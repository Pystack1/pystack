import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaTrash, FaSearch, FaUserPlus, FaSortUp, FaSortDown } from "react-icons/fa";
import { api } from "@/services/api";
import { useToast } from "@/hooks/useToast";
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

type SortField = "email" | "full_name" | "created_at";
type SortOrder = "asc" | "desc";

export const Route = createFileRoute("/admin/approvals")({
  component: ApprovalsPage,
});

function ApprovalsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  
  const { showToast } = useToast();
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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const processedUsers = users
    .filter(u => 
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.full_name && u.full_name.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle nulls for names
      if (valA === null) valA = "";
      if (valB === null) valB = "";

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-navy dark:text-white">User Approvals</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage user access and roles</p>
        </div>
        
        {isSuperAdmin && (
          <button
            onClick={() => navigate({ to: "/admin/create-admin" })}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <FaUserPlus /> Create Admin
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-lg">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">Loading users...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          
          {/* TABLET & DESKTOP VIEW */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <SortableHeader 
                    label="User Details" 
                    field="full_name" 
                    currentField={sortField} 
                    order={sortOrder} 
                    onSort={handleSort} 
                  />
                  <th className="px-6 py-4">Roles</th>
                  <th className="px-6 py-4">Status</th>
                  <SortableHeader 
                    label="Registered" 
                    field="created_at" 
                    currentField={sortField} 
                    order={sortOrder} 
                    onSort={handleSort} 
                  />
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-900">
                {processedUsers.map((u) => (
                  <tr key={u.id} className="group hover:bg-indigo-50/50 dark:hover:bg-gray-700/40 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">
                          {u.full_name ? u.full_name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{u.full_name || "Unknown User"}</div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {u.roles.map((role, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.is_active ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${u.is_active ? "bg-green-500" : "bg-red-500"}`}></span>
                        {u.is_active ? "Active" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                        <ActionButton
                          onClick={() => handleToggleApproval(u)}
                          active={u.is_active}
                          title={u.is_active ? "Revoke Access" : "Grant Access"}
                        >
                          {u.is_active ? <FaTimes /> : <FaCheck />}
                        </ActionButton>
                        <ActionButton
                          onClick={() => handleDelete(u.id)}
                          active={false}
                          deleteBtn
                          title="Delete User"
                        >
                          <FaTrash />
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="md:hidden space-y-4 p-4">
            {processedUsers.map((u) => (
              <div key={u.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                
                {/* Card Header: Name & Status */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-sm">
                      {u.full_name ? u.full_name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-base">{u.full_name || "Unknown User"}</div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">{u.email}</div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.is_active ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
                    {u.is_active ? "Active" : "Pending"}
                  </span>
                </div>

                {/* Card Body: Details */}
                <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Roles:</span>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {u.roles.map((role, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Joined:</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {new Date(u.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Card Footer: Actions */}
                <div className="flex items-center justify-end gap-3 pt-2 mt-2 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => handleToggleApproval(u)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto justify-center ${
                      u.is_active 
                        ? "text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30" 
                        : "text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30"
                    }`}
                  >
                    {u.is_active ? <><FaTimes /> Revoke</> : <><FaCheck /> Approve</>}
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="p-2 text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Empty State */}
          {processedUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
                <FaSearch className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No users found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1">
                We couldn't find any users matching your search criteria.
              </p>
              {search && (
                <button 
                  onClick={() => setSearch("")}
                  className="mt-4 text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* --- Subcomponents for cleaner code --- */

interface SortableHeaderProps {
  label: string;
  field: SortField;
  currentField: SortField;
  order: SortOrder;
  onSort: (field: SortField) => void;
}

function SortableHeader({ label, field, currentField, order, onSort }: SortableHeaderProps) {
  const isActive = currentField === field;
  return (
    <th 
      className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors select-none group"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-2">
        {label}
        {isActive && (
          <span className="text-indigo-600 dark:text-indigo-400">
            {order === "asc" ? <FaSortUp /> : <FaSortDown />}
          </span>
        )}
        {!isActive && (
          <FaSortUp className="text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </th>
  );
}

interface ActionButtonProps {
  onClick: () => void;
  active: boolean; // true = green or red primary action
  children: React.ReactNode;
  title: string;
  deleteBtn?: boolean;
}

function ActionButton({ onClick, active, children, title, deleteBtn = false }: ActionButtonProps) {
  let baseClasses = "p-2 rounded-lg transition-all duration-200 flex items-center justify-center";
  let colorClasses = "";

  if (deleteBtn) {
    colorClasses = "text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-gray-500";
  } else if (active) {
    // Used for Revoke (Red)
    colorClasses = "text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300 dark:border-red-900 dark:hover:bg-red-900/20";
  } else {
    // Used for Approve (Green)
    colorClasses = "text-green-600 border border-green-200 hover:bg-green-50 hover:border-green-300 dark:border-green-900 dark:hover:bg-green-900/20";
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${colorClasses}`}
      title={title}
    >
      {children}
    </button>
  );
}