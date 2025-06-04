import { useEffect, useState } from "react";
import { useUpdateProjectStatus } from "../hooks/UseProjects";
import { Project, statusProject } from "../models/Project";
import { MessageModal, MessageType } from "../components/MessageModal";

interface EditProjectStatusProps {
  project: Project,
}

const statusStyles: Record<Project["status"], { bg: string; text: string; label: string }> = {
  EN_PROGRESO: { bg: "bg-yellow-100", text: "text-yellow-800", label: "🟡 En progreso" },
  FINALIZADO: { bg: "bg-green-100", text: "text-green-800", label: "✅ Finalizado" },
  SUSPENDIDO: { bg: "bg-red-100", text: "text-red-800", label: "⛔ Suspendido" },
};

const EditProjectStatus = ({ project }: EditProjectStatusProps) => {
  const { mutate: updateStatus, isError: isErrorUpdateStatusProject, isSuccess: isSuccessUpdateStatusProject } = useUpdateProjectStatus();
  const status = statusStyles[project.status];
  const [notification, setNotification] = useState<{ message: string, type: MessageType } | null>(null);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as statusProject;
    updateStatus({ id: project.id, status: newStatus });
  };

  useEffect(() => {
    if (isSuccessUpdateStatusProject) {
      setNotification({
        message: "Estado del proyecto actualizado correctamente",
        type: "success"
      })
    }

    if (isErrorUpdateStatusProject) {
      if (isSuccessUpdateStatusProject) {
        setNotification({
          message: "Error al actualizar estado del proyecto",
          type: "error"
        })
      }
    }
  }, [isSuccessUpdateStatusProject, isErrorUpdateStatusProject]);

  return (
    <>
      <select
        value={project.status}
        onChange={handleStatusChange}
        className={`px-3 py-1 rounded-full text-sm font-semibold mx-auto sm:m-0 ${status.bg} ${status.text} w-fit sm:w-auto  cursor-pointer border-none focus:ring-2 focus:ring-blue-500 outline-none`}
      >
        <option value="EN_PROGRESO">🟡 En progreso</option>
        <option value="FINALIZADO">✅ Finalizado</option>
        <option value="SUSPENDIDO">⛔ Suspendido</option>
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

export default EditProjectStatus;