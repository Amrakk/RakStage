import { useState } from "react";
import { toast } from "react-toastify";
import BaseCard from "../shared/BaseCard";
import { useNavigate } from "react-router-dom";
import CustomTextField from "../shared/CustomTextField";
import { FaPlus, FaSpinner } from "react-icons/fa";

export default function HomeComponent() {
    const navigate = useNavigate();
    const [stageCode, setStageCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleJoinStage = () => {
        if (!stageCode.trim()) {
            toast.error("Please enter a valid stage code.");
            return;
        }
        navigate(`/stage/${stageCode}`);
    };

    const handleCreateStage = () => {
        setLoading(true);
        setTimeout(() => {
            const newStageCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            navigate(`/stage/${newStageCode}`);
        }, 500);
    };

    return (
        <div className="flex justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800">
            <BaseCard className="bg-gray-700 bg-opacity-25 p-8 rounded-xl shadow-lg animate-fadeIn">
                <h2 className="text-3xl font-extrabold text-white mb-3 text-center">Join or Create a Stage</h2>
                <p className="text-gray-300 text-center mb-6">
                    Enter a stage code to join an existing session or start a new one.
                </p>

                <div className="space-y-5">
                    <div className="grid grid-cols-5 gap-4">
                        <div className="col-span-3">
                            <CustomTextField
                                id="stage-code"
                                label="Stage Code"
                                type="text"
                                value={stageCode}
                                onChange={(e) => setStageCode(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            onClick={handleJoinStage}
                            className={`col-span-2 bg-highlight-teal font-bold text-center text-white py-3 rounded-lg transition-all duration-200 ${
                                stageCode ? "hover:bg-teal-600 active:scale-95" : "opacity-50 cursor-not-allowed"
                            }`}
                            disabled={!stageCode}
                        >
                            Join Stage
                        </button>
                    </div>

                    <button
                        onClick={handleCreateStage}
                        className="relative w-full group flex items-center justify-center rounded-lg p-[2px] text-text transition-all duration-700 ease-in-out focus:outline-0"
                        disabled={loading}
                    >
                        {/* Animated Border */}
                        <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-highlight-teal to-transparent animate-border-spin opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-500"></span>

                        {/* Button Content */}
                        <div className="relative flex h-full w-full items-center py-3 justify-center rounded-lg bg-primary bg-opacity-90 transition duration-300">
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <FaPlus className="mr-2" />
                                    Create New Stage
                                </>
                            )}
                        </div>
                    </button>
                </div>
            </BaseCard>
        </div>
    );
}
