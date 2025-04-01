import ScanCorner from "./ScanCorner";
import { ScanRegion } from "./QRScanComponent";
import useScreenSize from "@/hooks/shared/useScreenSize";
import { useNavigate } from "react-router-dom";

export type Point = {
    x: number;
    y: number;
};

type Props = {
    scannedRegion?: ScanRegion;
    size?: number;
    navigateUrl?: string | null;
};

export default function ScannerBackground(props: Props) {
    const navigate = useNavigate();
    const { size = 24 } = props;
    const { scannedRegion } = props;
    const { width } = useScreenSize();

    return (
        <div
            className={`size-full z-50 aspect-square relative text-secondary-text ${
                !scannedRegion && " animate-pulse-scale"
            }`}
        >
            <div
                className="absolute top-1/4 left-[2.5%] opacity-50"
                style={
                    scannedRegion && {
                        color: "#008C8C",
                        opacity: 0.85,
                        transition: "all 0.5s cubic-bezier(0,.5,.7,1.4)",
                        left: scannedRegion.topLeftCorner.x - size / 2,
                        top: scannedRegion.topLeftCorner.y - size / 2,
                    }
                }
                onTransitionEnd={() => setTimeout(() => props.navigateUrl && navigate(props.navigateUrl), 200)}
            >
                <ScanCorner corner="top-left" size={size} />
            </div>
            <div
                className="absolute top-1/4 right-[2.5%] opacity-50"
                style={
                    scannedRegion && {
                        color: "#008C8C",
                        opacity: 0.85,
                        transition: "all 0.5s cubic-bezier(0,.5,.7,1.4)",
                        right: width - scannedRegion.topRightCorner.x - size / 2,
                        top: scannedRegion.topRightCorner.y - size / 2,
                    }
                }
            >
                <ScanCorner corner="top-right" size={size} />
            </div>
            <div
                className="absolute top-3/4 left-[2.5%] opacity-50"
                style={
                    scannedRegion && {
                        color: "#008C8C",
                        opacity: 0.85,
                        transition: "all 0.5s cubic-bezier(0,.5,.7,1.4)",
                        left: scannedRegion.bottomLeftCorner.x - size / 2,
                        top: scannedRegion.bottomLeftCorner.y - size / 2,
                    }
                }
            >
                <ScanCorner corner="bottom-left" size={size} />
            </div>
            <div
                className="absolute top-3/4 right-[2.5%] opacity-50"
                style={
                    scannedRegion && {
                        color: "#008C8C",
                        opacity: 0.85,
                        transition: "all 0.5s cubic-bezier(0,.5,.7,1.4)",
                        right: width - scannedRegion.bottomRightCorner.x - size / 2,
                        top: scannedRegion.bottomRightCorner.y - size / 2,
                    }
                }
            >
                <ScanCorner corner="bottom-right" size={size} />
            </div>
        </div>
    );
}
