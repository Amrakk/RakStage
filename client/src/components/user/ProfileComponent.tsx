import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord } from "react-icons/fa";
import PasskeySection from "./PasskeySection";
import { GetUserById } from "@/network/apis/user";
import { useUserStore } from "@/stores/user.store";
import { useEffect, useRef, useState } from "react";
import CustomTextField from "../shared/CustomTextField";
import { useDebounce } from "@/hooks/shared/useDebounce";
import { QueryObserverResult } from "@tanstack/react-query";
import { useUpdateUserByUser } from "@/hooks/shared/useUserActions";

const menuItems = [
    { label: "Profile", id: "profile" },
    { label: "Social Media", id: "social-media" },
    { label: "Authenticate", id: "authenticate" },
    { label: "Delete Account", id: "delete-account" },
];

type Props = {
    toggleDeleteModal: () => void;
    toggleEditAvatarModal: () => void;
    refetch: () => Promise<QueryObserverResult<GetUserById, Error>>;
};

export default function ProfileComponent(props: Props) {
    const { user } = useUserStore();
    if (!user) return null;

    const [isChange, setIsChange] = useState(false);
    const [name, setName] = useState(user.name);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");

    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState(menuItems[0].id);

    const setActiveSectionDebounced = useDebounce(setActiveSection, 100);
    const updateUserProfile = useUpdateUserByUser();

    const offsetPosition = useRef(0);

    const providerIcons = [
        { label: "Google", icon: <FcGoogle size={32} /> },
        { label: "Discord", icon: <FaDiscord size={32} color="#5865F2" /> },
    ];

    const handleNavigate = (id: string) => {
        const target = document.getElementById(id);
        if (target) {
            const elementPosition = target.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: elementPosition - offsetPosition.current,
                behavior: "smooth",
            });
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            if (!name || name.trim() === "") {
                toast.error("Name cannot be empty", {
                    toastId: "update-profile-error",
                });
                return;
            }

            const phone = phoneNumber.trim().length > 0 ? phoneNumber.trim() : undefined;

            if (name !== user.name || phone !== user.phoneNumber) {
                await updateUserProfile.mutateAsync({
                    _id: user._id,
                    data: {
                        name,
                        phoneNumber: phone,
                    },
                });

                await props.refetch();
                setIsChange(false);

                toast.success("Profile updated successfully", {
                    toastId: "update-profile-success",
                });
            }
        } catch (err) {
            let message = "Failed to update profile";
            if (isAxiosError(err)) {
                if (err.status === 403) {
                    toast.error("You are not authorized to perform this action", {
                        toastId: "update-account-error",
                    });
                    return;
                }

                const responseData = err.response?.data;
                message = responseData?.error[0]?.message || responseData?.message || err.message || message;
            }

            toast.error(message, {
                toastId: "update-account-error",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const indicator = document.getElementById("indicator");
        const indicatorBar = document.getElementById("indicator-bar");

        const indicatorHeight = indicatorBar!.clientHeight / menuItems.length;
        offsetPosition.current = (indicatorBar?.getBoundingClientRect().top ?? 0) + indicatorHeight;

        indicator?.style.setProperty("height", `${indicatorHeight}px`);

        const breakPoints = menuItems.map(
            (item) =>
                (document.getElementById(item.id)?.getBoundingClientRect().bottom ?? 0) - offsetPosition.current - 1
        );

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const activeIndex = breakPoints.findIndex((point) => scrollPosition < point);

            if (activeIndex === -1) {
                if (activeSection !== menuItems[menuItems.length - 1].id)
                    setActiveSectionDebounced(menuItems[menuItems.length - 1].id);
                return;
            }
            setActiveSectionDebounced(menuItems[activeIndex].id);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const indicator = document.getElementById("indicator");
        const indicatorHeight = indicator?.clientHeight ?? 0;

        indicator?.style.setProperty(
            "top",
            `${menuItems.findIndex((item) => item.id === activeSection) * indicatorHeight}px`
        );
    }, [activeSection]);

    useEffect(() => {
        const phone = phoneNumber.trim().length > 0 ? phoneNumber.trim() : undefined;
        setIsChange(name !== user.name || phone !== user.phoneNumber);
    }, [name, phoneNumber]);

    return (
        <div className="flex flex-row w-full p-6 gap-4">
            {/* Left Sidebar */}
            <aside className="p-4 w-1/6 rounded-lg text-text font-bold text-lg">
                <div className="sticky top-1/4 -translate-y-1/4 flex gap-6">
                    <nav className="w-full">
                        <ul className="flex flex-col justify-around">
                            {menuItems.map((item) => (
                                <li
                                    key={item.id}
                                    className=" hover:bg-highlight-teal hover:bg-opacity-40 rounded cursor-pointer"
                                >
                                    <a
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavigate(item.id);
                                        }}
                                        href={`#${item.id}`}
                                        className="p-4 block"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="mr-8">
                        <div id="indicator-bar" className="border-l-2 border-secondary-text h-full relative">
                            <div
                                id="indicator"
                                className="absolute left-0 w-1 bg-highlight-teal transition-all duration-300"
                            />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="w-3/4 h-full overflow-y-auto">
                <div className="p-4">
                    <h1 className="text-4xl font-bold text-text my-4">User Profile</h1>

                    {/* Profile Form */}
                    <div
                        id={menuItems[0].id}
                        className="border-2 border-secondary-text border-opacity-50 p-8 rounded-xl"
                    >
                        <h2 className="text-3xl font-bold text-text mb-6">Profile</h2>
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Left Column: Avatar */}
                            <button
                                className="relative w-full md:w-1/5 flex justify-center items-start focus:outline-none"
                                onClick={props.toggleEditAvatarModal}
                            >
                                <img
                                    src={user.avatarUrl}
                                    alt="Avatar"
                                    className="w-2/3 aspect-square rounded-full border border-secondary-text p-2"
                                />
                            </button>

                            {/* Right Column: Text Fields and Save Button */}
                            <div className="w-full md:w-2/3 space-y-4">
                                <div>
                                    <CustomTextField
                                        id="name"
                                        label="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <CustomTextField id="email" label="Email" value={user.email} disabled />
                                    <CustomTextField
                                        id="phone"
                                        label="Phone Number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        className={`bg-highlight-teal text-text font-bold py-3 px-6 rounded-md transition-colors ${
                                            loading || !isChange ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                                        }`}
                                        disabled={loading || !isChange}
                                        onClick={handleSave}
                                    >
                                        {loading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div
                        id={menuItems[1].id}
                        className="border-2 border-secondary-text border-opacity-50 p-8 rounded-xl mt-6"
                    >
                        <h2 className="text-3xl font-bold text-text mb-6">Social Media</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {user.socialMediaAccounts.length ? (
                                providerIcons.map((provider, idx) => {
                                    const account = user.socialMediaAccounts.find(
                                        (acc) => acc.provider.toLowerCase() === provider.label.toLowerCase()
                                    );

                                    return (
                                        account && (
                                            <div
                                                key={idx}
                                                className="p-5 rounded-lg shadow-sm border border-secondary flex items-center gap-4 hover:shadow-md transition-shadow duration-200"
                                            >
                                                {/* Social Media Icon */}
                                                <div className="flex items-center justify-center w-12 h-12 bg-text rounded-full">
                                                    {provider.icon}
                                                </div>

                                                {/* Account Details */}
                                                <div className="flex-1">
                                                    <p className="text-text text-lg font-semibold">{provider.label}</p>

                                                    <p className="text-secondary-text text-sm">
                                                        <span className="font-medium">Account ID:</span>{" "}
                                                        {account.accountId}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    );
                                })
                            ) : (
                                <p className="col-span-2 text-center text-secondary-text">
                                    No social media accounts linked
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Authenticate */}
                    <div
                        id={menuItems[2].id}
                        className="border-2 border-secondary-text border-opacity-50 p-12 rounded-xl mt-6"
                    >
                        <h2 className="text-3xl font-bold text-text">Authenticate</h2>
                        <p className="mt-4 text-secondary-text">Enable two-factor authentication for added security.</p>
                        <PasskeySection />
                    </div>

                    {/* Delete Account */}
                    <div id={menuItems[3].id} className="py-4 flex justify-end items-center">
                        <button
                            className="bg-accent focus:outline-accent font-bold text-white py-3 px-6 rounded-md"
                            onClick={props.toggleDeleteModal}
                        >
                            Delete My Account
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
