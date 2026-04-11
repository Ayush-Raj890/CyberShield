import { cn } from "./cn";

export default function Modal({
  open,
  title,
  description,
  children,
  containerClassName,
  onBackdropClick
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onBackdropClick}
    >
      <div
        className={cn("w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900", containerClassName)}
        onClick={(event) => event.stopPropagation()}
      >
        {title ? <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3> : null}
        {description ? <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{description}</p> : null}
        {children}
      </div>
    </div>
  );
}
