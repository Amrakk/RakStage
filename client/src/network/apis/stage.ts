import { IStage } from "@/models/stage";
import { API } from ".";

export interface JoinStage {
    stage: IStage;
    token: string;
}

export async function createStage(title?: string): Promise<JoinStage> {
    return API.post(`/stage`, { title }).then((res) => res.data.data!);
}

export async function joinStage(stageCode: string): Promise<JoinStage> {
    return API.post(`/stage/${stageCode}`).then((res) => res.data.data!);
}
