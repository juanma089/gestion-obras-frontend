import { GenericService } from './GenericService';
import { Attendance, CreateAttendance } from '../models/Attendance';
import axios from 'axios';

class AttendanceService extends GenericService<Attendance, CreateAttendance> {
    constructor() {
        super(`${import.meta.env.VITE_API_GESTION}/attendances`);
    }

    async checkOut(id: number): Promise<Attendance> {
        try {
            const response = await axios.put<Attendance>(`${this.apiUrl}/check-out/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error al realizar el check-out para la asistencia con ID ${id}`);
        }
    }
}

export const attendanceService = new AttendanceService();