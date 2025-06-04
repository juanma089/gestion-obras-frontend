import { GenericService } from './GenericService';
import { WorkZone, CreateWorkZone } from '../models/WorkZone';
import axios, { AxiosResponse } from 'axios';

class WorkZoneService extends GenericService<WorkZone, CreateWorkZone> {
    constructor() {
        super(`${import.meta.env.VITE_API_GESTION}/zones`);
    }

    async updateWorkZoneStatus(
        id: number,
        status: string,
        token: string
    ): Promise<void> {
        try {
            await axios.put(`${this.apiUrl}/${id}/status`,
                null,
                {
                    params: { status },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error('No autorizado - Token inválido o expirado');
            }
            if (error.response?.status === 403) {
                throw new Error('No tienes permisos para actualizar WorkZones');
            }
            throw new Error(`Error al actualizar el estado de WorkZone con ID ${id}: ${error.message}`);
        }
    }

    async fetchMyWorkZones(token: string): Promise<WorkZone[]> {
        try {
            const response: AxiosResponse<WorkZone[]> = await axios.get(`${this.apiUrl}/my-zones`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error("No autorizado - Token inválido o expirado");
            }
            throw new Error("Error al obtener las zonas de trabajo del usuario");
        }
    }

    async fetchZonesByProjectId(projectId: number, token: string): Promise<WorkZone[]> {
        try {
            const response: AxiosResponse<WorkZone[]> = await axios.get(
                `${this.apiUrl}/zoneByProjectId`,
                {
                    params: { projectId },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error("No tienes permiso para acceder a esta información");
            }
            throw new Error("Error al obtener las zonas del proyecto");
        }
    }

}

export const workZoneService = new WorkZoneService();