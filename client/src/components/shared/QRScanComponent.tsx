import jsQR from "jsqr";
import { toast } from "react-toastify";
import { CLIENT_URL } from "@/constants";
import WebcamCapture from "./WebcamCapture";
import { useCallback, useRef, useState } from "react";
import useScreenSize from "@/hooks/shared/useScreenSize";
import ScannerBackground, { Point } from "./ScannerBackground";

export type ScanRegion = {
    topRightCorner: Point;
    topLeftCorner: Point;
    bottomRightCorner: Point;
    bottomLeftCorner: Point;
};

const size = 54;
export default function QRScanComponent() {
    const isScanned = useRef(false);
    const { width, height } = useScreenSize();
    const qrRef = useRef<HTMLCanvasElement | null>(null);
    const [navigateUrl, setNavigateUrl] = useState<string | null>(null);
    const [scannedRegion, setScannedRegion] = useState<ScanRegion | undefined>(undefined);

    const handleScan = useCallback(
        (imageSrc: string | null) => {
            console.log(isScanned.current);
            if (!imageSrc || isScanned.current) return;

            const image = new Image();
            image.src = imageSrc;

            image.onload = () => {
                try {
                    if (!qrRef.current) return;

                    const imgWidth = image.width;
                    const imgHeight = image.height;

                    qrRef.current.width = width;
                    qrRef.current.height = height;

                    const ctx = qrRef.current.getContext("2d", { willReadFrequently: true });
                    if (!ctx) return;

                    const scale = Math.max(width / imgWidth, height / imgHeight);
                    const scaledWidth = imgWidth * scale;
                    const scaledHeight = imgHeight * scale;

                    const offsetX = (width - scaledWidth) / 2;
                    const offsetY = (height - scaledHeight) / 2;

                    ctx.drawImage(image, offsetX, offsetY, scaledWidth, scaledHeight);

                    const imageData = ctx.getImageData(0, 0, width, height);

                    const code = jsQR(imageData.data, imageData.width, imageData.height, {
                        inversionAttempts: "dontInvert",
                    });

                    if (code) {
                        isScanned.current = true;
                        const { topRightCorner, topLeftCorner, bottomLeftCorner, bottomRightCorner } = code.location;

                        cropQrImage(code.location, ctx);

                        setScannedRegion({
                            topRightCorner,
                            topLeftCorner,
                            bottomLeftCorner,
                            bottomRightCorner,
                        });

                        const url = new URL(code.data);
                        if (url.origin !== CLIENT_URL) throw new Error("Invalid URL");

                        setNavigateUrl(url.pathname);
                    }
                } catch (e) {
                    toast.error("QR code not recognized", {
                        autoClose: 1000,
                        onClose: () => {
                            isScanned.current = false;
                            setScannedRegion(undefined);
                        },
                    });
                }
            };
        },
        [width, height]
    );

    return (
        <div className="relative size-full max-w-[600px] lg:mx-auto">
            <div className="absolute top-0 left-0 size-full">
                <div className="size-full">
                    <ScannerBackground scannedRegion={scannedRegion} size={size} navigateUrl={navigateUrl} />
                </div>
                <canvas ref={qrRef} className="top-0 fixed z-40" style={scannedRegion ? {} : { display: "none" }} />
            </div>
            <div className="size-full">
                <WebcamCapture onScan={handleScan} />
            </div>
        </div>
    );
}

