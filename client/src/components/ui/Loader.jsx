import { Loader2 } from "lucide-react";
import { cn } from "./cn";

export default function Loader({ label = "Loading...", className, size = "md" }) {
  const sizeClass = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : "h-6 w-6";

  return (
    <div className={cn("flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300", className)}>
      <Loader2 className={cn("animate-spin", sizeClass)} />
      <span>{label}</span>
    </div>
  );
}
