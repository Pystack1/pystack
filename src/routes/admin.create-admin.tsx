import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "@/services/api";
import { useToast } from "@/hooks/useToast";
// REMOVED: import { useToastStore } from "@/store/toastStore";
// REMOVED: import { ToastContainer } from "@/components/ui/ToastContainer";
import { FaUserPlus } from "react-icons/fa";

export const Route = createFileRoute("/admin/create-admin")({
  component: CreateAdminPage,
});

function CreateAdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  // REMOVED: const { toasts } = useToastStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("auth/create-admin", { 
        email, 
        password, 
        full_name: fullName
      });

      showToast("Admin created successfully!", "success");
      navigate({ to: "/admin/approvals" });
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to create admin", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      {/* REMOVED: <ToastContainer toasts={toasts} /> */}
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-lg">
            <FaUserPlus size={24} />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-navy dark:text-white">Create New Admin</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Add a new administrator to the system.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Full Name</label>
          <input 
            type="text" 
            className="w-full border border-gray-300 dark:border-gray-600 p-2.5 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary outline-none" 
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
          <input 
            type="email" 
            className="w-full border border-gray-300 dark:border-gray-600 p-2.5 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary outline-none" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Password</label>
          <input 
            type="password" 
            className="w-full border border-gray-300 dark:border-gray-600 p-2.5 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary outline-none" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            required 
          />
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> This account will be created with the <b>Admin</b> role and will require approval before they can log in.
            </p>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-primary/90 font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Admin"}
        </button>
      </form>
    </div>
  );
}