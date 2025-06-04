import { Material } from "./Material";
import { Project } from "./Project";

export interface Inventory {
    id: number;
    project: Project;
    material: Material;
    availableQuantity: number;
}

export interface CreateInventory {
    projectId: number;
    materialId: number;
}