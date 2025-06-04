import { useQuery, useMutation, useQueryClient, UseMutationResult, UseQueryResult, useQueries } from "@tanstack/react-query";
import { materialRequestService } from "../services/MaterialRequestService";
import { MaterialRequest, CreateMaterialRequest } from "../models/MaterialRequest";
import { useAuth } from "../context/AuthProvider";

export const useMaterialsRequests = () => {
  const { token } = useAuth();
  return useQuery<MaterialRequest[], Error>({
    queryKey: ["materialsRequests"],
    queryFn: () => materialRequestService.fetchAll(token!),
  });
};

export const useMaterialRequest = (id: number) => {
  const { token } = useAuth();
  return useQuery<MaterialRequest, Error>({
    queryKey: ["materialRequest", id],
    queryFn: () => materialRequestService.fetchById(id, token!),
    enabled: !!id,
  });
};

export const useCreateMaterialRequest = (): UseMutationResult<MaterialRequest, Error, CreateMaterialRequest> => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<MaterialRequest, Error, CreateMaterialRequest>({
    mutationFn: (data) => materialRequestService.create(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materialsRequests"] });
      queryClient.invalidateQueries({ queryKey: ["materialsRequests", "by-user"] })
    },
    onError: (error) => {
      console.error("Error al crear la solicitud de materiale: ", error.message);
    },
  });
};

export const useUpdateMaterialRequest = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<MaterialRequest, Error, { id: number; data: Partial<CreateMaterialRequest> }>({
    mutationFn: ({ id, data }) => materialRequestService.update(id, data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materialsRequests"] });
      queryClient.invalidateQueries({ queryKey: ["materialsRequests", "by-user"] })
    },
    onError: (error) => {
      console.error("Error al actualizar la solicitud de materiales:", error.message);
    }
  });
};

export const useDeleteMaterialRequest = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => materialRequestService.delete(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materialsRequests"] });
      queryClient.invalidateQueries({ queryKey: ["materialsRequests", "by-user"] })
    },
    onError: (error) => {
      console.error("Error al eliminar la solicitud de material:", error.message);
    },
  });
};

export const useMaterialRequestsByUserId = (
  userId: string
): UseQueryResult<MaterialRequest[], Error> => {
  const { token } = useAuth();

  return useQuery<MaterialRequest[], Error>({
    queryKey: ["materialsRequests", "by-user"],
    queryFn: () => materialRequestService.getByUserId(userId, token!),
    enabled: !!userId && !!token,
  });
};

export const useMaterialRequestsByProjectId = (
  projectId: number | undefined
): UseQueryResult<MaterialRequest[], Error> => {
  const { token } = useAuth();

  return useQuery<MaterialRequest[], Error>({
    queryKey: ["materialsRequests", "by-project", projectId],
    queryFn: () => materialRequestService.getByProjectId(projectId!, token!),
    enabled: !!projectId && !!token,
  });
};

export const useMaterialRequestsByProjectIdsMap = (
  projectIds: number[]
): {
  materialRequestsMap: Record<number, MaterialRequest[] | undefined>,
  isLoading: boolean
} => {
  const { token } = useAuth();

  const results = useQueries({
    queries: projectIds.map((projectId) => ({
      queryKey: ["materialsRequests", "by-project", projectId],
      queryFn: () => materialRequestService.getByProjectId(projectId, token!),
      enabled: !!token,
    })),
  });

  // Combinar el estado de carga de todos los queries
  const isLoading = results.some((r) => r.isLoading);

  // Crear el map
  const materialRequestsMap = projectIds.reduce<Record<number, MaterialRequest[] | undefined>>(
    (acc, projectId, index) => {
      const result = results[index];
      acc[projectId] = result.data;
      return acc;
    },
    {}
  );

  return { materialRequestsMap, isLoading };
};

export const useUpdateMaterialRequestStatus = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      materialRequestService.updateStatus(id, status, token!),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["materialsRequests"],
      });
    },
  });
};