import { Outlet, useNavigate } from "@tanstack/react-router";
// 1. Ensure these paths are correct. 
// If you named your files Sidebar.tsx and TopNavbar.tsx, use these imports:
import {Sidebar} from "@/components/dashboard/Sidebar"; 
import {TopNavbar} from "@/components/dashboard/TopNavbar";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

export function AdminLayout() {
  // 2. Remove 'hydrated'. Zustand persist middleware syncs state automatically.
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // 3. Simple check: If user exists and is not authenticated (or null), redirect.
    // We check for 'user' instead of just 'isAuthenticated' because 
    // persist middleware ensures data is loaded before we render.
    if (!user) {
      navigate({ to: "/login", replace: true });
    }
  }, [user, navigate]);

  // 4. If user is missing, show nothing (loading state) to prevent White Screen flicker
  if (!user) {
    return null; 
  }

  return (
    <div className="flex h-screen w-screen bg-secondary/40 overflow-hidden">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-shrink-0 z-40">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        {/* Drawer */}
        <div className={`absolute top-0 left-0 h-full w-64 bg-sidebar transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Pass closeSidebar prop if your Sidebar component expects it */}
          <Sidebar closeSidebar={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Right Side Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Navbar */}
        <div className="h-16 flex-shrink-0 z-30 bg-card">
          <TopNavbar onMenuClick={() => setSidebarOpen(true)} />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 pt-8 bg-secondary/20">
          <Outlet />
        </main>

      </div>
    </div>
  );
}