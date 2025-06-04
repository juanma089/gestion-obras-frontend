import { Project } from './Project';

export type StatusWorkZone = 'EN_PROGRESO' | 'FINALIZADA';

export interface WorkZone {
    id: number;
    project: Project;
    name: string;
    description: string;
    status: 'EN_PROGRESO' | 'FINALIZADA';
}

export interface CreateWorkZone {
    projectId: number;
    name: string;
    description: string;
}