import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaLock, FaUser } from "react-icons/fa";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/ToastContainer";

export const Route = createFileRoute("/_public/register")({
 
  head: () => ({
    meta: [
      { title: "Register — Pystack Academy" },
      { name: "description", content: "Create an account with Pystack Academy." },
    ],
  }),
  component: Register,
});

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const { toasts, showToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Please enter a valid email", "error");
      return false;
    }
    if (!password || password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return false;
    }
    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return false;
    }
    return true;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const r = await register(email, password);
      if (r.ok) {
        showToast("Registration successful! Redirecting to login...", "success");
        setTimeout(() => {
          navigate({ to: "/login" });
        }, 2000);
      } else {
        showToast(r.error || "Registration failed", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero grid place-items-center p-6">
      <ToastContainer toasts={toasts} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        
        <div className="bg-card rounded-2xl p-8 shadow-elegant border border-border">
          <div className="text-center mb-8">
            <div className="h-14 w-14 rounded-2xl bg-gradient-primary grid place-items-center text-primary-foreground text-xl font-bold mx-auto shadow-elegant">P</div>
            <h1 className="mt-4 text-2xl font-bold text-navy">Create Account</h1>
            <p className="mt-1 text-sm text-muted-foreground">Join Pystack Academy today</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-navy block mb-1.5">Email</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  placeholder="your@email.com"
                  className="w-full pl-11 pr-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-navy block mb-1.5">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  placeholder="At least 6 characters"
                  className="w-full pl-11 pr-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-navy block mb-1.5">Confirm Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  placeholder="Re-enter your password"
                  className="w-full pl-11 pr-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold shadow-elegant hover:scale-[1.01] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
