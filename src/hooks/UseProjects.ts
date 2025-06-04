import { useQuery, useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { projectService } from "../services/ProjectService";
import { Project, CreateProject } from "../models/Project";
import { useAuth } from "../context/AuthProvider";

// Obtener todos los proyectos con manejo de errores
export const useProjects = (enabled: boolean) => {
  const { token } = useAuth();
  return useQuery<Project[], Error>({
    queryKey: ["projects"],
    queryFn: () => projectService.fetchAll(token!),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: enabled && !!token,
  });
};

// Obtener un proyecto por ID
export const useProject = (id: number) => {
  const { token } = useAuth();
  return useQuery<Project, Error>({
    queryKey: ["project", id],
    queryFn: () => projectService.fetchById(id, token!),
    enabled: !!id, // Solo ejecutar la consulta si id es verdadero
  });
};

// Crear un nuevo proyecto con manejo de errores
export const useCreateProject = (): UseMutationResult<Project, Error, CreateProject> => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<Project, Error, CreateProject>({
    mutationFn: (data) => projectService.create(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      console.error("Error al crear el proyecto:", error.message);
    },
  });
};

// Actualizar un proyecto
export const useUpdateProject = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<Project, Error, { id: number; data: Partial<CreateProject> }>({
    mutationFn: ({ id, data }) => projectService.update(id, data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      console.error("Error al actualizar el proyecto:", error.message);
    },
  });
};

// Eliminar un proyecto
export const useDeleteProject = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => projectService.delete(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      console.error("Error al eliminar el proyecto:", error.message);
    },
  });
};

// Actualizar el estado de un proyecto
export const useUpdateProjectStatus = (): UseMutationResult<void, Error, { id: number; status: string }> => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: number; status: string }>({
    mutationFn: ({ id, status }) => projectService.updateProjectStatus(id, status, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      console.error("Error al actualizar el estado del proyecto:", error.message);
    },
  });
};

export const useMyProjects = (enabled: boolean) => {
  const { token } = useAuth();

  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => projectService.fetchMyProjects(token!),
    enabled: enabled && !!token,
  });
};