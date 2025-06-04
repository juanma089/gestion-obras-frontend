import { useEffect, useState } from "react";
import { useUpdateWorkZoneStatus } from "../hooks/UseWorkZone";
import { WorkZone, StatusWorkZone } from "../models/WorkZone";
import { MessageModal, MessageType } from "../components/MessageModal";

interface EditZoneStatusProps {
    zone: WorkZone;
}

const statusStyles: Record<StatusWorkZone, { bg: string; text: string; label: string }> = {
    EN_PROGRESO: { bg: "bg-yellow-100", text: "text-yellow-800", label: "🟡 En progreso" },
    FINALIZADA: { bg: "bg-green-100", text: "text-green-800", label: "✅ Finalizada" },
};

const EditZoneStatus = ({ zone }: EditZoneStatusProps) => {
    const { mutate: updateStatus, isError, isSuccess } = useUpdateWorkZoneStatus();
    const status = statusStyles[zone.status];
    const [notification, setNotification] = useState<{ message: string, type: MessageType } | null>(null);

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as StatusWorkZone;
        updateStatus({ id: zone.id, status: newStatus });
    };

    useEffect(() => {
        if (isSuccess) {
            setNotification({
                message: "Estado de la zona actualizado correctamente",
                type: "success"
            });
        }

        if (isError) {
            setNotification({
                message: "Error al actualizar el estado de la zona",
                type: "error"
            });
        }
    }, [isSuccess, isError]);

    return (
        <>
            <select
                value={zone.status}
                onChange={handleStatusChange}
                className={`px-3 py-1 rounded-full text-sm font-semibold mx-auto sm:m-0 ${status.bg} ${status.text} w-fit sm:w-auto cursor-pointer border-none focus:ring-2 focus:ring-blue-500 outline-none`}
            >
                <option value="EN_PROGRESO">🟡 En progreso</option>
                <option value="FINALIZADA">✅ Finalizada</option>
            </select>

            {notification && (
                <MessageModal
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </>
    );
};

export default EditZoneStatus;