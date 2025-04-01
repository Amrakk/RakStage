import React from "react";

type Props = {
    className?: string;
    children: React.ReactNode;
};

export default function BaseCard(props: Props) {
    return (
        <div className="w-screen">
            <div
                className={`shadow fixed ${
                    props.className ?? "bg-white"
                } -translate-y-1/2 left-1/2 -translate-x-1/2 p-6 rounded-lg`}
            >
                {props.children}
            </div>
        </div>
    );
}
