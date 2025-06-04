import { useMemo, useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import { useCreateMaterialRequest, useMaterialRequestsByUserId } from "../../../hooks/UseMaterialRequest";
import { useCreateMaterial, useMaterials } from "../../../hooks/UseMaterial";
import { CreateMaterialRequest, MaterialRequest } from "../../../models/MaterialRequest";
import { CreateMaterial } from "../../../models/Material";
import { useZoneByUserId } from "../../../hooks/UseAssignUserZone";
import { Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageModal, MessageType } from "../../../components/MessageModal";
import { FormDeleteMaterialRequest } from "./FormDeleteMaterialRequests";
import { FormEditMaterialRequest } from "./FormEditMaterialRequests";

export const MaterialRequestForm = () => {
    const { user } = useAuth();
    const createRequest = useCreateMaterialRequest();
    const { data: materials, isLoading } = useMaterials();
    const { data: zone } = useZoneByUserId(user?.numberID ?? "");
    const project = zone?.project;

    const { data, isLoading: isLoadingMaterialRequests } = useMaterialRequestsByUserId(user?.numberID ?? "");
    const requests = data ?? [];

    const [formData, setFormData] = useState({
        materialId: "",
        quantity: "",
        comments: "",
        materialQuality: "",
        deliveryDate: "",
    });


    const [notification, setNotification] = useState<{ message: string, type: MessageType } | null>(null);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const [isOtherMaterial, setIsOtherMaterial] = useState(false);
    const createMaterial = useCreateMaterial();
    const [newMaterial, setNewMaterial] = useState<CreateMaterial>({
        name: "",
        unit: ""
    });

    const selectedMaterial = materials?.find((mat) => mat.id === Number(formData.materialId));

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};
        if (!formData.materialId) newErrors.materialId = "El material es obligatorio.";
        if (!formData.quantity || isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0)
            newErrors.quantity = "Ingrese una cantidad válida.";
        if (!formData.materialQuality) newErrors.materialQuality = "Seleccione la calidad.";
        if (!formData.deliveryDate) newErrors.deliveryDate = "Seleccione la fecha de entrega.";
        if (!project?.id) newErrors.projectId = "No se encontró el proyecto asociado a la zona.";

        if (isOtherMaterial) {
            if (!newMaterial.name) newErrors.newMaterialName = "Nombre requerido.";
            if (!newMaterial.unit) newErrors.newMaterialUnit = "Unidad requerida.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        let materialIdToUse = Number(formData.materialId);

        if (isOtherMaterial) {
            try {
                const created = await createMaterial.mutateAsync({
                    name: newMaterial.name,
                    unit: newMaterial.unit,
                });
                materialIdToUse = created.id;
            } catch (err) {
                console.error("Error al crear nuevo material", err);
                return;
            }
        }

        const request: CreateMaterialRequest = {
            materialId: materialIdToUse,
            projectId: project!.id,
            userId: user?.numberID ?? "",
            requestedQuantity: Number(formData.quantity),
            comments: formData.comments,
            materialQuality: formData.materialQuality as 'ALTA' | 'MEDIA' | 'BAJA',
            deliveryDate: formData.deliveryDate,
        };

        createRequest.mutate(request, {
            onSuccess: () => {
                setFormData({
                    materialId: "",
                    quantity: "",
                    comments: "",
                    materialQuality: "",
                    deliveryDate: "",
                });
                setNewMaterial({ name: "", unit: "" });
                setErrors({});
                setIsOtherMaterial(false);
                setNotification({ message: "Solicitud guardada", type: "success" });
            },
            onError: () => {
                setNotification({ message: "Error al guardar solicitud", type: "success" });
            }
        }
        );
    };

    return (
        <>
            <div className="flex flex-col md:flex-row gap-6">
                <form onSubmit={handleSubmit} className="md:p-3 py-2 px-3 space-y-4">
                    {/* Material */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Material <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="materialId"
                            value={formData.materialId}
                            onChange={(e) => {
                                handleChange(e);
                                if (e.target.value === "otro") {
                                    setIsOtherMaterial(true);
                                } else {
                                    setIsOtherMaterial(false);
                                }
                            }}
                            className={`w-full px-2 py-1.5 text-sm border ${errors.materialId ? 'border-red-400' : 'border-gray-300'} rounded-md`}
                        >
                            <option value="">Seleccione un material...</option>
                            {isLoading ? (
                                <option>Cargando...</option>
                            ) : (
                                materials?.map((material) => (
                                    <option key={material.id} value={material.id}>
                                        {material.name}
                                    </option>
                                ))
                            )}
                            <option value="otro">Otro...</option>
                        </select>

                        {errors.materialId && <p className="mt-1 text-xs text-red-600">{errors.materialId}</p>}
                    </div>

                    {isOtherMaterial && (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del nuevo material</label>
                                <input
                                    type="text"
                                    value={newMaterial.name}
                                    onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Unidad del nuevo material</label>
                                <input
                                    type="text"
                                    value={newMaterial.unit}
                                    onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                    )}

                    {/* Cantidad y Unidad */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cantidad <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                className={`w-full px-2 py-1.5 text-sm border ${errors.quantity ? 'border-red-400' : 'border-gray-300'
                                    } rounded-md`}
                                placeholder="0.00"
                            />
                            {errors.quantity && <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
                            <input
                                type="text"
                                value={selectedMaterial?.unit ?? ""}
                                readOnly
                                disabled
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 bg-gray-100 rounded-md"
                            />
                        </div>
                    </div>

                    {/* Calidad del material */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Calidad del material <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="materialQuality"
                            value={formData.materialQuality}
                            onChange={handleChange}
                            className={`w-full px-2 py-1.5 text-sm border ${errors.materialQuality ? 'border-red-400' : 'border-gray-300'
                                } rounded-md`}
                        >
                            <option value="">Seleccione una calidad...</option>
                            <option value="ALTA">Alta</option>
                            <option value="MEDIA">Media</option>
                            <option value="BAJA">Baja</option>
                        </select>
                        {errors.materialQuality && (
                            <p className="mt-1 text-xs text-red-600">{errors.materialQuality}</p>
                        )}
                    </div>

                    {/* Fecha de entrega */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha de entrega <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="deliveryDate"
                            value={formData.deliveryDate}
                            onChange={handleChange}
                            className={`w-full px-2 py-1.5 text-sm border ${errors.deliveryDate ? 'border-red-400' : 'border-gray-300'
                                } rounded-md`}
                        />
                        {errors.deliveryDate && (
                            <p className="mt-1 text-xs text-red-600">{errors.deliveryDate}</p>
                        )}
                    </div>

                    {/* Comentarios */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Comentarios</label>
                        <textarea
                            name="comments"
                            rows={2}
                            value={formData.comments}
                            onChange={handleChange}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md"
                            placeholder="Detalles adicionales..."
                        />
                    </div>

                    {/* Botón de enviar */}
                    <div className="flex justify-end gap-2">
                        <div onClick={(e) => e.preventDefault()}> {/* Esto evita que el botón envíe el formulario */}
                            <MaterialRequestModal
                                requests={requests}
                                isLoading={isLoadingMaterialRequests}
                                onEdit={true}
                                onDelete={true}
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                        >
                            Enviar Solicitud
                        </button>
                    </div>
                </form>

                <MaterialRequestInfoPanel
                    requests={requests}
                    isLoading={isLoadingMaterialRequests}
                />
            </div>
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

interface MaterialRequestPanelProps {
    requests: MaterialRequest[],
    isLoading: boolean
}

const MaterialRequestInfoPanel = ({ requests, isLoading }: MaterialRequestPanelProps) => {
    return (
        <>
            <div className="md:w-80 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Instrucciones</h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                        {[
                            "Seleccione el material requerido",
                            "Especifique cantidad y unidad de medida",
                            "Indique calidad preferida si aplica",
                            "Agregue fecha de entrega estimada"
                        ].map((text, index) => (
                            <li key={index} className="flex items-start">
                                <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{text}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">Solicitudes recientes</h4>
                        {isLoading ? (
                            <div className="flex items-center gap-2 text-blue-600 text-xs">
                                <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
                            </div>
                        ) : (
                            <p className="text-xs text-blue-600">
                                Tienes {requests.length} solicitudes
                                {requests.length > 0 &&
                                    ` (${requests.filter((r) => r.status === "PENDIENTE").length} pendientes)`}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

interface MaterialRequestProps {
    requests: MaterialRequest[],
    isLoading: boolean,
    onEdit: boolean,
    onDelete: boolean,
}
const ITEMS_PER_PAGE = 4;

const MaterialRequestModal = ({ requests, isLoading, onEdit, onDelete }: MaterialRequestProps) => {
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredRequests = useMemo(() => {
        return requests.filter((req) =>
            req.material.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [requests, searchTerm]);

    const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
    const paginatedRequests = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredRequests.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredRequests, currentPage]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // Función para obtener el color según la calidad del material
    const getQualityColor = (quality: 'ALTA' | 'MEDIA' | 'BAJA') => {
        switch (quality) {
            case 'ALTA': return 'bg-green-100 text-green-800';
            case 'MEDIA': return 'bg-yellow-100 text-yellow-800';
            case 'BAJA': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setShowModal(true)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                Ver solicitudes
            </button>

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                        >
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-800">Historial de Solicitudes</h3>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="mt-3">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        placeholder="Buscar por material..."
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="overflow-y-auto flex-1 p-4">
                                {isLoading ? (
                                    <div className="flex justify-center items-center h-full">
                                        <div className="text-gray-500">Cargando solicitudes...</div>
                                    </div>
                                ) : filteredRequests.length === 0 ? (
                                    <div className="flex justify-center items-center h-full">
                                        <div className="text-gray-500">No hay solicitudes registradas</div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {paginatedRequests.map((req) => (
                                            <motion.div
                                                key={req.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="relative border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200 bg-white"
                                            >
                                                <div className="absolute bottom-2 right-2 flex gap-2">
                                                    {onEdit && (
                                                        <div>
                                                            <FormEditMaterialRequest
                                                             requestId={req.id}
                                                             initialData={req}
                                                             materialName={req.material.name}
                                                            />
                                                        </div>
                                                    )}

                                                    {onDelete && (
                                                        <div>
                                                            <FormDeleteMaterialRequest
                                                                requestId={req.id}
                                                                materialName={req.material.name}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-medium text-gray-800">{req.material.name}</h4>
                                                        <div className="flex items-center mt-1 space-x-2">
                                                            <span className={`text-xs px-2 py-1 rounded-full ${req.status === "PENDIENTE" ? "bg-yellow-100 text-yellow-800" :
                                                                req.status === "APROBADA" ? "bg-green-100 text-green-800" :
                                                                    "bg-red-100 text-red-800"
                                                                }`}>
                                                                {req.status}
                                                            </span>
                                                            <span className={`text-xs px-2 py-1 rounded-full ${getQualityColor(req.materialQuality)}`}>
                                                                Calidad: {req.materialQuality}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        ID: {req.id}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                                                    <div>
                                                        <p className="text-xs text-gray-500">Cantidad solicitada</p>
                                                        <p>{req.requestedQuantity}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Fecha de solicitud</p>
                                                        <p>{new Date(req.requestDate).toLocaleDateString()}</p>
                                                    </div>
                                                    {req.deliveryDate && (
                                                        <div className="col-span-2">
                                                            <p className="text-xs text-gray-500">Fecha de entrega</p>
                                                            <p>{new Date(req.deliveryDate).toLocaleDateString()}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {req.comments && (
                                                    <div className="mt-3">
                                                        <p className="text-xs text-gray-500">Comentarios</p>
                                                        <p className="text-sm text-gray-700 italic">{req.comments}</p>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {filteredRequests.length > ITEMS_PER_PAGE && (
                                <div className="border-t border-gray-200 p-4 flex items-center justify-between">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => p - 1)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Anterior
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Página {currentPage} de {totalPages}
                                    </span>
                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};