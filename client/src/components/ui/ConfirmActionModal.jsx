import Button from "./Button";
import Modal from "./Modal";

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
  const mappedConfirmVariant = confirmVariant === "secondary" || confirmVariant === "outline"
    ? confirmVariant
    : "danger";

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      size="md"
      footer={(
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={cancelDisabled}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={mappedConfirmVariant}
            onClick={onConfirm}
            disabled={confirmDisabled}
          >
            {confirmLabel}
          </Button>
        </>
      )}
    >
      <p className="text-sm text-neutral-600 dark:text-neutral-300">{description}</p>
    </Modal>
  );
}
