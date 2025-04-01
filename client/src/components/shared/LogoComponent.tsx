import Logo from "@/assets/logo.svg";
import { useNavigate } from "react-router-dom";

export default function LogoComponent() {
    const navigate = useNavigate();

    return (
        <button className="flex items-center p-2" tabIndex={-1} onClick={() => navigate("/home")}>
            <img src={Logo} alt="RakStage Logo" className={`size-14 mr-2`} />
            <h1 className="text-xl font-bold tracking-wide text-text">RakStage</h1>
        </button>
    );
}
