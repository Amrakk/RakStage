import { useEffect, useRef, useState } from "react";
import BaseModal from "./BaseModal";
import { toast } from "react-toastify";
import CustomTextField from "./CustomTextField";

type Props = {
    id: string;
    confirmText: string;
    isShowing: boolean;
    hide: () => void;
    onError?: (error: any) => void;
    deleteAction: () => Promise<any>;
};

export default function DeleteModal(props: Props) {
    const [loading, setLoading] = useState(false);
    const [confirmationInput, setConfirmationInput] = useState("");

    async function handleSubmit() {
        if (confirmationInput !== props.confirmText) {
            toast.error("The entered name does not match. Please try again.");
            return;
        }
        try {
            setLoading(true);
            await props.deleteAction();
            props.hide();
        } catch (error) {
            if (props.onError) props.onError(error);
            else toast.error("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <BaseModal
            isShowing={props.isShowing}
            hide={props.hide}
            title="Confirm Delete"
            builder={() => {
                return (
                    <>
                        <form onSubmit={handleSubmit}>
                            <ConfirmationInput
                                confirmText={props.confirmText}
                                confirmationInput={confirmationInput}
                                onChange={setConfirmationInput}
                            />
                            <div className="flex flex-row gap-5 p-4 md:p-5">
                                <button
                                    type="submit"
                                    className={`w-full bg-accent focus:outline-accent font-bold text-center select-none text-text p-3 rounded-md active:scale-90 transition-all duration-75 hover:scale-105 disabled:bg-opacity-50 disabled:cursor-not-allowed`}
                                    disabled={loading || confirmationInput !== props.confirmText}
                                >
                                    {loading ? "Deleting..." : "Delete"}
                                </button>
                                <button
                                    type="button"
                                    className="w-full border-highlight-teal border text-text p-3 text-center select-none rounded-md active:scale-90 transition-all duration-75 hover:scale-105"
                                    onClick={props.hide}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </>
                );
            }}
        />
    );
}

type ConfirmInputProps = {
    confirmText: string;
    confirmationInput: string;
    onChange: (value: string) => void;
};

function ConfirmationInput(props: ConfirmInputProps) {
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        ref.current?.focus();
    }, []);

    return (
        <div className="flex flex-col gap-4 border-b border-secondary-text p-4 md:p-5">
            <p className="text-lg text-text">
                Type <span className="font-bold">{props.confirmText}</span> to confirm your action
            </p>
            <CustomTextField
                id="confirmationInput"
                label="Name"
                value={props.confirmationInput}
                onChange={(e) => props.onChange(e.target.value)}
                placeholder={props.confirmText}
                ref={ref}
                required
            />
        </div>
    );
}
