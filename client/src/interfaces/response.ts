import { UserDetail } from "@/models/user";
import { PASSKEY_TRANSPORT, RESPONSE_CODE, RESPONSE_MESSAGE } from "@/constants";

export interface IResponse<T = undefined> {
    /** Response code */
    code: RESPONSE_CODE;
    /** Response message */
    message: RESPONSE_MESSAGE;
    /** Response data */
    data?: T;
    /** Error details */
    error?: Record<string, unknown> | Array<unknown>;
}

export interface IResLogin {
    user: UserDetail;
}

export interface IResPasskey {
    _id: string;
    name: string;
    userId: string;
    counter: number;
    transports: PASSKEY_TRANSPORT[];
    lastUsedAt: Date | null;
    createdAt: Date;
    updatedAt?: Date;
}
