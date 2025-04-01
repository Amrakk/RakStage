import Webcam from "react-webcam";
import { useCallback, useEffect, useRef, useState } from "react";
import useScreenSize from "@/hooks/shared/useScreenSize";

type Props = {
    onScan: (data: string | null) => void;
};

export default function WebcamCapture({ onScan }: Props) {
    const { width, height } = useScreenSize();
    const webcamRef = useRef<Webcam | null>(null);

    const [videoConstraints, setVideoConstraints] = useState<MediaTrackConstraints>({
        height,
        width: Math.min(600, width),
        facingMode: "environment",
    });

    const capture = useCallback(() => {
        if (!webcamRef.current) return;
        const imageSrc = webcamRef.current.getScreenshot();

        if (imageSrc) onScan(imageSrc);
    }, [onScan]);

    useEffect(() => {
        const timer = setInterval(() => {
            capture();
        }, 1000);
        return () => clearInterval(timer);
    }, [capture]);

    useEffect(() => {
        setVideoConstraints({
            height,
            width: Math.min(600, width),
            facingMode: "environment",
        });
    }, [width, height]);

    return (
        <div className="size-full">
            <Webcam
                audio={false}
                ref={webcamRef}
                imageSmoothing={true}
                screenshotQuality={1}
                autoFocus={true}
                audioConstraints={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="size-full object-cover"
            />
        </div>
    );
}
