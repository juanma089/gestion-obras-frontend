import { useEffect, useState } from "react";
import { MessageModal, MessageType } from "../../../components/MessageModal";
import { useCreateWorkZone } from "../../../hooks/UseWorkZone";
import { CreateWorkZone } from "../../../models/WorkZone";
import { useMyProjects, useProjects } from "../../../hooks/UseProjects";
import { GenericModalForm } from "../../../components/FormCommon";
import { useAuth } from "../../../context/AuthProvider";

interface FormAddZoneProps {
    onClose: () => void;
    onMesaje?: (message: string, type: MessageType) => void;
}

export const FormAddZone = ({ onClose, onMesaje }: FormAddZoneProps) => {
    const { user } = useAuth();

    const { mutate: createZoneMutation, isError, isSuccess, isPending } = useCreateWorkZone();

    const isAdmin = user?.role === "ADMINISTRADOR";
    const isSupervisor = user?.role === "SUPERVISOR";

    const { data: adminProjects } = useProjects(isAdmin);
    const { data: supervisorProjects } = useMyProjects(isSupervisor);

    const allProjects = isAdmin ? adminProjects : supervisorProjects;

    const projects = [...(allProjects ?? [])]
        .reverse()
        .filter((project) => project.status === "EN_PROGRESO");

    const [newZone, setNewZone] = useState<CreateWorkZone>({
        projectId: 0,
        name: "",
        description: "",
    });

    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<MessageType>("error");

    const addZone = () => {
        if (
            newZone.projectId === 0 ||
            !newZone.name.trim() ||
            !newZone.description.trim()
        ) {
            setMessage("Por favor, completa todos los campos.");
            setMessageType("error");
            return;
        }

        createZoneMutation(newZone);
    };

    useEffect(() => {
        if (isSuccess) {
            onMesaje?.("Zona creada exitosamente!", "success");
            onClose();
        } else if (isError) {
            onMesaje?.("Error al crear la zona. Inténtalo de nuevo.", "error");
            onClose();
        }
    }, [isSuccess, isError]);

    return (
        <>
            <GenericModalForm
                title="Nueva Zona"
                headerColor="from-blue-600 to-indigo-600"
                onClose={onClose}
            >
                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        addZone();
                    }}
                >
                    {!projects || projects.length === 0 ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
                            <input
                                type="text"
                                value="No hay proyectos disponibles"
                                className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-lg"
                                disabled
                            />
                        </div>
                    ) : (
                        <>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
                            <select
                                name="projectId"
                                className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-lg mb-4"
                                value={newZone.projectId}
                                onChange={(e) => setNewZone({ ...newZone, projectId: Number(e.target.value) })}
                                required
                            >
                                <option value={0} disabled>Selecciona un proyecto</option>
                                {projects.map((project, index) => (
                                    <option key={index} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la zona</label>
                        <input
                            type="text"
                            placeholder="Nombre de la zona"
                            name="name"
                            className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-lg"
                            value={newZone.name}
                            onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                            required
                            disabled={!projects || projects.length === 0}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea
                            placeholder="Descripción de la Zona"
                            name="description"
                            rows={3}
                            className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-lg"
                            value={newZone.description}
                            onChange={(e) => setNewZone({ ...newZone, description: e.target.value })}
                            required
                            disabled={!projects || projects.length === 0}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                            disabled={isPending || !projects || projects.length === 0}
                        >
                            {isPending
                                ? "Guardando..."
                                : !projects || projects.length === 0
                                    ? "No se Puede guardar"
                                    : "Guardar Zona"}
                        </button>
                    </div>
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

export default FormAddZone;