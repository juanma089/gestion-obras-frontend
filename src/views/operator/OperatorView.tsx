import { CheckSquare, FileInput, House } from "lucide-react";
import { GenericView } from "../../components/GenericView"
import TaskManagement from "../TaskManagement/TaskManagement";
import WorkerPanel from "./WorkerPanel/WorkerPanel";
import MaterialRequestsViewOperador from "./materialrequests/MaterialRequestsViewOperador";

const OperatorView = () => {
  const options = [
    {
      id: 1,
      label: "Inicio",
      icon: <House size={20} />,
      content: <WorkerPanel />
    },
    {
      id: 2,
      label: "Tareas",
      icon: <CheckSquare size={20} />,
      content: <TaskManagement />
    },
    {
      id: 3,
      label: "Solicitudes de Materiales",
      icon: <FileInput size={20} />,
      content: <MaterialRequestsViewOperador/>
    },
  ];

  return (
    <GenericView
      options={options}
    />
  )
}

export default OperatorView