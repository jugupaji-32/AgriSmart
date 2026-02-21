import { toast as sonnerToast } from "sonner";

export const useToast = () => {
  const toast = (options: { title?: string; description?: string; variant?: "default" | "destructive" }) => {
    if (options.variant === "destructive") {
      sonnerToast.error(options.title || options.description || "An error occurred");
    } else {
      sonnerToast.success(options.title || options.description || "Success");
    }
  };

  return { toast };
};