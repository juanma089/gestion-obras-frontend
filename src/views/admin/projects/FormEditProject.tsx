import { useEffect, useState } from "react";
import MapModal from "../../../components/MapModal";
import { useUpdateProject } from "../../../hooks/UseProjects";
import { CreateProject, Project } from "../../../models/Project";
import { MessageModal, MessageType } from "../../../components/MessageModal";
import { MapPin } from "lucide-react";
import { GenericModalForm } from "../../../components/FormCommon";
import { useAllUsersSupervisor } from "../../../hooks/UseUser";
import { useAuth } from "../../../context/AuthProvider";

interface FormEditProjectProps {
    projectToEdit: Project;
    onClose: () => void;
    onMesaje?: (message: string, type: MessageType) => void;
}

export const FormEditProject = ({ projectToEdit, onClose, onMesaje }: FormEditProjectProps) => {
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>({
        lat: Number(projectToEdit.latitude),
        lng: Number(projectToEdit.longitude)
    });
    const [locationRange, setLocationRange] = useState<number>(projectToEdit.locationRange);

    const { user } = useAuth();

    const { mutate: updateProjectMutation, isSuccess: isSuccessEditProject, isError: isErrorEditProject, isPending: isPendingEditProject } = useUpdateProject();

    const { data: allUsersSupervisor = [] } = useAllUsersSupervisor(user?.role === "ADMINISTRADOR");
    const usersSupervisor = [...(allUsersSupervisor ?? [])].reverse();

    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"error" | "success" | "warning" | "info">("error");

    const [isOpen, setIsOpen] = useState(true);

    const [newProject, setNewProject] = useState<CreateProject>({
        name: projectToEdit.name,
        description: projectToEdit.description,
        latitude: projectToEdit.latitude,
        longitude: projectToEdit.longitude,
        startDate: projectToEdit.startDate,
        locationRange: projectToEdit.locationRange,
        endDate: projectToEdit.endDate,
        userId: projectToEdit.userId
    });

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(onClose, 300);
    };

    const handleSubmit = () => {
        if (!newProject.name.trim() || !newProject.description.trim() || !newProject.startDate || !newProject.endDate) {
            setMessage("Por favor, completa todos los campos.");
            setMessageType("error");
            return;
        }

        if (new Date(newProject.startDate) >= new Date(newProject.endDate)) {
            setMessage("La fecha de inicio debe ser anterior a la de finalización.");
            setMessageType("error");
            return;
        }

        updateProjectMutation({ id: projectToEdit.id, data: newProject });
    };

    const children =
        <form
            className="space-y-4"
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Proyecto</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                    rows={3}
                    className="w-full p-2 border rounded-lg"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    required
                />
            </div>

            {user?.role === "ADMINISTRADOR" && (
                !usersSupervisor || usersSupervisor.length === 0 ? (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">No hay usuarios Disponibles</label>
                        <input
                            type="text"
                            value="No hay proyectos disponibles"
                            className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-lg"
                            disabled
                        />
                    </div>
                ) : (
                    <>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Encargado del Proyecto:</label>
                        <select
                            name="userId"
                            className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-lg mb-4"
                            value={newProject.userId}
                            onChange={(e) => setNewProject({ ...newProject, userId: e.target.value })}
                            required
                        >
                            <option value={0} disabled>Selecciona un usuario</option>
                            {usersSupervisor.map((user, index) => (
                                <option key={index} value={user.numberID}>
                                    {user.fullName}
                                </option>
                            ))}
                        </select>
                    </>
                )
            )}

            <div className="space-y-2 flex flex-col justify-center items-center">
                <MapModal
                    onSelect={(lat, lng, locationRange) => {
                        setCoords({ lat, lng });
                        setLocationRange(locationRange);
                        setNewProject({ ...newProject, latitude: lat, longitude: lng, locationRange: locationRange });
                    }}
                    initialCoords={[Number(projectToEdit.latitude), Number(projectToEdit.longitude)]}
                    locationRange={locationRange}
                />
                {coords && locationRange && (
                    <div>
                        <p>
                            <a
                                href={`https://www.google.com/maps?q=${coords.lat},${coords.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                <MapPin />
                                <span>Ver en Google Maps</span>
                            </a>
                        </p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
                    <input
                        type="date"
                        className="w-full p-2 border rounded-lg"
                        value={newProject.startDate}
                        onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
                    <input
                        type="date"
                        className="w-full p-2 border rounded-lg"
                        value={newProject.endDate}
                        onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-white py-3 rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all"
                disabled={isPendingEditProject}
            >
                {isPendingEditProject ? "Actualizando..." : "Actualizar Proyecto"}
            </button>
        </form>

    useEffect(() => {
        if (isSuccessEditProject) {
            if (onMesaje) {
                onMesaje("Proyecto actualizado exitosamente!", "success")
            }
            onClose();
            return;
        } else if (isErrorEditProject) {
            if (onMesaje) {
                onMesaje("Hubo un error al actualizar el proyecto!", "error")
            }
            onClose();
        }
    }, [isSuccessEditProject, isErrorEditProject]);

    return (
        <>

            {isOpen && (
                <GenericModalForm
                    title="Editar Proyecto"
                    headerColor="from-amber-400 to-amber-500"
                    onClose={handleClose}
                    children={children}
                />
            )}

            {message && (
                <MessageModal
                    message={message}
                    type={messageType}
                    onClose={() => setMessage(null)}
                />
            )}
        </>
    );
};