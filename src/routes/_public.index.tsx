import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { FaChalkboardTeacher, FaProjectDiagram, FaBriefcase, FaUserTie, FaLaptopCode, FaFileAlt, FaComments, FaArrowRight, FaCheckCircle, FaStar, FaQuoteRight } from "react-icons/fa";

import heroImg from "@/assets/hero.jpg";
import bannerPyFS from "@/assets/banner-pyfs.jpg";
import bannerDE from "@/assets/banner-de.jpg";
import bannerDA from "@/assets/banner-da.jpg";
import bannerDS from "@/assets/banner-ds.jpg";

import { api } from "@/services/api";
import Testimonials from "@/components/Testimonials";   // ← Add this line

// 1. Define Course Interface
interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  skills: string;
  price: number;
  published: boolean;
}

// 2. Define Review Interface
interface Review {
  id: number;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      { title: "Pystack Academy — Live Software Training & Placement Support" },
      { name: "description", content: "Become job-ready with live online classes, industry projects and dedicated placement support from expert trainers." },
      { property: "og:title", content: "Pystack Academy" },
      { property: "og:description", content: "Live online classes, industry projects and placement support." },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: Home,
});

const whyChoose = [
  { icon: FaUserTie, title: "Expert Trainers", text: "Learn from senior engineers with real industry experience." },
  { icon: FaChalkboardTeacher, title: "Online Classes", text: "Live interactive classes from anywhere — learn at your own pace." },
  { icon: FaLaptopCode, title: "Real-Time Projects", text: "Build production-grade projects that go on your resume." },
  { icon: FaProjectDiagram, title: "Industry Curriculum", text: "Curriculum aligned to what employers actually hire for." },
  { icon: FaBriefcase, title: "Placement Support", text: "End-to-end placement assistance until you get hired." },
  { icon: FaComments, title: "Interview Help", text: "Mock interviews, prep sessions and 1:1 feedback until you crack it." },
];

const features = [
  { icon: FaChalkboardTeacher, title: "Live Online Classes" },
  { icon: FaBriefcase, title: "Placement Assistance" },
  { icon: FaProjectDiagram, title: "Industry Projects" },
  { icon: FaFileAlt, title: "Resume Building" },
  { icon: FaComments, title: "Mock Interviews" },
  { icon: FaUserTie, title: "Interview Preparation" },
  { icon: FaStar, title: "Career Mentorship" },
];

const banners = [
  { img: bannerPyFS, title: "Python Fullstack", tag: "Python • Django • React • REST APIs" },
  { img: bannerDE, title: "Data Engineer", tag: "SQL • PySpark • Airflow • AWS" },
  { img: bannerDA, title: "Data Analyst", tag: "Excel • SQL • Power BI • Tableau" },
  { img: bannerDS, title: "Data Science", tag: "Python • ML • Deep Learning • AI" },
];

