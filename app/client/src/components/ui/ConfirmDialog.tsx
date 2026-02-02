import { useEffect } from "react";
import { X, AlertTriangle, Info, CheckCircle, AlertCircle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "warning",
}: ConfirmDialogProps) => {
  useEffect(() => {
    // Synchronize visibility with isOpen prop
    if (isOpen) {
      // Use requestAnimationFrame to avoid cascading renders
      requestAnimationFrame(() => {
        const element = document.getElementById("confirm-dialog");
        if (element) {
          element.classList.add("opacity-100", "scale-100");
          element.classList.remove("opacity-0", "scale-95");
        }
      });
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: <AlertCircle className="h-6 w-6 text-red-500" />,
          iconBg: "bg-red-100",
          confirmBtn: "bg-red-600 hover:bg-red-700 text-white",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-[#DF8142]" />,
          iconBg: "bg-[#DF8142]/10",
          confirmBtn: "bg-[#DF8142] hover:bg-[#5A270F] text-white",
        };
      case "info":
        return {
          icon: <Info className="h-6 w-6 text-[#EEB38C]" />,
          iconBg: "bg-[#EEB38C]/10",
          confirmBtn: "bg-[#5A270F] hover:bg-[#DF8142] text-white",
        };
      default:
        return {
          icon: <CheckCircle className="h-6 w-6 text-[#5A270F]" />,
          iconBg: "bg-[#5A270F]/10",
          confirmBtn: "bg-[#5A270F] hover:bg-[#DF8142] text-white",
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        id="confirm-dialog"
        className={`relative bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all duration-300 ${
          isOpen
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 translate-y-4 opacity-0"
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#EFEDED] transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5 text-[#92664A]" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Icon */}
          <div
            className={`w-14 h-14 rounded-2xl ${variantStyles.iconBg} flex items-center justify-center mb-6`}
          >
            {variantStyles.icon}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-black text-[#5A270F] mb-3 tracking-tight uppercase">
            {title}
          </h3>

          {/* Message */}
          <p className="text-[#92664A] font-medium leading-relaxed mb-8">
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-[#EFEDED] text-[#5A270F] rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#D9D9C2] transition-all duration-300 active:scale-95"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all duration-300 active:scale-95 shadow-lg ${variantStyles.confirmBtn}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
