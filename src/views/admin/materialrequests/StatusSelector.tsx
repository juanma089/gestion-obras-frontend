import { useState } from "react";
import { useUpdateMaterialRequestStatus } from "../../../hooks/UseMaterialRequest";

export const StatusSelector = ({
  id,
  currentStatus,
}: {
  id: number;
  currentStatus: "PENDIENTE" | "APROBADA" | "RECHAZADA";
}) => {
  const [open, setOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<"APROBADA" | "RECHAZADA" | null>(null);
  const { mutate, isPending } = useUpdateMaterialRequestStatus();

  const handleClick = (status: "APROBADA" | "RECHAZADA") => {
    setPendingStatus(status);
    setOpen(true);
  };

  const handleConfirm = () => {
    if (!pendingStatus) return;
    mutate(
      { id, status: pendingStatus },
      {
        onSuccess: () => setOpen(false),
        onError: (err) => {
          alert(err.message);
          setOpen(false);
        },
      }
    );
  };

  const isDisabled = currentStatus !== "PENDIENTE" || isPending;

  return (
    <div className="space-x-2 mt-3 flex justify-between">
      <button
        onClick={() => handleClick("APROBADA")}
        disabled={isDisabled}
        className={`px-3 py-1 text-sm rounded-md border text-white ${
          isDisabled ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        Aprobar
      </button>

      <button
        onClick={() => handleClick("RECHAZADA")}
        disabled={isDisabled}
        className={`px-3 py-1 text-sm rounded-md border text-white ${
          isDisabled ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
        }`}
      >
        Rechazar
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-4 rounded shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-2">¿Estás seguro?</h2>
            <p className="text-sm text-gray-600">
              Cambiar el estado a <strong>{pendingStatus}</strong> no se puede deshacer ni cambiar.
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancelar
              </button>
              <button
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleConfirm}
                disabled={isPending}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};