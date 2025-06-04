import { GenericService } from './GenericService';
import { AssignUsersToZoneDto, AssignUserZone, CreateAssignUserZone } from '../models/AssignUserZone';
import axios, { AxiosResponse } from 'axios';
import { WorkZone } from '../models/WorkZone';

class AssignUserZoneService extends GenericService<AssignUserZone, CreateAssignUserZone> {
    constructor() {
        super(`${import.meta.env.VITE_API_GESTION}/assign_user_zones`);
    }

    async fetchZoneByUserId(userId: string, token: string): Promise<WorkZone> {
        try {
            const response: AxiosResponse<WorkZone> = await axios.get(
                `${this.apiUrl}/user/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('No se encontró una zona asignada para este usuario');
            }
            if (error.response?.status === 403) {
                throw new Error('No tienes permiso para acceder a esta información');
            }
            throw new Error('Error al obtener la zona asignada');
        }
    }

    async assignUsersToZone(data: AssignUsersToZoneDto, token: string): Promise<string> {
        try {
            const response: AxiosResponse<string> = await axios.post(
                `${this.apiUrl}/assignUsersToZone`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error('No tienes permiso para realizar esta acción');
            }
            throw new Error(error.response?.data?.message || 'Error al asignar usuarios');
        }
    }
}

export const assignUserZoneService = new AssignUserZoneService();