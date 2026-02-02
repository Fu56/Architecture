/**
 * Example Component: Confirmation Modal Usage
 *
 * This file demonstrates how to use the confirmation modal
 * to replace window.confirm() calls throughout the application.
 */

import { useConfirm } from "../hooks/useConfirm";
import { toast } from "../lib/toast";
import { Trash2, Upload, Send } from "lucide-react";

export const ConfirmationExamples = () => {
  const { confirm, ConfirmDialog } = useConfirm();

  // Example 1: Delete action (danger variant)
  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Delete Resource",
      message:
        "This resource will be permanently removed from the vault. This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (confirmed) {
      // Perform delete operation
      toast.success("Resource deleted successfully!");
    }
  };

  // Example 2: Publish action (warning variant)
  const handlePublish = async () => {
    const confirmed = await confirm({
      title: "Publish Resource",
      message:
        "Once published, this resource will be visible to all users in the vault. Are you ready to proceed?",
      confirmText: "Publish",
      cancelText: "Keep Draft",
      variant: "warning",
    });

    if (confirmed) {
      // Perform publish operation
      toast.success("Resource published successfully!");
    }
  };

  // Example 3: Save changes (info variant)
  const handleSave = async () => {
    const confirmed = await confirm({
      title: "Save Changes",
      message: "Do you want to save your changes before leaving this page?",
      confirmText: "Save",
      cancelText: "Discard",
      variant: "info",
    });

    if (confirmed) {
      // Perform save operation
      toast.success("Changes saved successfully!");
    } else {
      toast.info("Changes discarded.");
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-black text-[#5A270F] uppercase tracking-tight">
        Confirmation Modal Examples
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Danger Example */}
        <button
          onClick={handleDelete}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-red-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-red-700 transition-all duration-300 active:scale-95 shadow-lg"
        >
          <Trash2 className="h-5 w-5" />
          Delete (Danger)
        </button>

        {/* Warning Example */}
        <button
          onClick={handlePublish}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-[#DF8142] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#5A270F] transition-all duration-300 active:scale-95 shadow-lg"
        >
          <Upload className="h-5 w-5" />
          Publish (Warning)
        </button>

        {/* Info Example */}
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-[#5A270F] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#DF8142] transition-all duration-300 active:scale-95 shadow-lg"
        >
          <Send className="h-5 w-5" />
          Save (Info)
        </button>
      </div>

      {/* IMPORTANT: Always render the ConfirmDialog component */}
      <ConfirmDialog />
    </div>
  );
};
