import { BiHome } from "react-icons/bi";
import { LuUserCog } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { IoScanSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/stores/user.store";
import { useAuthActions } from "@/hooks/auth/useAuth";
import { MdOutlinePowerSettingsNew } from "react-icons/md";
import { DEFAULT_AVATAR_URL, USER_ROLE } from "@/constants";
import LogoComponent from "@/components/shared/LogoComponent";

export default function Header() {
    const navigate = useNavigate();
    const { user } = useUserStore();
    const [open, setOpen] = useState(false);
    const { logoutAction } = useAuthActions();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const nonTarget = document.getElementById("avatarBtn") as HTMLElement;
            if (nonTarget && !nonTarget.contains(event.target as Node)) setOpen(false);
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    async function handleLogout() {
        await logoutAction.mutateAsync();
        window.location.reload();
    }

    const handleNavigate = (path: string) => {
        setOpen(false);
        navigate(path);
    };

    return (
        <header className="border-b-2 border-secondary-text border-opacity-10 flex justify-between font-bold items-center bg-primary text-text bg-opacity-90 p-2 pr-10 sticky top-0 z-50">
            <LogoComponent />
            <div id="avatarBtn" className="p-1 ml-auto">
                <button className="focus:outline-none" onClick={() => setOpen((s) => !s)} tabIndex={-1}>
                    <div className="flex gap-5 text-base items-center">
                        <img
                            src={user?.avatarUrl ?? DEFAULT_AVATAR_URL}
                            className="rounded-full p-0.5 size-12 bg-text"
                        />
                        {user?.name ?? "User"}
                    </div>
                </button>
                {open && (
                    <div className="absolute right-6 top-20 min-w-44 flex flex-col gap-1 px-4 py-2 overflow-hidden rounded-md z-10 bg-text bg-opacity-20 shadow-lg fade-in max-w-[90vw] select-none ">
                        {user?.role === USER_ROLE.ADMIN && (
                            <div className="mx-auto w-full cursor-pointer" onClick={() => handleNavigate("/admin")}>
                                <div className="flex items-center gap-6 text-base font-semibold  px-3 py-2 rounded-md w-full hover:bg-primary hover:bg-opacity-50 transition-colors duration-200 ">
                                    <LuUserCog size={24} />
                                    <span>Admin</span>
                                </div>
                            </div>
                        )}

                        <hr className="border-text border-opacity-15 my-2" />

                        <div className="mx-auto w-full cursor-pointer" onClick={() => handleNavigate("/home")}>
                            <div className="flex items-center gap-6 text-base font-semibold px-3 py-2 rounded-md w-full hover:bg-primary hover:bg-opacity-50 transition-colors duration-200">
                                <BiHome size={24} />
                                <span>Home</span>
                            </div>
                        </div>

                        <div className="mx-auto w-full cursor-pointer" onClick={() => handleNavigate("/profile")}>
                            <div className="flex items-center gap-6 text-base font-semibold px-3 py-2 rounded-md w-full hover:bg-primary hover:bg-opacity-50 transition-colors duration-200">
                                <FaRegUser size={24} />
                                <span>Profile</span>
                            </div>
                        </div>

                        <div className="mx-auto w-full cursor-pointer" onClick={() => handleNavigate("/qr/scan")}>
                            <div className="flex items-center gap-6 text-base font-semibold px-3 py-2 rounded-md w-full hover:bg-primary hover:bg-opacity-50 transition-colors duration-200">
                                <IoScanSharp size={24} />
                                <span>QR Code</span>
                            </div>
                        </div>

                        <hr className="border-text border-opacity-15 my-2" />

                        <div className="mx-auto w-full cursor-pointer" onClick={handleLogout}>
                            <div className="flex items-center gap-6 text-base font-semibold px-3 py-2 rounded-md w-full hover:bg-primary hover:bg-opacity-50 transition-colors duration-200">
                                <MdOutlinePowerSettingsNew size={24} />
                                <span>Logout</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
