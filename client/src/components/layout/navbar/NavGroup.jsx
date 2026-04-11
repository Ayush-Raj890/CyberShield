export default function NavGroup({ children, className = "" }) {
  return (
    <div className={`w-full sm:w-auto flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3 text-sm ${className}`.trim()}>
      {children}
    </div>
  );
}
