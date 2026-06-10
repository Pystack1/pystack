import { useEffect, useState } from "react";
import { FaMoon, FaSun, FaSignOutAlt, FaBars } from "react-icons/fa";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "@tanstack/react-router";

interface TopNavbarProps {
  onMenuClick: () => void;
}

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  // FIX: Get 'user' from store, then access email from user
  const { user, logout } = useAuthStore();
  const email = user?.email;

  const navigate = useNavigate();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );

      setCurrentDate(
        now.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      );
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleDarkMode = () => {
    const dark = document.documentElement.classList.toggle("dark");
    setIsDark(dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/login", replace: true });
  };

  return (
    <header className="bg-card/95 backdrop-blur border-b border-border px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between h-full w-full shadow-sm">
      {/* Left Side */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile Hamburger */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
        >
          <FaBars className="text-lg" />
        </button>

        {/* Logo */}
        <h1
          className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent leading-none"
          style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.5px" }}
        >
          Pystack Academy
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Date & Time: Hidden on very small screens, shown on sm+ */}
        <div className="hidden sm:flex flex-col text-right leading-tight">
          <span className="text-xs sm:text-sm font-semibold text-navy tracking-tight">
            {currentTime}
          </span>
          <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
            {currentDate}
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors hover:text-primary"
        >
          {isDark ? <FaSun /> : <FaMoon />}
        </button>

        {/* User Profile - Simplified on mobile */}
        <div className="flex items-center gap-2 sm:gap-3 border-l border-border pl-2 sm:pl-4">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center font-bold shadow-md text-xs sm:text-sm">
            {email?.charAt(0).toUpperCase() || "A"}
          </div>

          <div className="hidden sm:block leading-tight">
            <p className="text-xs sm:text-sm font-medium text-navy truncate max-w-[100px]">
              {email || "Admin"}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Administrator
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
            title="Logout"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </header>
  );
}