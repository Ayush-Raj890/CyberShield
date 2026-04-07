import { forwardRef } from "react";
import { cn } from "./cn";

const inputBaseClass =
  "w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm transition-all duration-200 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-400";

const Input = forwardRef(function Input(
  {
    id,
    label,
    helperText,
    error,
    leftIcon,
    rightIcon,
    className,
    wrapperClassName,
    ...props
  },
  ref
) {
  return (
    <div className={cn("w-full", wrapperClassName)}>
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-200">
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
            {leftIcon}
          </span>
        )}

        <input
          id={id}
          ref={ref}
          className={cn(
            inputBaseClass,
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error && "border-red-400 focus:ring-red-500",
            className
          )}
          aria-invalid={Boolean(error)}
          {...props}
        />

        {rightIcon && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-400">
            {rightIcon}
          </span>
        )}
      </div>

      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-300">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;