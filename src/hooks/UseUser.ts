import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserService } from "../services/UserService";
import { RegisterUserDto, RoleType, UserResponseDto } from "../models/UserResponse";
import { useAuth } from "../context/AuthProvider";

const userService = new UserService();


export const useAllUsers = () => {
    const { token } = useAuth();
    return useQuery<UserResponseDto[], Error>({
        queryKey: ["all-users"],
        queryFn: () => userService.fetchAllUsers(token!),
        enabled: !!token,
    });
};

export const useAllUsersSupervisor = (enabled: boolean) => {
    const { token } = useAuth();
    const role: RoleType = "SUPERVISOR";
    return useQuery<UserResponseDto[]>({
        queryKey: ["users-supervisor", role],
        queryFn: () => new UserService().fetchUsersByRole(role, token!),
        enabled: !!token && !!role && enabled,
    });
};

export const useAllUsersOperator = () => {
    const { token } = useAuth();
    const role: RoleType = "OPERADOR";
    return useQuery<UserResponseDto[]>({
        queryKey: ["users-operator", role],
        queryFn: () => new UserService().fetchUsersByRole(role, token!),
        enabled: !!token && !!role,
    });
};

export const useUserByIdentification = (numberID: string) => {
    const { token } = useAuth();

    return useQuery<UserResponseDto>({
        queryKey: ['user-identification', numberID],
        queryFn: () => new UserService().fetchUserByIdentification(numberID, token!),
        enabled: !!token && !!numberID,
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    const { token, user, setUser } = useAuth();

    return useMutation<UserResponseDto, Error, { id: number; data: RegisterUserDto }>({
        mutationFn: ({ id, data }) => new UserService().updateUser(id, data, token!),
        onSuccess: (data) => {
            if (user?.id === data.id) {
                setUser(data);
                localStorage.setItem("user", JSON.stringify(data));
            }
            queryClient.invalidateQueries({ queryKey: ['user-identification', data.id] });
            queryClient.invalidateQueries({ queryKey: ['all-users'] });
            queryClient.invalidateQueries({ queryKey: ['users-supervisor', 'SUPERVISOR'] });
            queryClient.invalidateQueries({ queryKey: ['users-operator', 'OPERADOR'] });
        },
    });
};