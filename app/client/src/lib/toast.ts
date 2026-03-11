import { toast as sonnerToast } from "sonner";

interface ToastOptions {
  duration?: number;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  cancel?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Toast notification utility using Sonner
 * Styled with Warm Earth architectural theme
 */
const baseToast = (message: string, options?: ToastOptions) => {
  return sonnerToast(message, {
    duration: options?.duration,
    description: options?.description,
    action: options?.action,
    cancel: options?.cancel,
  });
};

export const toast = Object.assign(baseToast, {
  success: (message: string, options?: ToastOptions) => {
    sonnerToast.success(message, {
      duration: options?.duration || 3000,
      description: options?.description,
      action: options?.action,
      cancel: options?.cancel,
    });
  },

  error: (message: string, options?: ToastOptions) => {
    sonnerToast.error(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      action: options?.action,
      cancel: options?.cancel,
    });
  },

  info: (message: string, options?: ToastOptions) => {
    sonnerToast.info(message, {
      duration: options?.duration || 3000,
      description: options?.description,
      action: options?.action,
      cancel: options?.cancel,
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    sonnerToast.warning(message, {
      duration: options?.duration || 3500,
      description: options?.description,
      action: options?.action,
      cancel: options?.cancel,
    });
  },

  // Alias for warning
  warn: (message: string, options?: ToastOptions) => {
    sonnerToast.warning(message, {
      duration: options?.duration || 3500,
      description: options?.description,
      action: options?.action,
      cancel: options?.cancel,
    });
  },

  // Custom toast with promise handling
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    },
  ) => {
    return sonnerToast.promise(promise, messages);
  },

  // Dismiss a specific toast or all toasts
  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId);
  },
});