function cropQrImage(location: any, ctx: CanvasRenderingContext2D) {
    const { topRightCorner, topLeftCorner, bottomLeftCorner, bottomRightCorner } = location;
    const padding = size / 2;

    const centerX = (topLeftCorner.x + topRightCorner.x + bottomLeftCorner.x + bottomRightCorner.x) / 4;
    const centerY = (topLeftCorner.y + topRightCorner.y + bottomLeftCorner.y + bottomRightCorner.y) / 4;

    const expandCorner = (corner: Point) => ({
        x: centerX + (corner.x - centerX) * 1.1,
        y: centerY + (corner.y - centerY) * 1.1,
    });

    const paddedTopLeft = expandCorner(topLeftCorner);
    const paddedTopRight = expandCorner(topRightCorner);
    const paddedBottomLeft = expandCorner(bottomLeftCorner);
    const paddedBottomRight = expandCorner(bottomRightCorner);

    const offscreenCanvas = document.createElement("canvas");
    const offscreenCtx = offscreenCanvas.getContext("2d");

    if (!offscreenCtx) return;

    const minX = Math.min(paddedTopLeft.x, paddedBottomLeft.x, paddedTopRight.x, paddedBottomRight.x) - padding;
    const minY = Math.min(paddedTopLeft.y, paddedBottomLeft.y, paddedTopRight.y, paddedBottomRight.y) - padding;
    const maxX = Math.max(paddedTopLeft.x, paddedBottomLeft.x, paddedTopRight.x, paddedBottomRight.x) + padding;
    const maxY = Math.max(paddedTopLeft.y, paddedBottomLeft.y, paddedTopRight.y, paddedBottomRight.y) + padding;
    const croppedWidth = maxX - minX;
    const croppedHeight = maxY - minY;

    offscreenCanvas.width = croppedWidth;
    offscreenCanvas.height = croppedHeight;

    offscreenCtx.save();

    offscreenCtx.beginPath();
    offscreenCtx.moveTo(paddedTopLeft.x - minX, paddedTopLeft.y - minY);
    offscreenCtx.arcTo(
        paddedTopRight.x - minX,
        paddedTopRight.y - minY,
        paddedBottomRight.x - minX,
        paddedBottomRight.y - minY,
        5
    );
    offscreenCtx.arcTo(
        paddedBottomRight.x - minX,
        paddedBottomRight.y - minY,
        paddedBottomLeft.x - minX,
        paddedBottomLeft.y - minY,
        5
    );
    offscreenCtx.arcTo(
        paddedBottomLeft.x - minX,
        paddedBottomLeft.y - minY,
        paddedTopLeft.x - minX,
        paddedTopLeft.y - minY,
        5
    );
    offscreenCtx.arcTo(
        paddedTopLeft.x - minX,
        paddedTopLeft.y - minY,
        paddedTopRight.x - minX,
        paddedTopRight.y - minY,
        5
    );
    offscreenCtx.closePath();
    offscreenCtx.clip();

    offscreenCtx.drawImage(ctx.canvas, -minX, -minY);
    offscreenCtx.restore();

    offscreenCtx.globalCompositeOperation = "destination-in";
    offscreenCtx.beginPath();
    offscreenCtx.moveTo(paddedTopLeft.x - minX, paddedTopLeft.y - minY);
    offscreenCtx.arcTo(
        paddedTopRight.x - minX,
        paddedTopRight.y - minY,
        paddedBottomRight.x - minX,
        paddedBottomRight.y - minY,
        5
    );
    offscreenCtx.arcTo(
        paddedBottomRight.x - minX,
        paddedBottomRight.y - minY,
        paddedBottomLeft.x - minX,
        paddedBottomLeft.y - minY,
        5
    );
    offscreenCtx.arcTo(
        paddedBottomLeft.x - minX,
        paddedBottomLeft.y - minY,
        paddedTopLeft.x - minX,
        paddedTopLeft.y - minY,
        5
    );
    offscreenCtx.arcTo(
        paddedTopLeft.x - minX,
        paddedTopLeft.y - minY,
        paddedTopRight.x - minX,
        paddedTopRight.y - minY,
        5
    );
    offscreenCtx.closePath();
    offscreenCtx.fill();
    offscreenCtx.globalCompositeOperation = "source-over";

    const croppedImage = offscreenCtx.getImageData(0, 0, croppedWidth, croppedHeight);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.putImageData(croppedImage, minX, minY);
}
