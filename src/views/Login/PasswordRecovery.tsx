import { useState } from "react";
import { MessageModal, MessageType } from "../../components/MessageModal";


const API_URL = import.meta.env.VITE_USERS_URL;


export default function PasswordRecovery() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1)

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: MessageType } | null>(null);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setNotification({ message: "Enviando código de recuperación...", type: "info" });

      const response = await fetch(`${API_URL}/auth/send-reset-code?email=` + email, {
        method: "POST",
      });

      if (response.ok) {
        setNotification({ message: "Código enviado a tu correo", type: "success" });
        setStep(2);
      } else if (response.status === 404) {
        setNotification({ message: `Correo ${email} no encontrado`, type: "error" });
      } else {
        setNotification({ message: "Error enviando el código", type: "error" });
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const bodyData = JSON.stringify({
        email,
        verificationCode,
        newPassword,
      });


      const resetResponse = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: bodyData,
      });


      if (resetResponse.ok) {
        setNotification({ message: "Contraseña restablecida con éxito", type: "success" });
        setStep(1);
      } else {
        setNotification({ message: "Error al restablecer la contraseña", type: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        {step === 1 ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">
              Restablecer contraseña
            </h2>
            <p className="text-gray-500 text-center mb-6">
              Ingresa tu correo y te enviaremos un código de verificación.
            </p>
            <form onSubmit={handleSendCode} className="space-y-4">
              <input
                type="email"
                placeholder="Introduce tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold py-3 rounded-lg transition hover:opacity-90"
              >
                {isLoading ? "Enviando..." : "Enviar código"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">
              Código de verificación
            </h2>
            <p className="text-gray-500 text-center mb-6">
              Ingresa el código que te enviamos a tu correo electrónico y establece una nueva contraseña.
            </p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="text"
                placeholder="Ingresa el código de verificación"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
              <input
                type="password"
                placeholder="Ingresa una nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold py-3 rounded-lg transition hover:opacity-90"
              >
                Restablecer contraseña
              </button>
            </form>
          </>
        )}

        <div className="text-center mt-4">
          <a href="/" className="text-pink-500 font-semibold">
            Volver al inicio de sesión
          </a>
        </div>
      </div>

      {notification && (
        <MessageModal
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
          duration={4000}
        />
      )}

    </div>
  );
}
