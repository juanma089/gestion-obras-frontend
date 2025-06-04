import { useEffect, useState } from "react";
import { useUpdateUser } from "../../../hooks/UseUser";
import { RegisterUserDto } from "../../../models/UserResponse";
import { GenericModalForm } from "../../../components/FormCommon";
import { MessageModal, MessageType } from "../../../components/MessageModal";
import { useAuth } from "../../../context/AuthProvider";

interface FormUpdateUserProps {
    onClose: () => void;
    onMesaje?: (message: string, type: MessageType) => void;
    userId: number;
    initialData: RegisterUserDto;
    isAdmin?: boolean;
}

export const FormUpdateUser = ({
    onClose,
    onMesaje,
    userId,
    initialData,
    isAdmin = false,
}: FormUpdateUserProps) => {
    const { mutate: updateUser, isSuccess, isPending, isError } = useUpdateUser();
    const [formData, setFormData] = useState<RegisterUserDto>(initialData);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<MessageType>("error");

    const {user}  = useAuth();

    const handleClose = () => {
        setTimeout(onClose, 300);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !formData.fullName.trim() ||
            !formData.email.trim() ||
            !formData.numberID.trim()
        ) {
            setMessage("Todos los campos son obligatorios.");
            setMessageType("error");
            return;
        }

        updateUser({ id: userId, data: formData });
    };

    useEffect(() => {
        if (isSuccess) {
            if (onMesaje) onMesaje("Usuario actualizado exitosamente", "success");
            onClose();
        } else if (isError) {
            if (onMesaje) onMesaje("Error al actualizar el usuario", "error");
            onClose();
        }
    }, [isSuccess, isError]);

    return (
        <>
            <GenericModalForm
                title="Actualizar Usuario"
                headerColor="from-blue-600 to-indigo-600"
                onClose={handleClose}
            >

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Número de identificación</label>
                        <input
                            type="text"
                            name="numberID"
                            value={formData.numberID}
                            onChange={(e) => setFormData({ ...formData, numberID: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {isAdmin && userId !== user?.id &&  (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                                className="w-full p-2 border rounded"
                            >
                                <option value="ADMINISTRADOR">Administrador</option>
                                <option value="SUPERVISOR">Supervisor</option>
                                <option value="OPERADOR">Operador</option>
                            </select>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                        disabled={isPending}
                    >
                        {isPending ? "Actualizando..." : "Actualizar Usuario"}
                    </button>
                </form>

            </GenericModalForm>

            {message && (
                <MessageModal
                    message={message}
                    type={messageType}
                    onClose={() => setMessage(null)}
                    duration={3000}
                />
            )}
        </>
    );
};