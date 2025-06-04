import { useState } from "react";
import { useUpdateMaterialRequest } from "../../../hooks/UseMaterialRequest";
import { MessageType } from "../../../components/MessageModal";
import { GenericModalForm } from "../../../components/FormCommon";
import { Pencil } from "lucide-react";
import { CreateMaterialRequest, MaterialRequest } from "../../../models/MaterialRequest";

interface FormEditMaterialRequestProps {
    requestId: number;
    initialData: MaterialRequest;
    materialName: string;
    onMessage?: (message: string, type: MessageType) => void;
}

export const FormEditMaterialRequest = ({
    requestId,
    initialData,
    materialName,
    onMessage
}: FormEditMaterialRequestProps) => {
    const [isOpen, setIsOpen] = useState(false);

    function convertToCreateMaterialRequest(request: MaterialRequest): CreateMaterialRequest {
        return {
            materialId: request.material.id,
            projectId: request.project.id,
            userId: request.userId,
            requestedQuantity: request.requestedQuantity,
            comments: request.comments,
            materialQuality: request.materialQuality,
            deliveryDate: request.deliveryDate
        };
    }

    const editData: CreateMaterialRequest = convertToCreateMaterialRequest(initialData);

    const [formData, setFormData] = useState({ ...editData });

    const {
        mutate: updateRequest,
        isPending
    } = useUpdateMaterialRequest();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "requestedQuantity" ? Number(value) : value
        }));
    };

    const handleSubmit = () => {
        updateRequest(
            {
                id: requestId,
                data: formData
            },
            {
                onSuccess: () => {
                    onMessage?.("Solicitud actualizada correctamente.", "success");
                    setIsOpen(false);
                },
                onError: () => {
                    onMessage?.("Error al actualizar la solicitud.", "error");
                }
            }
        );
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 bg-amber-400 text-white rounded-full hover:bg-amber-500 transition-all hover:shadow-xl duration-300 hover:scale-120"
                aria-label="Editar solicitud"
            >
                <Pencil className="h-4 w-4" />
            </button>

            {isOpen && (
                <GenericModalForm
                    title="Editar Solicitud de Material"
                    headerColor="from-amber-500 to-amber-600"
                    onClose={() => setIsOpen(false)}
                >
                    <div className="space-y-4">
                        <p className="text-gray-700 text-base">
                            Editar solicitud de <strong>{materialName}</strong>
                        </p>

                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Cantidad solicitada</label>
                                <input
                                    type="number"
                                    name="requestedQuantity"
                                    value={formData.requestedQuantity}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                    min={1}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Calidad del material</label>
                                <select
                                    name="materialQuality"
                                    value={formData.materialQuality}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="ALTA">ALTA</option>
                                    <option value="MEDIA">MEDIA</option>
                                    <option value="BAJA">BAJA</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Fecha de entrega</label>
                                <input
                                    type="date"
                                    name="deliveryDate"
                                    value={formData.deliveryDate.slice(0, 10)} // formato YYYY-MM-DD
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Comentarios</label>
                                <textarea
                                    name="comments"
                                    value={formData.comments || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={isPending}
                                className={`px-4 py-2 rounded-lg text-white transition ${isPending ? "bg-amber-400" : "bg-amber-500 hover:bg-amber-600"
                                    }`}
                            >
                                {isPending ? "Actualizando..." : "Guardar cambios"}
                            </button>
                        </div>
                    </div>
                </GenericModalForm>
            )}
        </>
    );
};