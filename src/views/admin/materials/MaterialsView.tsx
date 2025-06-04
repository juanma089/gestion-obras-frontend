import { useState, useEffect, useMemo } from 'react';
import { Plus, Pencil, Trash, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import FormAddMaterial from './FormAddMaterial';
import { MessageModal, MessageType } from '../../../components/MessageModal';
import { useMaterials } from '../../../hooks/UseMaterial';
import FormEditMaterial from './FormEditMaterial';
import { Material } from '../../../models/Material';
import { FormDeleteMaterial } from './FormDeleteMaterial';

export const MaterialsView = () => {
  const { data: materials, isLoading, isError } = useMaterials();
  const [notification, setNotification] = useState<{ message: string, type: MessageType } | null>(null);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openDeleteForm, setOpenDeleteForm] = useState(false);
  const [materialEdit, setMaterialEdit] = useState<Material | null>(null);

  // Estados para búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtrar materiales basados en el término de búsqueda
  const filteredMaterials = useMemo(() => {
    return materials?.filter(material =>
      material.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  }, [materials, searchTerm]);

  // Calcular materiales paginados
  const paginatedMaterials = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMaterials.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMaterials, currentPage]);

  // Calcular total de páginas
  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);

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

  return (
    <>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between items-center mb-4 gap-4">
          <h2 className="text-xl font-semibold">Materiales</h2>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Buscador */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar materiales..."
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

        {isLoading ? (
          <div className="text-center text-gray-500">Cargando materiales...</div>
        ) : isError ? (
          <div className="text-center text-red-500">Error al cargar los materiales.</div>
        ) : filteredMaterials.length === 0 ? (
          <div className="text-center text-gray-500">
            {searchTerm ? 'No se encontraron materiales con ese nombre' : 'No hay materiales registrados'}
          </div>
        ) : (
          <>
            {/* Tabla en escritorio */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border border-gray-200">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-3 border-b">Nombre</th>
                      <th className="p-3 border-b">Unidad</th>
                      <th className="p-3 border-b text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedMaterials.map((material) => (
                      <tr key={material.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{material.name}</td>
                        <td className="p-3">{material.unit}</td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setMaterialEdit(material);
                              setOpenEditForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                            title="Editar"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setMaterialEdit(material);
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
              {paginatedMaterials.map((material) => (
                <div
                  key={material.id}
                  className="border rounded-lg p-4 shadow-sm bg-white"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{material.name}</h3>
                      <span className="text-sm text-gray-600">{material.unit}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setOpenEditForm(true);
                          setMaterialEdit(material);
                        }}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setMaterialEdit(material);
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
                  {Math.min(currentPage * itemsPerPage, filteredMaterials.length)} de {filteredMaterials.length} materiales
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
        <FormAddMaterial
          onClose={() => setOpenAddForm(false)}
          onMesaje={(message, type) => setNotification({ message, type })}
        />
      )}

      {openEditForm && materialEdit && (
        <FormEditMaterial
          material={materialEdit}
          onClose={() => setOpenEditForm(false)}
          onMesaje={(message, type) => setNotification({ message, type })}
        />
      )}

      {openDeleteForm && materialEdit && (
        <FormDeleteMaterial
          onClose={() => setOpenDeleteForm(false)}
          onMesaje={(message, type) => setNotification({ message, type })}
          materialId={materialEdit.id}
          materialName={materialEdit.name}
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