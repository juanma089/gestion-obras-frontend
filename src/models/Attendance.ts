import { WorkZone } from "./WorkZone";

export interface Attendance {
    id: number;
    userId: string;
    zone: WorkZone;
    checkIn: Date;
    checkOut: Date;
}

export interface CreateAttendance {
    userId: string;
    zoneId: number;
}