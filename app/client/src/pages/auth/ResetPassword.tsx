import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authClient } from "../../lib/auth-client";
import { Lock, ArrowRight, ArrowLeft, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { toast } from "../../lib/toast";
import { useTheme } from "../../context/useTheme";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Get token from URL
  const token = searchParams.get("token") || "";

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      navigate("/login");
    }

    const FONT_LINK_ID = "news-page-fonts";
    if (!document.getElementById(FONT_LINK_ID)) {
      const link = document.createElement("link");
      link.id = FONT_LINK_ID;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap";
      document.head.appendChild(link);
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      type AuthClientWithReset = {
        resetPassword: (params: {
          newPassword: string;
          token?: string;
        }) => Promise<{ error: { message: string } | null }>;
      };

      const result = await (
        authClient as unknown as AuthClientWithReset
      ).resetPassword({
        newPassword: password,
        token: token, // Pass token explicitly if needed, or better-auth might grab it from URL
      });

      if (result.error) {
        toast.error(result.error.message || "Failed to reset password.");
        setLoading(false);
        return;
      }

      toast.success("Password reset successfully! Please login.");
      navigate("/login");
    } catch (err: unknown) {
      console.error("Reset password error:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
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
        <div className={`${isDark ? "bg-card border-white/10" : "bg-white border-[#EEB38C]/30"} p-10 rounded-[3rem] shadow-2xl border relative overflow-hidden group/card transition-all duration-500`}>
          <div className="text-center mb-10">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#DF8142] to-[#92664A] rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-[#DF8142]/20">
              <ShieldCheck className="h-10 w-10 text-white" />
            </div>
            <h2 className={`text-3xl font-black ${isDark ? "text-white" : "text-[#5A270F]"} tracking-tight uppercase font-space-grotesk`}>
              Set New Key
            </h2>
            <p className={`mt-4 text-[10px] ${isDark ? "text-[#EEB38C]/40" : "text-[#92664A]"} font-black uppercase tracking-[0.3em]`}>
              Secure your architectural node
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              {/* New Password */}
              <div className="relative group">
                <div className={`absolute left-5 top-1/2 -translate-y-1/2 ${isDark ? "text-[#EEB38C]/40" : "text-[#DF8142]"} group-focus-within:text-[#DF8142] transition-colors`}>
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full pl-14 pr-14 py-4 ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-[#FDFCFB] border-[#EEB38C]/40 text-[#5A270F] placeholder-[#92664A]/60"} border-2 rounded-2xl font-black focus:outline-none focus:border-[#DF8142] transition-all shadow-sm font-inter`}
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-5 top-1/2 -translate-y-1/2 ${isDark ? "text-[#EEB38C]/40" : "text-[#DF8142]"} hover:text-[#5A270F] transition-colors`}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative group">
                <div className={`absolute left-5 top-1/2 -translate-y-1/2 ${isDark ? "text-[#EEB38C]/40" : "text-[#DF8142]"} group-focus-within:text-[#DF8142] transition-colors`}>
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full pl-14 pr-6 py-4 ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-[#FDFCFB] border-[#EEB38C]/40 text-[#5A270F] placeholder-[#92664A]/60"} border-2 rounded-2xl font-black focus:outline-none focus:border-[#DF8142] transition-all shadow-sm font-inter`}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-3 py-5 px-4 ${isDark ? "bg-white text-slate-900" : "bg-gradient-to-r from-[#5A270F] to-[#6C3B1C] text-white"} text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50`}
            >
              {loading ? (
                "Updating..."
              ) : (
                <>
                  Update password
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className={`w-full flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-widest ${isDark ? "text-white/40 hover:text-white" : "text-[#92664A] hover:text-[#5A270F]"} transition-all`}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
