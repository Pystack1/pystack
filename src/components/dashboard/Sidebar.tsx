import { Link, useNavigate } from "@tanstack/react-router";
import { 
  FaTachometerAlt, 
  FaBookOpen, 
  FaEnvelopeOpenText, 
  FaSignOutAlt, 
  FaHome, 
  FaTimes,
  FaUserCheck,
  FaUserPlus
} from "react-icons/fa";
import { useAuthStore } from "@/store/authStore";
import logo from "@/assets/pystack_logo.png"; // <-- import logo

const items = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  { to: "/admin/courses", label: "Courses", icon: FaBookOpen },
  { to: "/admin/enquiries", label: "Enquiries", icon: FaEnvelopeOpenText },
  { to: "/admin/approvals", label: "Approvals", icon: FaUserCheck }, 
] as const;

interface SidebarProps {
  closeSidebar?: () => void;
}

export function Sidebar({ closeSidebar }: SidebarProps) {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  
  const user = useAuthStore((s) => s.user);
  const isSuperAdmin = user?.roles.includes("SuperAdmin");

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const handleLinkClick = () => {
    if (closeSidebar) closeSidebar();
  };

  return (
    <aside className="w-full h-full bg-sidebar text-sidebar-foreground flex flex-col shadow-xl">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* Logo replaces "P" */}
          <img 
            src={logo} 
            alt="Pystack" 
            className="h-13 w-13 rounded-lg object-cover"
          />
          <span className="font-display font-bold text-sm sm:text-base">Admin Portal</span>
        </div>
        {closeSidebar && (
          <button 
            onClick={closeSidebar} 
            className="md:hidden text-muted-foreground hover:text-white"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
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

          {isSuperAdmin && (
            <Link
              to="/admin/create-admin"
              onClick={handleLinkClick}
              activeProps={{ 
                className: "bg-indigo-600 text-white shadow-md" 
              }}
              inactiveProps={{ 
                className: "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:translate-x-1 transition-all font-semibold" 
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mt-4 border border-indigo-200 dark:border-indigo-800"
            >
              <FaUserPlus className="flex-shrink-0 w-5 h-5" /> 
              <span className="truncate">Create Admin</span>
            </Link>
          )}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="flex-shrink-0 border-t border-sidebar-border bg-sidebar-accent/20">
        <div className="p-4 space-y-1">
          <Link 
            to="/" 
            onClick={handleLinkClick} 
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-primary transition-colors w-full"
          >
            <FaHome className="flex-shrink-0 w-5 h-5" /> 
            <span className="truncate">View Site</span>
          </Link>

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