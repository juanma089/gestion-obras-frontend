import { useState } from "react";
import { MessageModal, MessageType } from "../../../components/MessageModal";
import { GenericModalForm } from "../../../components/FormCommon";
import { CreateMaterial } from "../../../models/Material";
import { useCreateMaterial } from "../../../hooks/UseMaterial"; // <- Hook que debes crear

interface FormAddMaterialProps {
    onClose: () => void;
    onMesaje?: (message: string, type: MessageType) => void;
}

const FormAddMaterial = ({ onClose, onMesaje }: FormAddMaterialProps) => {
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<MessageType>("error");

    const [newMaterial, setNewMaterial] = useState<CreateMaterial>({
        name: "",
        unit: ""
    });

    const { mutate: createMaterial, isPending } = useCreateMaterial();

    const handleClose = () => {
        setTimeout(onClose, 300);
    };

    const addMaterial = () => {
        if (!newMaterial.name.trim() || !newMaterial.unit.trim()) {
            setMessage("Por favor, completa todos los campos.");
            setMessageType("error");
            return;
        }

        createMaterial(newMaterial, {
            onSuccess: () => {
                onMesaje?.("¡Material creado exitosamente!", "success");
                onClose();
            },

            onError: () => {
                onMesaje?.("Error al crear el material. Inténtalo de nuevo.", "error");
                onClose();
            }
        });
    };

    const children = (
        <form
            className="space-y-4"
            onSubmit={(e) => {
                e.preventDefault();
                addMaterial();
            }}
        >
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del material</label>
                <input
                    type="text"
                    placeholder="Ej. Cemento, Arena"
                    name="name"
                    className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={newMaterial.name}
                    onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
                <input
                    type="text"
                    placeholder="Ej. Kg, m3, litros"
                    name="unit"
                    className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={newMaterial.unit}
                    onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                    required
                />
            </div>

            <div>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                    disabled={isPending}
                >
                    {isPending ? "Guardando..." : "Guardar Material"}
                </button>
            </div>
        </form>
    );

    return (
        <>
            <GenericModalForm
                title="Nuevo Material"
                headerColor="from-blue-600 to-indigo-600"
                onClose={handleClose}
                children={children}
            />

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

export default FormAddMaterial;