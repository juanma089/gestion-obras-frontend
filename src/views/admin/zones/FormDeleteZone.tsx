import { useEffect } from "react";
import { useDeleteWorkZone } from "../../../hooks/UseWorkZone";
import { MessageType } from "../../../components/MessageModal";
import { GenericModalForm } from "../../../components/FormCommon";

interface FormDeleteZoneProps {
  zoneId: number;
  onClose: () => void;
  onMesaje?: (message: string, type: MessageType) => void;
}

export const FormDeleteZone = ({ zoneId, onClose, onMesaje }: FormDeleteZoneProps) => {
  const {
    mutate: deleteZoneMutation,
    isPending: isPendingDelete,
    isSuccess: isSuccessDelete,
    isError: isErrorDelete,
  } = useDeleteWorkZone();

  const handleDelete = () => {
    deleteZoneMutation(zoneId);
  };

  useEffect(() => {
    if (isSuccessDelete) {
      onMesaje?.("Zona eliminada correctamente.", "success");
      onClose();
    } else if (isErrorDelete) {
      onMesaje?.("Error al eliminar la zona.", "error");
      onClose();
    }
  }, [isSuccessDelete, isErrorDelete]);

  return (
    <GenericModalForm
      title="Eliminar Zona"
      headerColor="from-red-600 to-red-700"
      onClose={onClose}
    >
      <div className="space-y-4">
        <p className="text-gray-700 text-center text-base">
          ¿Estás seguro de que deseas eliminar esta zona? Esta acción no se puede deshacer.
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleDelete}
            disabled={isPendingDelete}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            {isPendingDelete ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </GenericModalForm>
  );
};

export default FormDeleteZone;
