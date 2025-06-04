import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { JSX } from "react";

interface ProtectedRouteProps {
    children: JSX.Element;
    allowedRoles: string[];
}

/**
 * Componente de ruta protegida que valida autenticación y rol.
 */
const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) return <div>Cargando...</div>;

    // No autenticado → redirigir al login
    if (!isAuthenticated || !user) {
        return <Navigate to="/" replace />;
    }

    // Autenticado pero sin permiso → redirigir al home (o login si prefieres)
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    // Usuario autenticado y rol válido → renderiza la ruta
    return children;
};

export default ProtectedRoute;