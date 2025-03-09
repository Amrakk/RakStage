import type { ISocialMediaAccount } from "../database/user.js";
import type { USER_ROLE, USER_STATUS } from "../../constants.js";

export interface IOffsetPagination {
    page?: number;
    limit?: number;
}

export interface ITimeBasedPagination {
    from?: Date;
    limit?: number;
}

// Auth
export namespace IReqAuth {
    export interface Login {
        emailOrPhone: string;
        password: string;
    }

    export interface Register {
        name: string;
        email: string;
        password: string;
        phoneNumber?: string;
    }

    export interface ForgotPassword {
        email: string;
    }

    export interface ResetPassword {
        email: string;
        otp: string;
        password: string;
    }
}

// User
export namespace IReqUser {
    export interface GetAllQuery {
        page?: string;
        limit?: string;

        searchTerm?: string;
        role?: USER_ROLE[];
        status?: USER_STATUS[];
    }

    export interface Filter {
        searchTerm?: string;
        role?: USER_ROLE[];
        status?: USER_STATUS[];
    }

    export interface Insert {
        name: string;
        email: string;
        password?: string;
        role?: USER_ROLE;
        phoneNumber?: string;
        avatarUrl?: string;
        socialMediaAccounts?: ISocialMediaAccount[];
    }

    export interface Update {
        name?: string;
        password?: string;
        role?: USER_ROLE;
        status?: USER_STATUS;
        phoneNumber?: string;
        avatarUrl?: string;
        socialMediaAccounts?: ISocialMediaAccount[];
    }
}
