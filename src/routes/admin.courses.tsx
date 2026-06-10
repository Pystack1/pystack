import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes } from "react-icons/fa";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/authStore";

// 1. Updated Course Interface
interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  skills: string;
  price: number;
  published: boolean;
}

// 2. Updated FormState
type FormState = Omit<Course, "id">;

const empty: FormState = {
  title: "",
  description: "",
  duration: "",
  skills: "",
  price: 0,
  published: true,
};

export const Route = createFileRoute("/admin/courses")({
  component: CourseManagement,
});

function CourseManagement() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [submitting, setSubmitting] = useState(false);

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await api.get<Course[]>("/courses/");
        setCourses(data);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [hydrated]);

  // 4. Search Courses (Includes Skills)
  const list = useMemo(
    () =>
      courses.filter((c) =>
        (
          c.title +
          c.description +
          c.skills +
          c.duration
        )
          .toLowerCase()
          .includes(q.toLowerCase())
      ),
    [courses, q]
  );

  const openAdd = () => {
    setForm(empty);
    setEditing(null);
    setOpen(true);
  };

  // 3. Fixed openEdit (Includes Skills & setOpen)
  const openEdit = (c: Course) => {
    setForm({
      title: c.title,
      description: c.description,
      duration: c.duration,
      skills: c.skills,
      price: c.price,
      published: c.published,
    });

    setEditing(c.id);
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;

    setSubmitting(true);
    try {
      if (editing) {
        // Update existing course
        await api.put(`/courses/${editing}`, form);
        setCourses(courses.map((c) => (c.id === editing ? { ...form, id: editing } : c)));
      } else {
        // Create new course
        const newCourse = await api.post<Course>("/courses/", form);
        setCourses([newCourse, ...courses]);
      }
      setOpen(false);
    } catch (err) {
      console.error("Failed to save course:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCourse = async (id: number) => {
    if (!confirm("Delete this course?")) return;
    try {
      await api.delete(`/courses/${id}`);
      setCourses(courses.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete course:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy">Course Management</h1>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground">Add, edit and manage all training programs.</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground font-semibold shadow-elegant hover:scale-105 transition-transform text-sm"
        >
          <FaPlus /> Add Course
        </button>
      </div>

      <div className="relative max-w-md w-full">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search courses..."
          className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Loading courses...</div>
      ) : (
        <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
          {/* Responsive Table Wrapper */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              {/* 5. Updated Table Header */}
              <thead className="bg-secondary text-navy">
                <tr>
                  {[
                    "Title",
                    "Description",
                    "Skills",
                    "Duration",
                    "Price",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-border hover:bg-secondary/20 align-top"
                  >
                    {/* 6. Updated Table Body Order */}
                    <td className="px-4 py-4 font-semibold text-navy min-w-[180px]">
                      {c.title}
                    </td>

                    <td className="px-4 py-4 max-w-[300px] whitespace-pre-wrap break-words text-sm text-muted-foreground">
                      {c.description}
                    </td>

                    <td className="px-4 py-4 max-w-[300px] whitespace-pre-wrap break-words text-sm text-primary/80">
                      {c.skills}
                    </td>

                    <td className="px-4 py-4 min-w-[120px] whitespace-nowrap">
                      {c.duration}
                    </td>

                    <td className="px-4 py-4 font-medium whitespace-nowrap">
                      ₹{c.price.toLocaleString()}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          c.published
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {c.published ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(c)}
                          className="p-2 rounded-lg hover:bg-primary/10 text-primary"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() => deleteCourse(c.id)}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* 7. Updated Empty Row colSpan to 7 */}
                {list.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                      No courses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4"
            onClick={() => setOpen(false)}
          >
            <motion.form
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={save}
              className="w-full max-w-2xl bg-card rounded-2xl border border-border shadow-elegant p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-navy">
                  {editing ? "Edit Course" : "Add Course"}
                </h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-muted rounded-lg"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="grid gap-4">
                <FormRow label="Course Title">
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className={inputCls}
                    maxLength={200}
                  />
                </FormRow>
                <FormRow label="Description">
                  <textarea
                    rows={4}
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className={inputCls}
                    maxLength={1000}
                  />
                </FormRow>

                {/* 8. Added Skills Field in Modal */}
                <FormRow label="Skills">
                  <textarea
                    rows={3}
                    value={form.skills}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        skills: e.target.value,
                      })
                    }
                    placeholder="Java, Spring Boot, MySQL, React"
                    className={inputCls}
                  />
                </FormRow>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormRow label="Duration">
                    <input
                      required
                      value={form.duration}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          duration: e.target.value,
                        })
                      }
                      placeholder="6 Months"
                      className={inputCls}
                    />
                  </FormRow>
                  <FormRow label="Price (₹)">
                    <input
                      required
                      type="number"
                      min={0}
                      step={100}
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      className={inputCls}
                    />
                  </FormRow>
                </div>

                <FormRow label="Status">
                  <select
                    value={form.published ? "published" : "draft"}
                    onChange={(e) => setForm({ ...form, published: e.target.value === "published" })}
                    className={inputCls}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </FormRow>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-5 py-2.5 rounded-lg border border-border hover:bg-muted text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground font-semibold shadow-elegant disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editing ? "Update" : "Create"}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm";

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium text-navy block mb-1.5">{label}</label>
      {children}
    </div>
  );
}