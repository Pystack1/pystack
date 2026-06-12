import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCamera, FaUser, FaEnvelope, FaIdCard, FaMapMarkerAlt, FaSave } from "react-icons/fa";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/authStore";

// Interfaces
interface Profile {
  id: number;
  user_id: number;
  full_name: string | null;
  email: string;
  mobile_number: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  aadhar_number: string | null;
  pan_number: string | null;
  profile_photo_url: string | null;
}

interface UploadResponse {
  url: string;
}

export const Route = createFileRoute("/user/profile")({
  component: UserProfile,
});

function UserProfile() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    id: 0,
    user_id: user?.id || 0,
    full_name: "",
    email: user?.email || "",
    mobile_number: "",
    date_of_birth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    aadhar_number: "",
    pan_number: "",
    profile_photo_url: "",
  });

  const [popupMessage, setPopupMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api.get<Profile>("/user/profile");
      setProfile(data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      setSaving(true);
      // Use api.upload instead of raw fetch
      const res = await api.upload<UploadResponse>("/user/profile/upload-photo", formData);
      
      setProfile({ ...profile, profile_photo_url: res.url });
      showPopup("success", "Photo updated successfully!");
    } catch (err: any) {
      console.error("Upload error:", err);
      showPopup("error", err.message || "Failed to upload photo");
    } finally {
      setSaving(false);
    }
  }
};

  const showPopup = (type: 'success' | 'error', text: string) => {
    setPopupMessage({ type, text });
    setTimeout(() => setPopupMessage(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put("/user/profile", profile);
      showPopup("success", "Profile updated successfully!");
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.detail || "Failed to update profile";
      showPopup("error", errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AnimatePresence>
        {popupMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-3 ${
              popupMessage.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            <span>{popupMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy dark:text-white">My Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your personal information and preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center text-center">
              <div className="relative w-40 h-40 mb-6 group">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={profile.profile_photo_url || "https://via.placeholder.com/150?text=No+Photo"}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full border-4 border-indigo-50 dark:border-gray-600 shadow-md"
                />
                <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]">
                  <div className="text-white flex flex-col items-center">
                    <FaCamera className="text-2xl mb-1" />
                    <span className="text-xs font-medium">Change</span>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={saving} />
                </label>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile.full_name || "Update Your Name"}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 break-all">{profile.email}</p>
              
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 w-full">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span>Account Status</span>
                  <span className="text-green-600 font-semibold">Active</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>Member Since</span>
                  <span>{new Date().getFullYear()}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-md p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Need Help?</h3>
              <p className="text-sm text-indigo-100 mb-4">If you have trouble updating your details, contact support.</p>
              <button type="button" className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
                Contact Support
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-navy dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-700">
                <FaUser className="text-indigo-500" /> Personal Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={profile.full_name || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">Updating email changes your login credential.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile_number"
                    value={profile.mobile_number || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={profile.date_of_birth || ""}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Gender</label>
                  <div className="flex gap-6">
                    {["Male", "Female", "Other"].map((g) => (
                      <label key={g} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={profile.gender === g}
                          onChange={handleChange}
                          className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 transition-colors">{g}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-navy dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-700">
                <FaMapMarkerAlt className="text-indigo-500" /> Address
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Street Address</label>
                  <textarea
                    name="address"
                    rows={2}
                    value={profile.address || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all outline-none resize-none"
                    placeholder="123 Main St, Apt 4B"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">City</label>
                  <input
                    type="text"
                    name="city"
                    value={profile.city || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">State</label>
                  <input
                    type="text"
                    name="state"
                    value={profile.state || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={profile.country || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-navy dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-700">
                <FaIdCard className="text-indigo-500" /> Identification
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Aadhar Number</label>
                  <input
                    type="text"
                    name="aadhar_number"
                    value={profile.aadhar_number || ""}
                    onChange={handleChange}
                    maxLength={12}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all outline-none"
                    placeholder="12 digits only"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">PAN Number</label>
                  <input
                    type="text"
                    name="pan_number"
                    value={profile.pan_number || ""}
                    onChange={handleChange}
                    maxLength={10}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all outline-none uppercase"
                    placeholder="ABCDE1234F"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <div className="mr-auto text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : <><FaSave /> Save Changes</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}