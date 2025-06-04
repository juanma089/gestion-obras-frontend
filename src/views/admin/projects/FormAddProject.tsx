import { useEffect, useState } from "react";
import MapModal from "../../../components/MapModal";
import { useCreateProject } from "../../../hooks/UseProjects";
import { CreateProject } from "../../../models/Project";
import { MessageModal, MessageType } from "../../../components/MessageModal";
import { MapPin } from "lucide-react";
import { GenericModalForm } from "../../../components/FormCommon";
import { useAllUsersSupervisor } from "../../../hooks/UseUser";


interface FormAddProjectProps {
    onClose: () => void;
    onMesaje?: (message: string, type: MessageType) => void;
}

export const FormAddProject = ({ onClose, onMesaje }: FormAddProjectProps) => {
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const { mutate: createProjectMutation, isSuccess: isSuccessAddProject, isPending: isPendingAddProject, isError: isErrorAddProject } = useCreateProject();

    const { data: allUsersSupervisor } = useAllUsersSupervisor(true);
    const usersSupervisor = [...(allUsersSupervisor ?? [])].reverse();

    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<MessageType>("error");

    const [isOpen, setIsOpen] = useState(true);

    const [newProject, setNewProject] = useState<CreateProject>({
        name: "",
        description: "",
        latitude: "",
        longitude: "",
        locationRange: 50,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        userId: ""
    });

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(onClose, 300);
    };

    const addProject = () => {
        if (
            !newProject.name.trim() ||
            !newProject.description.trim() ||
            !newProject.startDate ||
            !newProject.endDate ||
            !newProject.userId
        ) {
            setMessage("Por favor, completa todos los campos.");
            setMessageType("error");
            return;
        }

        if (new Date(newProject.startDate) >= new Date(newProject.endDate)) {
            setMessage("La fecha de inicio debe ser anterior a la fecha de finalización.");
            setMessageType("error");
            return;
        }

        const formattedProject: CreateProject = {
            ...newProject,
            latitude: Number(newProject.latitude),
            longitude: Number(newProject.longitude),
        };

        createProjectMutation(formattedProject);
    };

    const children =
        <form className="space-y-4"
            onSubmit={(e) => {
                e.preventDefault();
                addProject();
            }}
        >
            {/* Nombre del Proyecto */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Proyecto</label>
                <input
                    type="text"
                    placeholder="Nombre del proyecto"
                    name="name"
                    className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    required
                />
            </div>

            <div className="m-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                    placeholder="Descripción del proyecto"
                    name="description"
                    rows={3}
                    className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    required
                />
            </div>

            {!usersSupervisor || usersSupervisor.length === 0 ? (
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
            )}

            <div className="space-y-2 flex flex-col justify-center items-center">
                <div>
                    <MapModal onSelect={(lat, lng, locationRange) => {
                        setCoords({ lat, lng });
                        setNewProject(prev => ({
                            ...prev,
                            latitude: lat.toString(),
                            longitude: lng.toString(),
                            locationRange: locationRange
                        }));
                    }} />
                </div>
                {coords && (
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
                        name="startDate"
                        className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={newProject.startDate}
                        onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
                    <input
                        type="date"
                        name="endDate"
                        className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={newProject.endDate}
                        onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                        required
                    />
                </div>
            </div>

            <div>
                <div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                        disabled={isPendingAddProject}
                    >
                        {isPendingAddProject ? "Guardando..." : "Guardar Proyecto"}
                    </button>
                </div>
            </div>
        </form>

    useEffect(() => {
        if (isSuccessAddProject) {
            if (onMesaje) {
                onMesaje("Proyecto creado exitosamente!", "success")
            }
            onClose();
            return;
        } else if (isErrorAddProject) {
            if (onMesaje) {
                onMesaje("Error al crear el proyecto. Inténtalo de nuevo.", "error")
            }
            onClose();
            return;
        }
    }, [isSuccessAddProject, isErrorAddProject]);

    return (
        <>

            {isOpen && (
                <GenericModalForm
                    title="Nuevo Proyecto"
                    headerColor="from-blue-600 to-indigo-600"
                    onClose={handleClose}
                    children={children}
                />
            )}

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