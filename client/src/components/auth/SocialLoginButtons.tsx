import { FaDiscord, FaGoogle } from "react-icons/fa";
import { useAuthActions } from "@/hooks/auth/useAuth";

export default function SocialLoginButtons() {
    const { loginWithGoogleAction, loginWithDiscordAction } = useAuthActions();

    return (
        <div className="flex justify-between items-center space-x-4">
            <button
                className="flex items-center justify-center w-full px-4 py-3 rounded-lg border border-text hover:bg-text hover:text-primary text-text active:scale-95 transition-all duration-150 focus:outline-none focus:border-highlight-teal"
                onClick={loginWithDiscordAction}
            >
                <FaDiscord size={20} />
            </button>
            <button
                className="flex items-center justify-center w-full px-4 py-3 rounded-lg border border-text hover:bg-text hover:text-primary text-text active:scale-95 transition-all duration-150 focus:outline-none focus:border-highlight-teal"
                onClick={loginWithGoogleAction}
            >
                <FaGoogle size={20} />
            </button>
        </div>
    );
}
