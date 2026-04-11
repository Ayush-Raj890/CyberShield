import { cn } from "./cn";

export default function Input({ as = "input", className, type = "text", ...props }) {
  const Component = as;

  if (Component === "select") {
    return <select className={cn("input", className)} {...props} />;
  }

  if (Component === "textarea") {
    return <textarea className={cn("input", className)} {...props} />;
  }

  return <input type={type} className={cn("input", className)} {...props} />;
}
