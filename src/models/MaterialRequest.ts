import { Material } from "./Material";
import { Project } from "./Project";

export interface MaterialRequest {
    id: number;
    material: Material;
    project: Project;
    userId: string;
    requestedQuantity: number;
    requestDate: Date;
    comments: string;
    status: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
    materialQuality: 'ALTA' | 'MEDIA' | 'BAJA';
    deliveryDate: string
}

export interface CreateMaterialRequest {
    materialId: number;
    projectId: number;
    userId: string;
    requestedQuantity: number;
    comments: string;
    materialQuality: 'ALTA' | 'MEDIA' | 'BAJA';
    deliveryDate: string
}