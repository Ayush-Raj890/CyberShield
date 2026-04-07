import { cn } from "./cn";

const variantClasses = {
  primary: "bg-primary-600 text-white hover:bg-primary-700",
  secondary: "bg-neutral-700 text-white hover:bg-neutral-900",
  danger: "bg-red-500 text-white hover:bg-red-600",
  outline: "border border-neutral-300 bg-transparent text-neutral-900 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-800",
  ghost: "bg-transparent text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base"
};

export default function Button({
  type = "button",
  variant = "primary",
  size = "md",
  className,
  disabled = false,
  loading = false,
  fullWidth = false,
  children,
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium shadow-sm transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.md,
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />}
      {children}
    </button>
  );
}