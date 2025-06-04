import { useQuery, useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { attendanceService } from "../services/AttendanceService";
import { Attendance, CreateAttendance } from "../models/Attendance";
import { useAuth } from "../context/AuthProvider";

export const useAttendances = () => {
  const { token } = useAuth();
  return useQuery<Attendance[], Error>({
    queryKey: ["attendances"],
    queryFn: () => attendanceService.fetchAll(token!),
  });
};

export const useAttendance = (id: number) => {
  const { token } = useAuth();
  return useQuery<Attendance, Error>({
    queryKey: ["attendance", id],
    queryFn: () => attendanceService.fetchById(id, token!),
    enabled: !!id,
  });
};

export const useCreateAttendance = (): UseMutationResult<Attendance, Error, CreateAttendance> => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<Attendance, Error, CreateAttendance>({
    mutationFn: (data) => attendanceService.create(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
    },
    onError: (error) => {
      console.error("Error al agregar dato de asistencia:", error.message);
    },
  });
};

export const useUpdateAttendance = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<Attendance, Error, { id: number; data: Partial<CreateAttendance> }>({
    mutationFn: ({ id, data }) => attendanceService.update(id, data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
    },
    onError: (error) => {
      console.error("Error al actualizar dato de asistencia:", error.message);
    }
  });
};

export const useDeleteAttendance = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => attendanceService.delete(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
    },
    onError: (error) => {
      console.error("Error al eliminar dato de asistencia:", error.message);
    },
  });
};