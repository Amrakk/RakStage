import { useMutation } from "@tanstack/react-query";
import { useStageStore } from "@/stores/stage.store";
import { createStage, JoinStage, joinStage } from "@/network/apis/stage";
import { useEffect } from "react";
import StageSocketManager from "@/network/sockets/stage";
import { IS_PROD } from "@/constants";

export function useStageActions() {
    const setStageData = useStageStore((state) => state.setStageData);

    function onSuccess(data: JoinStage) {
        setStageData(data);
    }

    const createStageAction = useMutation({
        mutationKey: ["create-stage"],
        mutationFn: createStage,
        onSuccess,
    });

    const joinStageAction = useMutation({
        mutationKey: ["join-stage"],
        mutationFn: joinStage,
        onSuccess,
    });

    return {
        joinStageAction,
        createStageAction,
    };
}

export function useStageSocketActions() {
    const stageData = useStageStore((state) => state.stageData);

    useEffect(() => {
        const socketManager = StageSocketManager.getInstance();

        const protocal = IS_PROD ? "wss" : "ws";

        if (stageData) socketManager.connect(`${protocal}://${stageData.stage.serverHost}/wss`);
    }, []);
}
