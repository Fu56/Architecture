import React, { useState } from "react";
import { getUser, setUser as setAuthUser } from "../../lib/auth";
import { useNavigate } from "react-router-dom";
import { User, Shield, Key, LogOut, X, Edit3, Save } from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "react-toastify";

const Profile = () => {
  const navigate = useNavigate();
  const user = getUser();

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    university_id: user?.university_id || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
    navigate("/login");
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.patch("/user/profile", profileForm);
      setAuthUser(data.user);
      toast.success("Profile updated successfully");
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
      toast.warning("New passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.patch("/user/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password changed successfully");
      setIsChangingPassword(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-300">
        <User className="h-16 w-16 text-gray-300 mb-4" />
        <p className="text-gray-500 mb-6 font-medium">
          No active session found.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Premium Header Card */}
      <div className="bg-slate-950 rounded-[3rem] p-10 sm:p-16 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-600/30 transition-all duration-700" />
        <div className="relative flex flex-col md:flex-row items-center gap-10">
          <div className="h-32 w-32 bg-white/10 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-white/10 group-hover:scale-105 transition-transform duration-500">
            <span className="text-4xl font-black text-indigo-400 uppercase tracking-tighter">
              {user.first_name?.[0]}
              {user.last_name?.[0]}
            </span>
          </div>
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Info & Settings Section */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-12 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-4 uppercase tracking-tight">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <User className="h-6 w-6" />
                </div>
                Identity Matrix
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`p-3 rounded-2xl transition-all ${
                  isEditing
                    ? "bg-red-50 text-red-500"
                    : "bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                {isEditing ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Edit3 className="h-6 w-6" />
                )}
              </button>
            </div>

            {isEditing ? (
              <form
                onSubmit={handleProfileSubmit}
                className="space-y-8 animate-in fade-in duration-500"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-indigo-500 outline-none transition-all"
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
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-indigo-500 outline-none transition-all"
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
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Email (Fixed)
                    </label>
                    <input
                      type="email"
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-400 cursor-not-allowed"
                      value={user.email}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      University ID
                    </label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-indigo-500 outline-none transition-all"
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
                <div className="flex justify-end pt-4 border-t border-slate-50">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-10 py-5 bg-slate-950 text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 disabled:opacity-50"
                  >
                    <Save className="h-5 w-5" />
                    {loading ? "Processing..." : "Sync Profile"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                <div className="space-y-1 group">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-indigo-500 transition-colors">
                    Legal First Name
                  </p>
                  <p className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-50">
                    {user.first_name}
                  </p>
                </div>
                <div className="space-y-1 group">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-indigo-500 transition-colors">
                    Legal Last Name
                  </p>
                  <p className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-50">
                    {user.last_name}
                  </p>
                </div>
                <div className="space-y-1 group">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-indigo-500 transition-colors">
                    Registered Email
                  </p>
                  <p className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-50">
                    {user.email}
                  </p>
                </div>
                <div className="space-y-1 group">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-indigo-500 transition-colors">
                    University ID
                  </p>
                  <p className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-50">
                    {user.university_id || "Not assigned"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security & System Section */}
        <div className="space-y-10">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/50">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight mb-8">
              <Key className="h-5 w-5 text-indigo-600" /> Security
            </h3>

            {!isChangingPassword ? (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-950 hover:text-white rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all group"
              >
                Access Protocols
                <Edit3 className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <form
                onSubmit={handlePasswordSubmit}
                className="space-y-4 animate-in fade-in duration-500"
              >
                <input
                  type="password"
                  placeholder="Current Code"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-indigo-500 outline-none"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="password"
                  placeholder="New Matrix Code"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-indigo-500 outline-none"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Code"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-indigo-500 outline-none"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all disabled:opacity-50"
                  >
                    Update Key
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <button
              onClick={handleLogout}
              className="mt-6 w-full flex items-center justify-between p-5 bg-red-50 hover:bg-red-500 hover:text-white rounded-[1.5rem] text-sm font-black uppercase tracking-widest text-red-600 transition-all group"
            >
              Terminate
              <LogOut className="h-5 w-5" />
            </button>
          </div>

          <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 text-indigo-900">
            <h4 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4" /> Node Security
            </h4>
            <p className="text-[10px] font-bold leading-relaxed opacity-60">
              Your profile data is encrypted end-to-end and stored in our secure
              regional data nodes. Session duration: 7 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
