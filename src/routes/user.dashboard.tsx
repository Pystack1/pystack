import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaBook,
  FaCheckCircle,
  FaRegClock,
  FaCertificate,
  FaBell,
  FaPlayCircle,
  FaUser,
  FaEnvelope,
  FaClock,
  FaChartLine,
} from "react-icons/fa";
import { useAuthStore } from "@/store/authStore";

export const Route = createFileRoute("/user/dashboard")({
  component: UserDashboard,
});

function UserDashboard() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const stats = [
    { label: "Enrolled", value: "3", icon: FaBook, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Completed", value: "1", icon: FaCheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "In Progress", value: "2", icon: FaRegClock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Certificates", value: "0", icon: FaCertificate, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  const courses = [
    { id: 1, title: "Python Fullstack", progress: 65, total: 40, done: 26 },
    { id: 2, title: "Data Engineering", progress: 30, total: 35, done: 10 },
    { id: 3, title: "Data Science", progress: 0, total: 50, done: 0 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">
            Welcome, {user?.full_name || "Student"}! 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">Continue your learning journey</p>
        </div>
        <button className="relative p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <FaBell className="text-gray-600 dark:text-gray-300" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm"
          >
            <div className={`inline-flex p-2 rounded-lg ${s.bg} mb-2`}>
              <s.icon className={`text-lg ${s.color}`} />
            </div>
            <div className="text-xl font-bold text-navy dark:text-white">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Courses */}
      <div>
        <h2 className="text-lg font-bold text-navy dark:text-white mb-3">My Courses</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm"
            >
              <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <FaBook className="text-3xl text-white/30" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm text-navy dark:text-white mb-2">{c.title}</h3>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{c.done}/{c.total} lessons</span>
                  <span className="font-medium text-indigo-600">{c.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 mb-3">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${c.progress}%` }}></div>
                </div>
                <button
                  onClick={() => window.location.href = "/user/courses"}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-indigo-100 transition-colors"
                >
                  <FaPlayCircle /> {c.progress === 0 ? "Start" : "Continue"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "My Profile", icon: FaUser, path: "/user/profile", color: "bg-green-50 text-green-600" },
          { label: "Enquiries", icon: FaEnvelope, path: "/user/enquiries", color: "bg-blue-50 text-blue-600" },
          { label: "Assignments", icon: FaClock, path: "/user/assignments", color: "bg-amber-50 text-amber-600" },
          { label: "All Courses", icon: FaChartLine, path: "/courses", color: "bg-purple-50 text-purple-600" },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => window.location.href = item.path}
            className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <div className={`p-2 rounded-lg ${item.color}`}>
              <item.icon />
            </div>
            <span className="text-sm font-medium text-navy dark:text-white">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}