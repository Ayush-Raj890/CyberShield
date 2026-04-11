import NavDropdown from "./NavDropdown";

export default function AccountMenu({ activeDropdown, onToggle, onNavigate, onLogout, items }) {
  const accountItems = items || [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Profile", path: "/profile" },
    { label: "Settings", path: "/settings" }
  ];

  return (
    <NavDropdown
      label="Account"
      dropdownKey="account"
      activeDropdown={activeDropdown}
      onToggle={onToggle}
      widthClass="w-40"
      onNavigate={onNavigate}
      items={[
        ...accountItems,
        {
          label: "Logout",
          className: "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30",
          onClick: onLogout
        }
      ]}
    />
  );
}
