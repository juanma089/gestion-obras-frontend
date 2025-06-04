import { GenericService } from './GenericService';
import { MaterialRequest, CreateMaterialRequest } from '../models/MaterialRequest';
import axios, { AxiosResponse } from 'axios';

class MaterialRequestService extends GenericService<MaterialRequest, CreateMaterialRequest> {
    constructor() {
        super(`${import.meta.env.VITE_API_GESTION}/material-requests`);
    }

    async getByUserId(userId: string, token: string): Promise<MaterialRequest[]> {
        try {
            const response: AxiosResponse<MaterialRequest[]> = await axios.get(
                `${this.apiUrl}/by-user/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 403) {
                throw new Error("No tienes permisos para ver las solicitudes de materiales");
            }
            throw new Error("Error al obtener las solicitudes por usuario");
        }
    }

    async getByProjectId(projectId: number, token: string): Promise<MaterialRequest[]> {
        try {
            const response: AxiosResponse<MaterialRequest[]> = await axios.get(
                `${this.apiUrl}/by-project/${projectId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 403) {
                throw new Error("No tienes permisos para ver las solicitudes del proyecto");
            }
            throw new Error("Error al obtener las solicitudes por proyecto");
        }
    }

    async updateStatus(id: number, status: string, token: string): Promise<void> {
        try {
            await axios.patch(
                `${this.apiUrl}/${id}/status`,
                null, // No necesitas cuerpo, solo query param
                {
                    params: { status },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (error: any) {
            if (error.response?.status === 403) {
                throw new Error("No tienes permisos para actualizar el estado de la solicitud");
            } else if (error.response?.status === 404) {
                throw new Error("Solicitud de material no encontrada");
            }
            throw new Error("Error al actualizar el estado de la solicitud");
        }
    }


}

export const materialRequestService = new MaterialRequestService();