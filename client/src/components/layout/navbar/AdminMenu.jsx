import NavDropdown from "./NavDropdown";

export default function AdminMenu({ activeDropdown, onToggle, onNavigate }) {
  return (
    <NavDropdown
      label="Admin"
      dropdownKey="admin"
      activeDropdown={activeDropdown}
      onToggle={onToggle}
      widthClass="w-44"
      onNavigate={onNavigate}
      items={[
        { label: "Admin Dashboard", path: "/admin" },
        { label: "Manage Users", path: "/admin/users" },
        { label: "Moderation", path: "/admin/reports" },
        { label: "Video Moderation", path: "/admin/videos" }
      ]}
    />
  );
}
