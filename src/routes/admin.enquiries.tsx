import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaTrash, FaEnvelope, FaCalendar, FaPhone, FaBook } from "react-icons/fa"; // <-- Added FaPhone, FaBook
import { api } from "@/services/api";
import { useAuthStore } from "@/store/authStore";

interface Enquiry {
  id: number;
  name: string;
  email: string;
  mobile: string; // <-- Added
  message: string;
  course_id?: number;
  course_title?: string; // <-- Added
  created_at: string;
}

export const Route = createFileRoute("/admin/enquiries")({
  component: EnquiryManagement,
});

function EnquiryManagement() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Fetch enquiries on mount
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setLoading(true);
        const data = await api.get<Enquiry[]>("/enquiries/");
        setEnquiries(data);
      } catch (err) {
        console.error("Failed to load enquiries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, [hydrated]);

  // Filter Logic
  const list = useMemo(() => {
    return enquiries.filter((e) => {
      const matchesSearch = (e.name + e.message + e.email + (e.course_title || ""))
        .toLowerCase()
        .includes(q.toLowerCase());

      let matchesDate = true;
      if (dateFilter) {
        const selectedDate = new Date(dateFilter).setHours(0,0,0,0);
        const enquiryDate = new Date(e.created_at).setHours(0,0,0,0);
        matchesDate = enquiryDate >= selectedDate;
      }

      return matchesSearch && matchesDate;
    });
  }, [enquiries, q, dateFilter]);

  // FIX: Properly update state after delete
  const deleteEnquiry = async (id: number) => {
    if (!confirm("Delete this enquiry?")) return;
    try {
      await api.delete(`/enquiries/${id}`);
      // Remove from state immediately
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Failed to delete enquiry:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy">Enquiry Management</h1>
        <p className="mt-1 text-sm sm:text-base text-muted-foreground">All contact form submissions in one place.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 max-w-4xl w-full">
        <div className="relative flex-1 w-full">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
          <input 
            value={q} 
            onChange={(e) => setQ(e.target.value)} 
            placeholder="Search name, email, message or course..."
            className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" 
          />
        </div>

        <div className="relative w-full sm:w-64">
          <FaCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
          <input 
            type="date" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Loading enquiries...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {list.map((e) => (
            <motion.div 
              key={e.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-navy truncate">{e.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {new Date(e.created_at).toLocaleString(undefined, { 
                      year: 'numeric', month: 'short', day: 'numeric', 
                      hour: '2-digit', minute: '2-digit' 
                    })}
                  </div>
                </div>
                <button 
                  onClick={() => deleteEnquiry(e.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors flex-shrink-0"
                >
                  <FaTrash />
                </button>
              </div>

              <div className="mt-3 space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-foreground/80">
                  <FaEnvelope className="text-primary text-xs flex-shrink-0" /> 
                  <span className="truncate">{e.email}</span>
                </div>
                {/* Mobile Number */}
                <div className="flex items-center gap-2 text-foreground/80">
                  <FaPhone className="text-green-600 text-xs flex-shrink-0" /> 
                  <span>{e.mobile}</span>
                </div>
                {/* Course Title */}
                {e.course_title && (
                  <div className="flex items-center gap-2 text-foreground/80">
                    <FaBook className="text-indigo-600 text-xs flex-shrink-0" /> 
                    <span className="font-medium text-indigo-600">{e.course_title}</span>
                  </div>
                )}
              </div>

              <p className="mt-3 text-sm text-foreground/70 leading-relaxed border-t border-border pt-3">
                {e.message}
              </p>
            </motion.div>
          ))}
          {list.length === 0 && (
            <div className="col-span-1 sm:col-span-2 text-center py-16 text-muted-foreground">
              No enquiries found matching your filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}