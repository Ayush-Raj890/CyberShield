import { cn } from "./cn";

const variantClasses = {
  neutral: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200",
  primary: "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  danger: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",
  outline: "border border-neutral-300 bg-transparent text-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm"
};

export default function Badge({
  as: Component = "span",
  variant = "neutral",
  size = "sm",
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={cn(
        "inline-flex items-center rounded-xl font-medium",
        variantClasses[variant] || variantClasses.neutral,
        sizeClasses[size] || sizeClasses.sm,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}