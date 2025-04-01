import { PASSKEY_TRANSPORT } from "@/constants";
import { IResPasskey } from "@/interfaces/response";

export interface PasskeyJSON {
    _id: string;
    name: string;
    userId: string;
    counter: number;
    transports: PASSKEY_TRANSPORT[];
    lastUsedAt: string | null;
    createdAt: string;
    updatedAt?: string | undefined;
}

export class Passkey implements IResPasskey {
    _id: string;
    name: string;
    userId: string;
    counter: number;
    transports: PASSKEY_TRANSPORT[];
    lastUsedAt: Date | null;
    createdAt: Date;
    updatedAt?: Date | undefined;

    constructor(passkey: PasskeyJSON) {
        this._id = passkey._id;
        this.name = passkey.name;
        this.userId = passkey.userId;
        this.counter = passkey.counter;
        this.transports = passkey.transports;
        this.lastUsedAt = passkey.lastUsedAt ? new Date(passkey.lastUsedAt) : null;
        this.createdAt = new Date(passkey.createdAt);
        this.updatedAt = passkey.updatedAt ? new Date(passkey.updatedAt) : undefined;
    }
}
