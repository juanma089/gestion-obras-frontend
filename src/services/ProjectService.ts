import { GenericService } from './GenericService';
import { Project, CreateProject } from '../models/Project';
import axios, { AxiosResponse } from 'axios';

class ProjectService extends GenericService<Project, CreateProject> {
    constructor() {
        super(`${import.meta.env.VITE_API_GESTION}/projects`);
    }

    async updateProjectStatus(id: number, status: string, token: string): Promise<void> {
        try {
            await axios.put(`${this.apiUrl}/${id}/status`, null, {
                params: { status },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error: any) {
            if (error.response?.status === 403) {
                throw new Error("No tienes permisos para actualizar el estado del proyecto");
            }
            throw new Error(`Error al actualizar el estado del proyecto con ID ${id}`);
        }
    }

    async fetchMyProjects(token: string): Promise<Project[]> {
        try {
            const response: AxiosResponse<Project[]> = await axios.get(`${this.apiUrl}/my-projects`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 403) {
                throw new Error("No tienes permisos para ver tus proyectos");
            }
            throw new Error("Error al obtener los proyectos del usuario");
        }
    }
}

export const projectService = new ProjectService();