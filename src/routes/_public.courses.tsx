import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaClock, FaCode } from "react-icons/fa";
import { api } from "@/services/api";

interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  skills: string;
  price: number;
  published: boolean;
}

export const Route = createFileRoute("/_public/courses")({
  head: () => ({
    meta: [
      { title: "Courses — Pystack Academy" },
      { name: "description", content: "Browse industry-oriented training programs from Pystack Academy." },
      { property: "og:title", content: "Courses at Pystack Academy" },
      { property: "og:description", content: "Browse industry-oriented training programs." },
    ],
  }),
  component: Courses,
});

function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"All" | "Active" | "Inactive">("Active");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await api.get<Course[]>("/courses/");
        setCourses(data);
      } catch (err) {
        console.error("Failed to load courses:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const list = useMemo(() => {
    return courses.filter((c) => {
      const matchesQ = (c.title + c.description + c.skills + c.duration)
        .toLowerCase()
        .includes(q.toLowerCase());
      const matchesF = filter === "All" ? true : (c.published ? "Active" : "Inactive") === filter;
      return matchesQ && matchesF;
    });
  }, [courses, q, filter]);

  return (
    <div>
      <section className="bg-gradient-hero text-navy-foreground py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold">Our Courses</h1>
          <p className="mt-3 text-navy-foreground/80 max-w-2xl">Industry-aligned programs taught by experienced engineers.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="flex gap-2">
              {(["All", "Active", "Inactive"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground/70 hover:border-primary"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="mt-10 text-center py-16 text-muted-foreground">Loading courses...</div>
          ) : (
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 shadow-card hover:shadow-elegant transition-all flex flex-col"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">{c.duration}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {c.published ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-bold text-navy">{c.title}</h3>
                  <p className="mt-3 text-sm text-foreground/70 line-clamp-3">{c.description}</p>
                  
                  <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <FaCode className="text-primary" /> <span className="line-clamp-1">{c.skills}</span>
                    </div>
                    <div className="flex items-center gap-2"><FaClock className="text-primary" /> Self-paced</div>
                  </div>
                  
                  <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
                    <div className="text-2xl font-bold text-navy">₹{c.price.toLocaleString()}</div>
                    <Link to="/contact" className="text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground shadow-elegant hover:scale-105 transition-transform">
                      Enquire
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && list.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">No courses found.</div>
          )}
        </div>
      </section>
    </div>
  );
}