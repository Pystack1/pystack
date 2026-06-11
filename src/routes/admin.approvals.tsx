import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaTrash, FaSearch, FaUserPlus } from "react-icons/fa";
import { api } from "@/services/api";
import { useToast } from "@/hooks/useToast";
// REMOVED: import { useToastStore } from "@/store/toastStore";
// REMOVED: import { ToastContainer } from "@/components/ui/ToastContainer";
import { useAuthStore } from "@/store/authStore";

interface User {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  roles: string[];
  created_at: string;
  updated_at: string;
}

export const Route = createFileRoute("/admin/approvals")({
  component: ApprovalsPage,
});

function ApprovalsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { showToast } = useToast();
  // REMOVED: const { toasts } = useToastStore();
  const navigate = useNavigate();
  
  const currentUser = useAuthStore((state) => state.user);
  const isSuperAdmin = currentUser?.roles.includes("SuperAdmin");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.get<User[]>("/auth/users");
      setUsers(data);
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproval = async (user: User) => {
    try {
      const newStatus = !user.is_active;
      await api.put(`/auth/users/${user.id}`, {
        is_active: newStatus,
        roles: user.roles 
      });

      showToast(
        `User ${newStatus ? "Approved" : "Revoked"} successfully`, 
        "success"
      );
      fetchUsers();
    } catch (err: any) {
      showToast("Failed to update user status", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/auth/users/${id}`);
      showToast("User deleted successfully", "success");
      fetchUsers();
    } catch (err: any) {
      showToast("Failed to delete user", "error");
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.full_name && u.full_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 p-4">
       {/* REMOVED: <ToastContainer toasts={toasts} /> */}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-navy">User Approvals</h1>
        
        {isSuperAdmin && (
          <button
            onClick={() => navigate({ to: "/admin/create-admin" })}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors shadow-sm"
          >
            <FaUserPlus /> Create Admin
          </button>
        )}
      </div>

      <div className="relative max-w-md">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          placeholder="Search users by email or name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white dark:bg-gray-800"
        />
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">Loading users...</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3">User Details</th>
                <th className="px-6 py-3">Roles</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Registered</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{u.full_name || "N/A"}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {u.roles.map((role, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-200 border border-gray-200 dark:border-gray-500">
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${u.is_active ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800" : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"}`}>
                      {u.is_active ? "Active" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    <button
                      onClick={() => handleToggleApproval(u)}
                      className={`p-2 rounded-lg transition-colors border ${u.is_active ? "text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20" : "text-green-600 border-green-200 hover:bg-green-50 dark:border-green-900 dark:hover:bg-green-900/20"}`}
                      title={u.is_active ? "Revoke Access" : "Grant Access"}
                    >
                      {u.is_active ? <FaTimes /> : <FaCheck />}
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="p-2 text-gray-500 border border-gray-200 hover:bg-gray-100 rounded-lg dark:border-gray-600 dark:hover:bg-gray-700"
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}