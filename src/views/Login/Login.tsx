import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import axios from "axios";

const API_URL = import.meta.env.VITE_USERS_URL;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const token = loginResponse.data.token;
      const expiresIn = loginResponse.data.expiresIn;

      // Obtener usuario actual
      const userResponse = await axios.get(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = userResponse.data;

      login(token, user, expiresIn); // Guardar en contexto

      // Redirigir según el rol
      if (user.role === "ADMINISTRADOR") navigate("/admin");
      else if (user.role === "SUPERVISOR") navigate("/supervisor");
      else if (user.role === "OPERADOR") navigate("/operator");
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
      }
    }

  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row bg-white max-w-6xl w-full rounded-lg shadow-lg overflow-hidden">
        {error && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
            {error}
          </div>
        )}
        {/* Sección izquierda - Formulario */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-8">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Iniciar Sesión</h2>
            <p className="text-center text-gray-600 mb-6">Por favor, inicie sesión en su cuenta</p>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form className="space-y-4" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <button
                type="submit"
                className="w-full text-white py-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 transition">
                Ingresar
              </button>
            </form>
            <div className="text-center mt-3">
              <p className="text-gray-500 mt-3">¿Has olvidado tu contraseña?</p>
              <a href="/password-recovery" className="text-pink-500 font-semibold">Restablecer contraseña</a>
            </div>
          </div>
        </div>

        {/* Sección derecha - Texto con gradiente */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-8 text-white bg-gradient-to-r from-orange-500 to-pink-500">
          <h2 className="text-2xl font-bold mb-4">Optimizamos la gestión en tu obra</h2>
          <div className="space-y-6">
            <Feature
              title="Control total desde cualquier lugar"
              description="Supervisa tareas, materiales y asistencia en tiempo real desde tu celular o computador."
            />
            <Feature
              title="Evita errores y retrabajos"
              description="Toma decisiones basadas en reportes claros, tareas con evidencias fotográficas y comunicación directa con tu equipo."
            />
            <Feature
              title="Aumenta la eficiencia del equipo"
              description="Asigna zonas y tareas, valida avances y lleva el control del inventario sin complicaciones."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

function Feature({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex items-start space-x-3">
      <CheckCircle className="text-white-500 w-6 h-6 mt-1" />
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>
    </div>
  );
}