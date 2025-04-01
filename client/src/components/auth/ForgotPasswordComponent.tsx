import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import BaseCard from "../shared/BaseCard";
import OTPInput from "../shared/OTPInput";
import { useNavigate } from "react-router-dom";
import { useAuthActions } from "@/hooks/auth/useAuth";
import CustomTextField from "../shared/CustomTextField";

export default function ForgotPasswordComponent() {
    const { forgotPasswordAction, resetPasswordAction } = useAuthActions();
    const navigate = useNavigate();
    const emailRef = useRef<HTMLInputElement>(null);

    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRequestOTP = async () => {
        setLoading(true);

        try {
            await forgotPasswordAction.mutateAsync(email);
            toast.success("OTP sent successfully. Please check your email.", {
                toastId: "otp-sent",
            });
        } catch (err) {
            let message = "Failed to get OTP. Please try again.";
            if (isAxiosError(err)) {
                const responseData = err.response?.data;
                message = responseData?.error[0]?.message || responseData?.message || err.message || message;
            }

            toast.error(message, {
                toastId: "get-otp-error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            await resetPasswordAction.mutateAsync({ email, otp, password });

            toast.success("Password reset successfully. Redirecting to login...", {
                toastId: "password-reset",
                onClose: () => {
                    navigate("/auth/login");
                },
            });
        } catch (err) {
            let message = "Failed to reset password. Please try again.";
            if (isAxiosError(err)) {
                const responseData = err.response?.data;
                message = responseData?.error[0]?.message || responseData?.message || err.message || message;
            }

            toast.error(message, {
                toastId: "reset-password-error",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        emailRef.current?.focus();
    }, []);

    return (
        <BaseCard className="bg-gray-400 bg-opacity-15 scale-110">
            <h2 className="text-2xl font-bold text-text mb-2">Forgot Password</h2>
            <p className="text-secondary-text mb-6">Enter your email to receive an OTP and reset your password.</p>

            <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="mt-5 items-center space-x-2 grid grid-cols-3">
                    <div className="col-span-2">
                        <CustomTextField
                            id="email"
                            ref={emailRef}
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleRequestOTP}
                        className={`col-span-1 bg-highlight-teal font-bold text-center select-none text-text py-3 rounded-md focus:outline-none focus:outline-highlight-teal active:scale-90 transition-all duration-75 ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={loading || !email}
                    >
                        Get OTP
                    </button>
                </div>
                <div className="w-full mt-5">
                    <OTPInput length={6} onComplete={(otp) => setOtp(otp)} />
                </div>

                <div className="mt-5">
                    <CustomTextField
                        id="password"
                        label="New Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    className={`w-full bg-highlight-teal font-bold text-center text-text py-3 rounded-md active:scale-90 transition-all duration-75 mt-5 focus:outline-none focus:outline-highlight-teal ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                    type="submit"
                >
                    Reset Password
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/auth/login")}
                    className="w-full mt-5 text-center text-highlight-teal hover:underline focus:outline-none focus:underline"
                >
                    Back to Login
                </button>
            </form>
        </BaseCard>
    );
}
