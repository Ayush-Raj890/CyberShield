import { cn } from "./cn";

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8"
};

export default function Card({
  as: Component = "div",
  className,
  children,
  hover = false,
  padding = "md",
  ...props
}) {
  return (
    <Component
      className={cn(
        "rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900",
        hover && "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        paddingClasses[padding] || paddingClasses.md,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("mb-4 flex items-start justify-between gap-3", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("text-xl font-semibold text-neutral-900 dark:text-neutral-100", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn("text-sm text-neutral-500 dark:text-neutral-300", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn("mt-4 flex items-center justify-end gap-2", className)} {...props}>
      {children}
    </div>
  );
}