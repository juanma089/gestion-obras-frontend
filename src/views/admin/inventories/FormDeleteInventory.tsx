import { useDeleteInventory } from "../../../hooks/UseInventory";
import { MessageType } from "../../../components/MessageModal";
import { GenericModalForm } from "../../../components/FormCommon";

interface FormDeleteInventoryProps {
    inventoryId: number;
    inventoryName: string;
    onClose: () => void;
    onMesaje?: (message: string, type: MessageType) => void;
}

const FormDeleteInventory = ({
    inventoryId,
    inventoryName,
    onClose,
    onMesaje
}: FormDeleteInventoryProps) => {
    const {
        mutate: deleteInventoryMutation,
        isPending: isPendingDelete
    } = useDeleteInventory();

    const handleDelete = () => {
        deleteInventoryMutation(inventoryId, {
            onSuccess: () => {
                if (onMesaje) {
                    onMesaje("Registro de inventario eliminado correctamente.", "success");
                }
                onClose();
            },
            onError: () => {
                if (onMesaje) {
                    onMesaje("Error al eliminar el registro de inventario.", "error");
                }
            }
        });
    };

    return (
        <GenericModalForm
            title="Eliminar Registro de Inventario"
            headerColor="from-red-600 to-red-700"
            onClose={onClose}
        >
            <div className="space-y-4">
                <p className="text-gray-700 text-center text-base">
                    ¿Estás seguro de que deseas eliminar el registro de inventario:
                    <strong> {inventoryName}</strong>? Esta acción no se puede deshacer.
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
    );
};

export default FormDeleteInventory;