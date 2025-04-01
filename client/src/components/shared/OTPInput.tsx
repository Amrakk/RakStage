import { useRef, useState } from "react";

interface OTPInputProps {
    length?: number;
    onComplete: (otp: string) => void;
}

export default function OTPInput({ length = 6, onComplete }: OTPInputProps) {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
        if (newOtp.every((digit) => digit !== "")) {
            onComplete(newOtp.join(""));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0) inputsRef.current[index - 1]?.focus();

            onComplete("");
        }
    };

    const handleBlur = (index: number, value: string) => {
        if (!/^\d$/.test(value)) {
            inputsRef.current[index]?.style.setProperty("border-color", "#FF3B3B");
            return;
        } else {
            inputsRef.current[index]?.style.setProperty("border-color", "#008C8C");
        }
    };

    const handleOnFocus = (index: number) => {
        inputsRef.current[index]?.style.setProperty("border-color", "#008C8C");
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const paste = event.clipboardData.getData("text");

        if (paste.length === length) {
            const newOtp = paste.split("");
            if (newOtp.some((digit) => !/^\d$/.test(digit)) || newOtp.length !== length) return;
            setOtp(newOtp);
            onComplete(paste);

            inputsRef.current.forEach((_, index) => {
                inputsRef.current[index]!.value = newOtp[index];
                inputsRef.current[index]!.style.setProperty("border-color", "#008C8C");
            });

            inputsRef.current[length - 1]?.focus();
        }
    };

    return (
        <div className="flex justify-evenly">
            {otp.map((value, index) => (
                <input
                    key={index}
                    ref={(e) => {
                        inputsRef.current[index] = e;
                    }}
                    type="text"
                    maxLength={1}
                    onPaste={handlePaste}
                    onFocus={(_) => handleOnFocus(index)}
                    onBlur={(e) => handleBlur(index, e.target.value)}
                    value={value}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="size-10 text-center bg-transparent text-text text-xl font-bold border-2 border-text rounded-md outline-none transition-all opacity-0 animate-fadeIn leading-none duration-300"
                />
            ))}
        </div>
    );
}
