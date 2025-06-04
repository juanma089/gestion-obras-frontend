import { Plus } from "lucide-react"
import { useAllUsers } from "../../../hooks/UseUser"
import { useState } from "react";
import { GenericFilter } from "../../../components/GenericFilter";
import { UserResponseDto } from "../../../models/UserResponse";
import { GenericSearch } from "../../../components/GenericSearch";
import { NoResults } from "../../../components/NoResults";
import { GenericPagination } from "../../../components/GenericPagination";
import UserCard from "../../../components/UserCard";
import { MessageModal, MessageType } from "../../../components/MessageModal";
import { GenericModalForm } from "../../../components/FormCommon";
import RegisterForm from "../register/RegisterForm";

const UsersView = () => {

  const { data: allUsers, isError, isLoading } = useAllUsers();
  const users = [...(allUsers ?? [])].reverse();
  const [filter, setFilter] = useState<"todos" | "administrador" | "supervisor" | "operador">("todos");
  const [searchedUsers, setSearchedUsers] = useState<UserResponseDto[]>([]);
  const [notification, setNotification] = useState<{ message: string, type: MessageType } | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const filteredUsers = users.filter((user) => {
    if (filter === "todos") return true;
    return user.role.toLowerCase() === filter;
  });

  const [currentPages, setCurrentPages] = useState({
    todos: 0,
    administrador: 0,
    supervisor: 0,
    operador: 0,
  });

  const currentPage = currentPages[filter];

  const handlePageChange = (newPage: number) => {
    setCurrentPages(prev => ({
      ...prev,
      [filter]: newPage,
    }));
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between flex-wrap">
        <h2 className="text-2xl font-semibold text-gray-800 md:m-0 mx-auto">
          Usuarios
        </h2>

        <div className="my-4 sm:my-0 mx-auto md:m-0">
          {/* Botón para Nuevo Usuario */}
          <button
            onClick={() => setShowRegisterModal(true)}
            className="mx-auto md:m-0 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <Plus />
            Nuevo Usuario
          </button>

          {showRegisterModal && (
            <GenericModalForm
              title="Registrar Nuevo Usuario"
              headerColor="from-orange-500 to-pink-500"
              onClose={() => setShowRegisterModal(false)}
            >
              <RegisterForm onClose={() => setShowRegisterModal(false)} />
            </GenericModalForm>
          )}
        </div>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500">Cargando usuarios...</p>
      ) : isError ? (
        <p className="text-center text-red-500">Error al cargar usuarios</p>
      ) : (
        <div className="space-y-6">
          <div className="bg-white px-6 pb-6 rounded-2xl shadow-lg my-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por rol:</label>
            <div className="md:grid grid-cols-4 gap-2">
              <GenericFilter
                currentFilter={filter}
                onFilterChange={setFilter}
                filters={[
                  { value: "todos", label: "Todos", color: "bg-blue-600" },
                  { value: "administrador", label: "Administrador", color: "bg-purple-600" },
                  { value: "supervisor", label: "Supervisor", color: "bg-green-600" },
                  { value: "operador", label: "Operador", color: "bg-yellow-500" },
                ]}
              />
            </div>
          </div>

          <GenericSearch<UserResponseDto>
            data={filteredUsers}
            searchFields={["fullName", "email", "role"]} // Usa los campos correctos de tu User
            onSearchResults={setSearchedUsers}
            className="mb-4"
          />

          {filteredUsers.length === 0 && (
            <NoResults
              title="No hay Usuarios"
              message="No se encontraron usuarios con el filtro o búsqueda actual."
              onResetFilter={() => setFilter("todos")}
              showButton={true}
              buttonText="Ver todos"
            />
          )}

          <GenericPagination
            items={searchedUsers}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            renderItem={(user) => (
              <UserCard
                key={user.id}
                user={user}
              />
            )}
          />

          {notification && (
            <MessageModal
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification(null)}
            />
          )}

        </div>
      )}
    </>
  )
}

export default UsersView