import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const dailyCoins = Number(user?.dailyCoins || 0);
  const dailyCap = 100;
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

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const publicLinks = [
    { label: "AI", path: "/ai" },
    { label: "Articles", path: "/articles" },
    { label: "Forum", path: "/forum" },
  ];

  return (
    <header ref={navRef} className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <button onClick={() => navigate("/")} className="text-xl font-bold text-blue-700 text-center sm:text-left">
          CyberShield
        </button>

        {!user ? (
          <div className="w-full sm:w-auto flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3 text-sm">
            {publicLinks.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="text-slate-700 hover:text-blue-700 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button onClick={() => navigate("/login")} className="text-slate-700 hover:text-blue-700 transition-colors">Login</button>
            <button onClick={() => navigate("/register")} className="btn btn-primary text-sm">Get Started</button>
          </div>
        ) : (
          <div className="w-full sm:w-auto flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3 text-sm">
            <button onClick={() => navigate("/dashboard")} className="hover:text-blue-700">Dashboard</button>
            <button onClick={() => navigate("/ai")} className="hover:text-blue-700">AI</button>

            <span className="font-semibold text-amber-600">
              🪙 {Number(user.coins || 0)}
              <span className="ml-2 text-xs text-slate-500">Today: {dailyCoins}/{dailyCap}</span>
            </span>

            <details className="relative" open={activeDropdown === "activity"}>
              <summary
                className="cursor-pointer list-none hover:text-blue-700"
                onClick={(e) => {
                  e.preventDefault();
                  toggleDropdown("activity");
                }}
              >
                Activity
              </summary>
              <div className="absolute right-0 mt-2 w-44 rounded border border-slate-200 bg-white shadow z-10">
                <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => {
                  setActiveDropdown(null);
                  navigate("/create-report");
                }}>Create Report</button>
                <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => {
                  setActiveDropdown(null);
                  navigate("/reports");
                }}>Reports</button>
                <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => {
                  setActiveDropdown(null);
                  navigate("/forum");
                }}>Forum</button>
              </div>
            </details>

            <details className="relative" open={activeDropdown === "learn"}>
              <summary
                className="cursor-pointer list-none hover:text-blue-700"
                onClick={(e) => {
                  e.preventDefault();
                  toggleDropdown("learn");
                }}
              >
                Learn
              </summary>
              <div className="absolute right-0 mt-2 w-44 rounded border border-slate-200 bg-white shadow z-10">
                <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => {
                  setActiveDropdown(null);
                  navigate("/articles");
                }}>Knowledge Hub</button>
                <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => {
                  setActiveDropdown(null);
                  navigate("/videos");
                }}>Video Hub</button>
                <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => {
                  setActiveDropdown(null);
                  navigate("/memes");
                }}>Meme Hub</button>
                <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => {
                  setActiveDropdown(null);
                  navigate("/videos/submit");
                }}>Submit Video</button>
                <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => {
                  setActiveDropdown(null);
                  navigate("/memes/upload");
                }}>Upload Meme</button>
                <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => {
                  setActiveDropdown(null);
                  navigate("/games");
                }}>Phishing Detector Game</button>
              </div>
            </details>

            <details className="relative" open={activeDropdown === "account"}>
              <summary
                className="cursor-pointer list-none hover:text-blue-700"
                onClick={(e) => {
                  e.preventDefault();
                  toggleDropdown("account");
                }}
              >
                Account
              </summary>
              <div className="absolute right-0 mt-2 w-36 rounded border border-slate-200 bg-white shadow z-10">
                <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => {
                  setActiveDropdown(null);
                  navigate("/profile");
                }}>Profile</button>
                <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => {
                  setActiveDropdown(null);
                  navigate("/settings");
                }}>Settings</button>
              </div>
            </details>

            {isAdmin && (
              <details className="relative" open={activeDropdown === "admin"}>
                <summary
                  className="cursor-pointer list-none hover:text-blue-700"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown("admin");
                  }}
                >
                  Admin
                </summary>
                <div className="absolute right-0 mt-2 w-44 rounded border border-slate-200 bg-white shadow z-10">
                  <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => {
                    setActiveDropdown(null);
                    navigate("/admin");
                  }}>Admin Dashboard</button>
                  <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => {
                    setActiveDropdown(null);
                    navigate("/admin/users");
                  }}>Manage Users</button>
                  <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => {
                    setActiveDropdown(null);
                    navigate("/admin/reports");
                  }}>Moderation</button>
                  <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => {
                    setActiveDropdown(null);
                    navigate("/admin/videos");
                  }}>Video Moderation</button>
                </div>
              </details>
            )}

            <button onClick={logout} className="text-red-500 hover:text-red-600">Logout</button>
          </div>
        )}

        {user && Number(user.coins || 0) < 3 && (
          <p className="text-red-500 text-xs text-center sm:text-right w-full sm:w-auto">
            Low coins! Earn more by engaging.
          </p>
        )}

        {user && dailyCoins >= dailyCap && (
          <p className="text-amber-600 text-xs text-center sm:text-right w-full sm:w-auto">
            Daily earn cap reached. More rewards unlock tomorrow.
          </p>
        )}
      </div>
    </header>
  );
}
