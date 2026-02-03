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
  CircleCheck,
} from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "../../lib/toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    first_name: String(user?.first_name || ""),
    last_name: String(user?.last_name || ""),
    university_id: String(user?.university_id || ""),
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
    if (!profileForm.first_name.trim() || !profileForm.last_name.trim()) {
      toast.warn("Identity Error: Legal identifiers required.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.patch("/user/profile", profileForm);
      setAuthUser(data.user); // Update local storage
      toast.success("Identity Matrix Updated Successfully");
      setIsEditing(false);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.warn("Protocol Error: Passwords do not match.");
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
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Recalibration Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null; // Should be handled by ProtectedRoute

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
      {/* Premium Header */}
      <div className="bg-[#2A1205] rounded-[2.5rem] p-10 sm:p-14 text-white shadow-2xl relative overflow-hidden group border border-white/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DF8142]/10 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#DF8142]/20 transition-all duration-1000" />

        <div className="relative flex flex-col md:flex-row items-center gap-10 z-10">
          <div className="h-32 w-32 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-white/10 group-hover:scale-105 transition-transform duration-500">
            <span className="text-4xl font-black text-[#EEB38C] uppercase tracking-tighter">
              {user.first_name?.[0]}
              {user.last_name?.[0]}
            </span>
          </div>
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#DF8142]/10 border border-[#DF8142]/20 rounded-full text-[10px] font-black uppercase tracking-widest text-[#EEB38C] mb-2">
              <Shield className="h-3 w-3" /> System Verified
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-xs">
              {typeof user.role === "object" ? user.role.name : user.role} •
              ArchVault Node 01
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
                      className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2"
                    >
                      First Identifier
                    </label>
                    <input
                      id="first_name"
                      title="First Identifier"
                      type="text"
                      className="w-full bg-[#EFEDED] border border-[#D9D9C2] rounded-2xl px-5 py-4 font-bold text-[#2A1205] focus:border-[#DF8142] outline-none transition-all text-sm"
                      value={profileForm.first_name}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          first_name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="last_name"
                      className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2"
                    >
                      Last Identifier
                    </label>
                    <input
                      id="last_name"
                      title="Last Identifier"
                      type="text"
                      className="w-full bg-[#EFEDED] border border-[#D9D9C2] rounded-2xl px-5 py-4 font-bold text-[#2A1205] focus:border-[#DF8142] outline-none transition-all text-sm"
                      value={profileForm.last_name}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          last_name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="university_id"
                      className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2"
                    >
                      University ID
                    </label>
                    <input
                      id="university_id"
                      title="University ID"
                      type="text"
                      className="w-full bg-[#EFEDED] border border-[#D9D9C2] rounded-2xl px-5 py-4 font-bold text-[#2A1205] focus:border-[#DF8142] outline-none transition-all text-sm"
                      value={profileForm.university_id}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          university_id: e.target.value,
                        })
                      }
                      placeholder="Enter ID..."
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-3 px-8 py-4 bg-[#2A1205] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#5A270F] transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 text-xs"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Sync Identity
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Legal First Name
                  </p>
                  <p className="text-lg font-bold text-[#2A1205] border-b border-[#EFEDED] pb-2">
                    {user.first_name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Legal Last Name
                  </p>
                  <p className="text-lg font-bold text-[#2A1205] border-b border-[#EFEDED] pb-2">
                    {user.last_name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Comms Frequency
                  </p>
                  <p className="text-lg font-bold text-[#2A1205] border-b border-[#EFEDED] pb-2">
                    {user.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    University ID
                  </p>
                  <p className="text-lg font-bold text-[#2A1205] border-b border-[#EFEDED] pb-2">
                    {String(user.university_id || "EXT-NODE")}
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
                <label
                  htmlFor="currentPassword"
                  className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2"
                >
                  Current Key
                </label>
                <input
                  id="currentPassword"
                  title="Current Password"
                  type="password"
                  className="w-full bg-[#EFEDED] border border-[#D9D9C2] rounded-2xl px-5 py-4 font-bold text-[#2A1205] focus:border-[#DF8142] outline-none transition-all text-sm"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="newPassword"
                    className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2"
                  >
                    New Key
                  </label>
                  <input
                    id="newPassword"
                    title="New Password"
                    type="password"
                    className="w-full bg-[#EFEDED] border border-[#D9D9C2] rounded-2xl px-5 py-4 font-bold text-[#2A1205] focus:border-[#DF8142] outline-none transition-all text-sm"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2"
                  >
                    Confirm Key
                  </label>
                  <input
                    id="confirmPassword"
                    title="Confirm Password"
                    type="password"
                    className="w-full bg-[#EFEDED] border border-[#D9D9C2] rounded-2xl px-5 py-4 font-bold text-[#2A1205] focus:border-[#DF8142] outline-none transition-all text-sm"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 h-14 bg-[#2A1205] text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-[#5A270F] transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 text-[11px]"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <CircleCheck className="h-4 w-4 text-[#DF8142]" />
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
