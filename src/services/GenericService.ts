import axios, { AxiosResponse } from 'axios';

export abstract class GenericService<T, CreateT = T> {
    protected apiUrl: string;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    async fetchAll(token: string): Promise<T[]> {
        try {
            const response: AxiosResponse<T[]> = await axios.get(
                this.apiUrl,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 403) {
                throw new Error("No tienes permisos para acceder a estos datos");
            }
            throw new Error("Error al obtener los datos");
        }
    }

    async fetchById(id: number, token: string): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axios.get(
                `${this.apiUrl}/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 403) {
                throw new Error(`No tienes permisos para acceder al elemento con ID ${id}`);
            }
            throw new Error(`Error al obtener el elemento con ID ${id}`);
        }
    }

    async create(data: CreateT, token: string): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axios.post(
                this.apiUrl,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 403) {
                throw new Error("No tienes permisos para crear elementos");
            }
            throw new Error("Error al crear el elemento");
        }
    }

    async update(id: number, data: Partial<CreateT>, token: string): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axios.put(
                `${this.apiUrl}/${id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 403) {
                throw new Error(`No tienes permisos para actualizar el elemento con ID ${id}`);
            }
            throw new Error(`Error al actualizar el elemento con ID ${id}`);
        }
    }

    async delete(id: number, token: string): Promise<void> {
        try {
            await axios.delete(
                `${this.apiUrl}/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (error: any) {
            if (error.response?.status === 403) {
                throw new Error(`No tienes permisos para eliminar el elemento con ID ${id}`);
            }
            throw new Error(`Error al eliminar el elemento con ID ${id}`);
        }
    }
}