import { useState } from "react";
import { useDeleteMaterialRequest } from "../../../hooks/UseMaterialRequest";
import { MessageType } from "../../../components/MessageModal";
import { GenericModalForm } from "../../../components/FormCommon";

import { Trash2 } from "lucide-react";

interface FormDeleteMaterialRequestProps {
    requestId: number;
    materialName: string;
    onMessage?: (message: string, type: MessageType) => void;
}

export const FormDeleteMaterialRequest = ({
    requestId,
    materialName,
    onMessage
}: FormDeleteMaterialRequestProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const {
        mutate: deleteRequest,
        isPending
    } = useDeleteMaterialRequest();

    const handleDelete = () => {
        deleteRequest(requestId, {
            onSuccess: () => {
                onMessage?.("Solicitud eliminada correctamente.", "success");
                setIsOpen(false);
            },
            onError: () => {
                onMessage?.("Error al eliminar la solicitud.", "error");
            }
        });
    };

    return (
        <>
            {/* Botón para abrir el modal */}
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all hover:shadow-xl  duration-300 hover:scale-120"
                aria-label="Eliminar proyecto"
            >
                <Trash2 className="h-4 w-4" />
            </button>

            {/* Modal de confirmación */}
            {isOpen && (
                <GenericModalForm
                    title="Eliminar Solicitud"
                    headerColor="from-red-600 to-red-700"
                    onClose={() => setIsOpen(false)}
                >
                    <div className="space-y-4">
                        <p className="text-gray-700 text-center text-base">
                            ¿Estás seguro de que deseas eliminar la solicitud del material{" "}
                            <strong>{materialName}</strong>? Esta acción no se puede deshacer.
                        </p>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={isPending}
                                className={`px-4 py-2 rounded-lg text-white transition ${isPending ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
                                    }`}
                            >
                                {isPending ? "Eliminando..." : "Eliminar"}
                            </button>
                        </div>
                    </div>
                </GenericModalForm>
            )}
        </>
    );
};