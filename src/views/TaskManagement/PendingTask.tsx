import React, { useState } from "react";

const PendingTasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Revisión de planos", description: "Verificar planos estructurales", status: "pendiente", priority: "alta" },
    { id: 2, title: "Compra de materiales", description: "Comprar cemento y acero", status: "en progreso", priority: "media" },
  ]);

  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "baja" });
  const [filter, setFilter] = useState("todas");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.description.trim()) return;

    const newTaskObj = {
      id: Date.now(), // Mejor usar timestamp para IDs únicos
      title: newTask.title,
      description: newTask.description,
      status: "pendiente",
      priority: newTask.priority,
    };

    setTasks([...tasks, newTaskObj]);
    setNewTask({ title: "", description: "", priority: "baja" });
    setIsFormOpen(false);
  };

  const updateTaskStatus = (id: number, newStatus: string) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, status: newStatus } : task)));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = filter === "todas" ? tasks : tasks.filter(task => task.status === filter);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta": return "bg-gradient-to-r from-red-100 to-red-50 border-l-4 border-red-500";
      case "media": return "bg-gradient-to-r from-yellow-100 to-yellow-50 border-l-4 border-yellow-500";
      case "baja": return "bg-gradient-to-r from-green-100 to-green-50 border-l-4 border-green-500";
      default: return "bg-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendiente": return "bg-gray-200 text-gray-800";
      case "en progreso": return "bg-blue-200 text-blue-800";
      case "completada": return "bg-green-200 text-green-800";
      default: return "bg-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Gestión de Tareas
              </span>
            </h1>
            <p className="text-gray-600 mt-1">Organiza y prioriza tus actividades</p>
          </div>
          
          <button
            onClick={() => setIsFormOpen(true)}
            className="mt-4 md:mt-0 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nueva Tarea
          </button>
        </div>

        {/* Filtro */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar tareas:</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <button
              onClick={() => setFilter("todas")}
              className={`px-4 py-2 rounded-lg transition-all ${filter === "todas" ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter("pendiente")}
              className={`px-4 py-2 rounded-lg transition-all ${filter === "pendiente" ? "bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFilter("en progreso")}
              className={`px-4 py-2 rounded-lg transition-all ${filter === "en progreso" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              En Progreso
            </button>
            <button
              onClick={() => setFilter("completada")}
              className={`px-4 py-2 rounded-lg transition-all ${filter === "completada" ? "bg-green-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              Completadas
            </button>
            <button
              onClick={() => setFilter("alta")}
              className={`px-4 py-2 rounded-lg transition-all col-span-2 md:col-span-1 ${filter === "alta" ? "bg-red-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              Prioridad Alta
            </button>
          </div>
        </div>

        {/* Modal para nueva tarea */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-t-2xl text-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Nueva Tarea</h3>
                  <button onClick={() => setIsFormOpen(false)} className="text-white hover:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleAddTask} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input
                    type="text"
                    placeholder="Nombre de la tarea"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    placeholder="Detalles de la tarea"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Crear Tarea
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Lista de tareas */}
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div 
                key={task.id} 
                className={`p-5 rounded-2xl shadow-md transition-all hover:shadow-lg ${getPriorityColor(task.priority)}`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600">{task.description}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      className={`p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${getStatusColor(task.status)}`}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en progreso">En Progreso</option>
                      <option value="completada">Completada</option>
                    </select>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No hay tareas</h3>
              <p className="mt-2 text-gray-600">No se encontraron tareas con los filtros seleccionados</p>
              <button
                onClick={() => setFilter("todas")}
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver todas las tareas
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingTasks;