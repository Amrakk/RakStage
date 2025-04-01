import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { GoTrash } from "react-icons/go";
import { FaCheck } from "react-icons/fa";
import { Passkey } from "@/models/passkey";
import CloseIcon from "../shared/CloseIcon";
import { useEffect, useRef, useState } from "react";
import { base64ToBuffer } from "@/utils/encryption";
import { usePasskeyActions } from "@/hooks/auth/useAuth";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { calculateTimeDiff } from "@/utils/calculateTimeDiff";

export default function PasskeySection() {
    const [loading, setLoading] = useState(false);

    const [editName, setEditName] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    const [isPasskeyAvailable, setIsPasskeyAvailable] = useState(false);
    const [passkeys, setPasskeys] = useState<Passkey[]>([]);
    const {
        getPasskeysAction,
        updatePasskeyAction,
        deletePasskeyAction,
        createPasskeyAction,
        createPasskeyOptionsAction,
    } = usePasskeyActions();

    useEffect(() => {
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

        fetchPasskeys();
    }, []);

    useEffect(() => {
        if (editingId) inputRefs.current[editingId]?.select();
    }, [editingId]);

    async function fetchPasskeys() {
        try {
            const data = await getPasskeysAction.mutateAsync();
            setPasskeys(data);
        } catch (error) {
            toast.error("Failed to load passkeys");
        }
    }

    async function handleAddPasskey() {
        try {
            setLoading(true);
            const options = await createPasskeyOptionsAction.mutateAsync();

            options.challenge = base64ToBuffer(`${options.challenge}`);
            options.user.id = base64ToBuffer(`${options.user.id}`);
            options.excludeCredentials = options.excludeCredentials?.map((cred) => {
                cred.id = base64ToBuffer(`${cred.id}`);
                return cred;
            });

            const credential = (await navigator.credentials.create({
                publicKey: options,
            })) as PublicKeyCredential;

            if (!credential) throw new Error("No credential returned");

            const passkey = await createPasskeyAction.mutateAsync(credential);

            toast.success("Passkey created successfully");
            setPasskeys((prev) => [...prev, passkey]);
        } catch (err) {
            let message = "Passkey creation failed. Please try again later.";
            if (isAxiosError(err)) {
                if (err.response?.status === 403) {
                    toast.error("You are not authorized to perform this action");
                    return;
                }
                const responseData = err.response?.data;
                message = responseData?.message || err.message || message;
            }
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    async function handleRename(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!editingId) return;
        try {
            const passkey = await updatePasskeyAction.mutateAsync({ _id: editingId, name: editName });
            toast.success("Passkey renamed successfully");
            setPasskeys((prev) => prev.map((p) => (p._id === passkey._id ? passkey : p)));
        } catch (error) {
            toast.error("Failed to rename passkey");
        } finally {
            setEditingId(null);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this passkey?")) return;
        try {
            await deletePasskeyAction.mutateAsync(id);
            toast.success("Passkey deleted successfully");
            setPasskeys((prev) => prev.filter((p) => p._id !== id));
        } catch (error) {
            toast.error("Failed to delete passkey");
        }
    }

    return (
        <div className=" text-text p-6 rounded-lg">
            <div className="border border-secondary bg-secondary bg-opacity-30 flex justify-between items-center p-4 rounded-t-lg backdrop-blur-sm">
                <h2 className="text-xl font-bold">Your Passkeys</h2>
                <button
                    className={`bg-highlight-teal font-bold text-text py-2 px-6 rounded-md ${
                        loading || !isPasskeyAvailable ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                    }`}
                    disabled={loading || !isPasskeyAvailable}
                    onClick={handleAddPasskey}
                >
                    {loading ? "Adding..." : isPasskeyAvailable ? "Add a passkey" : "Passkey Not Available"}
                </button>
            </div>

            <div className="border border-secondary rounded-b-lg p-3">
                {passkeys.length > 0 ? (
                    passkeys.map((passkey, index) => (
                        <div
                            key={passkey._id}
                            className={`flex items-center justify-between p-3 rounded mb-2 ${
                                index % 2 === 0 ? "bg-secondary bg-opacity-15" : ""
                            } ${index !== passkeys.length - 1 ? "border-b border-secondary" : ""}`}
                        >
                            <form id={`form-${passkey._id}`} onSubmit={handleRename} className="flex flex-col gap-1">
                                <input
                                    type="text"
                                    key={`${passkey._id}-input`}
                                    disabled={editingId !== passkey._id}
                                    defaultValue={passkey.name}
                                    ref={(el) => {
                                        inputRefs.current[passkey._id] = el;
                                    }}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="bg-transparent text-white text-lg font-semibold focus:outline-none border-b border-transparent focus:border-highlight-teal"
                                />
                                <div className="text-gray-400 text-sm">
                                    Added on{" "}
                                    {`${passkey.createdAt.toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}`}
                                    {passkey.lastUsedAt && calculateTimeDiff(passkey.lastUsedAt, " | Last used ")}
                                </div>
                            </form>

                            {editingId === passkey._id ? (
                                <div className="flex gap-2">
                                    <button
                                        key={`${passkey._id}-save`}
                                        type="submit"
                                        form={`form-${passkey._id}`}
                                        className="border-secondary-text border text-highlight-teal rounded p-2 hover:scale-105"
                                    >
                                        <FaCheck />
                                    </button>
                                    <button
                                        key={`${passkey._id}-cancel`}
                                        onClick={() => {
                                            inputRefs.current[passkey._id]!.value = passkey.name;
                                            setEditingId(null);
                                        }}
                                        className="border-secondary-text border text-accent rounded p-2 hover:scale-105"
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        key={`${passkey._id}-edit`}
                                        className="border-secondary-text border text-text rounded p-2 hover:scale-105"
                                        onClick={() => {
                                            setEditingId(passkey._id);
                                            setEditName(passkey.name);
                                        }}
                                    >
                                        <MdOutlineModeEditOutline />
                                    </button>

                                    <button
                                        key={`${passkey._id}-delete`}
                                        className="border-secondary-text border text-accent rounded p-2 hover:scale-105"
                                        onClick={() => handleDelete(passkey._id)}
                                    >
                                        <GoTrash />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">No passkeys found.</p>
                )}
            </div>
        </div>
    );
}
