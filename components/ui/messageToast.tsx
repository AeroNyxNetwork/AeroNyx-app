/*
 * @Description: 
 * @Date: 2025-03-17 17:03:05
 * @LastEditTime: 2025-03-17 17:23:09
 */
import { useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";
import { useToastStore } from "@/store/useToastStore";

const MessageToast = () => {
    const { type, message, show, hideToast } = useToastStore();

    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => hideToast(), 3000);
            return () => clearTimeout(timer);
        }
    }, [show, hideToast]);

    if (!show) return null;

    const iconMap = {
        success: <CheckCircle className="text-green-400" size={20} />,
        error: <XCircle className="text-red-500" size={20} />,
        warning: <AlertTriangle className="text-yellow-400" size={20} />,
    };

    return (
        <div
            className={`z-[9999] fixed top-5 left-1/2 transform -translate-x-1/2
                        flex items-center p-4 rounded-lg shadow-lg bg-gray-900 text-white border
                        ${type === "success" ? "border-green-500"
                    : type === "error" ? "border-red-500"
                        : "border-yellow-500"
                }`}
        >
            {iconMap[type]}
            <span className="ml-2 text-sm">{message}</span>
            <button onClick={hideToast} className="ml-3 text-gray-400 hover:text-white">
                <X size={18} />
            </button>
        </div>
    );
};

export default MessageToast;