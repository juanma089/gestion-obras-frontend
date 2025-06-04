import { useQuery, useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { materialService } from "../services/MaterialService";
import { Material, CreateMaterial } from "../models/Material";
import { useAuth } from "../context/AuthProvider";

export const useMaterials = () => {
  const { token } = useAuth();
  return useQuery<Material[], Error>({
    queryKey: ["materials"],
    queryFn: () => materialService.fetchAll(token!),
  });
};

export const useMaterial = (id: number) => {
  const { token } = useAuth();
  return useQuery<Material, Error>({
    queryKey: ["material", id],
    queryFn: () => materialService.fetchById(id, token!),
    enabled: !!id,
  });
};

export const useCreateMaterial = (): UseMutationResult<Material, Error, CreateMaterial> => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<Material, Error, CreateMaterial>({
    mutationFn: (data) => materialService.create(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
    onError: (error) => {
      console.error("Error al crear el Material:", error.message);
    },
  });
};

export const useUpdateMaterial = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<Material, Error, { id: number; data: Partial<CreateMaterial> }>({
    mutationFn: ({ id, data }) => materialService.update(id, data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
    onError: (error) => {
      console.error("Error al actualizar el material:", error.message);
    }
  });
};

export const useDeleteMaterial = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => materialService.delete(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
    onError: (error) => {
      console.error("Error al eliminar el Material:", error.message);
    },
  });
};