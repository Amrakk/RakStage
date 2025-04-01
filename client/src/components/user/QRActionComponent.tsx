import Logo from "@/assets/logo.svg";
import { toast } from "react-toastify";
import BaseCard from "../shared/BaseCard";
import { useEffect, useState } from "react";
import { useQRCodeActions } from "@/hooks/auth/useAuth";
import { Navigate, useNavigate, useParams } from "react-router-dom";

export default function QRActionComponent() {
    const params = useParams();
    const navigate = useNavigate();
    const fingerprint = params.fingerprint;
    const [validated, setValidated] = useState<boolean>(false);

    if (!fingerprint) {
        return <Navigate to="/home" />;
    }

    const { acceptFingerprintAction, declineFingerprintAction, validateFingerprintAction } = useQRCodeActions();

    useEffect(() => {
        validateFingerprintAction
            .mutateAsync(fingerprint)
            .then(({ validated }) => {
                setValidated(validated);
            })
            .catch((error) => {
                toast.error(error.response?.data.error.message || "An error occurred", {
                    toastId: "qr-action-error",
                });
                setValidated(false);
            });
    }, []);

    const handleAction = (action: "accept" | "decline") => {
        let promise;
        if (action === "accept") promise = acceptFingerprintAction.mutateAsync(fingerprint);
        else promise = declineFingerprintAction.mutateAsync(fingerprint);

        promise
            .then(() => {
                navigate("/home");
            })
            .catch((error) => {
                toast.error(error.response?.data.error.message || "An error occurred", {
                    toastId: "qr-action-error",
                });
                setValidated(false);
            });
    };

    return (
        <div className="flex justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800">
            <BaseCard className="bg-gray-700 bg-opacity-25 p-4 items-center justify-center rounded-xl shadow-lg animate-fadeIn flex flex-col gap-4 w-[clamp(300px,90vw,400px)]">
                {validateFingerprintAction.data || validateFingerprintAction.error ? (
                    validated ? (
                        <>
                            <h2 className="text-2xl font-extrabold text-secondary-text text-center">
                                Log in on a new device?
                            </h2>
                            <p className="text-accent text-center">Never scan a login QR code from another user.</p>
                            <button
                                className="text-text w-full bg-highlight-teal rounded-lg py-2"
                                onClick={() => handleAction("accept")}
                            >
                                Login
                            </button>
                            <button
                                className="text-text w-full rounded-lg py-2"
                                onClick={() => handleAction("decline")}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-extrabold text-secondary-text text-center">Invalid QR Code</h2>
                            <p className="text-accent text-center">The QR code is invalid or has expired.</p>
                            <button
                                className="text-text w-full bg-highlight-teal rounded-lg py-2"
                                onClick={() => navigate("/qr/scan")}
                            >
                                Retry
                            </button>
                            <button className="text-text w-full rounded-lg py-2" onClick={() => navigate("/home")}>
                                Cancel
                            </button>
                        </>
                    )
                ) : (
                    <div className="animate-bounce">
                        <img src={Logo} alt="Logo" className="w-16 h-16 animate-spin" />
                    </div>
                )}
            </BaseCard>
        </div>
    );
}
