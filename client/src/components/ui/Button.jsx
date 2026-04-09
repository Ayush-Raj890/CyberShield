import { cn } from "./cn";

const variantClassMap = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  danger: "btn-danger",
  outline: "btn-outline"
};

export default function Button({
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  className,
  children,
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={cn("btn", variantClassMap[variant] ?? variantClassMap.primary, className)}
      {...props}
    >
      {loading ? "Processing..." : children}
    </button>
  );
}
