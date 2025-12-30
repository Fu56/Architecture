// Simple toast notification utility
type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  duration?: number;
  position?:
    | "top-right"
    | "top-center"
    | "top-left"
    | "bottom-right"
    | "bottom-center"
    | "bottom-left";
}

const defaultOptions: ToastOptions = {
  duration: 3000,
  position: "top-right",
};

const getPositionClasses = (position: string) => {
  const positions = {
    "top-right": "top-4 right-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
    "bottom-left": "bottom-4 left-4",
  };
  return (
    positions[position as keyof typeof positions] || positions["top-right"]
  );
};

const getTypeStyles = (type: ToastType) => {
  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
  };
  return styles[type];
};

const getIcon = (type: ToastType) => {
  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠",
  };
  return icons[type];
};

const showToast = (
  message: string,
  type: ToastType = "info",
  options: ToastOptions = {}
) => {
  const opts = { ...defaultOptions, ...options };

  // Create toast container if it doesn't exist
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "fixed z-[9999] pointer-events-none";
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement("div");
  const toastId = `toast-${Date.now()}-${Math.random()}`;
  toast.id = toastId;
  toast.className = `pointer-events-auto mb-4 px-6 py-4 rounded-2xl border-2 shadow-xl backdrop-blur-sm transition-all duration-300 transform flex items-center gap-3 font-bold ${getTypeStyles(
    type
  )} animate-in slide-in-from-right-5 fade-in`;

  toast.innerHTML = `
    <span class="text-xl flex-shrink-0">${getIcon(type)}</span>
    <span class="flex-grow">${message}</span>
    <button class="ml-2 text-lg opacity-60 hover:opacity-100 transition-opacity flex-shrink-0" onclick="document.getElementById('${toastId}').remove()">×</button>
  `;

  // Position the container
  container.className = `fixed z-[9999] pointer-events-none ${getPositionClasses(
    opts.position!
  )}`;
  container.appendChild(toast);

  // Auto remove after duration
  setTimeout(() => {
    toast.classList.add("animate-out", "slide-out-to-right-5", "fade-out");
    setTimeout(() => {
      toast.remove();
      // Remove container if empty
      if (container && container.children.length === 0) {
        container.remove();
      }
    }, 300);
  }, opts.duration);
};

export const toast = {
  success: (message: string, options?: ToastOptions) =>
    showToast(message, "success", options),
  error: (message: string, options?: ToastOptions) =>
    showToast(message, "error", options),
  info: (message: string, options?: ToastOptions) =>
    showToast(message, "info", options),
  warning: (message: string, options?: ToastOptions) =>
    showToast(message, "warning", options),
};
