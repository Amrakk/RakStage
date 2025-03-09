import type { ObjectId } from "mongooat";
import type { ISocialMediaAccount, IUser } from "../database/user.js";
import type BaseError from "../../errors/BaseError.js";
import type { RESPONSE_CODE, RESPONSE_MESSAGE, USER_ROLE, USER_STATUS } from "../../constants.js";

// CORE RESPONSE INTERFACE
export interface IResponse<T = undefined> {
    /** Response code */
    code: RESPONSE_CODE;
    /** Response message */
    message: RESPONSE_MESSAGE;
    /** Response data */
    data?: T;
    /** Error details */
    error?: BaseError | Record<string, unknown> | Array<unknown>;
}

// API RESPONSE INTERFACES
export interface IResLogin {
    user: Omit<IUser, "password">;
}

export namespace IResGetAll {
    export interface User {
        users: Omit<IUser, "password">[];
        totalDocuments: number;
    }
}

export namespace IResGetById {
    export interface User {
        _id: ObjectId;
        name: string;
        email: string;
        phoneNumber?: string;
        role: USER_ROLE;
        status: USER_STATUS;
        avatarUrl: string;
        socialMediaAccounts: ISocialMediaAccount[];
    }
}
