import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Key,
  ArrowLeft,
  ShieldCheck,
  Lock,
  RefreshCw,
  Eye,
  EyeOff,
  Settings as SettingsIcon,
  CircleCheck,
} from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "../../lib/toast";

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.warn("Protocol Error: Passwords do not match.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.warn("Security Alert: Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await api.patch("/user/change-password", {
        currentPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Authority Credentials Updated Successfully");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(
        error.response?.data?.message ||
          "Recalibration Failed: Verification Error",
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gradient-to-r from-[#2A1205] to-[#5A270F] rounded-[2.5rem] p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden group border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#DF8142]/10 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#DF8142]/20 transition-all duration-1000" />

        <div className="flex items-center gap-8 relative z-10">
          <button
            onClick={() => navigate("/super-admin")}
            className="h-14 w-14 shrink-0 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl flex items-center justify-center transition-all group/back active:scale-95"
            title="Return to Dashboard"
          >
            <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform text-[#EEB38C]" />
          </button>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EEB38C]/20 border border-[#EEB38C]/30 rounded-full text-[10px] font-black uppercase tracking-widest text-[#EEB38C] mb-4">
              <SettingsIcon className="h-3 w-3" /> Core Configuration
            </div>
            <h1
              onClick={() => navigate("/super-admin")}
              className="text-2xl sm:text-3xl font-black tracking-tight cursor-pointer"
            >
              System{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] to-[#EEB38C]">
                Settings
              </span>
            </h1>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end relative z-10 opacity-40">
          <ShieldCheck className="h-8 w-8 text-[#EEB38C] mb-2" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
            Root Secure
          </span>
        </div>
      </div>

      {/* Main Settings Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-8">
          <div className="bg-white rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-xl shadow-slate-200/50 relative overflow-hidden">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-lg font-black text-[#2A1205] flex items-center gap-4 uppercase tracking-tighter">
                <div className="p-4 bg-[#5A270F] text-white rounded-2xl shadow-lg">
                  <Lock className="h-6 w-6" />
                </div>
                Access Control
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Old Password */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">
                  Old Password
                </label>
                <div className="relative group">
                  <input
                    type={showPasswords.old ? "text" : "password"}
                    placeholder="old password"
                    className="w-full h-16 pl-6 pr-14 bg-[#EFEDED] border border-[#D9D9C2] rounded-2xl text-sm font-bold text-[#2A1205] focus:ring-4 focus:ring-[#DF8142]/10 focus:border-[#DF8142] outline-none transition-all placeholder:text-gray-400"
                    value={passwordForm.oldPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        oldPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility("old")}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5A270F] transition-colors"
                  >
                    {showPasswords.old ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">
                  New Password
                </label>
                <div className="relative group">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    placeholder="newpassword"
                    className="w-full h-16 pl-6 pr-14 bg-[#EFEDED] border border-[#D9D9C2] rounded-2xl text-sm font-bold text-[#2A1205] focus:ring-4 focus:ring-[#DF8142]/10 focus:border-[#DF8142] outline-none transition-all placeholder:text-gray-400"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility("new")}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5A270F] transition-colors"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">
                  Confirm Password
                </label>
                <div className="relative group">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    placeholder="confirm password"
                    className="w-full h-16 pl-6 pr-14 bg-[#EFEDED] border border-[#D9D9C2] rounded-2xl text-sm font-bold text-[#2A1205] focus:ring-4 focus:ring-[#DF8142]/10 focus:border-[#DF8142] outline-none transition-all placeholder:text-gray-400"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility("confirm")}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5A270F] transition-colors"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-[#2A1205] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-[#5A270F] transition-all shadow-xl shadow-[#2A1205]/20 flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <CircleCheck className="h-5 w-5 text-[#DF8142]" />
                      Update Matrix Credentials
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="md:col-span-4 space-y-8">
          <div className="bg-gradient-to-br from-[#92664A] to-[#6C3B1C] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-[#6C3B1C]/20 border border-white/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#EEB38C]/10 blur-3xl" />
            <Key className="h-10 w-10 mb-6 relative z-10 text-[#EEB38C]" />
            <h3 className="text-xl font-black mb-2 relative z-10 text-white">
              Security Protocol
            </h3>
            <p className="text-[#EEB38C]/60 text-[10px] font-bold uppercase tracking-widest leading-relaxed relative z-10">
              Passphrase changes will terminate all other active sessions for
              this node. Use high-entropy keys for maximum protection.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-[#D9D9C2] shadow-sm">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5A270F] mb-6 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> System Info
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-gray-400">Node Cluster</span>
                <span className="text-[#2A1205]">EU-Central-01</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-gray-400">Encryption</span>
                <span className="text-[#2A1205]">AES-256-GCM</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-emerald-600">
                <span>Active Shield</span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
