import { useParams } from "react-router-dom";
import { useStageStore } from "@/stores/stage.store";
import { useStageSocketActions } from "@/hooks/user/useStage";

export default function StageComponent() {
    const { code } = useParams();
    const stageData = useStageStore((state) => state.stageData);

    useStageSocketActions();

    return (
        <div className="text-text">
            {JSON.stringify(stageData)} {code}
        </div>
    );
}
