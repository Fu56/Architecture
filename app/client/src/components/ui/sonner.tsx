import { Toaster as Sonner } from "sonner";
import { useTheme } from "../../context/useTheme";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as "light" | "dark"}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white dark:bg-card group-[.toaster]:text-[#5A270F] dark:text-[#EEB38C] group-[.toaster]:border-[#D9D9C2] dark:border-white/10 group-[.toaster]:shadow-lg group-[.toaster]:rounded-2xl",
          description: "group-[.toast]:text-[#92664A] dark:text-[#EEB38C]/40",
          actionButton:
            "group-[.toast]:bg-[#DF8142] group-[.toast]:text-white group-[.toast]:rounded-xl group-[.toast]:font-bold",
          cancelButton:
            "group-[.toast]:bg-[#EFEDED] dark:bg-background group-[.toast]:text-[#5A270F] dark:text-[#EEB38C] group-[.toast]:rounded-xl group-[.toast]:font-bold",
          success:
            "group-[.toaster]:border-[#5A270F]/30 group-[.toaster]:bg-[#D9D9C2]/20",
          error:
            "group-[.toaster]:border-red-500/30 group-[.toaster]:bg-red-50/20",
          warning:
            "group-[.toaster]:border-[#DF8142]/30 group-[.toaster]:bg-[#DF8142]/10",
          info: "group-[.toaster]:border-[#EEB38C]/30 dark:border-white/5 group-[.toaster]:bg-[#EEB38C]/10",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
