import { TbBorderCornerRounded } from "react-icons/tb";

type Props = {
    corner: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    size?: number | string;
    color?: string;
    rotateAngle?: number;
};

export default function ScanCorner(props: Props) {
    return (
        <TbBorderCornerRounded
            size={props.size ?? 24}
            strokeWidth={4}
            style={{ rotate: getRotation(props.corner, props.rotateAngle), color: props.color ?? "currentColor" }}
        />
    );
}

function getRotation(corner: Props["corner"], rotateAngle?: number) {
    switch (corner) {
        case "top-left":
            return `${0 + (rotateAngle ?? 0)}deg`;
        case "top-right":
            return `${90 + (rotateAngle ?? 0)}deg`;
        case "bottom-left":
            return `${270 + (rotateAngle ?? 0)}deg`;
        case "bottom-right":
            return `${180 + (rotateAngle ?? 0)}deg`;
    }
}
