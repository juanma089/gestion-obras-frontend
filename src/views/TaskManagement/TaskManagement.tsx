import PendingTasks from "./PendingTask"; // Importamos la nueva vista

const TaskManagement = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6 mt-12" >Gestión de Tareas</h1>
      <PendingTasks /> {/* Mostramos la lista de tareas pendientes */}
    </div>
  );
};

export default TaskManagement;
