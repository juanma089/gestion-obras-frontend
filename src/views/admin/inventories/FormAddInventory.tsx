import { useState } from "react";
import { MessageModal, MessageType } from "../../../components/MessageModal";
import { GenericModalForm } from "../../../components/FormCommon";
import { useCreateInventory } from "../../../hooks/UseInventory";
import { useMaterials } from "../../../hooks/UseMaterial";
import { useMyProjects, useProjects } from "../../../hooks/UseProjects";
import { CreateInventory } from "../../../models/Inventory";
import { useAuth } from "../../../context/AuthProvider";

interface FormAddInventoryProps {
    onClose: () => void;
    onMesaje?: (message: string, type: MessageType) => void;
}

const FormAddInventory = ({ onClose, onMesaje }: FormAddInventoryProps) => {
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<MessageType>("error");
    const [newInventory, setNewInventory] = useState<CreateInventory>({
        projectId: 0,
        materialId: 0
    });

    const { user } = useAuth();

    const isAdmin = user?.role === "ADMINISTRADOR";
    const isSupervisor = user?.role === "SUPERVISOR";

    const { data: adminProjects } = useProjects(isAdmin);
    const { data: supervisorProjects } = useMyProjects(isSupervisor);

    const projects = isAdmin ? adminProjects : supervisorProjects;

    // Obtener datos necesarios para los selects
    const { data: materials } = useMaterials();
    const { mutate: createInventory, isPending } = useCreateInventory();

    const handleClose = () => {
        setTimeout(onClose, 300);
    };

    const addInventory = () => {
        if (!newInventory.projectId || !newInventory.materialId) {
            setMessage("Por favor, selecciona un proyecto y un material.");
            setMessageType("error");
            return;
        }

        createInventory(newInventory, {
            onSuccess: () => {
                onMesaje?.("¡Registro de inventario creado exitosamente!", "success");
                onClose();
            },
            onError: () => {
                onMesaje?.("Error al crear el registro de inventario.", "error");
            }
        });
    };

    const children = (
        <form
            className="space-y-4"
            onSubmit={(e) => {
                e.preventDefault();
                addInventory();
            }}
        >
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
                <select
                    className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={newInventory.projectId}
                    onChange={(e) => setNewInventory({ ...newInventory, projectId: Number(e.target.value) })}
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
                    value={newInventory.materialId}
                    onChange={(e) => setNewInventory({ ...newInventory, materialId: Number(e.target.value) })}
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
                    {isPending ? "Guardando..." : "Guardar Registro"}
                </button>
            </div>
        </form>
    );

    return (
        <>
            <GenericModalForm
                title="Agregar al Inventario"
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

export default FormAddInventory;