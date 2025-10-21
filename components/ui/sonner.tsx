"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-right"
      expand={true}
      richColors={true}
      closeButton={true}
      toastOptions={{
        duration: 4000,
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border group-[.toaster]:border-gray-200 group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl group-[.toaster]:backdrop-blur-sm group-[.toaster]:p-4 group-[.toaster]:min-w-[400px] group-[.toaster]:font-outfit",
          description:
            "group-[.toast]:text-gray-600 group-[.toast]:text-sm group-[.toast]:mt-2 group-[.toast]:leading-relaxed group-[.toast]:whitespace-nowrap group-[.toast]:overflow-hidden group-[.toast]:text-ellipsis group-[.toast]:font-outfit",
          actionButton:
            "group-[.toast]:bg-blue-600 group-[.toast]:text-white group-[.toast]:hover:bg-blue-700 group-[.toast]:rounded-lg group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:text-sm group-[.toast]:font-medium group-[.toast]:transition-colors group-[.toast]:font-outfit",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-700 group-[.toast]:hover:bg-gray-200 group-[.toast]:rounded-lg group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:text-sm group-[.toast]:font-medium group-[.toast]:transition-colors group-[.toast]:font-outfit",
          closeButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-400 group-[.toast]:hover:bg-gray-200 group-[.toast]:hover:text-gray-600 group-[.toast]:rounded-full group-[.toast]:p-1 group-[.toast]:transition-colors",
          title:
            "group-[.toast]:font-semibold group-[.toast]:text-base group-[.toast]:flex group-[.toast]:items-center group-[.toast]:gap-3 group-[.toast]:mb-1 group-[.toast]:font-outfit",
          success:
            "group-[.toaster]:border-green-200 group-[.toaster]:bg-green-50 group-[.toaster]:shadow-green-100/50",
          error:
            "group-[.toaster]:border-red-200 group-[.toaster]:bg-red-50 group-[.toaster]:shadow-red-100/50",
          warning:
            "group-[.toaster]:border-yellow-200 group-[.toaster]:bg-yellow-50 group-[.toaster]:shadow-yellow-100/50",
          info: "group-[.toaster]:border-blue-200 group-[.toaster]:bg-blue-50 group-[.toaster]:shadow-blue-100/50",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
