type Props = {
    size?: number;
    className?: string;
};

export default function CloseIcon(props: Props) {
    return (
        <svg
            className={props.className}
            width={props.size ?? "1em"}
            height={props.size ?? "1em"}
            stroke="currentColor"
            fill="currentColor"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M112 112 L400 400 M400 112 L112 400" strokeLinecap="round" strokeWidth={112}></path>
        </svg>
    );
}
