import { useEffect, useState } from "react";
import { MessageType } from "../../../components/MessageModal";
import { useUpdateWorkZone } from "../../../hooks/UseWorkZone";
import { WorkZone } from "../../../models/WorkZone";
import { useMyProjects, useProjects } from "../../../hooks/UseProjects";
import { GenericModalForm } from "../../../components/FormCommon";
import { useAuth } from "../../../context/AuthProvider";

interface FormEditZoneProps {
  zone: WorkZone;
  onClose: () => void;
  onMesaje?: (message: string, type: MessageType) => void;
}

export const FormEditZone = ({ zone, onClose, onMesaje }: FormEditZoneProps) => {
  const { user } = useAuth();

  const { mutate: updateZoneMutation, isError, isSuccess, isPending } = useUpdateWorkZone();

  const isAdmin = user?.role === "ADMINISTRADOR";
  const isSupervisor = user?.role === "SUPERVISOR";

  const { data: adminProjects } = useProjects(isAdmin);
  const { data: supervisorZones } = useMyProjects(isSupervisor);

  const allProjects = isAdmin ? adminProjects : supervisorZones;

  const projects = [...(allProjects ?? [])]
    .reverse()
    .filter(project => project.status === 'EN_PROGRESO');

  const [editZone, setEditZone] = useState({
    projectId: zone.project.id,
    name: zone.name,
    description: zone.description,
  });

  const updateZone = () => {
    if (
      editZone.projectId === 0 ||
      !editZone.name.trim() ||
      !editZone.description.trim()
    ) {
      onMesaje?.("Por favor, completa todos los campos.", "error");
      return;
    }

    updateZoneMutation({
      id: zone.id,
      data: editZone
    });
  };

  useEffect(() => {
    if (isSuccess) {
      onMesaje?.("Zona actualizada exitosamente!", "success");
      onClose();
    } else if (isError) {
      onMesaje?.("Error al actualizar la zona. Inténtalo de nuevo.", "error");
      onClose();
    }
  }, [isSuccess, isError]);

  return (
    <GenericModalForm
      title="Editar Zona"
      headerColor="from-amber-400 to-amber-500"
      onClose={onClose}
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          updateZone();
        }}
      >
        {/* Proyecto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
          <select
            name="projectId"
            className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={editZone.projectId}
            onChange={(e) =>
              setEditZone({ ...editZone, projectId: Number(e.target.value) })
            }
            required
          >
            <option value={0} disabled>Selecciona un proyecto</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la zona</label>
          <input
            type="text"
            name="name"
            placeholder="Nombre de la zona"
            value={editZone.name}
            onChange={(e) => setEditZone({ ...editZone, name: e.target.value })}
            className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            name="description"
            placeholder="Descripción de la zona"
            rows={3}
            value={editZone.description}
            onChange={(e) => setEditZone({ ...editZone, description: e.target.value })}
            className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
          />
        </div>

        {/* Botón */}
        <div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-white py-3 rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all"
            disabled={isPending}
          >
            {isPending ? "Actualizando..." : "Actualizar Zona"}
          </button>
        </div>
      </form>
    </GenericModalForm>
  );
};

export default FormEditZone;