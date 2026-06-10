import { Link, useNavigate } from "@tanstack/react-router";
import { 
  FaTachometerAlt, 
  FaBookOpen, 
  FaEnvelopeOpenText, 
  FaSignOutAlt, 
  FaHome, 
  FaTimes 
} from "react-icons/fa";
import { useAuthStore } from "@/store/authStore";

const items = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  { to: "/admin/courses", label: "Courses", icon: FaBookOpen },
  { to: "/admin/enquiries", label: "Enquiries", icon: FaEnvelopeOpenText },
] as const;

interface SidebarProps {
  closeSidebar?: () => void;
}

export function Sidebar({ closeSidebar }: SidebarProps) {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const handleLinkClick = () => {
    if (closeSidebar) closeSidebar();
  };

  return (
    <aside className="w-full h-full bg-sidebar text-sidebar-foreground flex flex-col shadow-xl">
      {/* 1. Brand Header (Top) */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center text-primary-foreground font-bold text-sm">
            P
          </span>
          <span className="font-display font-bold text-sm sm:text-base">Admin Portal</span>
        </div>
        {/* Close Button for Mobile Drawer only */}
        {closeSidebar && (
          <button 
            onClick={closeSidebar} 
            className="md:hidden text-muted-foreground hover:text-white"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* 2. Navigation Menu (Middle) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        <nav className="space-y-1">
          {items.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={handleLinkClick}
              activeProps={{ 
                className: "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
              }}
              inactiveProps={{ 
                className: "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:translate-x-1 transition-all" 
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Icon className="flex-shrink-0 w-5 h-5" /> 
              <span className="truncate">{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* 3. Bottom Actions (View Site & Logout) */}
      <div className="flex-shrink-0 border-t border-sidebar-border bg-sidebar-accent/20">
        <div className="p-4 space-y-1">
          
          {/* View Site */}
          <Link 
            to="/" 
            onClick={handleLinkClick} 
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-primary transition-colors w-full"
          >
            <FaHome className="flex-shrink-0 w-5 h-5" /> 
            <span className="truncate">View Site</span>
          </Link>

          {/* Logout */}
          <button
            onClick={() => {
              handleLogout();
              if(closeSidebar) closeSidebar();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/80 hover:bg-destructive/10 hover:text-destructive transition-colors text-left group"
          >
            <FaSignOutAlt className="flex-shrink-0 w-5 h-5 group-hover:rotate-180 transition-transform duration-500" /> 
            <span className="truncate">Logout</span>
          </button>

        </div>
      </div>
    </aside>
  );
}