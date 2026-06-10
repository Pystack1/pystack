import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FaBookOpen,
  FaEnvelopeOpenText,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useEffect } from "react";
import { useDashboardStore } from "@/store/dashboardStore";
// ... imports remain same
export const Route = createFileRoute("/admin/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { data, loading, fetchDashboard } = useDashboardStore();

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <div className="space-y-8 p-6"><h1 className="text-2xl font-bold">Dashboard</h1><p>Loading...</p></div>;
  if (!data) return <div className="space-y-8 p-6"><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-red-500">Failed to load.</p></div>;

  const stats = [
    { label: "Total Courses", value: data.total_courses, icon: FaBookOpen, color: "from-blue-500 to-indigo-600" },
    { label: "Total Enquiries", value: data.total_enquiries, icon: FaEnvelopeOpenText, color: "from-violet-500 to-purple-600" },
    { label: "Total Users", value: data.total_users, icon: FaCheckCircle, color: "from-emerald-500 to-teal-600" },
    { label: "Total Admins", value: data.total_admins, icon: FaTimesCircle, color: "from-rose-500 to-pink-600" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy">Dashboard</h1>
        <p className="mt-1 text-sm sm:text-base text-muted-foreground">Welcome back — here's what's happening at Pystack today.</p>
      </div>

      {/* 1. Stats Grid: Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-card"
          >
            <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br ${s.color} grid place-items-center text-white text-base sm:text-lg`}>
              <s.icon />
            </div>
            <div className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-bold text-navy">{s.value}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* 2. Lower Section: Stacked on mobile, Side-by-side on tablet+ */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-border">
          <h2 className="text-lg font-bold text-navy">Quick Stats</h2>
          <div className="mt-4 space-y-3">
             {/* Stats rows */}
            {[
              { label: "Total Courses", val: data.total_courses },
              { label: "Total Enquiries", val: data.total_enquiries },
              { label: "Total Users", val: data.total_users },
              { label: "Total Admins", val: data.total_admins },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <span className="text-sm">{stat.label}</span>
                <span className="font-bold text-sm sm:text-base">{stat.val}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-card border border-border">
          <h2 className="text-lg font-bold text-navy">System Status</h2>
          <div className="mt-4 space-y-3">
            <div className="p-3 rounded-lg bg-green-500/10 text-sm">Backend API Connected</div>
            <div className="p-3 rounded-lg bg-green-500/10 text-sm">Database Connected</div>
            <div className="p-3 rounded-lg bg-green-500/10 text-sm">Authentication Active</div>
          </div>
        </div>
      </div>
    </div>
  );
}