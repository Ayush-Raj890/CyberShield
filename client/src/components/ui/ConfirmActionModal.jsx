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
  return (
    <Modal open={open} title={title} description={description} onBackdropClick={onCancel}>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={cancelDisabled}>
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant={confirmVariant}
          onClick={onConfirm}
          disabled={confirmDisabled}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
