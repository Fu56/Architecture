import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-[#5A270F] group-[.toaster]:border-[#D9D9C2] group-[.toaster]:shadow-lg group-[.toaster]:rounded-2xl",
          description: "group-[.toast]:text-[#92664A]",
          actionButton:
            "group-[.toast]:bg-[#DF8142] group-[.toast]:text-white group-[.toast]:rounded-xl group-[.toast]:font-bold",
          cancelButton:
            "group-[.toast]:bg-[#EFEDED] group-[.toast]:text-[#5A270F] group-[.toast]:rounded-xl group-[.toast]:font-bold",
          success:
            "group-[.toaster]:border-[#5A270F]/30 group-[.toaster]:bg-[#D9D9C2]/20",
          error:
            "group-[.toaster]:border-red-500/30 group-[.toaster]:bg-red-50/20",
          warning:
            "group-[.toaster]:border-[#DF8142]/30 group-[.toaster]:bg-[#DF8142]/10",
          info: "group-[.toaster]:border-[#EEB38C]/30 group-[.toaster]:bg-[#EEB38C]/10",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
