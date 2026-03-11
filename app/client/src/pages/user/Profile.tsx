import React, { useState } from "react";
import { getUser, setUser as setAuthUser } from "../../lib/auth";
import { signOut } from "../../lib/auth-client";
import {
  User,
  Shield,
  Key,
  LogOut,
  X,
  Edit3,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
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
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-32 transition-colors duration-500">
      {/* Premium Command Header */}
      <div className="bg-[#5A270F] rounded-[3.5rem] p-12 sm:p-16 text-white shadow-2xl relative overflow-hidden group border border-white/5 transition-colors duration-500">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#DF8142]/20 blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#DF8142]/30 transition-all duration-1000" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#EEB38C]/10 blur-[80px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-12 z-10">
          <div className="relative">
            <div className="h-40 w-40 bg-white/5 backdrop-blur-2xl rounded-[3rem] flex items-center justify-center shadow-2xl border border-white/10 group-hover:scale-110 transition-transform duration-700">
              <span className="text-5xl font-black text-[#EEB38C] uppercase tracking-tighter italic transition-colors">
                {authUser.first_name?.[0]}
                {authUser.last_name?.[0]}
              </span>
            </div>
            <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-[#DF8142] rounded-2xl flex items-center justify-center border-4 border-[#5A270F] shadow-lg animate-pulse">
              <Shield className="h-5 w-5 text-white" />
            </div>
          </div>
          
          <div className="text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#DF8142]/20 border border-[#DF8142]/30 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-[#EEB38C] mb-4 transition-colors">
              <div className="h-2 w-2 rounded-full bg-[#DF8142] animate-ping" />
              Node Authority Verified
            </div>
            <h2 className="text-5xl sm:text-6xl font-black tracking-tighter text-white italic transition-colors">
              {authUser.first_name} <span className="text-[#DF8142] not-italic">{authUser.last_name}</span>
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <p className="text-[#EEB38C]/60 font-black uppercase tracking-[0.4em] text-[10px] bg-white/5 px-4 py-2 rounded-xl border border-white/5 transition-colors">
                {typeof authUser.role === "object" ? authUser.role.name : authUser.role} Protocol
              </p>
              <div className="h-1 w-8 bg-white/10 rounded-full" />
              <p className="text-[#EEB38C]/40 font-black uppercase tracking-[0.4em] text-[10px] transition-colors">
                 Cluster: Nexus-Alpha-01
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {/* Identity Matrix Configuration */}
          <div className="bg-white dark:bg-card rounded-[3rem] p-10 sm:p-12 shadow-2xl shadow-[#5A270F]/5 dark:shadow-none relative overflow-hidden border border-[#D9D9C2] dark:border-white/10 transition-all duration-500">
            <div className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-[#5A270F] dark:text-white uppercase tracking-tighter italic flex items-center gap-4 transition-colors">
                  Identity <span className="text-[#DF8142] not-italic">Matrix</span>
                </h3>
                <p className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.3em] transition-colors">Recalibrate Node Parameters</p>
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                  isEditing
                    ? "bg-rose-500 text-white hover:bg-rose-600 shadow-xl shadow-rose-500/20"
                    : "bg-[#EFEDED] dark:bg-white/5 text-[#5A270F] dark:text-[#EEB38C] hover:bg-[#D9D9C2] dark:hover:bg-white/10"
                }`}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4" /> Cancel Re-sync
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4" /> Edit Profile
                  </>
                )}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleProfileSubmit} className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    { id: "first_name", label: "Legal First Name", value: profileForm.first_name, placeholder: "e.g. Elias" },
                    { id: "last_name", label: "Legal Last Name", value: profileForm.last_name, placeholder: "e.g. Thorne" },
                    { id: "university_id", label: "University Identifier", value: profileForm.university_id, placeholder: "U-ARCH-XXXX" }
                  ].map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label 
                        htmlFor={field.id}
                        className="text-[10px] font-black uppercase tracking-widest text-[#92664A] dark:text-[#EEB38C]/60 ml-2 transition-colors"
                      >
                        {field.label}
                      </label>
                      <div className="relative group">
                        <input
                          id={field.id}
                          type="text"
                          title={field.label}
                          value={field.value as string}
                          onChange={(e) => {
                            setProfileForm({ ...profileForm, [field.id]: e.target.value });
                            if (errors[field.id]) setErrors((prev) => ({ ...prev, [field.id]: "" }));
                          }}
                          className={`w-full bg-[#EFEDED] dark:bg-background border rounded-2xl px-6 py-4 font-bold text-[#5A270F] dark:text-[#EEB38C] focus:border-[#DF8142] focus:ring-4 focus:ring-[#DF8142]/5 outline-none transition-all text-sm ${
                            errors[field.id] ? "border-[#DF8142]" : "border-[#D9D9C2] dark:border-white/10"
                          }`}
                          placeholder={field.placeholder}
                        />
                        {errors[field.id] && (
                          <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#DF8142]" />
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#92664A] dark:text-[#EEB38C]/60 ml-2 transition-colors">Academic Batch</label>
                    <input
                      type="number"
                      title="Academic Batch"
                      placeholder="e.g. 2024"
                      value={profileForm.batch}
                      onChange={(e) => setProfileForm({ ...profileForm, batch: e.target.value })}
                      className="w-full bg-[#EFEDED] dark:bg-background border border-[#D9D9C2] dark:border-white/10 rounded-2xl px-6 py-4 font-bold text-[#5A270F] dark:text-[#EEB38C] focus:border-[#DF8142] transition-all text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4">
                   {[
                    { id: "year", label: "Year", value: profileForm.year },
                    { id: "semester", label: "Semester", value: profileForm.semester },
                    { id: "department", label: "Department", value: profileForm.department, disabled: true }
                  ].map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label 
                        htmlFor={field.id}
                        className="text-[10px] font-black uppercase tracking-widest text-[#92664A] dark:text-[#EEB38C]/60 ml-2 transition-colors"
                      >
                        {field.label}
                      </label>
                      <input
                        id={field.id}
                        type="text"
                        title={field.label}
                        placeholder={field.label}
                        value={field.value as string}
                        disabled={field.disabled}
                        onChange={(e) => setProfileForm({ ...profileForm, [field.id]: e.target.value })}
                        className={`w-full bg-[#EFEDED] dark:bg-background border border-[#D9D9C2] dark:border-white/10 rounded-2xl px-6 py-4 font-bold text-[#5A270F] dark:text-[#EEB38C] focus:border-[#DF8142] transition-all text-sm outline-none ${
                          field.disabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-8 border-t border-[#D9D9C2] dark:border-white/10">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-4 px-10 py-5 bg-[#5A270F] text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-[#6C3B1C] hover:scale-105 transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50 text-[11px] transition-colors"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 text-[#DF8142]" />
                    )}
                    Synchronize Identity Matrix
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 animate-in fade-in duration-700">
                {[
                  { label: "Legal Profile Name", value: `${authUser.first_name} ${authUser.last_name}`, icon: User },
                  { label: "Matrix Comms", value: authUser.email, icon: RefreshCw },
                  { label: "Registry Node ID", value: String(authUser.university_id || "EXT-NODE"), icon: Shield },
                  { label: "Departmental Sector", value: String(authUser.department || "Architecture"), icon: Shield },
                  { label: "Academic Batch", value: String(authUser.batch || "N/A"), hide: authUser.role !== "Student" },
                  { label: "Cycle Position", value: `Year ${authUser.year || "N/A"} / Sem ${authUser.semester || "N/A"}`, hide: authUser.role !== "Student" }
                ].filter(i => !i.hide).map((item, i) => (
                  <div key={i} className="group space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#92664A] dark:text-[#EEB38C]/40 group-hover:text-[#DF8142] transition-colors">{item.label}</p>
                    <p className="text-xl font-black text-[#5A270F] dark:text-white border-b-2 border-[#EFEDED] dark:border-white/5 pb-3 transition-all group-hover:border-[#DF8142]/30 dark:group-hover:text-[#EEB38C]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Security Command Center */}
          <div className="bg-[#FAF8F4] dark:bg-card/50 rounded-[3rem] p-10 sm:p-12 shadow-xl relative overflow-hidden border border-[#D9D9C2] dark:border-white/10 transition-all duration-500">
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none architectural-grid" />
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-[#5A270F] dark:text-white uppercase tracking-tighter italic flex items-center gap-4 transition-colors">
                  Access <span className="text-[#DF8142] not-italic">Control</span>
                </h3>
                <p className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.3em] transition-colors">Recalibrate Gateway Security</p>
              </div>
              <div className="p-4 bg-[#5A270F] text-white rounded-2xl shadow-xl transition-colors">
                <Key className="h-6 w-6 text-[#DF8142]" />
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-8 relative z-10">
              <div className="space-y-3">
                <div className="flex justify-between items-center ml-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#92664A] dark:text-foreground/40 transition-colors">Current Terminal Key</label>
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="text-[9px] font-black uppercase tracking-widest text-[#DF8142] hover:text-[#5A270F] dark:text-[#EEB38C] transition-colors flex items-center gap-2"
                  >
                    {showPasswords ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    {showPasswords ? "Mask" : "Scan"} Keys
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => {
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value });
                      if (errors.currentPassword) setErrors((prev) => ({ ...prev, currentPassword: "" }));
                    }}
                    className={`w-full bg-white dark:bg-background border rounded-2xl px-6 py-4 font-bold text-[#5A270F] dark:text-[#EEB38C] focus:border-[#DF8142] focus:ring-4 focus:ring-[#DF8142]/5 outline-none transition-all text-sm shadow-inner transition-colors ${
                      errors.currentPassword ? "border-[#DF8142]" : "border-[#D9D9C2] dark:border-white/10"
                    }`}
                    placeholder="Enter Master Passphrase"
                  />
                  {errors.currentPassword && (
                    <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#DF8142]" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { id: "newPassword", label: "Initialize New Secure Key", placeholder: "Min 12 entropy chars" },
                  { id: "confirmPassword", label: "Verify New Secure Key", placeholder: "Re-scan key" }
                ].map((field) => (
                  <div key={field.id} className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#92664A] dark:text-foreground/40 ml-2 transition-colors">{field.label}</label>
                    <div className="relative">
                      <input
                        type={showPasswords ? "text" : "password"}
                        value={(field.id === "newPassword" ? passwordForm.newPassword : passwordForm.confirmPassword) as string}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (field.id === "newPassword") setPasswordForm({ ...passwordForm, newPassword: val });
                          else setPasswordForm({ ...passwordForm, confirmPassword: val });
                          if (errors[field.id]) setErrors((prev) => ({ ...prev, [field.id]: "" }));
                        }}
                        className={`w-full bg-white dark:bg-background border rounded-2xl px-6 py-4 font-bold text-[#5A270F] dark:text-[#EEB38C] focus:border-[#DF8142] focus:ring-4 focus:ring-[#DF8142]/5 outline-none transition-all text-sm shadow-inner transition-colors ${
                          errors[field.id] ? "border-[#DF8142]" : "border-[#D9D9C2] dark:border-white/10"
                        }`}
                        placeholder={field.placeholder}
                      />
                    </div>
                    {field.id === "newPassword" && (
                      <div className="flex items-center gap-3 ml-2 pt-1 transition-colors">
                        <div className="flex-grow h-1.5 bg-[#EFEDED] dark:bg-white/5 rounded-full overflow-hidden">
                           <div 
                              className={`h-full transition-all duration-1000 ${
                                passwordForm.newPassword.length >= 12 ? "bg-emerald-500 w-full" : 
                                passwordForm.newPassword.length >= 6 ? "bg-[#DF8142] w-1/2" : "bg-rose-500 w-1/4"
                              }`} 
                            />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-[#92664A] transition-colors">
                          {passwordForm.newPassword.length >= 12 ? "High Entropy" : "Insufficient"}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-[#5A270F] text-white rounded-2xl font-black uppercase tracking-[0.3em] hover:bg-[#6C3B1C] transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50 text-[11px] flex items-center justify-center gap-4 transition-colors"
                >
                  {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5 text-[#DF8142]" />}
                  Recalibrate Access Credentials
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-gradient-to-br from-[#5A270F] to-[#2A1205] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl border border-white/5 group transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#DF8142]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <Shield className="h-12 w-12 mb-8 text-[#DF8142] animate-pulse" />
            <h3 className="text-2xl font-black mb-4 tracking-tighter italic transition-colors">Security <span className="text-[#DF8142]">Protocol</span></h3>
            <p className="text-[#EEB38C]/60 text-xs font-bold uppercase tracking-widest leading-relaxed transition-colors">
              Updating your terminal key will immediately terminate all other active communication sessions for this node across the Nexus Matrix.
            </p>
            <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#EEB38C]/40 transition-colors">Last Recalibration</span>
              <span className="text-[10px] font-black text-white italic transition-colors">Active Node</span>
            </div>
          </div>

          <div className="bg-white dark:bg-card p-10 rounded-[3rem] border border-[#D9D9C2] dark:border-white/10 shadow-xl transition-all duration-500 space-y-8">
            <div className="space-y-4">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#92664A] dark:text-[#EEB38C]/60 flex items-center gap-3 transition-colors">
                <Zap className="h-4 w-4 text-[#DF8142]" /> System Matrix Info
              </h4>
              {[
                { label: "Node Cluster", value: "Alpha-EU-01" },
                { label: "Encryption Grade", value: "AES-256-GCM" },
                { label: "Matrix Sync", value: "99.9% Latency" },
                { label: "Operational State", value: "Active", special: true }
              ].map((info, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-[#EFEDED] dark:border-white/5 last:border-0 transition-colors">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#92664A]/60 dark:text-white/20 transition-colors">{info.label}</span>
                  <span className={`text-[10px] font-black uppercase italic transition-colors ${info.special ? "text-emerald-500 flex items-center gap-2" : "text-[#5A270F] dark:text-[#EEB38C]"}`}>
                    {info.special && <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />}
                    {info.value}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={handleLogout}
              className="w-full h-14 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all group"
            >
              <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Terminate Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
