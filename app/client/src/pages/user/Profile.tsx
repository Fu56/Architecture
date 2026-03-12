import React, { useState } from "react";
import { getUser, setUser as setAuthUser } from "../../lib/auth";
import { signOut } from "../../lib/auth-client";
import {
  Shield,
  LogOut,
  X,
  Edit3,
  Save,
  RefreshCw,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "../../lib/toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const authUser = getUser();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    first_name: String(authUser?.first_name || ""),
    last_name: String(authUser?.last_name || ""),
    university_id: String(authUser?.university_id || ""),
    batch: String(authUser?.batch || ""),
    year: String(authUser?.year || ""),
    semester: String(authUser?.semester || ""),
    specialization: String(authUser?.specialization || ""),
    department: String(authUser?.department || ""),
    worker_id: String(authUser?.worker_id || ""),
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateProfile = () => {
    const newErrors: Record<string, string> = {};
    if (!profileForm.first_name.trim())
      newErrors.first_name = "Legal identifier (First Name) required.";
    if (!profileForm.last_name.trim())
      newErrors.last_name = "Legal identifier (Last Name) required.";
    if (!profileForm.university_id.trim())
      newErrors.university_id = "University ID required.";

    // Optional but formatted numeric validations
    if (profileForm.batch && isNaN(Number(profileForm.batch)))
      newErrors.batch = "Invalid batch sequence.";
    if (profileForm.year && isNaN(Number(profileForm.year)))
      newErrors.year = "Invalid chronological year.";
    if (profileForm.semester && isNaN(Number(profileForm.semester)))
      newErrors.semester = "Invalid semester index.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};
    if (!passwordForm.currentPassword)
      newErrors.currentPassword = "Current key required.";
    if (!passwordForm.newPassword) {
      newErrors.newPassword = "New key required.";
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword =
        "Security breach: Key must be at least 6 characters.";
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Protocol Error: Keys do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogout = async () => {
    try {
      await signOut(); // Better Auth signout
      localStorage.removeItem("token"); // Legacy cleanup
      localStorage.removeItem("user");
      sessionStorage.removeItem("better-auth-user"); // Ensure session storage sync is cleared
      toast.info("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Failed to terminate session.");
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfile()) {
      toast.warn("Identity Protocol Breach: Invalid field parameters.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.patch("/user/profile", profileForm);
      setAuthUser(data.user); // Update local storage
      toast.success("Identity Matrix Updated Successfully");
      setIsEditing(false);
      setErrors({});
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) {
      toast.warn("Security Protocol Breach: Invalid credentials.");
      return;
    }
    setLoading(true);
    try {
      await api.patch("/user/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Security Key Re-calibrated");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Recalibration Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!authUser) return null; // Should be handled by ProtectedRoute

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      {/* Premium Compact Header */}
      <div className="bg-[#5A270F] rounded-xl p-5 text-white shadow-lg relative overflow-hidden group border-b-4 border-[#DF8142]">
        <div className="absolute inset-0 architectural-dot-grid opacity-10 pointer-events-none" />
        <div className="relative flex flex-col md:flex-row items-center gap-6 z-10">
          <div className="relative">
            <div className="h-14 w-14 bg-white rounded-lg flex items-center justify-center shadow-md border-2 border-[#DF8142] group-hover:scale-105 transition-transform duration-500">
              <span className="text-xl font-black text-[#5A270F] italic">
                {authUser.first_name?.[0]}{authUser.last_name?.[0]}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-[#DF8142] rounded flex items-center justify-center border border-[#5A270F]">
              <Shield className="h-3 w-3 text-white" />
            </div>
          </div>
          
          <div className="text-center md:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
               <span className="px-2 py-0.5 bg-[#DF8142] text-white text-[7px] font-black uppercase tracking-widest rounded-full">Root Node</span>
               <span className="px-2 py-0.5 bg-white/10 text-white text-[7px] font-black uppercase tracking-widest rounded-full border border-white/10">Active</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic leading-none">
              {authUser.first_name} <span className="text-[#DF8142] not-italic">{authUser.last_name}</span>
            </h2>
            <div className="bg-black/10 px-2 py-0.5 rounded-md border border-white/5 text-[10px] text-[#EEB38C] font-bold">
              {authUser.email}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
        {/* Profile Settings */}
        <div className="bg-white dark:bg-card rounded-xl p-5 border-2 border-[#5A270F]/20 shadow-lg space-y-5 group transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-5 w-1 bg-[#DF8142] rounded-full" />
              <h3 className="text-base font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-tighter italic">General <span className="text-[#DF8142]">Settings</span></h3>
            </div>
            <button
               onClick={() => setIsEditing(!isEditing)}
               className="text-[#DF8142] hover:text-[#5A270F] transition-colors"
            >
              {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            </button>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-1 p-2 bg-[#FAF8F4] dark:bg-white/10 rounded-lg border border-[#5A270F]/20">
                <label className="text-[10px] font-black text-[#5A270F] dark:text-[#DF8142] uppercase tracking-widest px-1">First Identity Matrix</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profileForm.first_name}
                  onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-[#5A270F]/40 font-black text-[#5A270F] dark:text-[#EEB38C] outline-none focus:border-[#DF8142] transition-all py-1 text-base placeholder-[#5A270F]/80 dark:placeholder-white/20"
                  placeholder="Enter First Name"
                />
                {errors.first_name && <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest px-1">{errors.first_name}</p>}
              </div>
              <div className="space-y-1 p-2 bg-[#FAF8F4] dark:bg-white/10 rounded-lg border border-[#5A270F]/20">
                <label className="text-[10px] font-black text-[#5A270F] dark:text-[#DF8142] uppercase tracking-widest px-1">Last Identity Matrix</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profileForm.last_name}
                  onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-[#5A270F]/40 font-black text-[#5A270F] dark:text-[#EEB38C] outline-none focus:border-[#DF8142] transition-all py-1 text-base placeholder-[#5A270F]/80 dark:placeholder-white/20"
                  placeholder="Enter Last Name"
                />
                {errors.last_name && <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest">{errors.last_name}</p>}
              </div>
            </div>

            {isEditing && (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-[#5A270F] text-white rounded-lg font-black uppercase tracking-widest hover:bg-[#6C3B1C] transition-all shadow-md flex items-center justify-center gap-2 text-[10px]"
              >
                {loading ? <RefreshCw className="h-3 w-3 animate-spin" /> : 
                <>
                  <Save className="h-3.5 w-3.5 text-[#DF8142]" /> 
                  Authorize Sync
                </>}
              </button>
            )}
          </form>
        </div>

        {/* Security Vault */}
        <div className="bg-white dark:bg-card rounded-xl p-5 border-2 border-[#5A270F]/20 shadow-lg space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 bg-[#5A270F] rounded-full" />
            <h3 className="text-base font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-tighter italic">Security <span className="text-[#DF8142]">Vault</span></h3>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-1 p-2 bg-[#FAF8F4] dark:bg-white/10 rounded-lg border border-[#5A270F]/20">
              <label className="text-[10px] font-black text-[#5A270F] dark:text-[#DF8142] uppercase tracking-widest px-1">Master Access Key</label>
              <div className="relative">
                <input
                  type={showPasswords ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-[#5A270F]/40 font-black text-[#5A270F] dark:text-[#EEB38C] outline-none focus:border-[#DF8142] transition-all py-1 text-base placeholder-[#5A270F]/80 dark:placeholder-white/20"
                  placeholder="Enter Master Key"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#DF8142]"
                >
                  {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1 p-2 bg-[#FAF8F4] dark:bg-white/10 rounded-lg border border-[#5A270F]/20">
              <label className="text-[10px] font-black text-[#5A270F] dark:text-[#DF8142] uppercase tracking-widest px-1">New Security Calibration</label>
              <input
                type={showPasswords ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full bg-transparent border-b-2 border-[#5A270F]/40 font-black text-[#5A270F] dark:text-[#EEB38C] outline-none focus:border-[#DF8142] transition-all py-1 text-base placeholder-[#5A270F]/80 dark:placeholder-white/20"
                placeholder="New Calibration Secret"
              />
            </div>

            <button
               type="submit"
               disabled={loading}
               className="w-full py-2 bg-[#DF8142] text-white rounded-lg font-black uppercase tracking-widest hover:bg-[#C96B2E] transition-all text-[9px] flex items-center justify-center gap-2"
            >
              <CheckCircle className="h-3.5 w-3.5 text-[#5A270F]" /> Re-Certify
            </button>
          </form>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={handleLogout}
          className="px-6 py-2 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center gap-2 text-[9px]"
        >
          <LogOut className="h-3 w-3" />
          Terminate link
        </button>
      </div>
    </div>
  );
};

export default Profile;
