import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../../lib/auth-client";
import { syncSessionToStorage } from "../../lib/auth";
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "../../lib/toast";

interface UserWithRole {
  id: string | number;
  email: string;
  name?: string;
  role?: { name: string } | string;
  status?: string;
}

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // Error states for inline validation
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    resetEmail: "",
  });

  const navigate = useNavigate();

  // Validation function
  const validateForm = () => {
    const newErrors = { email: "", password: "", resetEmail: "" };
    let isValid = true;

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "Please enter a valid email address.";
        isValid = false;
      }
    }

    // Password validation
    if (!form.password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
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
          result.error.message ||
            "Authentication Failed: Node access rejected.",
        );
        return;
      }

      // Sync session to storage for legacy components
      await syncSessionToStorage();

      // Get user data from session
      const session = await authClient.getSession();
      const user = session?.data?.user as UserWithRole | undefined;

      if (user) {
        if (user.status === "pending_approval") {
          await authClient.signOut();
          toast.error(
            "Access Forbidden: Your node authorization is pending Department Head approval.",
          );
          setLoading(false);
          return;
        }
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate reset email
    const newErrors = { ...errors };
    if (!resetEmail.trim()) {
      newErrors.resetEmail = "Email address is required.";
      setErrors(newErrors);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      newErrors.resetEmail = "Please enter a valid email address.";
      setErrors(newErrors);
      return;
    }

    // Clear errors
    newErrors.resetEmail = "";
    setErrors(newErrors);

    setResetLoading(true);
    try {
      // Define types for method missing from client definition
      type AuthClientWithForgot = {
        forgetPassword: (params: {
          email: string;
          redirectTo: string;
        }) => Promise<{ error: { message: string } | null }>;
      };

      const { error } = await (
        authClient as unknown as AuthClientWithForgot
      ).forgetPassword({
        email: resetEmail,
        redirectTo: "/reset-password", // Page to redirect after clicking link in email
      });

      if (error) {
        toast.error(error.message || "Failed to send reset link.");
        setResetLoading(false);
        return;
      }

      toast.success("Password reset link sent! Check your email.");
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (err: unknown) {
      console.error("Password reset error:", err);
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error for this field when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#EFEDED] via-[#D9D9C2] to-[#EFEDED] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#DF8142] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#92664A] rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {!showForgotPassword ? (
          // Login Form
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-[#D9D9C2]">
            <div className="text-center mb-10">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#DF8142] to-[#92664A] rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-[#DF8142]/20">
                <ShieldCheck className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-4xl font-black text-[#5A270F] tracking-tight uppercase">
                Sign In
              </h2>
              <p className="mt-4 text-xs text-[#92664A] font-bold uppercase tracking-widest">
                Access the Architecture Core
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                {/* Email Input */}
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#92664A] group-focus-within:text-[#DF8142] transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`w-full pl-14 pr-6 py-4 bg-[#EFEDED] border-2 ${errors.email ? "border-red-500" : "border-[#D9D9C2]"} rounded-2xl text-[#5A270F] font-bold placeholder-[#92664A]/50 focus:outline-none focus:border-[#DF8142] focus:bg-white transition-all`}
                    placeholder="Studio email address"
                    value={form.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className="mt-2 text-xs text-red-600 font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-600" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#92664A] group-focus-within:text-[#DF8142] transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className={`w-full pl-14 pr-14 py-4 bg-[#EFEDED] border-2 ${errors.password ? "border-red-500" : "border-[#D9D9C2]"} rounded-2xl text-[#5A270F] font-bold placeholder-[#92664A]/50 focus:outline-none focus:border-[#DF8142] focus:bg-white transition-all`}
                    placeholder="Account password"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[#92664A] hover:text-[#DF8142] transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="mt-2 text-xs text-red-600 font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-600" />
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs font-bold text-[#DF8142] hover:text-[#5A270F] transition-colors uppercase tracking-widest"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-3 py-5 px-4 bg-gradient-to-r from-[#DF8142] to-[#92664A] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:shadow-2xl hover:shadow-[#DF8142]/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    "Authenticating..."
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-[#D9D9C2]">
              <p className="text-center text-xs text-[#92664A] font-medium">
                Protected by{" "}
                <span className="font-black text-[#DF8142]">ArchVault</span>{" "}
                Security Protocol
              </p>
            </div>
          </div>
        ) : (
          // Forgot Password Form
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-[#D9D9C2]">
            <div className="text-center mb-10">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#EEB38C] to-[#DF8142] rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-[#DF8142]/20">
                <Mail className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-black text-[#5A270F] tracking-tight uppercase">
                Reset Password
              </h2>
              <p className="mt-4 text-sm text-[#92664A] font-medium leading-relaxed">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-6">
              {/* Email Input */}
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#92664A] group-focus-within:text-[#DF8142] transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  className="w-full pl-14 pr-6 py-4 bg-[#EFEDED] border-2 border-[#D9D9C2] rounded-2xl text-[#5A270F] font-bold placeholder-[#92664A]/50 focus:outline-none focus:border-[#DF8142] focus:bg-white transition-all"
                  placeholder="Your email address"
                  value={resetEmail}
                  onChange={(e) => {
                    setResetEmail(e.target.value);
                    if (errors.resetEmail) {
                      setErrors({ ...errors, resetEmail: "" });
                    }
                  }}
                />
                {errors.resetEmail && (
                  <p className="mt-2 text-xs text-red-600 font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-600" />
                    {errors.resetEmail}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail("");
                  }}
                  className="flex-1 py-4 px-4 bg-[#EFEDED] text-[#5A270F] text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-[#D9D9C2] transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 py-4 px-4 bg-gradient-to-r from-[#DF8142] to-[#92664A] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:shadow-2xl hover:shadow-[#DF8142]/30 transition-all active:scale-95 disabled:opacity-50"
                >
                  {resetLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
