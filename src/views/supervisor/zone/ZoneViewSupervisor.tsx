import { Plus } from "lucide-react";
import { useState } from "react";
import { MessageModal, MessageType } from "../../../components/MessageModal";
import FormAddZone from "../../admin/zones/FormAddZone";
import { useMyWorkZones } from "../../../hooks/UseWorkZone";
import { GenericFilter } from "../../../components/GenericFilter";
import { GenericSearch } from "../../../components/GenericSearch";
import { WorkZone } from "../../../models/WorkZone";
import { NoResults } from "../../../components/NoResults";
import { GenericPagination } from "../../../components/GenericPagination";
import ZoneCard from "../../../components/ZoneCard";
import FormEditZone from "../../admin/zones/FormEditZone";
import FormDeleteZone from "../../admin/zones/FormDeleteZone";
import { useWorkZoneSync } from "../../../hooks/useWebSocketSync";
import { useMyProjects } from "../../../hooks/UseProjects";
import { UserSelectTableModal } from "../../../components/UserSelectTable";
import { useAllUsersOperator } from "../../../hooks/UseUser";

export const ZoneViewSupervisor = () => {

    const { data: allZones, isError, isLoading } = useMyWorkZones();
    const zones = [...(allZones ?? [])].reverse();

    const { data: projects } = useMyProjects(true);

    useWorkZoneSync();

    const [selectedProject, setSelectedProject] = useState("");

    const [searchedZones, setSearchedZones] = useState<WorkZone[]>([]);

    const { data: users } = useAllUsersOperator()

    const [openSelectedUser, setOpenSelectedUser] = useState(false);
    const [openAddForm, setOpenAddForm] = useState(false);
    const [openEditForm, setOpenEditForm] = useState(false);
    const [openDeleteForm, setOpenDeleteForm] = useState(false);
    const [zoneEdit, setZoneEdit] = useState<WorkZone | null>(null);
    const [notification, setNotification] = useState<{ message: string, type: MessageType } | null>(null);

    const [filter, setFilter] = useState<"todas" | "en_progreso" | "finalizada" | "proyecto">("todas");
    const filteredZones = (zones ?? []).filter(zone => {
        const matchesStatus = filter === "todas" || zone.status === filter.toUpperCase();

        const matchesProject = !selectedProject || zone.project?.id === Number(selectedProject);

        return matchesStatus && matchesProject;
    });

    // 🔥 Estado que guarda la página actual por cada filtro
    const [currentPages, setCurrentPages] = useState({
        todas: 0,
        en_progreso: 0,
        finalizada: 0,
        proyecto: 0,
    });

    const currentPage = currentPages[filter];

    // Función para cambiar de página (actualiza el estado correspondiente al filtro)
    const handlePageChange = (newPage: number) => {
        setCurrentPages(prev => ({
            ...prev,
            [filter]: newPage,
        }));
    };

    const handleFilterChange = (newFilter: typeof filter) => {
        setFilter(newFilter);
    };

    return (
        <>
            <div className="flex justify-between flex-wrap">
                <h2 className="text-2xl font-semibold text-gray-800 md:m-0 mx-auto">
                    Gestión de Zonas
                </h2>

                {/* Nueva Zona */}
                <div className="my-4 sm:my-0 mx-auto md:m-0">
                    {/* Botón para Nueva Zona */}
                    {!openAddForm && (
                        <button
                            onClick={() => setOpenAddForm(true)}
                            className="mx-auto md:m-0 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                        >
                            <Plus />
                            Nueva Zona
                        </button>
                    )}

                    {/* Formulario */}
                    {openAddForm && (
                        <FormAddZone
                            onClose={() => setOpenAddForm(false)}
                            onMesaje={(message, type) => setNotification({ message, type })}
                        />
                    )}
                </div>
            </div>

            {isLoading ? (
                <p className="text-center text-gray-500">Cargando zonas...</p>
            ) : isError ? (
                <p className="text-center text-red-500">Error al cargar zonas</p>
            ) : !zones || zones.length === 0 ? (
                <p className="text-center text-gray-500">No hay zonas disponibles</p>
            ) : (
                <div className="space-y-6">
                    {/* Componente de Filtro */}
                    <div className="bg-white px-6 pb-6 rounded-2xl shadow-lg sm:my-3">
                        <label className="block sm:hidden text-sm font-medium text-gray-700 mb-2">Filtrar</label>
                        <div className="hidden md:grid grid-cols-4 gap-2">
                            <label className="col-span-3 text-sm font-medium text-gray-700">Filtrar por estado:</label>
                            <label className="col-span-1 text-sm font-medium text-gray-700">Filtrar por proyecto:</label>
                        </div>
                        <div className="md:grid grid-cols-4 gap-2">
                            <GenericFilter
                                currentFilter={filter}
                                onFilterChange={handleFilterChange}
                                filters={[
                                    { value: "todas", label: "Todas", color: "bg-blue-600" },
                                    { value: "en_progreso", label: "En Progreso", color: "bg-yellow-500" },
                                    { value: "finalizada", label: "Finalizadas", color: "bg-green-500" },
                                ]}
                            />
                            <label className="block sm:hidden text-sm font-medium text-gray-700 mb-2">Filtrar por Proyecto:</label>
                            <select
                                className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg transition-colors bg-gray-200 text-black"
                                id="project-select"
                                value={selectedProject}
                                onChange={(e) => setSelectedProject(e.target.value)}
                            >
                                <option value="">Todas las zonas</option>
                                {projects && projects.map((project, index) => (
                                    <option key={index} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <GenericSearch<WorkZone>
                        data={filteredZones}
                        searchFields={["name", "description"]}
                        onSearchResults={setSearchedZones}
                        className="mb-4"
                    />

                    <div className="my-4">
                        <button
                            onClick={() => setOpenSelectedUser(true)}
                            className="mx-auto md:m-0 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                        >
                            Asignar usuario a zona
                        </button>

                        {openSelectedUser && (
                            <UserSelectTableModal
                                users={users ?? []}
                                onClose={() => setOpenSelectedUser(false)}
                            />
                        )}
                    </div>

                    {/* Mensaje cuando no hay resultados */}
                    {filteredZones.length === 0 && (
                        <NoResults
                            onResetFilter={() => handleFilterChange("todas")}
                            title="No hay zonas"
                            message="No se encontraron zonas con el filtro seleccionado"
                            buttonText="Ver todas"
                        />
                    )}

                    {/* Contenedor grid para las tarjetas */}
                    <GenericPagination
                        items={searchedZones}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        renderItem={(zone => (
                            <ZoneCard
                                zone={zone}
                                onEdit={() => {
                                    setZoneEdit(zone);
                                    setOpenEditForm(true);
                                }}
                                onDelete={() => {
                                    setZoneEdit(zone);
                                    setOpenDeleteForm(true);
                                }}
                            />
                        ))}
                    />
                    {openEditForm && zoneEdit && (
                        <FormEditZone
                            zone={zoneEdit}
                            onClose={() => setOpenEditForm(false)}
                            onMesaje={(message, type) => setNotification({ message, type })} />
                    )}
                    {openDeleteForm && zoneEdit && (
                        <FormDeleteZone
                            zoneId={zoneEdit.id}
                            onClose={() => setOpenDeleteForm(false)}
                            onMesaje={(message, type) => setNotification({ message, type })}
                        />
                    )}

                </div>
            )}

            {notification && (
                <MessageModal
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </>
    )
}