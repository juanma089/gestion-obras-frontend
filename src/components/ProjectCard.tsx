import { Calendar, CalendarCheck, MapPin, Pencil, Trash2 } from "lucide-react";
import { Project } from "../models/Project";
import EditProjectStatus from "./EditProjectStatus";
import { useUserByIdentification } from "../hooks/UseUser";

interface Props {
    project: Project;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}

const ProjectCard = ({ project, onEdit, onDelete }: Props) => {
    const showActions = project.status !== "FINALIZADO";

    const { data: user } = useUserByIdentification(project.userId);

    return (
        <div className="bg-white rounded-xl shadow-lg border p-4 w-full hover:shadow-xl transition duration-300 relative">
            {/* Botones de acción */}
            {showActions && onEdit && (
                <div className="absolute bottom-2 left-2">
                    <button
                        onClick={() => onEdit(project.id)}
                        className="p-2 bg-amber-400 text-white rounded-full hover:bg-amber-500 transition-all hover:shadow-xl  duration-300 hover:scale-120"
                        aria-label="Editar proyecto"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                </div>
            )}

            {showActions && onDelete && (
                <div className="absolute bottom-2 right-2">
                    <button
                        onClick={() => onDelete(project.id)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all hover:shadow-xl  duration-300 hover:scale-120"
                        aria-label="Eliminar proyecto"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Contenido de la tarjeta */}
            <h2 className="text-2xl font-bold text-gray-800 break-words">
                {project.name}
            </h2>

            <div className="flex flex-col md:flex-row items-center md:gap-4 my-2">
                <p className="text-sm text-gray-600">
                    <strong>Estado:</strong>
                </p>
                <EditProjectStatus project={project} />
            </div>

            <p className="text-gray-600 text-sm"><strong >Descripción:</strong> {project.description}</p>

            <p className="text-gray-600 text-sm"><strong >Encargado del proyecto: </strong> {user?.fullName}</p>

            <div className="grid grid-cols-1 text-sm text-gray-500 p-2">
                <p className="flex gap-0.5 items-center justify-center">
                    <MapPin /><strong>Ubicación: </strong>
                    <a
                        href={`https://www.google.com/maps?q=${project.latitude},${project.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <span>Ver En Google Maps</span>
                    </a>
                </p>

                <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex gap-0.5 items-center justify-center">
                        <Calendar /><p ><strong>Inicio:</strong> {new Date(project.startDate).toISOString().split("T")[0]}</p>
                    </div>

                    <div className="flex gap-0.5 items-center justify-center">
                        <CalendarCheck /><p><strong>Fin:</strong> {new Date(project.endDate).toISOString().split("T")[0]}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;