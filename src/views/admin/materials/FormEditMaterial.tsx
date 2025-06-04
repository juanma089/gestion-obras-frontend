import { useState } from "react";
import { MessageModal, MessageType } from "../../../components/MessageModal";
import { GenericModalForm } from "../../../components/FormCommon";
import { CreateMaterial, Material } from "../../../models/Material";
import { useUpdateMaterial } from "../../../hooks/UseMaterial";

interface FormEditMaterialProps {
    material: Material;
    onClose: () => void;
    onMesaje?: (message: string, type: MessageType) => void;
}

const FormEditMaterial = ({ material, onClose, onMesaje }: FormEditMaterialProps) => {
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<MessageType>("error");

    const [editedMaterial, setEditedMaterial] = useState<CreateMaterial>({
        name: material.name,
        unit: material.unit
    });

    const { mutate: updateMaterial, isPending } = useUpdateMaterial();

    const handleClose = () => {
        setTimeout(onClose, 300);
    };

    const handleEdit = () => {
        if (!editedMaterial.name.trim() || !editedMaterial.unit.trim()) {
            setMessage("Por favor, completa todos los campos.");
            setMessageType("error");
            return;
        }

        updateMaterial(
            { id: material.id, data: editedMaterial },
            {
                onSuccess: () => {
                    onMesaje?.("¡Material actualizado exitosamente!", "success");
                    onClose();
                },
                onError: () => {
                    onMesaje?.("Error al actualizar el material. Inténtalo de nuevo.", "error");
                    onClose();
                }
            }
        );
    };

    const children = (
        <form
            className="space-y-4"
            onSubmit={(e) => {
                e.preventDefault();
                handleEdit();
            }}
        >
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del material</label>
                <input
                    type="text"
                    placeholder="Ej. Cemento, Arena"
                    name="name"
                    className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={editedMaterial.name}
                    onChange={(e) => setEditedMaterial({ ...editedMaterial, name: e.target.value })}
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
                    value={editedMaterial.unit}
                    onChange={(e) => setEditedMaterial({ ...editedMaterial, unit: e.target.value })}
                    required
                />
            </div>

            <div>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                    disabled={isPending}
                >
                    {isPending ? "Guardando..." : "Actualizar Material"}
                </button>
            </div>
        </form>
    );

    return (
        <>
            <GenericModalForm
                title="Editar Material"
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

export default FormEditMaterial;