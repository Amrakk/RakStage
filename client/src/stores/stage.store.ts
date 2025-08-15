import { JoinStage } from "@/network/apis/stage";
import { create } from "zustand";

interface stageStore {
    stageData?: JoinStage;
    setStageData: (data: JoinStage) => void;
}

export const useStageStore = create<stageStore>()((set) => ({
    stageData: undefined,
    setStageData: (data: JoinStage) => set({ stageData: data }),
}));
