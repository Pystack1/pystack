import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FaBullseye, FaEye, FaGraduationCap, FaBriefcase, FaUsers, FaRocket, FaHandshake, FaAward, FaLightbulb } from "react-icons/fa";
import { FaProjectDiagram } from "react-icons/fa";
export const Route = createFileRoute("/_public/about")({
  head: () => ({
    meta: [
      { title: "About — Pystack Academy" },
      { name: "description", content: "Learn about Pystack Academy's mission, vision and training methodology." },
      { property: "og:title", content: "About Pystack Academy" },
      { property: "og:description", content: "Our mission, vision and training methodology." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div>
      <section className="bg-gradient-hero text-navy-foreground py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-5xl font-bold">
            About Pystack Academy
          </motion.h1>
          <p className="mt-5 text-navy-foreground/80 max-w-2xl mx-auto">
            We exist to turn ambitious learners into industry-ready engineers through hands-on training and real placement support.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
          {[
            { icon: FaBullseye, title: "Our Mission", text: "Empower learners with the skills, mindset and confidence to thrive in the modern tech industry — through live training,real projects and mentorship." },
            { icon: FaEye, title: "Our Vision", text: "Be the most trusted launchpad for software careers in India by delivering measurable outcomes and uncompromised teaching quality." },
          ].map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-card border border-border shadow-card"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground text-xl">
                <b.icon />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-navy">{b.title}</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{b.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-gradient-soft">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-navy text-center">Our Approach</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { icon: FaGraduationCap, title: "Training Methodology", text: "Concept-first, project-driven. Every topic is reinforced with hands-on exercises and code reviews." },
              { icon: FaBriefcase, title: "Placement Support", text: "Resume reviews, mock interviews, referrals and dedicated placement coordinators until you're hired." },
              { icon: FaUsers, title: "Career Development", text: "1:1 mentorship, soft-skills training and long-term career guidance from senior engineers." },
            ].map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="p-7 rounded-2xl bg-card border border-border">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center text-xl">
                  <b.icon />
                </div>
                <h3 className="mt-5 text-lg font-bold text-navy">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey / Milestones */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Our Journey</div>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-navy">Milestones that define us</h2>
            <p className="mt-3 text-muted-foreground">From a small classroom to thousands of placed engineers — built on consistent outcomes.</p>
          </div>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FaRocket, n: "2,000+", l: "Students Trained" },
             { icon: FaProjectDiagram, n: "100+", l: "Live Projects" },
              { icon: FaAward, n: "100%", l: "Placement Rate" },
              { icon: FaLightbulb, n: "5+", l: "Industry Courses" },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-7 rounded-2xl bg-card border border-border shadow-card text-center hover:border-primary/40 hover:shadow-elegant transition-all"
              >
                <div className="h-12 w-12 mx-auto rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground text-xl">
                  <s.icon />
                </div>
                <div className="mt-5 text-3xl font-bold text-navy">{s.n}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gradient-soft">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary">What We Stand For</div>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-navy">Our Core Values</h2>
          </div>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { t: "Learner First", d: "Every decision is filtered through what's best for the learner's outcome." },
              { t: "Practical over Theory", d: "We teach by building. If you can't ship it, you don't really know it." },
              { t: "Transparency", d: "Honest about timelines, outcomes, and what it takes to get hired." },
              { t: "Career Support", d: "Your relationship with Pystack doesn't end on placement day." },
            ].map((v, i) => (
              <motion.div
                key={v.t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <div className="h-1 w-10 rounded-full bg-gradient-primary" />
                <h3 className="mt-4 text-lg font-bold text-navy">{v.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}