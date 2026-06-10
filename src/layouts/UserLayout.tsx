import { Outlet } from "@tanstack/react-router";
import UserNavbar from "@/components/dashboard/UserNavbar";
import UserSidebar from "@/components/dashboard/UserSidebar";
import { useState } from "react";

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-secondary/40 overflow-hidden font-sans">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-shrink-0 z-40">
        {/* Desktop doesn't need closeSidebar prop */}
        <UserSidebar />
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        {/* Drawer */}
        <div className={`absolute top-0 left-0 h-full w-64 bg-white dark:bg-sidebar transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Mobile DOES need closeSidebar prop */}
          <UserSidebar closeSidebar={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Right Side Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Navbar */}
        <div className="h-16 flex-shrink-0 z-30 bg-card">
          <UserNavbar onMenuClick={() => setSidebarOpen(true)} />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 pt-8 bg-gradient-soft">
          <Outlet />
        </main>

      </div>
    </div>
  );
}