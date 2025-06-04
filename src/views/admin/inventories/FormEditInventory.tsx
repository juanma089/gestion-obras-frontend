import { useState, useEffect } from "react";
import { MessageModal, MessageType } from "../../../components/MessageModal";
import { GenericModalForm } from "../../../components/FormCommon";
import { useUpdateInventory } from "../../../hooks/UseInventory";
import { useMaterials } from "../../../hooks/UseMaterial";
import { useMyProjects, useProjects } from "../../../hooks/UseProjects";
import { Inventory } from "../../../models/Inventory";
import { useAuth } from "../../../context/AuthProvider";

interface FormEditInventoryProps {
    inventory: Inventory;
    onClose: () => void;
    onMesaje?: (message: string, type: MessageType) => void;
}

const FormEditInventory = ({ inventory, onClose, onMesaje }: FormEditInventoryProps) => {
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<MessageType>("error");
    const [updatedInventory, setUpdatedInventory] = useState({
        projectId: inventory.project.id,
        materialId: inventory.material.id,
        availableQuantity: inventory.availableQuantity
    });

    const { user } = useAuth();
    const isAdmin = user?.role === "ADMINISTRADOR";
    const isSupervisor = user?.role === "SUPERVISOR";

    const { data: adminProjects } = useProjects(isAdmin);
    const { data: supervisorProjects } = useMyProjects(isSupervisor);
    const projects = isAdmin ? adminProjects : supervisorProjects;

    // Obtener datos necesarios para los selects
    const { data: materials } = useMaterials();
    const { mutate: updateInventory, isPending } = useUpdateInventory();

    // Inicializar los valores del formulario
    useEffect(() => {
        setUpdatedInventory({
            projectId: inventory.project.id,
            materialId: inventory.material.id,
            availableQuantity: inventory.availableQuantity
        });
    }, [inventory]);

    const handleClose = () => {
        setTimeout(onClose, 300);
    };

    const handleEdit = () => {
        if (!updatedInventory.projectId || !updatedInventory.materialId) {
            setMessage("Por favor, selecciona un proyecto y un material.");
            setMessageType("error");
            return;
        }

        if (updatedInventory.availableQuantity < 0) {
            setMessage("La cantidad no puede ser negativa.");
            setMessageType("error");
            return;
        }

        updateInventory({
            id: inventory.id,
            data: {
                projectId: updatedInventory.projectId,
                materialId: updatedInventory.materialId
            }
        }, {
            onSuccess: () => {
                onMesaje?.("¡Inventario actualizado exitosamente!", "success");
                onClose();
            },
            onError: () => {
                onMesaje?.("Error al actualizar el inventario.", "error");
            }
        });
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
                <select
                    className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={updatedInventory.projectId}
                    onChange={(e) => setUpdatedInventory({
                        ...updatedInventory,
                        projectId: Number(e.target.value)
                    })}
                    required
                >
                    <option value="">Selecciona un proyecto</option>
                    {projects?.map((project) => (
                        <option key={project.id} value={project.id}>
                            {project.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                <select
                    className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={updatedInventory.materialId}
                    onChange={(e) => setUpdatedInventory({
                        ...updatedInventory,
                        materialId: Number(e.target.value)
                    })}
                    required
                >
                    <option value="">Selecciona un material</option>
                    {materials?.map((material) => (
                        <option key={material.id} value={material.id}>
                            {material.name} ({material.unit})
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                    disabled={isPending}
                >
                    {isPending ? "Actualizando..." : "Actualizar Inventario"}
                </button>
            </div>
        </form>
    );

    return (
        <>
            <GenericModalForm
                title="Editar Registro de Inventario"
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

export default FormEditInventory;