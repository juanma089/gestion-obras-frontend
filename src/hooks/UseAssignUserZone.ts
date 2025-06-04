import { useQuery, useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { assignUserZoneService } from "../services/AssignUserZoneService";
import { AssignUsersToZoneDto, AssignUserZone, CreateAssignUserZone } from "../models/AssignUserZone";
import { useAuth } from "../context/AuthProvider";
import { WorkZone } from "../models/WorkZone";

export const useAssignUserZones = () => {
  const { token } = useAuth();
  return useQuery<AssignUserZone[], Error>({
    queryKey: ["assignUserZones"],
    queryFn: () => assignUserZoneService.fetchAll(token!),
  });
};

export const useAssignUserZone = (id: number) => {
  const { token } = useAuth();
  return useQuery<AssignUserZone, Error>({
    queryKey: ["assignUserZone", id],
    queryFn: () => assignUserZoneService.fetchById(id, token!),
    enabled: !!id,
  });
};

export const useCreateAssignUserZone = (): UseMutationResult<AssignUserZone, Error, CreateAssignUserZone> => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<AssignUserZone, Error, CreateAssignUserZone>({
    mutationFn: (data) => assignUserZoneService.create(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignUserZones"] });
    },
    onError: (error) => {
      console.error("Error al agregar dato de asiganación de zona:", error.message);
    },
  });
};

export const useUpdateAssignUserZone = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<AssignUserZone, Error, { id: number; data: Partial<CreateAssignUserZone> }>({
    mutationFn: ({ id, data }) => assignUserZoneService.update(id, data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignUserZones"] });
    },
    onError: (error) => {
      console.error("Error al actualizar dato de asiganación de zona:", error.message);
    }
  });
};

export const useDeleteAssignUserZone = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => assignUserZoneService.delete(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignUserZones"] });
    },
    onError: (error) => {
      console.error("Error al eliminar dato de asiganación de zona:", error.message);
    },
  });
};

export const useZoneByUserId = (userId: string) => {
  const { token } = useAuth();
  return useQuery<WorkZone>({
    queryKey: ['user-zone', userId],
    queryFn: () => assignUserZoneService.fetchZoneByUserId(userId, token!),
    enabled: !!userId && !!token,
  });
};

export const useZonesByUserIds = (userIds: string[]) => {
  const { token } = useAuth();

  return useQuery<Record<string, WorkZone | null>>({
    queryKey: ['user-zones', userIds],
    queryFn: async () => {
      const results = await Promise.all(
        userIds.map(async (id) => {
          try {
            const zone = await assignUserZoneService.fetchZoneByUserId(id, token!);
            return { id, zone };
          } catch (error) {
            return { id, zone: null };
          }
        })
      );

      return results.reduce<Record<string, WorkZone | null>>((acc, { id, zone }) => {
        acc[id] = zone;
        return acc;
      }, {});
    },
    enabled: userIds.length > 0 && !!token,
  });
};

export const useAssignUsersToZone = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignUsersToZoneDto) =>
      assignUserZoneService.assignUsersToZone(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-zone'] });
      queryClient.invalidateQueries({ queryKey: ['user-zones'] });
    },
  });
};