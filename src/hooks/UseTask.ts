import { useQuery, useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { taskService } from "../services/TaskService";
import { Task, CreateTask } from "../models/Task";
import { useAuth } from "../context/AuthProvider";

export const useTasks = () => {
  const { token } = useAuth();
  return useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: () => taskService.fetchAll(token!),
  });
};

export const useTask = (id: number,) => {
  const { token } = useAuth();
  return useQuery<Task, Error>({
    queryKey: ["task", id],
    queryFn: () => taskService.fetchById(id, token!),
    enabled: !!id,
  });
};

export const useCreateTask = (): UseMutationResult<Task, Error, CreateTask> => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<Task, Error, CreateTask>({
    mutationFn: (data) => taskService.create(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      console.error("Error al crear la Tarea:", error.message);
    },
  });
};

export const useUpdateTask = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<Task, Error, { id: number; data: Partial<CreateTask> }>({
    mutationFn: ({ id, data }) => taskService.update(id, data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      console.error("Error al actualizar la tarea:", error.message);
    }
  });
};

export const useDeleteTask = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => taskService.delete(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      console.error("Error al eliminar la Tarea:", error.message);
    },
  });
};