function Home() {
  const [bannerIdx, setBannerIdx] = useState(0);
  
  // Courses State
  const [courses, setCourses] = useState<Course[]>([]);

  // Reviews State & Logic
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 1. Banner Effect
  useEffect(() => {
    const t = setInterval(() => setBannerIdx((i) => (i + 1) % banners.length), 3000);
    return () => clearInterval(t);
  }, []);

  // 2. Fetch Courses
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await api.get<Course[]>("/courses/");
        setCourses(data.filter((c) => c.published));
      } catch (err) {
        console.error(err);
      }
    };
    loadCourses();
  }, []);

  // 3. Fetch Reviews
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await api.get<Review[]>("/reviews/");
        setReviews(data);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }
    };
    loadReviews();
  }, []);

  // 4. Automatic Scroll Logic (Every 3 seconds)
  useEffect(() => {
    if (reviews.length === 0) return;

    const interval = setInterval(() => {
      // Determine how many items are visible (Responsive)
      // Mobile: 1 visible, Tablet: 2, Desktop: 3
      const width = window.innerWidth;
      let itemsVisible = 1;
      if (width >= 1024) itemsVisible = 3;
      else if (width >= 768) itemsVisible = 2;

      // Calculate max scroll position to make it loop perfectly
      const maxIndex = reviews.length - itemsVisible;
      
      setCurrentReviewIndex((prev) => {
        const next = prev + 1;
        return next > maxIndex ? 0 : next;
      });

    }, 3000); // 3 Seconds

    return () => clearInterval(interval);
  }, [reviews.length]);

  // 5. Smooth Scroll Effect when index changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const itemWidth = 320 + 24; // Card width (320) + Gap (24)
      scrollContainerRef.current.scrollTo({
        left: currentReviewIndex * itemWidth,
        behavior: 'smooth'
      });
    }
  }, [currentReviewIndex]);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero text-navy-foreground">
        <div className="absolute inset-0 opacity-30">
          <img src={heroImg} alt="" className="w-full h-full object-cover mix-blend-overlay" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium backdrop-blur">
              <FaCheckCircle className="text-primary-glow" /> Live cohorts starting every month
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05]">
              Build a career in tech with <span className="text-primary-glow">Pystack Academy</span>
            </h1>
            <p className="mt-6 text-lg text-navy-foreground/80 max-w-xl">
              Live online classes, real industry projects, and dedicated placement support — everything you need to become job-ready.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-elegant hover:scale-105 transition-transform">
                Join Now <FaArrowRight />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 border border-white/20 text-navy-foreground font-semibold backdrop-blur hover:bg-white/20 transition-colors">
                Contact Us
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[["2K+","Students"],["100%","Placement"],["5+","Industry Courses"]].map(([n,l]) => (
                <div key={l}>
                  <div className="text-2xl sm:text-3xl font-bold text-primary-glow">{n}</div>
                  <div className="text-xs text-navy-foreground/70 mt-1">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-elegant border border-white/10 h-[480px] bg-navy">
              <AnimatePresence mode="wait">
                <motion.div
                  key={bannerIdx}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0"
                >
                  <img src={banners[bannerIdx].img} alt={banners[bannerIdx].title} className="w-full h-full object-cover" width={1024} height={768} />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-glow">{banners[bannerIdx].tag}</div>
                    <div className="mt-2 text-2xl font-bold text-white">{banners[bannerIdx].title}</div>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setBannerIdx(i)}
                    aria-label={`Show banner ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${i === bannerIdx ? "w-6 bg-primary-glow" : "w-1.5 bg-white/40"}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Why Pystack" title="Why Choose Pystack Academy" subtitle="Everything you need to make the leap into a tech career." />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoose.map((it, i) => (
              <motion.div
                key={it.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group p-7 rounded-2xl bg-card border border-border hover:border-primary/40 shadow-card hover:shadow-elegant transition-all"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground text-xl group-hover:scale-110 transition-transform">
                  <it.icon />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-navy">{it.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="What You Get" title="Built for outcomes" subtitle="From your first class to your first offer letter." />
          <div className="mt-12 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="p-5 rounded-xl bg-card border border-border flex items-center gap-4 hover:scale-[1.02] transition-transform"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center">
                  <f.icon />
                </div>
                <span className="font-medium text-navy text-sm">{f.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading 
              eyebrow="Programs" 
              title="Popular Courses" 
              subtitle="Industry-aligned programs designed for real outcomes." 
              align="left" 
            />
            <Link 
              to="/courses" 
              className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all <FaArrowRight />
            </Link>
          </div>
          
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.slice(0, 4).map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 shadow-card hover:shadow-elegant transition-all flex flex-col"
              >
                <div className="text-xs font-semibold text-primary uppercase tracking-wider">
                  {c.duration}
                </div>
                
                <h3 className="mt-2 text-lg font-bold text-navy">
                  {c.title}
                </h3>
                
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                  {c.skills}
                </p>
                
                <p className="mt-3 text-sm text-foreground/70 line-clamp-3 flex-1">
                  {c.description}
                </p>
                
                <div className="mt-5 flex items-center justify-between">
                  <div className="text-lg font-bold text-navy">
                    ₹{c.price?.toLocaleString()}
                  </div>

                  <Link
                    to="/contact"
                    className="text-xs font-semibold px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
                  >
                    Enquire
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

     {/* TESTIMONIALS - CONTINUOUS SCROLLING */}
<section className="py-20 bg-gradient-soft overflow-hidden">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
    <SectionHeading 
      eyebrow="Success Stories" 
      title="What our students say" 
      subtitle="Real outcomes from learners who took the leap." 
    />
  </div>

  {reviews.length > 0 && <Testimonials reviews={reviews} />}
</section>


      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero text-navy-foreground p-10 lg:p-16 text-center shadow-elegant">
            <h2 className="text-3xl lg:text-4xl font-bold">Ready to start your tech career?</h2>
            <p className="mt-4 text-navy-foreground/80 max-w-2xl mx-auto">
              Join the next cohort and learn from industry experts with real projects and full placement support.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/courses" className="px-7 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-elegant hover:scale-105 transition-transform">
                Browse Courses
              </Link>
              <Link to="/contact" className="px-7 py-3.5 rounded-xl bg-white/10 border border-white/20 font-semibold backdrop-blur hover:bg-white/20">
                Talk to an Advisor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle, align = "center" }: { eyebrow: string; title: string; subtitle?: string; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</div>
      <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-navy">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}