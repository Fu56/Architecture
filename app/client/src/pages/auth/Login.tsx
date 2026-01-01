import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../../lib/auth-client";
import { syncSessionToStorage } from "../../lib/auth";
import { LogIn } from "lucide-react";
import { toast } from "react-toastify";

interface UserWithRole {
  id: string | number;
  email: string;
  name?: string;
  role?: { name: string } | string;
}

const Login = () => {
  const [form, setForm] = useState({
    email: "fuadabdela95@gmail.com",
    password: "Fuad@ab5659",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enhanced Validation Protocol
    if (!form.email.trim() || !form.password.trim()) {
      toast.warn("Access Denied: Mission critical credentials missing.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.warn("Protocol Breach: Invalid email syntax detected.");
      return;
    }

    setLoading(true);
    try {
      const result = await authClient.signIn.email({
        email: form.email,
        password: form.password,
      });

      if (result.error) {
        toast.error(
          result.error.message || "Authentication Failed: Node access rejected."
        );
        return;
      }

      // Sync session to storage for legacy components
      await syncSessionToStorage();

      // Get user data from session
      const session = await authClient.getSession();
      const user = session?.data?.user as UserWithRole | undefined;

      if (user) {
        toast.success(`Welcome back, ${user.name || user.email}!`);

        // Redirect based on role
        const role =
          typeof user.role === "object" && user.role !== null
            ? user.role.name
            : user.role;
        if (role === "Admin" || role === "SuperAdmin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen-minus-header bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="text-center mb-10">
            <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 shadow-inner">
              <LogIn className="h-8 w-8" />
            </div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
              Sign In
            </h2>
            <p className="mt-4 text-sm text-gray-400 font-bold uppercase tracking-widest">
              Access the Architecture Core
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-bold placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all outline-none"
                  placeholder="Studio email address"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div className="relative group">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-bold placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all outline-none"
                  placeholder="Account password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-5 px-4 bg-slate-950 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 disabled:opacity-50"
              >
                {loading ? "Authenticating..." : "Establish Access"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
