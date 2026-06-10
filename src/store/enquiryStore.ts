import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Enquiry {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  course: string;
  message: string;
  createdAt: string;
}

interface EnquiryState {
  enquiries: Enquiry[];
  addEnquiry: (e: Omit<Enquiry, "id" | "createdAt">) => void;
  deleteEnquiry: (id: string) => void;
}

export const useEnquiryStore = create<EnquiryState>()(
  persist(
    (set) => ({
      enquiries: [],
      addEnquiry: (e) =>
        set((s) => ({
          enquiries: [
            { ...e, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
            ...s.enquiries,
          ],
        })),
      deleteEnquiry: (id) =>
        set((s) => ({ enquiries: s.enquiries.filter((x) => x.id !== id) })),
    }),
    { name: "pystack-enquiries" }
  )
);