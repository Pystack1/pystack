import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";
import type { Toast } from "@/hooks/useToast";

interface ToastContainerProps {
  toasts: Toast[];
  onRemove?: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="text-green-500" />;
      case "error":
        return <FaExclamationCircle className="text-red-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      default:
        return "text-blue-800";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -10, x: 400 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -10, x: 400 }}
            className={`flex items-center gap-3 p-4 rounded-lg border ${getBgColor(toast.type)} shadow-lg`}
          >
            <div className="text-lg">{getIcon(toast.type)}</div>
            <p className={`flex-1 text-sm font-medium ${getTextColor(toast.type)}`}>{toast.message}</p>
            {onRemove && (
              <button
                onClick={() => onRemove(toast.id)}
                className={`text-lg opacity-50 hover:opacity-100 ${getTextColor(toast.type)}`}
              >
                <FaTimes />
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
