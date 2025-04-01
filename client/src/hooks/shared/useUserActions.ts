import { useCallback } from "react";
import usePagination from "./usePagination";
import * as UserAPI from "@/network/apis/user";
import { useSearchParams } from "react-router-dom";
import { USER_ROLE, USER_STATUS } from "@/constants";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useGetUsers() {
    const { currentPage, limitPage } = usePagination();
    const { searchTerm, role, status } = useUserFilter();

    const userQuery = useQuery({
        queryKey: ["users", currentPage, limitPage, searchTerm, role, status],
        queryFn: () => UserAPI.getUsers({ page: currentPage, limit: limitPage, searchTerm, role, status }),
    });

    return userQuery;
}

export function useGetUserById(id: string) {
    const userQuery = useQuery({
        queryKey: ["user"],
        queryFn: () => UserAPI.getUserById(id),
    });

    return userQuery;
}

export function useUserFilter() {
    const [searchParams, setSearchParams] = useSearchParams();

    const searchTerm = searchParams.get("searchTerm") ?? undefined;
    const role = (searchParams.get("role") ?? undefined) as USER_ROLE | undefined;
    const status = (searchParams.get("status") ?? undefined) as USER_STATUS | undefined;

    const changeFilter = useCallback(
        (searchTerm?: string, role?: USER_ROLE, status?: USER_STATUS) => {
            setSearchParams((params) => {
                if (searchTerm) params.set("searchTerm", searchTerm);
                else params.delete("searchTerm");

                if (role) params.set("role", `${role}`);
                else params.delete("role");

                if (status) params.set("status", `${status}`);
                else params.delete("status");

                return params;
            });
        },
        [setSearchParams]
    );

    return {
        searchTerm,
        role,
        status,
        changeFilter,
    };
}

export function useInsertUser() {
    return useMutation({
        mutationKey: ["user-insert"],
        mutationFn: UserAPI.insertUser,
    });
}

export function useUpdateUserByAdmin() {
    return useMutation({
        mutationKey: ["user-update-admin"],
        mutationFn: UserAPI.updateUserByAdmin,
    });
}

export function useUpdateUserByUser() {
    return useMutation({
        mutationKey: ["user-update-user"],
        mutationFn: UserAPI.updateUserByUser,
    });
}

export function useUpdateUserAvatar() {
    return useMutation({
        mutationKey: ["user-update-avatar"],
        mutationFn: UserAPI.updateUserAvatar,
    });
}

export function useDeleteUser() {
    return useMutation({
        mutationKey: ["user-delete"],
        mutationFn: UserAPI.deleteUser,
    });
}
