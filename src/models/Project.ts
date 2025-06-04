export type statusProject = 'EN_PROGRESO' | 'FINALIZADO' | 'SUSPENDIDO';

export interface Project {
    id: number;
    name: string;
    description: string;
    latitude: number | string;
    longitude: number | string;
    locationRange: number;
    startDate: string;
    endDate: string;
    status: statusProject;
    userId: string;
    createdAt: string;
}

export interface CreateProject {
    name: string;
    description: string;
    latitude: number | string;
    longitude: number | string;
    locationRange: number;
    startDate: string;
    endDate: string;
    userId: string;
}