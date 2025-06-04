import { useState, useEffect } from "react";
import { Task } from "../models/Task";

// Ajuste de las opciones de estado para que coincidan con la interfaz
const taskStatusOptions = {
  PENDIENTE: { text: "🔵 Pendiente", color: "text-blue-600" },
  EN_PROGRESO: { text: "🟢 En progreso", color: "text-green-600" },
  COMPLETADA: { text: "✅ Completada", color: "text-gray-600" },
  CANCELADA: { text: "❌ Cancelada", color: "text-red-600" },
};

const taskStatusBgColors = {
  PENDIENTE: "bg-blue-100",
  EN_PROGRESO: "bg-gray-100",
  COMPLETADA: "bg-green-100",
  CANCELADA: "bg-red-100"
};

// Eliminé las opciones de prioridad ya que no están en la interfaz Task

interface TaskListProps {
  tasks: Task[];
}

const TaskList = ({ tasks }: TaskListProps) => {
  const [taskList, setTaskList] = useState<Task[]>(tasks);

  useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);

  const handleStatusChange = (id: number, newStatus: Task["status"]) => {
    setTaskList(taskList.map(task =>
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-2">Mis Tareas</h2>
      {taskList.map(task => (
        <div key={task.id} className={`p-4 rounded-lg mb-2 ${taskStatusBgColors[task.status]}`}>
          <h3 className="font-bold">{task.name}</h3> {/* Añadido el campo name */}
          <p className="text-sm">{task.description}</p>
          <p className={`text-sm ${taskStatusOptions[task.status].color}`}>
            Estado: {taskStatusOptions[task.status].text}
          </p>
          <p className="text-xs text-gray-500">
            Zona: {task.zone.name} {/* Cambiado locationName por name ya que no existe en WorkZone */}
          </p>
          <p className="text-xs text-gray-500">
            Trabajador ID: {task.userId} {/* Cambiado ya que la interfaz solo tiene userId */}
          </p>
          {/* Eliminado assignmentDate ya que no está en la interfaz */}
          {task.evidence && ( // Mostrar evidencia si existe
            <p className="text-xs text-gray-500">
              Evidencia: {task.evidence}
            </p>
          )}
          <select
            className="mt-2 p-1 border rounded-lg w-full"
            value={task.status}
            onChange={e => handleStatusChange(task.id, e.target.value as Task["status"])}
          >
            <option value="PENDIENTE">🔵 Pendiente</option>
            <option value="EN_PROGRESO">🟢 En progreso</option>
            <option value="COMPLETADA">✅ Completada</option>
            <option value="CANCELADA">❌ Cancelada</option>
          </select>
        </div>
      ))}
    </>
  );
};

export default TaskList;