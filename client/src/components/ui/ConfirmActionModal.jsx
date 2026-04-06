export default function ConfirmActionModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  confirmVariant = "danger",
  onConfirm,
  onCancel,
  confirmDisabled = false,
  cancelDisabled = false
}) {
  if (!open) return null;

  const confirmClassName =
    confirmVariant === "secondary"
      ? "btn btn-secondary"
      : confirmVariant === "outline"
        ? "btn btn-outline"
        : "btn btn-danger";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{description}</p>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onCancel}
            disabled={cancelDisabled}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={confirmClassName}
            onClick={onConfirm}
            disabled={confirmDisabled}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
