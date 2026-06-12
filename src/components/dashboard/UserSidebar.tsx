import { Link } from "@tanstack/react-router";
import { 
  FaHome, 
  FaBook, 
  FaEnvelope, 
  FaUser, 
  FaSignOutAlt,
  FaChalkboardTeacher 
} from "react-icons/fa";
import { useAuthStore } from "@/store/authStore";
import logo from "@/assets/pystack_logo.png"; // <-- import logo

const menuItems = [
  { to: "/user/dashboard", label: "Dashboard", icon: FaHome },
  { to: "/user/profile", label: "My Profile", icon: FaUser },
  { to: "/user/courses", label: "My Courses", icon: FaBook },
  { to: "/user/enquiries", label: "My Enquiries", icon: FaEnvelope },
  { to: "/user/assignments", label: "Assignments", icon: FaChalkboardTeacher },
];

interface UserSidebarProps {
  closeSidebar?: () => void;
}

export default function UserSidebar({ closeSidebar }: UserSidebarProps) {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const handleLinkClick = () => {
    if (closeSidebar) {
      closeSidebar();
    }
  };

  return (
    <div className="w-64 h-screen flex flex-col shadow-lg z-20 bg-white dark:bg-slate-900 border-r border-border">
      {/* Header / Logo */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          {/* Logo replaces "P" */}
          <img 
            src={logo} 
            alt="Pystack" 
            className="w-13 h-13 rounded-xl object-cover shadow-lg"
          />
          <div>
            <h2 className="text-xl font-bold tracking-tight text-navy dark:text-white">Student</h2>
            <p className="text-xs text-muted-foreground">Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={handleLinkClick}
            className="group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground dark:text-slate-400 hover:text-navy dark:hover:text-white hover:bg-primary/5 transition-all duration-200"
            activeProps={{ 
              className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 font-semibold" 
            }}
          >
            <item.icon className="text-lg transition-transform group-hover:scale-110" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-border/50 bg-card/50 dark:bg-slate-800/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/20 transition-all"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}