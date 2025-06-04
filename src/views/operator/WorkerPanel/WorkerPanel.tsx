import TaskList from '../../../components/TaskList';
import { Task } from "../../../models/Task";
import { useMaterialRequests } from '../../../context/MaterialRequestsContext';

const WorkerPanel = () => {
  const { requests } = useMaterialRequests();

  // Datos de ejemplo corregidos según la interfaz Task
  const tasks: Task[] = [
    {
      id: 1,
      zone: {
        id: 103,
        project: {
          id: 1,
          name: "Proyecto Norte",
          description: "Construcción residencial",
          latitude: 3.4516,
          longitude: -76.5320,
          locationRange: 100,
          startDate: "2025-01-01",
          endDate: "2025-12-31",
          status: 'EN_PROGRESO',
          userId: "1",
          createdAt: "2025-01-01"
        },
        name: "Zona 1",
        description: "Avenida Central, Cali", // Moved location to description
        status: 'EN_PROGRESO' // Asegurado que está en progreso
      },
      name: "Reparación de muro",
      description: "Reparar muro en sector 3",
      userId: "1",
      status: 'EN_PROGRESO',
      evidence: ""
    },
    {
      id: 2,
      zone: {
        id: 103,
        project: {
          id: 1,
          name: "Proyecto Norte",
          description: "Construcción residencial",
          latitude: 3.4516,
          longitude: -76.5320,
          locationRange: 100,
          startDate: "2025-01-01",
          endDate: "2025-12-31",
          status: 'EN_PROGRESO',
          userId: "1",
          createdAt: "2025-01-01"
        },
        name: "Zona 1",
        description: "Avenida Central, Cali", // Moved location to description
        status: 'EN_PROGRESO' // Asegurado que está en progreso
      },
      name: "Instalación de tuberías",
      description: "Instalar tuberías en baño 2",
      userId: "1",
      status: 'EN_PROGRESO', // Cambiado de 'PENDIENTE' a 'EN_PROGRESO'
      evidence: ""
    },
  ];

  return (
    <>
      {/* Sección de Asistencia */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Registro de Asistencia</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-700">Ubicación actual: <span className="font-bold">Zona A - Obra 12</span></p>
            <p className="text-gray-700">Horas trabajadas hoy: <span className="font-bold">5h 30m</span></p>
          </div>
        </div>
      </div>

      {/* Sección de Tareas */}
      <div>
        <TaskList tasks={tasks} />
      </div>

      {/* Sección de Materiales Solicitados */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Materiales Solicitados</h2>
        {requests.length === 0 ? (
          <p className="text-gray-600 p-4 bg-gray-100 rounded-lg">No hay solicitudes de materiales registradas.</p>
        ) : (
          <div className="space-y-2">
            {requests.map((request, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                <div className="flex justify-between">
                  <p className="font-semibold">{request.material}</p>
                  <p className="text-gray-600">{request.quantity} {request.unit}</p>
                </div>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-600 mr-2">Estado:</span>
                  {request.status === "Aprobado" ? (
                    <span className="text-green-600 text-sm flex items-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                      Aprobado
                    </span>
                  ) : request.status === "Pendiente" ? (
                    <span className="text-yellow-600 text-sm flex items-center">
                      <span className="w-2 h-2 bg-yellow-600 rounded-full mr-1"></span>
                      Pendiente
                    </span>
                  ) : (
                    <span className="text-red-600 text-sm flex items-center">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-1"></span>
                      Rechazado
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección de Comunicaciones */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Comunicaciones</h2>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <p className="font-semibold text-yellow-800">Aviso importante</p>
          <p className="text-yellow-700">Hoy habrá inspección de seguridad a las 3:00 PM.</p>
        </div>
      </div>

      {/* Sección de Progreso */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Mi Progreso</h2>
        <p className="text-gray-700 mb-1">Tareas completadas esta semana: <span className="font-bold">8/12</span></p>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: '66%' }}
          ></div>
        </div>
      </div>
    </>
  );
}

export default WorkerPanel;