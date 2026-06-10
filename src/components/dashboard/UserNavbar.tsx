import { useEffect, useState } from "react";
import { FaMoon, FaSun, FaSignOutAlt, FaBars } from "react-icons/fa";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "@tanstack/react-router";

interface UserNavbarProps {
  onMenuClick?: () => void;
}

export default function UserNavbar({ onMenuClick }: UserNavbarProps) {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const email = user?.email;
  const name = user?.full_name || "Student";

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
    <header className="bg-card/95 backdrop-blur border-b border-border px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between h-16 w-full shadow-sm relative z-30">
      {/* Left Side */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
        >
          <FaBars className="text-lg" />
        </button>

        <h1
          className="text-xl sm:text-2xl font-extrabold tracking-wide bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent leading-none"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Pystack Academy
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Date & Time */}
        <div className="hidden sm:flex flex-col text-right leading-tight">
          <span className="text-xs sm:text-sm font-semibold text-navy dark:text-white tracking-tight">
            {currentTime}
          </span>
          <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
            {currentDate}
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors hover:text-emerald-600"
        >
          {isDark ? <FaSun /> : <FaMoon />}
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 border-l border-border pl-2 sm:pl-4">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold shadow-md text-xs sm:text-sm">
            {name?.charAt(0).toUpperCase() || "S"}
          </div>

          <div className="hidden sm:block leading-tight">
            <p className="text-xs sm:text-sm font-medium text-navy dark:text-white truncate max-w-[100px]">
              {name}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate max-w-[100px]">
              {email}
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