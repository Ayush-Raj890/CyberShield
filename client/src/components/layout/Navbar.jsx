import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { performLogout } from "../../utils/logout";

export default function Navbar() {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(user?.role);

  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!navRef.current?.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const closeDropdownAndGo = (path) => {
    setActiveDropdown(null);
    navigate(path);
  };

  const GuestNav = () => (
    <div className="w-full sm:w-auto flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3 text-sm">
      <details className="relative" open={activeDropdown === "guest-core"}>
        <summary
          className="cursor-pointer list-none text-neutral-700 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-primary-100 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            toggleDropdown("guest-core");
          }}
        >
          Core
        </summary>
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800 shadow-sm z-10">
          <button className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700" onClick={() => closeDropdownAndGo("/ai")}>AI Detector</button>
          <button className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700" onClick={() => closeDropdownAndGo("/create-report")}>Report Incident</button>
        </div>
      </details>

      <button onClick={() => navigate("/articles")} className="text-neutral-700 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-primary-100 transition-colors">Learn</button>

      <details className="relative" open={activeDropdown === "guest-community"}>
        <summary
          className="cursor-pointer list-none text-neutral-700 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-primary-100 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            toggleDropdown("guest-community");
          }}
        >
          Community
        </summary>
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800 shadow-sm z-10">
          <button className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700" onClick={() => closeDropdownAndGo("/forum")}>Forum</button>
          <button className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700" onClick={() => closeDropdownAndGo("/videos")}>Video Hub</button>
          <button className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700" onClick={() => closeDropdownAndGo("/memes")}>Meme Hub</button>
          <button className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700" onClick={() => closeDropdownAndGo("/games")}>Phishing Game</button>
        </div>
      </details>

      <button onClick={() => navigate("/login")} className="text-neutral-700 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-primary-100 transition-colors">Login</button>
      <button onClick={() => navigate("/register")} className="btn btn-primary text-sm">Get Started</button>
    </div>
  );

  const UserNav = () => (
    <div className="w-full sm:w-auto flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3 text-sm">
      <details className="relative" open={activeDropdown === "core"}>
        <summary
          className="cursor-pointer list-none text-neutral-700 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-primary-100 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            toggleDropdown("core");
          }}
        >
          Core
        </summary>
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800 shadow-sm z-10">
          <button className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700" onClick={() => closeDropdownAndGo("/ai")}>AI Detector</button>
          <button className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700" onClick={() => closeDropdownAndGo("/reports")}>Reports</button>
        </div>
      </details>

      <details className="relative" open={activeDropdown === "learn"}>
        <summary
          className="cursor-pointer list-none text-neutral-700 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-primary-100 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            toggleDropdown("learn");
          }}
        >
          Learn
        </summary>
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800 shadow-sm z-10">
          <button className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700" onClick={() => closeDropdownAndGo("/articles")}>Knowledge Hub</button>
        </div>
      </details>

      <details className="relative" open={activeDropdown === "community"}>
        <summary
          className="cursor-pointer list-none text-neutral-700 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-primary-100 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            toggleDropdown("community");
          }}
        >
          Community
        </summary>
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800 shadow-sm z-10">
          <button className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700" onClick={() => closeDropdownAndGo("/forum")}>Forum</button>
          <button className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700" onClick={() => closeDropdownAndGo("/videos")}>Video Hub</button>
          <button className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700" onClick={() => closeDropdownAndGo("/memes")}>Meme Hub</button>
          <button className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700" onClick={() => closeDropdownAndGo("/games")}>Phishing Game</button>
        </div>
      </details>

      <details className="relative" open={activeDropdown === "account"}>
        <summary
          className="cursor-pointer list-none text-neutral-700 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-primary-100 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            toggleDropdown("account");
          }}
        >
          Account
        </summary>
        <div className="absolute right-0 mt-2 w-40 rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800 shadow-sm z-10">
          <button className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700" onClick={() => closeDropdownAndGo("/dashboard")}>Dashboard</button>
          <button className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700" onClick={() => closeDropdownAndGo("/profile")}>Profile</button>
          <button className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700" onClick={() => closeDropdownAndGo("/settings")}>Settings</button>
          <button className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30" onClick={() => performLogout(navigate)}>Logout</button>
        </div>
      </details>

      {isAdmin && (
        <details className="relative" open={activeDropdown === "admin"}>
          <summary
            className="cursor-pointer list-none text-neutral-700 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-primary-100 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              toggleDropdown("admin");
            }}
          >
            Admin
          </summary>
          <div className="absolute right-0 mt-2 w-44 rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800 shadow-sm z-10">
            <button className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700" onClick={() => closeDropdownAndGo("/admin")}>Admin Dashboard</button>
            <button className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700" onClick={() => closeDropdownAndGo("/admin/users")}>Manage Users</button>
            <button className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700" onClick={() => closeDropdownAndGo("/admin/reports")}>Moderation</button>
            <button className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700" onClick={() => closeDropdownAndGo("/admin/videos")}>Video Moderation</button>
          </div>
        </details>
      )}
    </div>
  );

  return (
    <header ref={navRef} className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 dark:border-neutral-700 dark:bg-neutral-900/95 backdrop-blur transition-colors">
      <div className="container-page py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <button onClick={() => navigate("/")} className="text-xl font-bold text-primary-700 dark:text-primary-100 text-center sm:text-left">
          CyberShield
        </button>

        {!user ? <GuestNav /> : <UserNav />}
      </div>
    </header>
  );
}
