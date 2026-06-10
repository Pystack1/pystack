import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Course {
  id: string;
  name: string;
  description: string;
  technologies: string;
  duration: string;
  fees: number;
  status: "Active" | "Inactive";
  createdAt: string;
}

const seedCourses: Course[] = [
  {
    id: "c1",
    name: "Full Stack Python Development",
    description: "Master Python, Django, REST APIs and React to build production-grade full stack apps.",
    technologies: "Python, Django, DRF, React, PostgreSQL",
    duration: "5 Months",
    fees: 35000,
    status: "Active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "c2",
    name: "MERN Stack Development",
    description: "Build modern web applications end-to-end with MongoDB, Express, React and Node.js.",
    technologies: "MongoDB, Express, React, Node.js",
    duration: "4 Months",
    fees: 30000,
    status: "Active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "c3",
    name: "Data Science & Machine Learning",
    description: "From Python and statistics to ML algorithms, deep learning and real-world projects.",
    technologies: "Python, Pandas, scikit-learn, TensorFlow",
    duration: "6 Months",
    fees: 45000,
    status: "Active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "c4",
    name: "Java Full Stack",
    description: "Enterprise-grade Java with Spring Boot, Hibernate and Angular frontend.",
    technologies: "Java, Spring Boot, Hibernate, Angular",
    duration: "5 Months",
    fees: 32000,
    status: "Active",
    createdAt: new Date().toISOString(),
  },
];

interface CourseState {
  courses: Course[];
  addCourse: (c: Omit<Course, "id" | "createdAt">) => void;
  updateCourse: (id: string, c: Omit<Course, "id" | "createdAt">) => void;
  deleteCourse: (id: string) => void;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      courses: seedCourses,
      addCourse: (c) =>
        set((s) => ({
          courses: [
            { ...c, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
            ...s.courses,
          ],
        })),
      updateCourse: (id, c) =>
        set((s) => ({
          courses: s.courses.map((x) => (x.id === id ? { ...x, ...c } : x)),
        })),
      deleteCourse: (id) =>
        set((s) => ({ courses: s.courses.filter((x) => x.id !== id) })),
    }),
    { name: "pystack-courses" }
  )
);