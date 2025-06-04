import { useState } from 'react';
import { UserResponseDto } from '../models/UserResponse';
import { useMyProjects, useProjects } from '../hooks/UseProjects';
import { useAuth } from '../context/AuthProvider';
import { useZonesByAllProjects } from '../hooks/UseWorkZone';
import { useAssignUsersToZone, useZonesByUserIds } from '../hooks/UseAssignUserZone';
import { WorkZone } from '../models/WorkZone';
import { ArrowLeft, CircleArrowLeft, CircleArrowRight } from 'lucide-react';
import { MessageModal, MessageType } from './MessageModal';

interface Props {
    users: UserResponseDto[];
    onClose: () => void;
}

const PAGE_SIZE = 5;

export const UserSelectTableModal = ({ users, onClose }: Props) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>();
    const [selectedZoneId, setSelectedZoneId] = useState<number | undefined>();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);

    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMINISTRADOR';
    const isSupervisor = user?.role === 'SUPERVISOR';

    const { data: adminProjects } = useProjects(isAdmin);
    const { data: supervisorProjects } = useMyProjects(isSupervisor);
    const projects = (isAdmin ? adminProjects : supervisorProjects) ?? [];

    const projectIds = projects.map(p => p.id);
    const { data: zonesByProject, isLoading: loadingZones } = useZonesByAllProjects(projectIds);

    const toggleSelection = (numberID: string) => {
        setSelectedIds(prev =>
            prev.includes(numberID)
                ? prev.filter(id => id !== numberID)
                : [...prev, numberID]
        );
    };

    const { mutate } = useAssignUsersToZone();

    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<MessageType>("error");

    const handleConfirm = () => {
        mutate({
            userIds: selectedIds,
            zoneId: selectedZoneId!,
        }, {
            onSuccess: () => {
                setMessage("Usuarios asignados correctamente.");
                setMessageType("success");
                setSelectedIds([]);
                setSelectedProjectId(undefined);
                setSelectedZoneId(undefined);
            },
            onError: () => {
                setMessage("Error al asignar usuarios. Inténtalo de nuevo.");
                setMessageType("error");
            }
        });
    };

    const zonesForSelectedProject: WorkZone[] = selectedProjectId && zonesByProject
        ? zonesByProject[selectedProjectId] ?? []
        : [];

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.numberID.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const paginatedIds = paginatedUsers.map(u => u.numberID);
    const { data: zonesByUserId, isLoading: loadingUserZones } = useZonesByUserIds(paginatedIds);

    return (
        <div className="fixed inset-0 z-50">
            <div className="bg-white rounded-none shadow-xl w-screen h-screen flex flex-col">
                <div className="flex flex-col items-start px-6">
                    <button onClick={onClose} className="rounded-2xl text-left my-2 px-8 py-2 bg-blue-400 hover:bg-blue-600 text-white text-lg"><ArrowLeft /></button>
                    <h2 className="text-xl font-semibold">Seleccionar zona</h2>
                </div>

                <div className="px-6 pt-2 grid md:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
                        <select
                            name="projectId"
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg"
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                setSelectedProjectId(isNaN(value) ? undefined : value);
                                setSelectedZoneId(undefined);
                            }}
                            value={selectedProjectId ?? ''}
                        >
                            <option value="" disabled>Selecciona un proyecto</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Zona</label>
                        <select
                            name="zoneId"
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg"
                            value={selectedZoneId ?? ''}
                            onChange={(e) => setSelectedZoneId(parseInt(e.target.value))}
                            disabled={!zonesForSelectedProject.length}
                        >
                            <option value="" disabled>
                                {loadingZones ? 'Cargando zonas...' : 'Selecciona una zona'}
                            </option>
                            {zonesForSelectedProject.map((zone) => (
                                <option key={zone.id} value={zone.id}>
                                    {zone.name}
                                </option>
                            ))}
                        </select>
                        {selectedProjectId && zonesForSelectedProject.length === 0 && !loadingZones && (
                            <p className="text-sm text-red-500">Este proyecto no tiene zonas disponibles.</p>
                        )}
                    </div>
                </div>

                <div className="px-6 mt-2 mb-2 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Seleccionar usuarios</h2>
                </div>

                <div className="px-6 mb-2">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o documento..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full p-1 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="flex-1 overflow-y-auto px-6">

                    {/* Vista de tabla para escritorio */}
                    <div className="hidden md:block">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700 sticky top-0">
                                <tr>
                                    <th className="p-2"></th>
                                    <th className="p-2">Nombre</th>
                                    <th className="p-2">Documento</th>
                                    <th className="p-2">Proyecto</th>
                                    <th className="p-2">Zona</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center text-gray-500 py-4">
                                            No se encontraron usuarios.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedUsers.map(user => (
                                        <tr key={user.id} className="border-y hover:bg-gray-50">
                                            <td className="p-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(user.numberID)}
                                                    onChange={() => toggleSelection(user.numberID)}
                                                    disabled={
                                                        zonesForSelectedProject.length === 0 ||
                                                        selectedZoneId === undefined
                                                    }
                                                />
                                            </td>
                                            <td className="p-2">{user.fullName}</td>
                                            <td className="p-2">{user.numberID}</td>
                                            <td className="p-2">
                                                {loadingUserZones ? (
                                                    <span className="text-gray-500">Cargando...</span>
                                                ) : zonesByUserId?.[user.numberID] ? (
                                                    <span className="text-green-600 font-medium">
                                                        {zonesByUserId[user.numberID]?.project.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-red-500 font-semibold">Sin proyecto</span>
                                                )}
                                            </td>
                                            <td className="p-2">
                                                {loadingUserZones ? (
                                                    <span className="text-gray-500">Cargando...</span>
                                                ) : zonesByUserId?.[user.numberID] ? (
                                                    <span className="text-green-600 font-medium">
                                                        {zonesByUserId[user.numberID]?.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-red-500 font-semibold">Sin zona</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Vista de lista para móviles */}
                    <div className="md:hidden flex flex-col gap-4">
                        {paginatedUsers.length === 0 ? (
                            <p className="text-center text-gray-500">No se encontraron usuarios.</p>
                        ) : (
                            paginatedUsers.map(user => (
                                <div
                                    key={user.id}
                                    className="border rounded-lg p-4 shadow-sm flex flex-col gap-2 bg-white"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold">{user.fullName}</h3>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(user.numberID)}
                                            onChange={() => toggleSelection(user.numberID)}
                                            className='w-6 h-6'
                                            disabled={
                                                zonesForSelectedProject.length === 0 ||
                                                selectedZoneId === undefined
                                            }
                                        />
                                    </div>
                                    <p className="text-sm text-gray-600"><strong>Documento:</strong> {user.numberID}</p>
                                    <p className="text-sm">
                                        <strong>Proyecto:</strong>{' '}
                                        {loadingUserZones ? (
                                            <span className="text-gray-500">Cargando...</span>
                                        ) : zonesByUserId?.[user.numberID] ? (
                                            <span className="text-green-600 font-medium">
                                                {zonesByUserId[user.numberID]?.project.name}
                                            </span>
                                        ) : (
                                            <span className="text-red-500 font-semibold">Sin proyecto</span>
                                        )}
                                    </p>
                                    <p className="text-sm">
                                        <strong>Zona:</strong>{' '}
                                        {loadingUserZones ? (
                                            <span className="text-gray-500">Cargando...</span>
                                        ) : zonesByUserId?.[user.numberID] ? (
                                            <span className="text-green-600 font-medium">
                                                {zonesByUserId[user.numberID]?.name}
                                            </span>
                                        ) : (
                                            <span className="text-red-500 font-semibold">Sin zona</span>
                                        )}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Paginación */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-2 gap-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                            >
                                <CircleArrowLeft />
                            </button>
                            <span className="self-center text-sm text-gray-600">
                                Página {currentPage} de {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                            >
                                <CircleArrowRight />
                            </button>
                        </div>
                    )}
                    <div className="px-6 py-4 bg-white sticky bottom-0 flex md:justify-end justify-center gap-2">
                        <button
                            onClick={handleConfirm}
                            disabled={
                                selectedIds.length === 0 ||
                                zonesForSelectedProject.length === 0 ||
                                selectedZoneId === undefined
                            }
                            className={`px-4 py-2 w-full md:w-auto rounded-lg text-white ${selectedIds.length === 0 ||
                                zonesForSelectedProject.length === 0 ||
                                selectedZoneId === undefined
                                ? 'bg-blue-300 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            Asignar usuarios
                        </button>
                    </div>
                </div>
            </div>

            {message && (
                <MessageModal
                    message={message}
                    type={messageType}
                    onClose={() => setMessage(null)}
                    duration={3000}
                />
            )}
        </div>
    );
};
