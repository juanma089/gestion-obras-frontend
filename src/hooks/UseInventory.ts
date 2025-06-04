import { useQuery, useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { inventoryService } from "../services/InventoryService";
import { Inventory, CreateInventory } from "../models/Inventory";
import { useAuth } from "../context/AuthProvider";

export const useInventories = () => {
  const { token } = useAuth();
  return useQuery<Inventory[], Error>({
    queryKey: ["inventories"],
    queryFn: () => inventoryService.fetchAll(token!),
  });
};

export const useInventory = (id: number) => {
  const { token } = useAuth();
  return useQuery<Inventory, Error>({
    queryKey: ["inventory", id],
    queryFn: () => inventoryService.fetchById(id, token!),
    enabled: !!id,
  });
};

export const useCreateInventory = (): UseMutationResult<Inventory, Error, CreateInventory> => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<Inventory, Error, CreateInventory>({
    mutationFn: (data) => inventoryService.create(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
    onError: (error) => {
      console.error("Error al agregar dato al inventario:", error.message);
    },
  });
};

export const useUpdateInventory = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<Inventory, Error, { id: number; data: Partial<CreateInventory> }>({
    mutationFn: ({ id, data }) => inventoryService.update(id, data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
    onError: (error) => {
      console.error("Error al actualizar dato del inventario:", error.message);
    }
  });
};

export const useDeleteInventory = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => inventoryService.delete(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
    onError: (error) => {
      console.error("Error al eliminar dato del inventario:", error.message);
    },
  });
};

export const useInventoriesByProject = (projectId: number) => {
  const { token } = useAuth();

  return useQuery<Inventory[], Error>({
    queryKey: ["materialsByProject", projectId],
    queryFn: () => inventoryService.getInventoriesByProjectId(projectId, token!),
    enabled: !!projectId,
  });
};

export const useAddQuantity = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: number; amount: number }>({
    mutationFn: ({ id, amount }) =>
      inventoryService.addAvailableQuantity(id, amount, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
    onError: (error) => {
      console.error("Error al aumentar cantidad:", error.message);
    },
  });
};

export const useSubtractQuantity = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: number; amount: number }>({
    mutationFn: ({ id, amount }) =>
      inventoryService.subtractAvailableQuantity(id, amount, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
    onError: (error) => {
      console.error("Error al reducir cantidad:", error.message);
    },
  });
};