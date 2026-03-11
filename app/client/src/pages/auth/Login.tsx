import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authClient } from "../../lib/auth-client";
import { syncSessionToStorage } from "../../lib/auth";
import { Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "../../lib/toast";
import { useTheme } from "../../context/useTheme";

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
    agreedToTerms: false,
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
    agreedToTerms: "",
  });

  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const FONT_LINK_ID = "news-page-fonts";
    if (!document.getElementById(FONT_LINK_ID)) {
      const link = document.createElement("link");
      link.id = FONT_LINK_ID;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  // Validation function
  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
      resetEmail: "",
      agreedToTerms: "",
    };
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

    // Terms validation
    if (!form.agreedToTerms) {
      newErrors.agreedToTerms = "You must agree to the Terms and Conditions.";
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
        redirectTo: window.location.origin + "/reset-password", // Page to redirect after clicking link in email
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
    <div className={`font-inter antialiased flex items-center justify-center min-h-screen ${isDark ? "bg-[#1A0B04]" : "bg-[#FAF8F4]"} py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500`}>
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#DF8142] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#92664A] rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {!showForgotPassword ? (
          // Login Form
          <div className={`${isDark ? "bg-card border-white/10" : "bg-white border-[#EEB38C]/30"} p-10 rounded-[3rem] shadow-2xl border relative overflow-hidden group/card transition-all duration-500`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#DF8142]/5 blur-3xl group-hover/card:bg-[#DF8142]/10 transition-colors" />
            
            <div className="relative z-10 text-center mb-10">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#DF8142] to-[#92664A] rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-[#DF8142]/20">
                <ShieldCheck className="h-10 w-10 text-white" />
              </div>
              <h2 className={`text-4xl font-black ${isDark ? "text-white" : "text-[#5A270F]"} tracking-tight uppercase font-space-grotesk`}>
                Sign In
              </h2>
              <p className={`mt-4 text-[10px] ${isDark ? "text-[#EEB38C]/70" : "text-[#92664A]"} font-black uppercase tracking-[0.3em]`}>
                Access the Architecture Core
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                {/* Email Input */}
                <div className="relative group">
                  <div className={`absolute left-5 top-1/2 -translate-y-1/2 ${isDark ? "text-[#EEB38C]/40" : "text-[#DF8142]"} group-focus-within:text-[#DF8142] transition-colors`}>
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`w-full pl-14 pr-6 py-4 ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-[#FDFCFB] border-[#EEB38C]/40 text-[#5A270F] placeholder-[#92664A]/60"} border-2 ${errors.email ? "border-red-500" : ""} rounded-2xl font-black focus:outline-none focus:border-[#DF8142] transition-all shadow-sm`}
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
                  <div className={`absolute left-5 top-1/2 -translate-y-1/2 ${isDark ? "text-[#EEB38C]/40" : "text-[#DF8142]"} group-focus-within:text-[#DF8142] transition-colors`}>
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className={`w-full pl-14 pr-14 py-4 ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-[#FDFCFB] border-[#EEB38C]/40 text-[#5A270F] placeholder-[#92664A]/60"} border-2 ${errors.password ? "border-red-500" : ""} rounded-2xl font-black focus:outline-none focus:border-[#DF8142] transition-all shadow-sm`}
                    placeholder="Account password"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-5 top-1/2 -translate-y-1/2 ${isDark ? "text-[#EEB38C]/40" : "text-[#DF8142]"} hover:text-[#5A270F] transition-colors`}
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
                  className={`text-xs font-black ${isDark ? "text-white hover:text-[#EEB38C]" : "text-[#DF8142] hover:text-[#5A270F]"} transition-all uppercase tracking-[0.2em]`}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 group/terms">
                  <div className="relative flex items-center h-5">
                    <input
                      id="agreedToTerms"
                      name="agreedToTerms"
                      type="checkbox"
                      className="h-5 w-5 rounded-lg border-2 border-[#EEB38C]/50 dark:border-white/10 bg-transparent text-[#DF8142] focus:ring-[#DF8142]/20 cursor-pointer accent-[#DF8142] transition-all"
                      checked={form.agreedToTerms}
                      onChange={(e) => {
                        setForm({ ...form, agreedToTerms: e.target.checked });
                        if (errors.agreedToTerms) {
                          setErrors({ ...errors, agreedToTerms: "" });
                        }
                      }}
                    />
                  </div>
                  <label
                    htmlFor="agreedToTerms"
                    className={`text-xs font-black ${isDark ? "text-white/90" : "text-[#5A270F]"} leading-[1.6] cursor-pointer hover:text-[#DF8142] transition-colors`}
                  >
                    I confirm that I understand the rules and agree to use this system responsibly and lawfully, as outlined in the{" "}
                    <Link
                      to="/terms"
                      className="text-[#DF8142] font-black underline decoration-2 decoration-[#DF8142]/30 underline-offset-4 hover:decoration-[#DF8142] transition-all"
                    >
                      Terms of Operation
                    </Link>{" "}
                    and Content Safety Protocols.
                  </label>
                </div>
                {errors.agreedToTerms && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-600" />
                    {errors.agreedToTerms}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-3 py-5 px-4 bg-gradient-to-r from-[#5A270F] to-[#6C3B1C] text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-2xl hover:shadow-[#5A270F]/40 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="mt-8 pt-6 border-t border-[#D9D9C2] dark:border-white/5 relative z-10">
              <p className="text-center text-xs text-[#92664A] dark:text-[#EEB38C]/70 font-medium">
                Protected by{" "}
                <span className={`font-black ${isDark ? "text-[#EEB38C]" : "text-[#DF8142]"}`}>ArchVault</span>{" "}
                Security Protocol
              </p>
            </div>
          </div>
        ) : (
          // Forgot Password Form
          <div className="bg-white dark:bg-card p-10 rounded-[3rem] shadow-2xl border border-[#D9D9C2] dark:border-white/10 relative overflow-hidden group/card transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#DF8142]/5 blur-3xl" />
            
            <div className="relative z-10 text-center mb-10">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#EEB38C] to-[#DF8142] rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-[#DF8142]/20">
                <Mail className="h-10 w-10 text-white" />
              </div>
              <h2 className={`text-3xl font-black ${isDark ? "text-white" : "text-[#5A270F]"} tracking-tight uppercase font-space-grotesk`}>
                Reset Password
              </h2>
              <p className={`mt-4 text-sm ${isDark ? "text-[#EEB38C]/40" : "text-[#92664A]"} font-medium leading-relaxed`}>
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-6">
              {/* Email Input */}
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#92664A] dark:text-[#EEB38C]/40 group-focus-within:text-[#DF8142] transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  className={`w-full pl-14 pr-6 py-4 ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-[#FDFCFB] border-[#EEB38C]/40 text-[#5A270F] placeholder-[#92664A]/60"} border-2 rounded-2xl font-black focus:outline-none focus:border-[#DF8142] transition-all shadow-sm`}
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
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 ${isDark ? "bg-white/5 hover:bg-white/10 text-white" : "bg-[#EFEDED] hover:bg-[#D9D9C2] text-[#5A270F]"} text-xs font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95`}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
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
