import { useState } from "react";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";

/**
 * Hook for using the confirm dialog
 * Returns a confirm function and a ConfirmDialog component to render
 */
export const useConfirm = () => {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const confirm = (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
  }): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialogState({
        ...options,
        isOpen: true,
        onConfirm: () => {
          resolve(true);
          setDialogState((prev) => ({ ...prev, isOpen: false }));
        },
      });
    });
  };

  const closeDialog = () => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      isOpen={dialogState.isOpen}
      onClose={closeDialog}
      onConfirm={dialogState.onConfirm}
      title={dialogState.title}
      message={dialogState.message}
      confirmText={dialogState.confirmText}
      cancelText={dialogState.cancelText}
      variant={dialogState.variant}
    />
  );

  return { confirm, ConfirmDialog: ConfirmDialogComponent };
};
