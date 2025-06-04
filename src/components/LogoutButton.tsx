import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-700 text-sm font-semibold m-2 text-white py-1 px-2 rounded-full shadow-lg flex items-center"
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default LogoutButton;