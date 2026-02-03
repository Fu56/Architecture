import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authClient } from "../../lib/auth-client";
import { Lock, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { toast } from "../../lib/toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get token from URL
  const token = searchParams.get("token") || "";

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      navigate("/login");
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#EFEDED] via-[#D9D9C2] to-[#EFEDED] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#DF8142] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#92664A] rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-[#D9D9C2]">
          <div className="text-center mb-10">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#DF8142] to-[#92664A] rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-[#DF8142]/20">
              <ShieldCheck className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-[#5A270F] tracking-tight uppercase">
              Set New Key
            </h2>
            <p className="mt-4 text-xs text-[#92664A] font-bold uppercase tracking-widest">
              Secure your architectural node
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              {/* New Password */}
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#92664A] group-focus-within:text-[#DF8142] transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-14 pr-14 py-4 bg-[#EFEDED] border-2 border-[#D9D9C2] rounded-2xl text-[#5A270F] font-bold placeholder-[#92664A]/50 focus:outline-none focus:border-[#DF8142] focus:bg-white transition-all"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#92664A] hover:text-[#DF8142] transition-colors"
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
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#92664A] group-focus-within:text-[#DF8142] transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-14 pr-6 py-4 bg-[#EFEDED] border-2 border-[#D9D9C2] rounded-2xl text-[#5A270F] font-bold placeholder-[#92664A]/50 focus:outline-none focus:border-[#DF8142] focus:bg-white transition-all"
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
              className="w-full flex justify-center items-center gap-3 py-5 px-4 bg-gradient-to-r from-[#DF8142] to-[#92664A] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:shadow-2xl hover:shadow-[#DF8142]/30 transition-all active:scale-95 disabled:opacity-50"
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
