import ProjectCard from "../../../components/ProjectCard";
import { useState } from "react";
import { useMyProjects } from "../../../hooks/UseProjects";
import { FormEditProject } from "../../admin/projects/FormEditProject";
import { Project } from "../../../models/Project";
import { MessageModal, MessageType } from "../../../components/MessageModal";
import { useProjectSync } from "../../../hooks/useWebSocketSync";
import { GenericPagination } from "../../../components/GenericPagination";
import { GenericSearch } from "../../../components/GenericSearch";
import { GenericFilter } from "../../../components/GenericFilter";
import { NoResults } from "../../../components/NoResults";

export const ProjectViewSupervisor = () => {

    const { data: projects, isError, isLoading } = useMyProjects(true);

    useProjectSync();

    const [searchedProjects, setSearchedProjects] = useState<Project[]>([]);

    const [notification, setNotification] = useState<{ message: string, type: MessageType } | null>(null);

    const [filter, setFilter] = useState<"todos" | "en_progreso" | "finalizado" | "suspendido">("todos");
    const [openEditForm, setOpenEditForm] = useState(false);

    // 🔥 Estado que guarda la página actual por cada filtro
    const [currentPages, setCurrentPages] = useState({
        todos: 0,
        en_progreso: 0,
        finalizado: 0,
        suspendido: 0,
    });

    const currentPage = currentPages[filter];

    // Función para cambiar de página (actualiza el estado correspondiente al filtro)
    const handlePageChange = (newPage: number) => {
        setCurrentPages(prev => ({
            ...prev,
            [filter]: newPage,
        }));
    };

    const [projectEdit, setProjectEdit] = useState<Project | null>(null);

    // Filtrar proyectos según el estado seleccionado
    const filteredProjects = (projects ?? []).filter(project => {
        if (filter === "todos") return true;
        return project.status === filter.toUpperCase();
    })

    const handleFilterChange = (newFilter: typeof filter) => {
        setFilter(newFilter);
    };


    return (
        <>
            <div className="flex justify-between flex-wrap">
                <h2 className="text-2xl font-semibold text-gray-800 md:m-0 mx-auto">
                    Gestión de Proyectos
                </h2>
            </div>

            {isLoading ? (
                <p className="text-center text-gray-500">Cargando proyectos...</p>
            ) : isError ? (
                <p className="text-center text-red-500">Error al cargar proyectos</p>
            ) : !projects || projects.length === 0 ? (
                <p className="text-center text-gray-500">No hay proyectos disponibles</p>
            ) : (
                <div className="space-y-6">
                    {/* Componente de Filtro */}
                    <div className="bg-white px-6 pb-6 rounded-2xl shadow-lg my-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar:</label>
                        <div className="md:grid grid-cols-4 gap-2">
                            <GenericFilter
                                currentFilter={filter}
                                onFilterChange={handleFilterChange}
                                filters={[
                                    { value: "todos", label: "Todos", color: "bg-blue-600" },
                                    { value: "en_progreso", label: "En Progreso", color: "bg-yellow-500" },
                                    { value: "finalizado", label: "Finalizados", color: "bg-green-500" },
                                    { value: "suspendido", label: "Suspendidos", color: "bg-red-500" }
                                ]}
                            />
                        </div>
                    </div>

                    <GenericSearch<Project>
                        data={filteredProjects}
                        searchFields={["name", "description"]}
                        onSearchResults={setSearchedProjects}
                        className="mb-4"
                    />

                    {/* Mensaje cuando no hay resultados */}
                    {filteredProjects.length === 0 && (
                        <NoResults
                            onResetFilter={() => handleFilterChange("todos")}
                            title="No hay Proyectos"
                            message="No se encontraron Proyectos con el filtro seleccionado"
                        />
                    )}

                    {/* Contenedor grid para las tarjetas */}
                    <GenericPagination
                        items={searchedProjects}
                        currentPage={currentPage} // 🔄 Página actual del filtro
                        onPageChange={handlePageChange} // 🔄 Callback para cambiar la página
                        renderItem={(project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onEdit={() => {
                                    setProjectEdit(project);
                                    setOpenEditForm(true);
                                }}
                            />
                        )}
                    />
                    {openEditForm && projectEdit && (
                        <FormEditProject projectToEdit={projectEdit} onClose={() => setOpenEditForm(false)} onMesaje={(message, type) => setNotification({ message, type })} />
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
    );
};