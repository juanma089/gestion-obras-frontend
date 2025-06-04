import { AlertTriangle, Check, Info, X, BadgeX } from "lucide-react"; // o cualquier librería de íconos
import { useEffect, useState } from "react";

export type MessageType = "error" | "success" | "warning" | "info";

interface MessageModalProps {
  message: string;
  type: MessageType;
  onClose: () => void;
  duration?: number;
}

export const MessageModal = ({
  message,
  type = "error",
  onClose,
  duration = 1000,
}: MessageModalProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const typeStyles = {
    error: {
      bg: "bg-red-500",
      icon: <BadgeX className="h-5 w-5" />,
    },
    success: {
      bg: "bg-green-500",
      icon: <Check className="h-5 w-5" />, // Asegúrate de importar el ícono
    },
    warning: {
      bg: "bg-amber-500",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    info: {
      bg: "bg-blue-500",
      icon: <Info className="h-5 w-5" />,
    },
  };

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
      }`}
    >
      <div
        className={`${typeStyles[type].bg} text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-4 max-w-md`}
      >
        <div className="flex-1 flex items-center gap-2">
          {typeStyles[type].icon}
          <p className="font-medium">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="text-white hover:bg-white/10 p-1 rounded-full transition-colors focus:outline-none"
          aria-label="Cerrar mensaje"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};