import { GenericView } from "../../components/GenericView";
import {
  FolderKanban,
  Map,
  Boxes,
  Warehouse,
  FileInput,
  CheckSquare,
} from "lucide-react";
import { ProjectViewSupervisor } from "./projects/ProjectViewSupervisor";
import { ZoneViewSupervisor } from "./zone/ZoneViewSupervisor";
import { MaterialsView } from "../admin/materials/MaterialsView";
import { InventoriesView } from "../admin/inventories/InventoryView";
import MaterialRequestsViewAdmin from "../admin/materialrequests/MaterialRequestsViewAdmin";


const SupervisorView = () => {
  const options = [
    {
      id: 1,
      label: "Proyectos",
      icon: <FolderKanban size={20} />,
      content: <ProjectViewSupervisor />
    },
    {
      id: 2,
      label: "Zonas",
      icon: <Map size={20} />,
      content: <ZoneViewSupervisor />
    },
    {
      id: 3,
      label: "Materiales",
      icon: <Boxes size={20} />,
      content: <MaterialsView />
    },
    {
      id: 4,
      label: "Inventario",
      icon: <Warehouse size={20} />,
      content: <InventoriesView />
    },
    {
      id: 5,
      label: "Tareas",
      icon: <CheckSquare size={20} />,
      content: "Vista de Tareas"
    },
    {
      id: 6,
      label: "Solicitudes de Materiales",
      icon: <FileInput size={20} />,
      content: <MaterialRequestsViewAdmin/>
    }
  ];


  return (
    <GenericView
      options={options}
    />
  )
}

export default SupervisorView