import { GenericService } from './GenericService';
import { Material, CreateMaterial } from '../models/Material';

class MaterialService extends GenericService<Material, CreateMaterial> {
    constructor() {
        super(`${import.meta.env.VITE_API_GESTION}/materials`);
    }
}

export const materialService = new MaterialService();