import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import BaseCard from "../shared/BaseCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuthActions } from "@/hooks/auth/useAuth";
import SocialLoginButtons from "./SocialLoginButtons";
import CustomTextField from "../shared/CustomTextField";

export default function RegisterComponent() {
    const navigate = useNavigate();
    const { registerAction } = useAuthActions();
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            await registerAction.mutateAsync({ name, email, password, phoneNumber });
        } catch (err: any) {
            let message = "Registration failed. Please try again.";
            if (isAxiosError(err)) {
                const responseData = err.response?.data;
                message = responseData?.error[0]?.message || responseData?.message || err.message || message;
            }

            toast.error(message, {
                toastId: "register-error",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        nameRef.current?.focus();
    }, []);

    return (
        <BaseCard className="bg-gray-400 bg-opacity-15 scale-110">
            <div className="flex-1 pr-0 md:pr-4 w-96">
                <h2 className="text-2xl font-bold text-text mb-2">Create an account</h2>
                <p className="text-secondary-text mb-6">Join us today!</p>

                <div className="flex flex-col">
                    <form onSubmit={handleSubmit}>
                        <div className="mt-4">
                            <CustomTextField
                                id="name"
                                ref={nameRef}
                                label="Full Name"
                                value={name}
                                type="text"
                                onChange={(e) => setName(e.target.value)}
                                required={true}
                            />
                        </div>
                        <div className="mt-4">
                            <CustomTextField
                                id="email"
                                ref={emailRef}
                                label="Email"
                                value={email}
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                required={true}
                            />
                        </div>
                        <div className="mt-4">
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
                        <div className="mt-4">
                            <CustomTextField
                                id="phoneNumber"
                                label="Phone Number (Optional)"
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>

                        <button
                            className={`w-full bg-highlight-teal font-bold text-center select-none focus:outline-none focus:outline-highlight-teal text-text py-3 rounded-md active:scale-90 transition-all duration-75 mt-5 ${
                                loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={loading}
                            type="submit"
                        >
                            Register
                        </button>
                    </form>

                    <div className="relative flex items-center my-5">
                        <div className="flex-1 border-t border-gray-400"></div>
                        <span className="px-2 text-secondary-text text-xs">OR</span>
                        <div className="flex-1 border-t border-gray-400"></div>
                    </div>

                    <SocialLoginButtons />

                    <p className="text-xs text-secondary-text text-center mt-5">
                        Already have an account?{" "}
                        <button
                            className="text-text font-bold hover:underline focus:underline focus:outline-none"
                            onClick={() => navigate("/auth/login")}
                        >
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </BaseCard>
    );
}
