import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import { useMyProjects, useProjects } from "../../../hooks/UseProjects";
import { useMaterialRequestsByProjectIdsMap } from "../../../hooks/UseMaterialRequest";
import { StatusSelector } from "./StatusSelector";

const getQualityColor = (quality: 'ALTA' | 'MEDIA' | 'BAJA') => {
    switch (quality) {
        case 'ALTA': return 'bg-green-100 text-green-800';
        case 'MEDIA': return 'bg-yellow-100 text-yellow-800';
        case 'BAJA': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const MaterialRequestsViewAdmin = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMINISTRADOR';
    const isSupervisor = user?.role === 'SUPERVISOR';

    const { data: adminProjects } = useProjects(isAdmin);
    const { data: supervisorProjects } = useMyProjects(isSupervisor);
    const projects = (isAdmin ? adminProjects : supervisorProjects) ?? [];

    const projectIds = projects.map(p => p.id);
    const { materialRequestsMap, isLoading } = useMaterialRequestsByProjectIdsMap(projectIds);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProjectId, setSelectedProjectId] = useState<number | "ALL">("ALL");

    // Aplanar solicitudes
    const allRequests = useMemo(() => {
        return Object.entries(materialRequestsMap).flatMap(([projectId, requests]) =>
            Array.isArray(requests)
                ? requests.map(req => ({ ...req, projectId: Number(projectId) }))
                : []
        );
    }, [materialRequestsMap]);

    // Aplicar filtro por proyecto
    const filteredByProject = useMemo(() => {
        return selectedProjectId === "ALL"
            ? allRequests
            : allRequests.filter(req => req.projectId === selectedProjectId);
    }, [allRequests, selectedProjectId]);

    // Aplicar filtro por búsqueda
    const filteredRequests = useMemo(() => {
        return filteredByProject.filter((req) =>
            req.material.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [filteredByProject, searchTerm]);

    const ITEMS_PER_PAGE = 4;
    const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);

    const paginatedRequests = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredRequests.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredRequests, currentPage]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedProjectId(value === "ALL" ? "ALL" : Number(value));
        setCurrentPage(1);
    };

    return (
        <>
            <div className="p-4 border-b border-gray-200 space-y-3">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Buscar por material..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />

                <select
                    value={selectedProjectId}
                    onChange={handleProjectChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value="ALL">Todos los proyectos</option>
                    {projects.map(project => (
                        <option key={project.id} value={project.id}>
                            {project.name}
                        </option>
                    ))}
                </select>
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
                                    <span className="text-xs text-gray-500">ID: {req.id}</span>
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
                                <StatusSelector
                                    id={req.id}
                                    currentStatus={req.status}
                                />
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
        </>
    );
};

export default MaterialRequestsViewAdmin;