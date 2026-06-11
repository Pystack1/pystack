import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaLock, FaUser } from "react-icons/fa";
import { useAuthStore } from "@/store/authStore";

export const Route = createFileRoute("/_public/login")({
  head: () => ({
    meta: [
      { title: "Login — Pystack Academy" },
      { name: "description", content: "Pystack Academy login portal." },
    ],
  }),
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      const isAdmin = user.roles.some((role) => role === "SuperAdmin" || role === "Admin");
      // FIX: Changed "/dashboard" to "/user/dashboard"
      const destination = isAdmin ? "/admin/dashboard" : "/user/dashboard";
      
      navigate({
        to: destination,
        replace: true,
      });
    }
  }, [isAuthenticated, user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null); // Clear previous errors

    try {
      const r = await login(email, password);

      if (r.ok) {
        // Determine redirect path based on roles
        const currentUser = useAuthStore.getState().user;
        const isAdmin = currentUser?.roles.some((role) => role === "SuperAdmin" || role === "Admin");
        
        // FIX: Changed "/dashboard" to "/user/dashboard"
        const destination = isAdmin ? "/admin/dashboard" : "/user/dashboard";

        // Redirect immediately or after a short delay
        setTimeout(() => {
          navigate({ to: destination, replace: true });
        }, 500);
      } else {
        // Show error under button (Red color)
        setErrorMessage(r.error || "Login failed. Please check your credentials.");
      }
    } catch (error: any) {
      // Catch any unexpected errors
      setErrorMessage(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gradient-hero flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-2xl p-8 shadow-elegant border border-border">
            <div className="text-center mb-8">
              <div className="h-14 w-14 rounded-2xl bg-gradient-primary grid place-items-center text-primary-foreground text-xl font-bold mx-auto shadow-elegant">
                P
              </div>

              <h1 className="mt-4 text-2xl font-bold text-navy dark:text-white">
                Welcome Back
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Sign in to access your account
              </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-navy dark:text-gray-200 block mb-1.5">
                  Email
                </label>

                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all dark:bg-gray-800 dark:border-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-navy dark:text-gray-200 block mb-1.5">
                  Password
                </label>

                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />

                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all dark:bg-gray-800 dark:border-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold shadow-elegant hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>

                {/* Error Message Display - Red Blinking Text */}
                {errorMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <span className="text-red-500 text-sm font-medium animate-pulse block bg-red-50 dark:bg-red-900/20 py-2 px-4 rounded-lg border border-red-100 dark:border-red-900/50">
                      {errorMessage}
                    </span>
                  </motion.div>
                )}
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-border dark:border-gray-700 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary font-semibold hover:underline"
                >
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}