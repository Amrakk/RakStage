import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { QR_Options } from "@/constants";
import BaseCard from "../shared/BaseCard";
import QRCodeStyling from "qr-code-styling";
import { useUserStore } from "@/stores/user.store";
import { base64ToBuffer } from "@/utils/encryption";
import { useEffect, useRef, useState } from "react";
import SocialLoginButtons from "./SocialLoginButtons";
import CustomTextField from "../shared/CustomTextField";
import { usePasskeyActions } from "@/hooks/auth/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthActions, useAuthSocket } from "@/hooks/auth/useAuth";

const QRCode = new QRCodeStyling(QR_Options);

export default function LoginComponent() {
    const [searchParams] = useSearchParams();

    const { lastUserId } = useUserStore();
    const navigate = useNavigate();
    const { loginAction } = useAuthActions();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [isPasskeyAvailable, setIsPasskeyAvailable] = useState(false);
    const { createPasskeyLoginOptionAction, loginPasskeyAction } = usePasskeyActions();

    const [emailOrPhone, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { qrCodeUrl, user, resetQRCode } = useAuthSocket();
    const qrCodeRef = useRef<HTMLDivElement | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            await loginAction.mutateAsync({ emailOrPhone, password });
        } catch (err: any) {
            let message = "Login failed. Please try again.";
            if (isAxiosError(err)) {
                if (err.status === 401) {
                    toast.error("Invalid email or password. Please try again.", {
                        toastId: "login-error",
                    });
                    return;
                }

                const responseData = err.response?.data;
                message = responseData?.error[0]?.message || responseData?.message || err.message || message;
            }

            toast.error(message, {
                toastId: "login-error",
            });
        } finally {
            lastUserId;
            setLoading(false);
        }
    };

    const handleLoginWithPasskey = async () => {
        try {
            if (!lastUserId) throw new Error("To enable passkey login, please log in at least once in this browser.");
            const options = await createPasskeyLoginOptionAction.mutateAsync(lastUserId);

            const allowCredentials = (options.allowCredentials?.map((cred) => ({
                ...cred,
                transports: cred.transports as AuthenticatorTransport[],
                id: base64ToBuffer(cred.id),
            })) || []) as PublicKeyCredentialDescriptor[];

            const credential = (await navigator.credentials.get({
                publicKey: {
                    ...options,
                    allowCredentials,
                    userVerification: "required",
                    challenge: base64ToBuffer(`${options.challenge}`),
                },
            })) as PublicKeyCredential;

            if (!credential) throw new Error("No credential returned");

            await loginPasskeyAction.mutateAsync(credential);

            navigate("/home");
        } catch (err: any) {
            let message = "Passkey is not available. Please try again later.";
            if (isAxiosError(err)) {
                if (err.status === 403) {
                    toast.error("You are not authorized to perform this action", {
                        toastId: "passkey-login-error",
                    });
                    return;
                }

                const responseData = err.response?.data;
                message =
                    responseData?.error?.message ||
                    responseData?.error[0]?.message ||
                    responseData?.message ||
                    err.message ||
                    message;
            } else if (err?.name === "NotAllowedError") message = "You have denied the request to login with passkey";
            else if (err?.name === "NotSupportedError") message = "Passkey is not supported in this browser";

            toast.error(message, {
                toastId: "passkey-login-error",
            });
        }
    };

    useEffect(() => {
        emailRef.current?.focus();

        const isFailed = searchParams.get("failed") === "true";
        const provider = searchParams.get("provider");

        if (isFailed && provider) toast.error(`Failed to login with ${provider}`, { toastId: "login-error" });

        QRCode.append(qrCodeRef.current ?? undefined);

        if (
            window.PublicKeyCredential &&
            PublicKeyCredential.isConditionalMediationAvailable &&
            PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable
        ) {
            Promise.all([
                PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),
                PublicKeyCredential.isConditionalMediationAvailable(),
            ]).then((results) => {
                if (results.every((r) => r === true)) {
                    setIsPasskeyAvailable(true);
                }
            });
        }
    }, []);

    useEffect(() => {
        if (qrCodeUrl) {
            QRCode.update({ data: qrCodeUrl });

            if (qrCodeRef.current?.firstChild) {
                const qrCode = qrCodeRef.current.firstChild as SVGElement;

                qrCode.style.setProperty("width", "100%");
                qrCode.style.setProperty("height", "100%");
            }
        }
    }, [qrCodeUrl]);

    return (
        <BaseCard className="bg-gray-400 bg-opacity-15 w-1/2">
            <div className="grid grid-cols-9 gap-16">
                {/* Login Form Section */}
                <div className="col-span-5">
                    <div className="flex-1 pr-0 md:pr-4 relative">
                        <h2 className="text-2xl font-bold text-text mb-2">Welcome back</h2>
                        <p className="text-secondary-text mb-6">We're so excited to see you again!</p>

                        <div className="flex flex-col">
                            <form onSubmit={handleSubmit}>
                                {/* Email & Password Fields */}
                                <div className="mt-5">
                                    <CustomTextField
                                        id="emailOrPhone"
                                        ref={emailRef}
                                        label="Email or Phone number"
                                        value={emailOrPhone}
                                        type="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        required={true}
                                    />
                                </div>
                                <div className="mt-5">
                                    <CustomTextField
                                        id="password"
                                        ref={passwordRef}
                                        label="Password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required={true}
                                    />
                                </div>
                                {/* Forgot Password */}
                                <div className="flex justify-end mt-2">
                                    <button
                                        className="text-secondary-text hover:underline focus:outline-none"
                                        tabIndex={-1}
                                        onClick={() => navigate("/auth/forgot-password")}
                                        type="button"
                                    >
                                        <p className="text-xs">Forgot password?</p>
                                    </button>
                                </div>

                                {/* Login Button */}
                                <button
                                    className={`w-full bg-highlight-teal font-bold text-center select-none focus:outline-none focus:outline-highlight-teal text-text py-3 rounded-md active:scale-90 transition-all duration-75 mt-5 ${
                                        loading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                    disabled={loading}
                                    type="submit"
                                >
                                    Login
                                </button>
                            </form>

                            {/* Break Divider */}
                            <div className="relative flex items-center my-5">
                                <div className="flex-1 border-t border-gray-400"></div>
                                <span className="px-2 text-secondary-text text-xs">OR</span>
                                <div className="flex-1 border-t border-gray-400"></div>
                            </div>

                            {/* Social Login Buttons */}
                            <SocialLoginButtons />

                            {/* Register Section */}
                            <p className="text-xs text-secondary-text text-center mt-5">
                                Need an account?{" "}
                                <button
                                    className="text-text font-bold hover:underline focus:underline focus:outline-none"
                                    onClick={() => navigate("/auth/register")}
                                >
                                    Register
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                {/* QR Code Section */}
                <div className="col-span-4 flex flex-col items-center relative space-y-4 mt-24">
                    <h3 className="text-xl font-bold text-text">Login with QR Code</h3>
                    <div className="relative">
                        <div
                            className={`w-48 h-48 rounded-lg p-1 inset-0 z-10 absolute scale-x-105 overflow-hidden ${
                                qrCodeUrl ? "" : "hidden"
                            }`}
                        >
                            <span className="size-full rounded-lg animate-border-scan-vertical" />
                        </div>

                        {user && (
                            <div className="flex flex-col items-center space-y-6">
                                <div className="flex items-center justify-center border-4 border-highlight-teal border-opacity-40 rounded-full">
                                    <img
                                        className="size-36 rounded-full"
                                        src={user.avatarUrl}
                                        alt={user.name}
                                        loading="lazy"
                                    />
                                </div>

                                <p className="text-lg text-secondary-text text-center max-w-xs">
                                    Logging in as <span className="font-bold">{user.name}</span>
                                </p>

                                <button
                                    className="text-highlight-teal text-base font-medium hover:underline focus:underline focus:outline-none"
                                    onClick={resetQRCode}
                                    type="button"
                                >
                                    Not me, start over
                                </button>
                            </div>
                        )}

                        <div
                            className={`w-48 h-48 p-1 rounded-lg flex items-center justify-center overflow-hidden object-contain relative ${
                                user ? "hidden" : ""
                            } ${qrCodeUrl ? "bg-text" : "bg-secondary-text"}`}
                        >
                            <div ref={qrCodeRef} className="size-full" />

                            <span
                                className={`${
                                    qrCodeUrl ? "hidden" : ""
                                } text-primary text-opacity-70 text-base absolute`}
                            >
                                Generating QR...
                            </span>
                        </div>
                    </div>

                    {!user && (
                        <>
                            {" "}
                            <p className="text-sm text-secondary-text text-center max-w-xs">
                                Scan this QR code with your mobile app to log in securely.
                            </p>
                            {isPasskeyAvailable && (
                                <button
                                    className="text-highlight-teal text-base font-medium hover:underline focus:underline focus:outline-none"
                                    onClick={handleLoginWithPasskey}
                                    type="button"
                                >
                                    Login with Passkey
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </BaseCard>
    );
}
