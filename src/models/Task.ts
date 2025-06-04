import { WorkZone } from "./WorkZone";

export interface Task {
    id: number;
    zone: WorkZone;
    name: string;
    description: string;
    userId: string;
    status: 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA' | 'CANCELADA';
    evidence: string;
}

export interface CreateTask {
    zoneId: number;
    name: string;
    description: string;
    status: 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA' | 'CANCELADA';
    evidence: string;
    userId: string;
}