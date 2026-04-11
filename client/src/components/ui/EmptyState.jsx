import PageState from "./PageState";

export default function EmptyState({ title, description, actionLabel, onAction, className }) {
  return (
    <PageState
      variant="empty"
      title={title}
      description={description}
      actionLabel={actionLabel}
      onAction={onAction}
      className={className}
    />
  );
}
