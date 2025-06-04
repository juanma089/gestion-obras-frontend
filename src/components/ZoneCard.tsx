import { MapPin, Pencil, Trash2, Layers } from "lucide-react";
import { WorkZone } from "../models/WorkZone";
import EditZoneStatus from "./EditZoneStatus";

interface Props {
    zone: WorkZone;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}

const ZoneCard = ({ zone, onEdit, onDelete }: Props) => {
    const showActions = zone.status !== "FINALIZADA";

    return (
        <div className="bg-white rounded-xl shadow-lg border p-6 w-full hover:shadow-xl transition duration-300 relative">
            {/* Botones de acción */}
            {showActions && onEdit && onDelete && (
                <div>
                    <div className="absolute bottom-2 left-2">
                        <button
                            onClick={() => onEdit(zone.id)}
                            className="p-2 bg-amber-400 text-white rounded-full hover:bg-amber-500 transition-all hover:shadow-xl  duration-300 hover:scale-120"
                            aria-label="Editar zona"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="absolute bottom-2 right-2">
                        <button
                            onClick={() => onDelete(zone.id)}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all hover:shadow-xl duration-300 hover:scale-120"
                            aria-label="Eliminar zona"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Contenido de la tarjeta */}
            <h2 className="text-2xl font-bold text-gray-800 break-words">
                {zone.name}
            </h2>

            <div className="flex flex-col md:flex-row items-center md:gap-4 my-2">
                <p className="text-sm text-gray-600">
                    <strong>Estado:</strong>
                </p>
                <EditZoneStatus
                    zone={zone}
                />
            </div>

            <p className="text-gray-600 text-sm"><strong >Descripción:</strong> {zone.description}</p>

            <div className="grid grid-cols-1 gap-1 text-sm text-gray-500 p-2 justify-center">
                <div className="flex flex-col gap-0.5 items-center justify-center">
                    <p>
                        <strong className="flex gap-0.5 items-center"><Layers /> Proyecto al que pertenece:</strong>
                    </p>
                    <p>{zone.project?.name}</p>
                </div>
                <p className="flex gap-0.5 items-center justify-center">
                    <MapPin /><strong>Ubicación: </strong>
                    <a
                        href={`https://www.google.com/maps?q=${zone.project.latitude},${zone.project.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <span>Ver En Google Maps</span>
                    </a>
                </p>
            </div>
        </div>
    );
};

export default ZoneCard;