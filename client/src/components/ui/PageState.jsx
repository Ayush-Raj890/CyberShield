import { Inbox, Loader2, TriangleAlert } from "lucide-react";
import Card from "./Card";
import Button from "./Button";
import { cn } from "./cn";

const stateConfig = {
  loading: {
    icon: Loader2,
    iconClass: "animate-spin text-primary-600",
    title: "Loading..."
  },
  empty: {
    icon: Inbox,
    iconClass: "text-neutral-400",
    title: "Nothing here yet"
  },
  error: {
    icon: TriangleAlert,
    iconClass: "text-red-500",
    title: "Something went wrong"
  }
};

export default function PageState({
  variant = "empty",
  title,
  description,
  actionLabel,
  onAction,
  actionVariant = "primary",
  className
}) {
  const config = stateConfig[variant] || stateConfig.empty;
  const Icon = config.icon;

  return (
    <Card className={cn("flex flex-col items-center justify-center text-center", className)} padding="lg">
      <Icon className={cn("h-10 w-10", config.iconClass)} />
      <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        {title || config.title}
      </h3>
      {description ? (
        <p className="mt-2 max-w-lg text-sm text-neutral-500 dark:text-neutral-300">{description}</p>
      ) : null}
      {actionLabel && onAction ? (
        <Button className="mt-5" variant={actionVariant} onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </Card>
  );
}