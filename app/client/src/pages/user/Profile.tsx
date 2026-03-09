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
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
      {/* Premium Header */}
      <div className="bg-[#2A1205] rounded-[2.5rem] p-10 sm:p-14 text-white shadow-2xl relative overflow-hidden group border border-white/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DF8142]/10 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#DF8142]/20 transition-all duration-1000" />

        <div className="relative flex flex-col md:flex-row items-center gap-10 z-10">
          <div className="h-32 w-32 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-white/10 group-hover:scale-105 transition-transform duration-500">
            <span className="text-4xl font-black text-[#EEB38C] uppercase tracking-tighter">
              {authUser.first_name?.[0]}
              {authUser.last_name?.[0]}
            </span>
          </div>
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#DF8142]/10 border border-[#DF8142]/20 rounded-full text-[10px] font-black uppercase tracking-widest text-[#EEB38C] mb-2">
              <Shield className="h-3 w-3" /> System Verified
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter">
              {authUser.first_name} {authUser.last_name}
            </h2>
            <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-xs">
              {typeof authUser.role === "object"
                ? authUser.role.name
                : authUser.role}{" "}
              • ArchVault Node 01
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-8 space-y-10">
          {/* Identity Matrix (Edit Profile) */}
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-slate-200/50 relative overflow-hidden border border-[#D9D9C2]">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-lg font-black text-[#2A1205] flex items-center gap-4 uppercase tracking-tighter">
                <div className="p-4 bg-[#5A270F] text-white rounded-2xl shadow-lg">
                  <User className="h-6 w-6" />
                </div>
                Identity Matrix
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`p-3 rounded-2xl transition-all ${
                  isEditing
                    ? "bg-red-50 text-red-500"
                    : "bg-[#EFEDED] text-[#92664A] hover:text-[#5A270F] hover:bg-[#DF8142]/10"
                }`}
              >
                {isEditing ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Edit3 className="h-5 w-5" />
                )}
              </button>
            </div>

            {isEditing ? (
              <form
                onSubmit={handleProfileSubmit}
                className="space-y-6 animate-in fade-in duration-500"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="first_name"
                      className="text-[10px] font-black uppercase tracking-widest text-[#92664A] ml-2"
                    >
                      First Name
                    </label>
                    <div className="relative group">
                      <input
                        id="first_name"
                        type="text"
                        className={`w-full bg-[#EFEDED] border rounded-2xl px-5 py-4 font-bold text-[#5A270F] focus:border-[#DF8142] outline-none transition-all text-sm pr-12 ${errors.first_name ? "border-[#DF8142] ring-1 ring-[#DF8142]/20" : "border-[#D9D9C2]"}`}
                        value={profileForm.first_name}
                        onChange={(e) => {
                          setProfileForm({
                            ...profileForm,
                            first_name: e.target.value,
                          });
                          if (errors.first_name)
                            setErrors((prev) => ({ ...prev, first_name: "" }));
                        }}
                        onBlur={() =>
                          !profileForm.first_name.trim() &&
                          setErrors((prev) => ({
                            ...prev,
                            first_name: "Identifier Required",
                          }))
                        }
                      />
                      {errors.first_name && (
                        <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#DF8142] animate-pulse" />
                      )}
                    </div>
                    {errors.first_name && (
                      <p className="text-[9px] text-[#DF8142] font-black uppercase ml-2 mt-1 animate-in fade-in slide-in-from-top-1">
                        {errors.first_name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="last_name"
                      className="text-[10px] font-black uppercase tracking-widest text-[#92664A] ml-2"
                    >
                      Last Name
                    </label>
                    <div className="relative group">
                      <input
                        id="last_name"
                        type="text"
                        className={`w-full bg-[#EFEDED] border rounded-2xl px-5 py-4 font-bold text-[#5A270F] focus:border-[#DF8142] outline-none transition-all text-sm pr-12 ${errors.last_name ? "border-[#DF8142] ring-1 ring-[#DF8142]/20" : "border-[#D9D9C2]"}`}
                        value={profileForm.last_name}
                        onChange={(e) => {
                          setProfileForm({
                            ...profileForm,
                            last_name: e.target.value,
                          });
                          if (errors.last_name)
                            setErrors((prev) => ({ ...prev, last_name: "" }));
                        }}
                        onBlur={() =>
                          !profileForm.last_name.trim() &&
                          setErrors((prev) => ({
                            ...prev,
                            last_name: "Identifier Required",
                          }))
                        }
                      />
                      {errors.last_name && (
                        <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#DF8142] animate-pulse" />
                      )}
                    </div>
                    {errors.last_name && (
                      <p className="text-[9px] text-[#DF8142] font-black uppercase ml-2 mt-1 animate-in fade-in slide-in-from-top-1">
                        {errors.last_name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="university_id"
                      className="text-[10px] font-black uppercase tracking-widest text-[#92664A] ml-2"
                    >
                      University ID
                    </label>
                    <div className="relative group">
                      <input
                        id="university_id"
                        type="text"
                        className={`w-full bg-[#EFEDED] border rounded-2xl px-5 py-4 font-bold text-[#5A270F] focus:border-[#DF8142] outline-none transition-all text-sm pr-12 ${errors.university_id ? "border-[#DF8142] ring-1 ring-[#DF8142]/20" : "border-[#D9D9C2]"}`}
                        value={profileForm.university_id}
                        onChange={(e) => {
                          setProfileForm({
                            ...profileForm,
                            university_id: e.target.value,
                          });
                          if (errors.university_id)
                            setErrors((prev) => ({
                              ...prev,
                              university_id: "",
                            }));
                        }}
                        placeholder="U-ID Required"
                        onBlur={() =>
                          !profileForm.university_id.trim() &&
                          setErrors((prev) => ({
                            ...prev,
                            university_id: "ID Sync Conflict",
                          }))
                        }
                      />
                      {errors.university_id && (
                        <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#DF8142] animate-pulse" />
                      )}
                    </div>
                    {errors.university_id && (
                      <p className="text-[9px] text-[#DF8142] font-black uppercase ml-2 mt-1 animate-in fade-in slide-in-from-top-1">
                        {errors.university_id}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="batch"
                      className="text-[10px] font-black uppercase tracking-widest text-[#92664A] ml-2"
                    >
                      Batch
                    </label>
                    <div className="relative group">
                      <input
                        id="batch"
                        type="number"
                        className={`w-full bg-[#EFEDED] border rounded-2xl px-5 py-4 font-bold text-[#5A270F] focus:border-[#DF8142] outline-none transition-all text-sm pr-12 ${errors.batch ? "border-[#DF8142] ring-1 ring-[#DF8142]/20" : "border-[#D9D9C2]"}`}
                        value={profileForm.batch}
                        onChange={(e) => {
                          setProfileForm({
                            ...profileForm,
                            batch: e.target.value,
                          });
                          if (errors.batch)
                            setErrors((prev) => ({ ...prev, batch: "" }));
                        }}
                        onBlur={() =>
                          profileForm.batch &&
                          isNaN(Number(profileForm.batch)) &&
                          setErrors((prev) => ({
                            ...prev,
                            batch: "Invalid Batch Sequence",
                          }))
                        }
                      />
                      {errors.batch && (
                        <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#DF8142] animate-pulse" />
                      )}
                    </div>
                    {errors.batch && (
                      <p className="text-[9px] text-[#DF8142] font-black uppercase ml-2 mt-1 animate-in fade-in slide-in-from-top-1">
                        {errors.batch}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="year"
                      className="text-[10px] font-black uppercase tracking-widest text-[#92664A] ml-2"
                    >
                      Year
                    </label>
                    <div className="relative group">
                      <input
                        id="year"
                        type="number"
                        className={`w-full bg-[#EFEDED] border rounded-2xl px-5 py-4 font-bold text-[#5A270F] focus:border-[#DF8142] outline-none transition-all text-sm pr-12 ${errors.year ? "border-[#DF8142] ring-1 ring-[#DF8142]/20" : "border-[#D9D9C2]"}`}
                        value={profileForm.year}
                        onChange={(e) => {
                          setProfileForm({
                            ...profileForm,
                            year: e.target.value,
                          });
                          if (errors.year)
                            setErrors((prev) => ({ ...prev, year: "" }));
                        }}
                        onBlur={() =>
                          profileForm.year &&
                          isNaN(Number(profileForm.year)) &&
                          setErrors((prev) => ({
                            ...prev,
                            year: "Invalid Year Format",
                          }))
                        }
                      />
                      {errors.year && (
                        <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#DF8142] animate-pulse" />
                      )}
                    </div>
                    {errors.year && (
                      <p className="text-[9px] text-[#DF8142] font-black uppercase ml-2 mt-1 animate-in fade-in slide-in-from-top-1">
                        {errors.year}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="semester"
                      className="text-[10px] font-black uppercase tracking-widest text-[#92664A] ml-2"
                    >
                      Semester
                    </label>
                    <div className="relative group">
                      <input
                        id="semester"
                        type="number"
                        className={`w-full bg-[#EFEDED] border rounded-2xl px-5 py-4 font-bold text-[#5A270F] focus:border-[#DF8142] outline-none transition-all text-sm pr-12 ${errors.semester ? "border-[#DF8142] ring-1 ring-[#DF8142]/20" : "border-[#D9D9C2]"}`}
                        value={profileForm.semester}
                        onChange={(e) => {
                          setProfileForm({
                            ...profileForm,
                            semester: e.target.value,
                          });
                          if (errors.semester)
                            setErrors((prev) => ({ ...prev, semester: "" }));
                        }}
                        onBlur={() =>
                          profileForm.semester &&
                          isNaN(Number(profileForm.semester)) &&
                          setErrors((prev) => ({
                            ...prev,
                            semester: "Invalid Semester",
                          }))
                        }
                      />
                      {errors.semester && (
                        <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#DF8142] animate-pulse" />
                      )}
                    </div>
                    {errors.semester && (
                      <p className="text-[9px] text-[#DF8142] font-black uppercase ml-2 mt-1 animate-in fade-in slide-in-from-top-1">
                        {errors.semester}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="specialization"
                      className="text-[10px] font-black uppercase tracking-widest text-[#92664A] ml-2"
                    >
                      Specialization
                    </label>
                    <input
                      id="specialization"
                      type="text"
                      className="w-full bg-[#EFEDED] border border-[#D9D9C2] rounded-2xl px-5 py-4 font-bold text-[#5A270F] focus:border-[#DF8142] outline-none transition-all text-sm"
                      value={profileForm.specialization}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          specialization: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="department"
                      className="text-[10px] font-black uppercase tracking-widest text-[#92664A] ml-2"
                    >
                      Department
                    </label>
                    <input
                      id="department"
                      type="text"
                      className="w-full bg-[#EFEDED] border border-[#D9D9C2] rounded-2xl px-5 py-4 font-bold text-[#5A270F] focus:border-[#DF8142] outline-none transition-all text-sm"
                      value={profileForm.department}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          department: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-3 px-8 py-4 bg-[#5A270F] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#6C3B1C] transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 text-xs"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Sync Identity Matrix
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#92664A]">
                    Legal First Name
                  </p>
                  <p className="text-lg font-bold text-[#5A270F] border-b border-[#EFEDED] pb-2">
                    {authUser.first_name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#92664A]">
                    Legal Last Name
                  </p>
                  <p className="text-lg font-bold text-[#5A270F] border-b border-[#EFEDED] pb-2">
                    {authUser.last_name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#92664A]">
                    Comms Frequency
                  </p>
                  <p className="text-sm font-bold text-[#5A270F] border-b border-[#EFEDED] pb-2 truncate">
                    {authUser.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#92664A]">
                    University ID
                  </p>
                  <p className="text-lg font-bold text-[#5A270F] border-b border-[#EFEDED] pb-2">
                    {String(authUser.university_id || "EXT-NODE")}
                  </p>
                </div>
                {authUser.role === "Student" && (
                  <>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#92664A]">
                        Academic Batch
                      </p>
                      <p className="text-lg font-bold text-[#5A270F] border-b border-[#EFEDED] pb-2">
                        {String(authUser.batch || "N/A")}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#92664A]">
                        Academic Year
                      </p>
                      <p className="text-lg font-bold text-[#5A270F] border-b border-[#EFEDED] pb-2">
                        {String(authUser.year || "N/A")}
                      </p>
                    </div>
                  </>
                )}
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#92664A]">
                    Department
                  </p>
                  <p className="text-lg font-bold text-[#5A270F] border-b border-[#EFEDED] pb-2">
                    {String(authUser.department || "Architecture")}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Security Protocols (Change Password) */}
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-slate-200/50 relative overflow-hidden border border-[#D9D9C2]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-[#2A1205] flex items-center gap-4 uppercase tracking-tighter">
                <div className="p-4 bg-[#92664A] text-white rounded-2xl shadow-lg">
                  <Key className="h-6 w-6" />
                </div>
                Access Control
              </h3>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-2">
                  <label
                    htmlFor="currentPassword"
                    className="text-[10px] font-black uppercase tracking-widest text-[#92664A]"
                  >
                    Current System Key
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="text-[9px] font-black uppercase tracking-tighter text-[#DF8142] hover:text-[#5A270F] transition-colors flex items-center gap-1"
                  >
                    {showPasswords ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                    {showPasswords ? "Hide" : "Show"} Key
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="currentPassword"
                    type={showPasswords ? "text" : "password"}
                    className={`w-full bg-[#EFEDED] border rounded-2xl px-5 py-4 font-bold text-[#5A270F] focus:border-[#DF8142] outline-none transition-all text-sm pr-12 ${errors.currentPassword ? "border-[#DF8142] ring-1 ring-[#DF8142]/20" : "border-[#D9D9C2]"}`}
                    value={passwordForm.currentPassword}
                    onChange={(e) => {
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      });
                      if (errors.currentPassword)
                        setErrors((prev) => ({ ...prev, currentPassword: "" }));
                    }}
                    onBlur={() =>
                      !passwordForm.currentPassword &&
                      setErrors((prev) => ({
                        ...prev,
                        currentPassword: "Verification Key Required",
                      }))
                    }
                    placeholder="Enter Master Key"
                    required
                  />
                  {errors.currentPassword && (
                    <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#DF8142] animate-bounce" />
                  )}
                </div>
                {errors.currentPassword && (
                  <p className="text-[9px] text-[#DF8142] font-black uppercase ml-2 mt-1 animate-in fade-in slide-in-from-top-1">
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="newPassword"
                    className="text-[10px] font-black uppercase tracking-widest text-[#92664A] ml-2"
                  >
                    New Secure Key
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showPasswords ? "text" : "password"}
                      className={`w-full bg-[#EFEDED] border rounded-2xl px-5 py-4 font-bold text-[#5A270F] focus:border-[#DF8142] outline-none transition-all text-sm pr-12 ${errors.newPassword ? "border-[#DF8142] ring-1 ring-[#DF8142]/20" : "border-[#D9D9C2]"}`}
                      value={passwordForm.newPassword}
                      onChange={(e) => {
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        });
                        if (errors.newPassword)
                          setErrors((prev) => ({ ...prev, newPassword: "" }));
                      }}
                      onBlur={() =>
                        passwordForm.newPassword.length < 6 &&
                        setErrors((prev) => ({
                          ...prev,
                          newPassword: "Insufficient Entropy: Min 6 chars",
                        }))
                      }
                      placeholder="Min 6 chars"
                      required
                    />
                    {errors.newPassword && (
                      <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#DF8142] animate-bounce" />
                    )}
                  </div>
                  {errors.newPassword && (
                    <p className="text-[9px] text-[#DF8142] font-black uppercase ml-2 mt-1 animate-in fade-in slide-in-from-top-1">
                      {errors.newPassword}
                    </p>
                  )}
                  <div className="flex items-center gap-2 ml-2 mt-1">
                    <div
                      className={`h-1 flex-1 rounded-full transition-all duration-500 ${passwordForm.newPassword.length >= 6 ? "bg-emerald-500" : "bg-gray-200"}`}
                    />
                    <span
                      className={`text-[8px] font-black uppercase ${passwordForm.newPassword.length >= 6 ? "text-emerald-600" : "text-gray-400"}`}
                    >
                      {passwordForm.newPassword.length >= 6
                        ? "Entropy Secure"
                        : "Weak Entropy"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-[10px] font-black uppercase tracking-widest text-[#92664A] ml-2"
                  >
                    Confirm Secure Key
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showPasswords ? "text" : "password"}
                      className={`w-full bg-[#EFEDED] border rounded-2xl px-5 py-4 font-bold text-[#5A270F] focus:border-[#DF8142] outline-none transition-all text-sm pr-12 ${errors.confirmPassword ? "border-[#DF8142] ring-1 ring-[#DF8142]/20" : "border-[#D9D9C2]"}`}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => {
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        });
                        if (errors.confirmPassword)
                          setErrors((prev) => ({
                            ...prev,
                            confirmPassword: "",
                          }));
                      }}
                      onBlur={() =>
                        passwordForm.confirmPassword !==
                          passwordForm.newPassword &&
                        setErrors((prev) => ({
                          ...prev,
                          confirmPassword:
                            "Protocol Mismatch: Keys do not match",
                        }))
                      }
                      placeholder="Match Keys"
                      required
                    />
                    {errors.confirmPassword && (
                      <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#DF8142] animate-bounce" />
                    )}
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[9px] text-[#DF8142] font-black uppercase ml-2 mt-1 animate-in fade-in slide-in-from-top-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 h-14 bg-[#5A270F] text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-[#6C3B1C] transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 text-[11px]"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-[#EEB38C]" />
                  )}
                  Update Credentials
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
              <Shield className="h-4 w-4" /> System Info
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

            <button
              onClick={handleLogout}
              className="mt-8 w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-500 hover:text-white rounded-[1rem] text-[10px] font-black uppercase tracking-widest text-red-600 transition-all group"
            >
              Terminate Session
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
