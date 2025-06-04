import { useEffect, useState } from "react";
import { useDeleteProject } from "../../../hooks/UseProjects";
import { MessageType } from "../../../components/MessageModal";
import { GenericModalForm } from "../../../components/FormCommon";

interface FormDeleteProjectProps {
    projectId: number;
    onClose: () => void;
    onMesaje?: (message: string, type: MessageType) => void;
}

export const FormDeleteProject = ({ projectId, onClose, onMesaje }: FormDeleteProjectProps) => {
    const {
        mutate: deleteProjectMutation,
        isPending: isPendingDelete,
        isSuccess: isSuccessDelete,
        isError: isErrorDelete,
    } = useDeleteProject();

    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(onClose, 300);
    };

    const handleDelete = () => {
        deleteProjectMutation(projectId);
    };

    const children =
        <div className="space-y-4">
            <p className="text-gray-700 text-center text-base">
                ¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-4">
                <button
                    onClick={handleClose}
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

    useEffect(() => {
        if (isSuccessDelete) {
            if (onMesaje) {
                onMesaje("Proyecto eliminado correctamente.", "success");
            }
            onClose();
        } else if (isErrorDelete) {
            if (onMesaje) {
                onMesaje("Error al eliminar el proyecto.", "error");
            }
            onClose();
        }
    }, [isSuccessDelete, isErrorDelete]);

    return (
        <>
            {isOpen && (
                <GenericModalForm
                    title="Eliminar Proyecto"
                    headerColor="from-red-600 to-red-700"
                    onClose={handleClose}
                    children={children}
                />
            )}
        </>
    );
};