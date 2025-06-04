import { GenericService } from './GenericService';
import { Inventory, CreateInventory } from '../models/Inventory';
import axios, { AxiosResponse } from 'axios';

class InventoryService extends GenericService<Inventory, CreateInventory> {
    constructor() {
        super(`${import.meta.env.VITE_API_GESTION}/inventories`);
    }

    async getInventoriesByProjectId(projectId: number, token: string): Promise<Inventory[]> {
        try {
            const response: AxiosResponse<Inventory[]> = await axios.get(
                `${this.apiUrl}/inventories-by-project/${projectId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error(`No tienes permisos para acceder a los materiales del proyecto con ID ${projectId}`);
            }
            throw new Error(`Error al obtener los materiales del proyecto con ID ${projectId}`);
        }
    }

    // PATCH: Sumar cantidad disponible
    async addAvailableQuantity(id: number, amount: number, token: string): Promise<void> {
        try {
            await axios.patch(`${this.apiUrl}/${id}/add-quantity`, null, {
                params: { amount },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error: any) {
            throw new Error(
                `Error al sumar ${amount} unidades al inventario con ID ${id}`
            );
        }
    }

    // PATCH: Restar cantidad disponible
    async subtractAvailableQuantity(id: number, amount: number, token: string): Promise<void> {
        try {
            await axios.patch(`${this.apiUrl}/${id}/subtract-quantity`, null, {
                params: { amount },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error: any) {
            throw new Error(
                `Error al restar ${amount} unidades al inventario con ID ${id}`
            );
        }
    }
}

export const inventoryService = new InventoryService();