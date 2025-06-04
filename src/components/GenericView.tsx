import { ReactNode, useEffect, useState } from "react";
import { Menu, CircleUserRound, X, Pencil } from "lucide-react";
import { useAuth } from "../context/AuthProvider";
import LogoutButton from "./LogoutButton";
import { FormUpdateUser } from "../views/admin/users/FormEditUser";
import { MessageModal, MessageType } from "./MessageModal";

interface Option {
  id: number;
  label: string;
  icon: ReactNode;
  content: ReactNode | string;
}

type GenericViewProps = {
  options: Option[];
  localStorageKey?: string;
};

export const GenericView = ({
  options,
  localStorageKey = "genericViewSelectedOption",
}: GenericViewProps) => {
  const [selected, setSelected] = useState<Option>(() => {
    const savedOption = localStorage.getItem(localStorageKey);
    return savedOption
      ? options.find((opt) => opt.id === JSON.parse(savedOption).id) || options[0]
      : options[0];
  });

  const { user } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: MessageType } | null>(null);

  const [isOpenEditUser, setIsOpenEditUser] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({ id: selected.id, label: selected.label })
    );
  }, [selected, localStorageKey]);

  return (
    <>
      <div className="min-h-screen flex bg-gradient-to-b from-blue-100 to-white">
        {/* Sidebar */}
        <div className="md:relative">
          {/* Menú lateral escritorio */}
          <div
            className="bg-white hidden md:flex flex-col items-start border-r border-blue-200 w-14 hover:w-64 transition-all duration-300 fixed h-full z-30 overflow-hidden group"
            onMouseEnter={() => setSidebarExpanded(true)}
            onMouseLeave={() => setSidebarExpanded(false)}
          >

            {/* Sección de Usuario - Estilo consistente con móvil */}
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-2 w-full">
              {/* Icono de usuario - Tamaño grande fijo */}
              <CircleUserRound className="group-hover:h-12 group-hover:w-12 transition-all duration-300" />

              {/* Nombre y email - Solo visible al expandir */}
              <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-1">
                <p className="font-semibolds text-sm">
                  {user?.fullName || "Usuario"}
                </p>
                {user?.email && (
                  <p className="text-sm text-gray-500 mt-1 truncate max-w-[180px]">
                    {user.email}
                  </p>
                )}
                <button
                  onClick={() => setIsOpenEditUser(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </button>

                <LogoutButton />
              </div>
            </div>

            <div className="w-full border-t border-black"></div>

            {/* Opciones del menú */}
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelected(option)}
                className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-colors ${selected.id === option.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {/* Icono */}
                <div className="min-w-[24px] ">{option.icon}</div>

                <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Contenido principal */}
        <div className={`flex-1 ml-0 md:ml-16 p-4 md:p-5 transition-all ${sidebarExpanded && "blur-[2px]"} `}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center">
              {/* MÓVIL - Menú Lateral */}
              <div className="md:hidden">
                {/* Botón de hamburguesa */}
                <div className="flex items-center justify-between px-4 py-4">
                  <button
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="p-2 rounded bg-white shadow-lg z-50"
                  >
                    <Menu className="text-blue-600 h-6 w-6" />
                  </button>
                </div>

                {/* Overlay y Menú Lateral */}
                {isMenuOpen && (
                  <>
                    {/* Overlay oscuro */}
                    <div
                      className="fixed inset-0 bg-opacity-50 z-40"
                      onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Menú Lateral */}
                    <div className="fixed inset-y-0 left-0 bg-white shadow-xl z-50 w-64 transform transition-transform duration-300 ease-in-out">
                      <div className="flex flex-col h-full pt-4 pb-6">
                        {/* Botón de cerrar */}
                        <div className="flex justify-end px-4">
                          <button
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2 rounded-full hover:bg-gray-100"
                          >
                            <X className="text-gray-500 h-5 w-5" />
                          </button>
                        </div>

                        {/* Sección de Usuario */}
                        <div className="flex flex-col items-center gap-2 px-4 py-2">
                          <CircleUserRound className="h-10 w-10" />
                          <span className="text-center font-semibold">
                            {user?.fullName || "Usuario"}
                          </span>
                          {user?.email && (
                            <span className="text-sm text-gray-500">
                              {user.email}
                            </span>
                          )}
                          <button
                            onClick={() => setIsOpenEditUser(true)} // Reemplaza con tu función real
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition-all"
                          >
                            <Pencil className="w-4 h-4" />
                            Editar
                          </button>
                          <LogoutButton />
                        </div>

                        <div className="w-full border-t border-black"></div>

                        {/* Opciones del menú */}
                        <div className="flex-1 overflow-y-auto">
                          {options.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => {
                                setSelected(option);
                                setIsMenuOpen(false);
                              }}
                              className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-colors ${selected.id === option.id
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                              <span>{option.icon}</span>
                              <span className="font-medium">{option.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <h1 className="text-2xl md:mb-4 md:text-3xl font-bold text-gray-800 text-center md:text-left">
                SISTEMA DE GESTIÓN
              </h1>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 text-center md:text-left">
              <div className="text-gray-600 text-lg">
                {typeof selected.content === "string" ? <p>{selected.content}</p> : selected.content}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para editar usuario */}
      {isOpenEditUser && user && (
        <FormUpdateUser
          userId={user.id}
          initialData={{
            email: user.email,
            fullName: user.fullName,
            numberID: user.numberID,
            role: user.role,
          }}
          onClose={() => setIsOpenEditUser(false)}
          onMesaje={(message, type) => setNotification({ message, type })}
        />
      )}

      {notification && (
        <MessageModal
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
};
