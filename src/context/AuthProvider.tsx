import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { UserResponseDto } from '../models/UserResponse';
import { MessageModal } from '../components/MessageModal';
import { useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  user: UserResponseDto | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: UserResponseDto, expiresIn: number) => void;
  logout: () => void;
  loading: boolean;
  setUser: (user: UserResponseDto | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const [showExpirationWarning, setShowExpirationWarning] = useState(false);
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(60);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const expiresAt = localStorage.getItem("expiresAt");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as UserResponseDto;
        const expiresAtTime = parseInt(expiresAt || "0");

        if (Date.now() > expiresAtTime) {
          console.warn("Token ha expirado, cerrando sesión.");
          logout();
        } else {
          setToken(storedToken);
          setUser(parsedUser);
          startTokenTimers(expiresAtTime);
        }
      } catch (e) {
        console.error("Error al parsear user:", e);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const startTokenTimers = (expiresAt: number) => {
    const timeUntilExpiration = expiresAt - Date.now();
    const timeUntilWarning = timeUntilExpiration - 60_000; // 1 minuto antes

    if (timeUntilWarning > 0) {
      warningTimeoutRef.current = setTimeout(() => {
        setShowExpirationWarning(true);
        setSecondsLeft(60); // reinicia el contador
        countdownIntervalRef.current = setInterval(() => {
          setSecondsLeft((prev) => {
            if (prev <= 1) {
              clearInterval(countdownIntervalRef.current!);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, timeUntilWarning);
    }

    logoutTimeoutRef.current = setTimeout(() => {
      logout();
    }, timeUntilExpiration);
  };


  const login = (token: string, user: UserResponseDto, expiresIn: number) => {
    const expiresAt = Date.now() + expiresIn;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("expiresAt", expiresAt.toString());
    setToken(token);
    setUser(user);
    startTokenTimers(expiresAt);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("genericViewSelectedOption");

    queryClient.removeQueries();

    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    setToken(null);
    setUser(null);
    setShowExpirationWarning(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        login,
        logout,
        loading,
        setUser,
      }}
    >
      {children}
      {showExpirationWarning && (
        <MessageModal
          message={`Tu sesión expirará en ${secondsLeft} segundos. Guarda tu trabajo y vuelve a iniciar sesión.`}
          type='warning'
          onClose={() => {
            setShowExpirationWarning(false);
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          }}
          duration={60000}
        />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};