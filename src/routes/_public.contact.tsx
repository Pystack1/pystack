import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhoneAlt, FaMapMarkedAlt, FaCheckCircle } from "react-icons/fa"; // Changed to Alt versions for better visuals
import { api } from "@/services/api";

// Interface for the new Course structure
interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  skills: string;
  price: number;
  published: boolean;
}

export const Route = createFileRoute("/_public/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Pystack Academy" },
      { name: "description", content: "Get in touch with Pystack Academy for course enquiries and admissions." },
      { property: "og:title", content: "Contact Pystack Academy" },
      { property: "og:description", content: "Get in touch for course enquiries and admissions." },
    ],
  }),
  component: Contact,
});

function Contact() {
  // 1. Fetch courses from DB instead of Store
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await api.get<Course[]>("/courses/");
        // Only show published courses in the dropdown
        setCourses(data.filter((c) => c.published));
      } catch (err) {
        console.error("Failed to load courses:", err);
      }
    };
    loadCourses();
  }, []);

  const [form, setForm] = useState({ fullName: "", email: "", mobile: "", course: "", message: "" });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim() || form.fullName.length > 100) e.fullName = "Enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Enter a valid 10-digit mobile";
    if (!form.course) e.course = "Select a course";
    if (!form.message.trim() || form.message.length > 1000) e.message = "Enter a message (max 1000 chars)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post("/enquiries/", {
        name: form.fullName,
        email: form.email,
        mobile: form.mobile,
        message: form.message,
        course_id: undefined,
      });
      setSuccess(true);
      setForm({ fullName: "", email: "", mobile: "", course: "", message: "" });
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : "Failed to submit enquiry" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="bg-gradient-hero text-navy-foreground py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold">Get in Touch</h1>
          <p className="mt-3 text-navy-foreground/80 max-w-2xl">Have a question? Send us a message and our team will get back to you within 24 hours.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-5 gap-8">
          {/* Left Side: Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {[
              { 
                icon: FaMapMarkedAlt, 
                label: "Visit Us", 
                value: "Ashwath Nagar, 30, 1st cross,1st main, Ashwath nagar, Upstairs of punari chai, marathahalli, Bengaluru-560037" 
              },
              { 
                icon: FaPhoneAlt, 
                label: "Call Us", 
                value: "+91 8618415182 , 8660298124" 
              },
              { 
                icon: FaEnvelope, 
                label: "Email Us", 
                value: "pystackacademy.in@gmail.com" 
              },
            ].map((c, i) => (
              <motion.div 
                key={c.label} 
                initial={{ opacity: 0, x: -20 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.15)" }} // 2. Added Hover Lift
                viewport={{ once: true }} 
                transition={{ delay: i * 0.08, type: "spring", stiffness: 300 }} // Bouncy animation
                className="group p-6 rounded-2xl bg-card border border-border flex items-start gap-5 cursor-default transition-all duration-300"
              >
                {/* 1. Improved Symbol Design */}
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary-hover shadow-lg shadow-primary/30 grid place-items-center text-white text-xl group-hover:scale-110 transition-transform duration-300">
                  <c.icon />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{c.label}</div>
                  <div className="mt-1 text-navy font-medium leading-snug break-words group-hover:text-primary transition-colors">{c.value}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Side: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            {/* 3. New Card Design with Subtle Gradient Border */}
            <div className="relative p-[1px] rounded-3xl bg-gradient-to-b from-border to-transparent shadow-2xl">
                <div className="bg-card rounded-[21px] p-8 lg:p-10 space-y-6">
                  <motion.form onSubmit={submit} className="space-y-5">
                    {success && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-4 rounded-xl bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                        <FaCheckCircle /> Enquiry submitted successfully. We'll be in touch soon!
                      </motion.div>
                    )}

                    {errors.submit && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
                        {errors.submit}
                      </motion.div>
                    )}

                    <Field label="Full Name" error={errors.fullName}>
                      <input className={inputCls(errors.fullName)} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} maxLength={100} disabled={loading} />
                    </Field>
                    
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field label="Email" error={errors.email}>
                        <input type="email" className={inputCls(errors.email)} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} disabled={loading} />
                      </Field>
                      <Field label="Mobile" error={errors.mobile}>
                        <input className={inputCls(errors.mobile)} value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })} disabled={loading} />
                      </Field>
                    </div>
                    
                    <Field label="Interested Course" error={errors.course}>
                      <select className={inputCls(errors.course)} value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} disabled={loading}>
                        <option value="">Select a course</option>
                        {courses.map((c) => <option key={c.id} value={c.title}>{c.title}</option>)}
                      </select>
                    </Field>

                    <Field label="Message" error={errors.message}>
                      <textarea rows={4} className={inputCls(errors.message)} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={1000} disabled={loading} />
                    </Field>

                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit" 
                      disabled={loading} 
                      className="w-full py-4 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? "Submitting..." : "Send Enquiry"}
                    </motion.button>
                  </motion.form>
                </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-bold text-navy block mb-2 tracking-wide">{label}</label>
      {children}
      {error && <div className="mt-1.5 text-xs font-semibold text-destructive flex items-center gap-1"><span>•</span> {error}</div>}
    </div>
  );
}

function inputCls(err?: string) {
  return `w-full px-4 py-3 rounded-xl bg-background border ${err ? "border-destructive ring-2 ring-destructive/10" : "border-border"} focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-base disabled:opacity-50 placeholder:text-muted-foreground/50`;
}