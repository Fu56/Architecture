import { toast as sonnerToast } from "sonner";

interface ToastOptions {
  duration?: number;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Toast notification utility using Sonner
 * Styled with Warm Earth architectural theme
 */
export const toast = {
  success: (message: string, options?: ToastOptions) => {
    sonnerToast.success(message, {
      duration: options?.duration || 3000,
      description: options?.description,
      action: options?.action,
    });
  },

  error: (message: string, options?: ToastOptions) => {
    sonnerToast.error(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      action: options?.action,
    });
  },

  info: (message: string, options?: ToastOptions) => {
    sonnerToast.info(message, {
      duration: options?.duration || 3000,
      description: options?.description,
      action: options?.action,
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    sonnerToast.warning(message, {
      duration: options?.duration || 3500,
      description: options?.description,
      action: options?.action,
    });
  },

  // Alias for warning
  warn: (message: string, options?: ToastOptions) => {
    sonnerToast.warning(message, {
      duration: options?.duration || 3500,
      description: options?.description,
      action: options?.action,
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
};
