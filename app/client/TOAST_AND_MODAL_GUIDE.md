# Toast Notifications & Confirmation Modals

This guide explains how to use the Shadcn-style toast notifications and confirmation modals in the ArchVault application.

## Toast Notifications

We use **Sonner** for toast notifications with custom styling that matches the Warm Earth color palette.

### Basic Usage

```tsx
import { toast } from "../../lib/toast";

// Success toast
toast.success("Resource uploaded successfully!");

// Error toast
toast.error("Failed to upload resource. Please try again.");

// Info toast
toast.info("Session terminated. Securely logged out.");

// Warning toast
toast.warning("This action cannot be undone.");
```

### Advanced Usage

```tsx
// With description
toast.success("Upload Complete", {
  description: "Your resource has been added to the vault.",
  duration: 5000,
});

// With action button
toast.info("New notification", {
  description: "You have a new message.",
  action: {
    label: "View",
    onClick: () => navigate("/notifications"),
  },
});

// Promise-based toast (for async operations)
toast.promise(uploadResource(file), {
  loading: "Uploading resource...",
  success: "Resource uploaded successfully!",
  error: "Failed to upload resource.",
});

// Dismiss a toast
const toastId = toast.info("Processing...");
// Later...
toast.dismiss(toastId);
```

## Confirmation Modals

Replace `window.confirm()` with our custom confirmation modal for a better user experience.

### Setup

First, add the hook to your component:

```tsx
import { useConfirm } from "../../hooks/useConfirm";

function MyComponent() {
  const { confirm, ConfirmDialog } = useConfirm();

  // Your component logic...

  return (
    <>
      {/* Your component JSX */}
      <ConfirmDialog />
    </>
  );
}
```

### Using Confirmation Modals

```tsx
const handleDelete = async () => {
  const confirmed = await confirm({
    title: "Delete Resource",
    message:
      "Are you sure you want to delete this resource? This action cannot be undone.",
    confirmText: "Delete",
    cancelText: "Cancel",
    variant: "danger",
  });

  if (confirmed) {
    // User clicked "Delete"
    await deleteResource();
    toast.success("Resource deleted successfully!");
  }
};
```

### Variants

The confirmation modal supports three variants:

#### Danger (Red)

For destructive actions like deleting data:

```tsx
await confirm({
  title: "Delete Account",
  message: "This will permanently delete your account and all associated data.",
  variant: "danger",
  confirmText: "Delete Account",
});
```

#### Warning (Caramel)

For actions that need caution:

```tsx
await confirm({
  title: "Publish Resource",
  message: "Once published, this resource will be visible to all users.",
  variant: "warning",
  confirmText: "Publish",
});
```

#### Info (Seal Brown)

For informational confirmations:

```tsx
await confirm({
  title: "Save Changes",
  message: "Do you want to save your changes before leaving?",
  variant: "info",
  confirmText: "Save",
  cancelText: "Discard",
});
```

## Migration Guide

### From window.confirm()

**Before:**

```tsx
const handleDelete = () => {
  if (window.confirm("Are you sure you want to delete this?")) {
    deleteItem();
  }
};
```

**After:**

```tsx
const { confirm, ConfirmDialog } = useConfirm();

const handleDelete = async () => {
  const confirmed = await confirm({
    title: "Delete Item",
    message: "Are you sure you want to delete this item?",
    variant: "danger",
  });

  if (confirmed) {
    deleteItem();
  }
};

// Don't forget to render the dialog
return (
  <>
    {/* Your component */}
    <ConfirmDialog />
  </>
);
```

### From react-toastify

**Before:**

```tsx
import { toast } from "react-toastify";

toast.success("Success!");
toast.error("Error!");
```

**After:**

```tsx
import { toast } from "../../lib/toast";

toast.success("Success!");
toast.error("Error!");
```

The API is mostly the same, so migration is straightforward!

## Styling

Both toasts and modals are styled with the Warm Earth color palette:

- **Success**: Seal Brown accents on Buff background
- **Error**: Red accents on light red background
- **Warning**: Caramel accents on light Caramel background
- **Info**: Buff accents on light Buff background

All components feature:

- Rounded corners (2xl for toasts, 3xl for modals)
- Smooth animations
- Backdrop blur effects
- Premium shadows
- Architectural typography

## Best Practices

1. **Use appropriate variants**: Match the variant to the action's severity
2. **Keep messages concise**: Users should understand the action quickly
3. **Provide context**: Explain what will happen if they confirm
4. **Use action buttons**: For toasts that need user interaction
5. **Don't overuse**: Only show toasts for important feedback
6. **Always render ConfirmDialog**: Include `<ConfirmDialog />` in your component's JSX

## Examples

### Complete Delete Flow

```tsx
import { useConfirm } from "../../hooks/useConfirm";
import { toast } from "../../lib/toast";

function ResourceManager() {
  const { confirm, ConfirmDialog } = useConfirm();

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: "Delete Resource",
      message:
        "This resource will be permanently removed from the vault. This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Keep",
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await api.delete(`/resources/${id}`);
      toast.success("Resource deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete resource. Please try again.");
    }
  };

  return (
    <>
      <button onClick={() => handleDelete(123)}>Delete</button>
      <ConfirmDialog />
    </>
  );
}
```

### Form Submission with Promise Toast

```tsx
const handleSubmit = async (data: FormData) => {
  await toast.promise(submitForm(data), {
    loading: "Submitting form...",
    success: (result) => `Form submitted! ID: ${result.id}`,
    error: (err) => `Submission failed: ${err.message}`,
  });
};
```
