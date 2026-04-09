import { cn } from "./cn";

const paddingMap = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6"
};

export default function Card({
  as: Component = "div",
  className,
  padding = "md",
  children,
  ...props
}) {
  return (
    <Component
      className={cn("card", paddingMap[padding] ?? paddingMap.md, className)}
      {...props}
    >
      {children}
    </Component>
  );
}
