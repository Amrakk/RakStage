import { STAGE_STATUS } from "@/constants";

export interface IStage {
    _id: string;
    code: `${string}-${string}-${string}`;
    title: string;
    hostId: string;
    serverHost: string;
    status: STAGE_STATUS;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
