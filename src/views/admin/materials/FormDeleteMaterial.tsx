import { useDeleteMaterial } from "../../../hooks/UseMaterial";
import { MessageType } from "../../../components/MessageModal";
import { GenericModalForm } from "../../../components/FormCommon";

interface FormDeleteMaterialProps {
    materialId: number;
    materialName: string;
    onClose: () => void;
    onMesaje?: (message: string, type: MessageType) => void;
}

export const FormDeleteMaterial = ({
    materialId,
    materialName,
    onClose,
    onMesaje
}: FormDeleteMaterialProps) => {
    const {
        mutate: deleteMaterialMutation,
        isPending: isPendingDelete
    } = useDeleteMaterial();

    const handleDelete = () => {
        deleteMaterialMutation(materialId, {
            onSuccess: () => {
                if (onMesaje) {
                    onMesaje("Material eliminado correctamente.", "success");
                }
            onClose();
            },

            onError: () => {
                if (onMesaje) {
                    onMesaje("Error al eliminar el material.", "error");
                }
            }
        });
    };

    return (
        <>
            <GenericModalForm
                title="Eliminar Material"
                headerColor="from-red-600 to-red-700"
                onClose={onClose}
            >
                <div className="space-y-4">
                    <p className="text-gray-700 text-center text-base">
                        ¿Estás seguro de que deseas eliminar el material <strong>{materialName}</strong>?
                        Esta acción no se puede deshacer.
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
                            className={`px-4 py-2 rounded-lg text-white transition ${isPendingDelete ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                                }`}
                        >
                            {isPendingDelete ? "Eliminando..." : "Eliminar"}
                        </button>
                    </div>
                </div>
            </GenericModalForm>
        </>
    );
};