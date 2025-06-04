import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, Pencil, Trash, Check, X } from 'lucide-react';
import { MessageModal, MessageType } from '../../../components/MessageModal';
import { useInventories, useAddQuantity, useSubtractQuantity } from '../../../hooks/UseInventory';
import { Inventory } from '../../../models/Inventory';
import FormAddInventory from './FormAddInventory';
import FormEditInventory from './FormEditInventory';
import FormDeleteInventory from './FormDeleteInventory';
import { useAuth } from '../../../context/AuthProvider';
import { useMyProjects, useProjects } from '../../../hooks/UseProjects';

export const InventoriesView = () => {

    const { user } = useAuth();
    const isAdmin = user?.role === "ADMINISTRADOR";
    const isSupervisor = user?.role === "SUPERVISOR";

    const { data: adminProjects } = useProjects(isAdmin);
    const { data: supervisorProjects } = useMyProjects(isSupervisor);
    const projects = isAdmin ? adminProjects : supervisorProjects;

    const [selectedProjectId, setSelectedProjectId] = useState<number | 'ALL'>('ALL');

    const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedProjectId(value === 'ALL' ? 'ALL' : parseInt(value));
    };

    const { data: inventories, isLoading, isError, refetch } = useInventories();

    const [notification, setNotification] = useState<{ message: string, type: MessageType } | null>(null);
    const [openAddForm, setOpenAddForm] = useState(false);
    const [openEditForm, setOpenEditForm] = useState(false);
    const [openDeleteForm, setOpenDeleteForm] = useState(false);
    const [inventoryEdit, setInventoryEdit] = useState<Inventory | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [tempQuantity, setTempQuantity] = useState<number>(0);

    // Estados para búsqueda y paginación
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    // Hooks para modificar cantidad
    const addMutation = useAddQuantity();
    const subtractMutation = useSubtractQuantity();

    // Filtrar inventarios basados en el término de búsqueda
    const filteredInventories = useMemo(() => {
        return (inventories || []).filter(inventory => {
            const matchesSearch =
                inventory.material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inventory.project.name.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesProject =
                selectedProjectId === 'ALL' || inventory.project.id === selectedProjectId;

            return matchesSearch && matchesProject;
        });
    }, [inventories, searchTerm, selectedProjectId]);


    // Calcular inventarios paginados
    const paginatedInventories = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredInventories.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredInventories, currentPage]);

    // Calcular total de páginas
    const totalPages = Math.ceil(filteredInventories.length / itemsPerPage);

    // Resetear a página 1 cuando se busca
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const startEditing = (inventory: Inventory) => {
        setEditingId(inventory.id);
        setTempQuantity(inventory.availableQuantity);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setTempQuantity(0);
    };

    const handleQuantityChange = (value: number) => {
        if (value >= 0) {
            setTempQuantity(value);
        }
    };

    const saveQuantity = (inventory: Inventory) => {
        const difference = tempQuantity - inventory.availableQuantity;

        if (difference === 0) {
            cancelEditing();
            return;
        }

        const mutation = difference > 0 ? addMutation : subtractMutation;
        const absoluteDifference = Math.abs(difference);

        mutation.mutate(
            { id: inventory.id, amount: absoluteDifference },
            {
                onSuccess: () => {
                    setNotification({
                        message: 'Cantidad actualizada correctamente',
                        type: 'success'
                    });
                    refetch();
                    cancelEditing();
                },
                onError: () => {
                    setNotification({
                        message: 'Error al actualizar la cantidad',
                        type: 'error'
                    });
                    cancelEditing();
                }
            }
        );
    };

    return (
        <>
            <div className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between items-center mb-4 gap-4">
                    <h2 className="text-xl font-semibold">Inventario</h2>

                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        {/* Buscador */}
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por material o proyecto..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Botón Agregar */}
                        <button
                            onClick={() => setOpenAddForm(true)}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all"
                        >
                            <Plus size={18} />
                            <span className='text-center'>Agregar</span>
                        </button>
                    </div>
                </div>

                <select
                    value={selectedProjectId}
                    onChange={handleProjectChange}
                    className="p-2 mb-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                    <option value="ALL">Todos los proyectos</option>
                    {projects?.map(project => (
                        <option key={project.id} value={project.id}>
                            {project.name}
                        </option>
                    ))}
                </select>

                {isLoading ? (
                    <div className="text-center text-gray-500">Cargando inventario...</div>
                ) : isError ? (
                    <div className="text-center text-red-500">Error al cargar el inventario.</div>
                ) : filteredInventories.length === 0 ? (
                    <div className="text-center text-gray-500">
                        {searchTerm ? 'No se encontraron registros con ese criterio' : 'No hay registros en el inventario'}
                    </div>
                ) : (
                    <>
                        {/* Tabla en escritorio */}
                        <div className="hidden md:block">
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm text-left border border-gray-200">
                                    <thead className="bg-gray-100 text-gray-700">
                                        <tr>
                                            <th className="p-3 border-b">Proyecto</th>
                                            <th className="p-3 border-b">Material</th>
                                            <th className="p-3 border-b">Cantidad</th>
                                            <th className="p-3 border-b text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedInventories.map((inventory) => (
                                            <tr key={inventory.id} className="border-b hover:bg-gray-50">
                                                <td className="p-3">{inventory.project.name}</td>
                                                <td className="p-3">{inventory.material.name} ({inventory.material.unit})</td>
                                                <td className="p-3">
                                                    {editingId === inventory.id ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center border rounded-md overflow-hidden">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={tempQuantity}
                                                                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                                                                    className="w-16 text-center border-x border-gray-200 py-1 px-2 focus:outline-none"
                                                                />
                                                            </div>

                                                            <button
                                                                onClick={() => saveQuantity(inventory)}
                                                                disabled={addMutation.isPending || subtractMutation.isPending}
                                                                className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                                                                title="Guardar"
                                                            >
                                                                <Check size={18} />
                                                            </button>
                                                            <button
                                                                onClick={cancelEditing}
                                                                disabled={addMutation.isPending || subtractMutation.isPending}
                                                                className="p-1 text-red-600 hover:text-red-700 disabled:opacity-50"
                                                                title="Cancelar"
                                                            >
                                                                <X size={18} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <span>{inventory.availableQuantity}</span>
                                                            <button
                                                                onClick={() => startEditing(inventory)}
                                                                className="p-1 text-blue-600 hover:text-blue-700"
                                                                title="Editar cantidad"
                                                            >
                                                                <Pencil size={16} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-3 text-right space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setInventoryEdit(inventory);
                                                            setOpenEditForm(true);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                                                        title="Editar"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setInventoryEdit(inventory);
                                                            setOpenDeleteForm(true);
                                                        }}
                                                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                                                        title="Eliminar"
                                                    >
                                                        <Trash size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Lista en móviles */}
                        <div className="md:hidden flex flex-col gap-3">
                            {paginatedInventories.map((inventory) => (
                                <div
                                    key={inventory.id}
                                    className="border rounded-lg p-4 shadow-sm bg-white"
                                >
                                    <div className="grid grid-cols-1 gap-2">
                                        <div>
                                            <h3 className="font-medium text-lg">{inventory.material.name}</h3>
                                            <span className="text-sm text-gray-600">{inventory.material.unit}</span>
                                        </div>
                                        <div>
                                            <p className="text-gray-700">
                                                <span className="font-medium">Proyecto:</span> {inventory.project.name}
                                            </p>
                                            <div className="text-gray-700 flex items-center gap-2 justify-center">
                                                <span className="font-medium">Cantidad:</span>
                                                {editingId === inventory.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center border rounded-md overflow-hidden">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={tempQuantity}
                                                                onChange={(e) => handleQuantityChange(Number(e.target.value))}
                                                                className="w-16 text-center border-x border-gray-200 py-1 px-2 focus:outline-none"
                                                            />
                                                        </div>

                                                        <button
                                                            onClick={() => saveQuantity(inventory)}
                                                            disabled={addMutation.isPending || subtractMutation.isPending}
                                                            className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                                                            title="Guardar"
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                        <button
                                                            onClick={cancelEditing}
                                                            disabled={addMutation.isPending || subtractMutation.isPending}
                                                            className="p-1 text-red-600 hover:text-red-700 disabled:opacity-50"
                                                            title="Cancelar"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <span>{inventory.availableQuantity}</span>
                                                        <button
                                                            onClick={() => startEditing(inventory)}
                                                            className="p-1 text-blue-600 hover:text-blue-700"
                                                            title="Editar cantidad"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex justify-between gap-2 mt-2">
                                            <button
                                                onClick={() => {
                                                    setOpenEditForm(true);
                                                    setInventoryEdit(inventory);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                                                title="Editar"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setInventoryEdit(inventory);
                                                    setOpenDeleteForm(true);
                                                }}
                                                className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                                                title="Eliminar"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Paginación */}
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center mt-6">
                                <div className="text-sm text-gray-600">
                                    Mostrando {(currentPage - 1) * itemsPerPage + 1}-
                                    {Math.min(currentPage * itemsPerPage, filteredInventories.length)} de {filteredInventories.length} registros
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <ChevronLeft size={20} />
                                    </button>

                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => goToPage(pageNum)}
                                                className={`w-10 h-10 rounded-md ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Formularios modales */}
            {openAddForm && (
                <FormAddInventory
                    onClose={() => setOpenAddForm(false)}
                    onMesaje={(message, type) => setNotification({ message, type })}
                />
            )}

            {openEditForm && inventoryEdit && (
                <FormEditInventory
                    inventory={inventoryEdit}
                    onClose={() => setOpenEditForm(false)}
                    onMesaje={(message, type) => setNotification({ message, type })}
                />
            )}

            {openDeleteForm && inventoryEdit && (
                <FormDeleteInventory
                    onClose={() => setOpenDeleteForm(false)}
                    onMesaje={(message, type) => setNotification({ message, type })}
                    inventoryId={inventoryEdit.id}
                    inventoryName={`${inventoryEdit.material.name} en ${inventoryEdit.project.name}`}
                />
            )}

            {/* Notificación */}
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