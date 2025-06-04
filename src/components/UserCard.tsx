import { Mail, BadgeInfo, UserCircle, Pencil } from "lucide-react";
import { UserResponseDto } from "../models/UserResponse";
import { useState } from "react";
import { MessageModal, MessageType } from "./MessageModal";
import { FormUpdateUser } from "../views/admin/users/FormEditUser";
import { useAuth } from "../context/AuthProvider";

interface Props {
  user: UserResponseDto;
}

const UserCard = ({ user }: Props) => {

  const auth = useAuth();

  const [notification, setNotification] = useState<{ message: string, type: MessageType } | null>(null);

  const [isOpenEditUser, setIsOpenEditUser] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border p-6 w-full hover:shadow-xl transition duration-300 relative">
        {/* Ícono principal */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 break-words">
            {user.fullName}
          </h2>
          <UserCircle className="text-blue-600 w-8 h-8" />
        </div>

        {/* Detalles */}
        <div className="grid gap-2 text-gray-600 text-sm px-2 mb-3">
          <p className="flex items-center gap-2">
            <BadgeInfo className="w-4 h-4 text-gray-500" />
            <strong>ID:</strong> {user.numberID}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <strong>Email:</strong> {user.email}
          </p>
          <p className="flex items-center gap-2">
            <UserCircle className="w-4 h-4 text-gray-500" />
            <strong>Rol:</strong> {user.role}
          </p>
        </div>
        <div className="absolute bottom-2 left-2">
          <button
            onClick={() => setIsOpenEditUser(true)}
            className="p-2 bg-amber-400 text-white rounded-full hover:bg-amber-500 transition-all hover:shadow-xl  duration-300 hover:scale-120"
            aria-label="Editar proyecto"
          >
            <Pencil className="h-4 w-4" />
          </button>
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
          isAdmin={auth.user?.role === "ADMINISTRADOR"}
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

export default UserCard;