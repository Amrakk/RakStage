import { API } from ".";

import type { IResponse } from "@/interfaces/response";
import type { USER_ROLE, USER_STATUS } from "@/constants";
import type { ISocialMediaAccount, UserDetail } from "@/models/user";

export interface GetUsersResponse {
    users: Omit<UserDetail, "password">[];
    totalDocuments: number;
}

export interface GetUserById {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    role: USER_ROLE;
    status: USER_STATUS;
    avatarUrl: string;
    socialMediaAccounts: ISocialMediaAccount[];
}

export interface UserFilter {
    page?: number;
    limit?: number;

    searchTerm?: string;
    role?: USER_ROLE;
    status?: USER_STATUS;
}

export interface InsertUser {
    name: string;
    email: string;
    password?: string;
    role?: USER_ROLE;
    status?: USER_STATUS;
    phoneNumber?: string;
    avatarUrl?: string;
}

export interface UpdateByAdmin {
    name?: string;
    password?: string;
    role?: USER_ROLE;
    status?: USER_STATUS;
    phoneNumber?: string;
    avatarUrl?: string;
}

export interface UpdateByUser {
    name?: string;
    password?: string;
    phoneNumber?: string;
    avatarUrl?: string;
}

export async function getUsers(query?: UserFilter): Promise<GetUsersResponse> {
    return API.get<IResponse<GetUsersResponse>>("/user", { params: query }).then(
        (res) => res.data.data ?? { users: [], totalDocuments: 0 }
    );
}

export async function getUserById(_id: string): Promise<GetUserById> {
    return API.get<IResponse<GetUserById>>(`/user/${_id}`).then((res) => res.data.data!);
}

export async function insertUser(data: InsertUser): Promise<UserDetail> {
    return API.post<IResponse<UserDetail[]>>("/user", data).then((res) => res.data.data![0]);
}

export async function updateUserByAdmin(props: { _id: string; data: UpdateByAdmin }): Promise<UserDetail> {
    return API.patch<IResponse<UserDetail>>(`/user/${props._id}`, props.data).then((res) => res.data.data!);
}

export async function updateUserByUser(props: { _id: string; data: UpdateByUser }): Promise<UserDetail> {
    return API.patch<IResponse<UserDetail>>(`/user/${props._id}`, props.data).then((res) => res.data.data!);
}

export async function updateUserAvatar(props: { _id: string; avatar: File }): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("image", props.avatar);

    return API.patch<IResponse<{ url: string }>>(`/user/${props._id}/avatar`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }).then((res) => res.data.data!);
}

export async function deleteUser(_id: string): Promise<UserDetail> {
    return API.delete<IResponse<void>>(`/user/${_id}`).then((res) => res.data.data!);
}
