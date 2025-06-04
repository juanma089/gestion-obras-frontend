import { useQuery, useMutation, useQueryClient, UseMutationResult, useQueries } from "@tanstack/react-query";
import { workZoneService } from "../services/WorkZoneService";
import { WorkZone, CreateWorkZone } from "../models/WorkZone";
import { useAuth } from "../context/AuthProvider";

// Obtener todas las zonas de trabajo
export const useWorkZones = () => {
  const { token } = useAuth();
  return useQuery<WorkZone[], Error>({
    queryKey: ["workZones"],
    queryFn: () => workZoneService.fetchAll(token!),
  });
};

// Obtener una zona de trabajo por ID
export const useWorkZone = (id: number) => {
  const { token } = useAuth();
  return useQuery<WorkZone, Error>({
    queryKey: ["workZone", id],
    queryFn: () => workZoneService.fetchById(id, token!),
    enabled: !!id,
  });
};

// Crear una nueva zona de trabajo
export const useCreateWorkZone = (): UseMutationResult<WorkZone, Error, CreateWorkZone> => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<WorkZone, Error, CreateWorkZone>({
    mutationFn: (data) => workZoneService.create(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workZones"] });
    },
    onError: (error) => {
      console.error("Error al crear la zona:", error.message);
    },
  });
};

// Actualizar una zona de trabajo
export const useUpdateWorkZone = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<WorkZone, Error, { id: number; data: Partial<CreateWorkZone> }>({
    mutationFn: ({ id, data }) => workZoneService.update(id, data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workZones"] });
    },
    onError: (error) => {
      console.error("Error al actualizar la zona:", error.message);
    },
  });
};

// Eliminar una zona de trabajo
export const useDeleteWorkZone = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => workZoneService.delete(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workZones"] });
    },
    onError: (error) => {
      console.error("Error al eliminar la zona:", error.message);
    },
  });
};

export const useUpdateWorkZoneStatus = (): UseMutationResult<
  void,
  Error,
  { id: number; status: string }
> => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: number; status: string }>({
    mutationFn: ({ id, status }) => workZoneService.updateWorkZoneStatus(id, status, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workZones'] });
    },
    onError: (error) => {
      console.error('Error al actualizar el estado de WorkZone:', error.message);
    },
  });
};

export const useMyWorkZones = () => {
  const { token } = useAuth();

  return useQuery<WorkZone[]>({
    queryKey: ["workZones"],
    queryFn: () => workZoneService.fetchMyWorkZones(token!),
    enabled: !!token,
  });
};

export const useZonesByProjectId = (projectId?: number) => {
  const { token } = useAuth();

  return useQuery<WorkZone[]>({
    queryKey: ['zones-by-project', projectId],
    queryFn: () => workZoneService.fetchZonesByProjectId(projectId!, token!),
    enabled: !!projectId && !!token,
  });
};

export const useZonesByAllProjects = (projectIds: number[]) => {
  const { token } = useAuth();

  const results = useQueries({
    queries: projectIds.map((projectId) => ({
      queryKey: ['zones-by-project', projectId],
      queryFn: () => workZoneService.fetchZonesByProjectId(projectId, token!),
      enabled: !!token,
    })),
  });

  const isLoading = results.some((res) => res.isLoading);
  const error = results.find((res) => res.error)?.error;

  const data = results.reduce((acc, res, index) => {
    const projectId = projectIds[index];
    if (res.data) {
      acc[projectId] = res.data;
    }
    return acc;
  }, {} as Record<number, WorkZone[]>);

  const projectsWithoutZones = projectIds.filter(
    (id) => !data[id] || data[id].length === 0
  );

  return {
    data,
    isLoading,
    error,
    projectsWithoutZones,
  };
};