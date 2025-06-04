import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";

const formFields = [
  { name: "fullName", type: "text", placeholder: "Nombre Completo" },
  { name: "email", type: "email", placeholder: "Email" },
  { name: "password", type: "password", placeholder: "Contraseña" },
  { name: "numberID", type: "text", placeholder: "Documento de Identidad" },
];

const roles = ["ADMINISTRADOR", "SUPERVISOR", "OPERADOR"];

const InputField = ({
  name,
  type,
  placeholder,
  onChange,
}: {
  name: string;
  type: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    onChange={onChange}
    required
  />
);

export default function RegisterForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const API_URL = import.meta.env.VITE_USERS_URL;
  const { token } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    numberID: "",
    role: roles[0],
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("You must be logged in as ADMINISTRADOR to register a user.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || "An unexpected error occurred.";
        setError(errorMessage)
        throw new Error(`Error ${response.status}: ${errorMessage}`);
      }

      setSuccess("User registered successfully!");
      setForm({ fullName: "", email: "", password: "", numberID: "", role: roles[0] });

      queryClient.invalidateQueries({ queryKey: ['all-users'] });

      setTimeout(() => {
        setSuccess("");
        onClose(); // Cierra el modal al finalizar con éxito
      }, 1000);

    } catch (err) {
      console.error((err as Error).message);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {success && <p className="text-green-500 text-sm text-center">{success}</p>}

      {formFields.map((field) => (
        <InputField key={field.name} {...field} onChange={handleChange} />
      ))}

      <label htmlFor="role" className="block text-sm text-left font-medium text-gray-700 mb-2">
        Rol
      </label>
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      >
        {roles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="w-full text-white py-3 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90"
      >
        Registrar
      </button>
    </form>
  );
}