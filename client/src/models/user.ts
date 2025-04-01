import type { SOCIAL_MEDIA_PROVIDER, USER_ROLE, USER_STATUS } from "@/constants";

export interface UserDetail {
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

export interface ISocialMediaAccount {
    provider: SOCIAL_MEDIA_PROVIDER;
    accountId: string;
}

export interface IUserSimplify {
    _id: string;
    name: string;
    avatarUrl: string;
}
