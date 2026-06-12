import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/authStore";
import { FaUserPlus, FaSearch, FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";

interface Admin {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
}

export const Route = createFileRoute("/admin/create-admin")({
  component: CreateAdminPage,
});

function CreateAdminPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Data
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Redirect if not SuperAdmin
  useEffect(() => {
    const isSuperAdmin = user?.roles?.includes("SuperAdmin");
    if (!isSuperAdmin) {
      showToast("Access denied. SuperAdmin only.", "error");
      navigate({ to: "/admin/approvals" });
    }
  }, [user, navigate, showToast]);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const data = await api.get<Admin[]>("/auth/admins");
      setAdmins(data);
    } catch (err: any) {
      showToast(err.message || "Failed to fetch admins", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsEditMode(false);
    setEditId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (admin: Admin) => {
    setEmail(admin.email);
    setFullName(admin.full_name || "");
    setPassword("");
    setConfirmPassword("");
    setIsEditMode(true);
    setEditId(admin.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEditMode && password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    if (!isEditMode && password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    setSubmitLoading(true);
    try {
      if (isEditMode && editId) {
        const body: any = { full_name: fullName, email };
        if (password) body.password = password;
        await api.put(`/auth/admins/${editId}`, body);
        showToast("Admin updated successfully!", "success");
      } else {
        await api.post("/auth/create-admin", { email, password, full_name: fullName });
        showToast("Admin created successfully!", "success");
      }
      closeModal();
      fetchAdmins();
    } catch (err: any) {
      showToast(err.message || "Failed to save admin", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    try {
      await api.delete(`/auth/admins/${id}`);
      showToast("Admin deleted successfully!", "success");
      fetchAdmins();
    } catch (err: any) {
      showToast(err.message || "Failed to delete admin", "error");
    }
  };

  const filteredAdmins = admins.filter((a) =>
    a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.full_name && a.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy dark:text-white">Admin Management</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors"
        >
          <FaUserPlus /> Create Admin
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search admins by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

    {/* Admins Table - Horizontal Scroll on All Screens */}
{loading ? (
  <div className="text-center py-10">Loading...</div>
) : (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] text-sm">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">ID</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Full Name</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Email</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Status</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Created</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {filteredAdmins.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No admins found</td>
            </tr>
          ) : (
            filteredAdmins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 whitespace-nowrap">{admin.id}</td>
                <td className="px-4 py-3 whitespace-nowrap">{admin.full_name || "-"}</td>
                <td className="px-4 py-3 whitespace-nowrap">{admin.email}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${admin.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {admin.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{new Date(admin.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(admin)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(admin.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-navy dark:text-white mb-4">
              {isEditMode ? "Edit Admin" : "Create New Admin"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2.5 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2.5 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  {isEditMode ? "New Password (leave blank to keep current)" : "Password"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 p-2.5 pr-10 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                    required={!isEditMode}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              {!isEditMode && (
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 p-2.5 pr-10 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {submitLoading ? "Saving..." : isEditMode ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}