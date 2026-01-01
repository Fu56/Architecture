import { useState } from "react";
import { api } from "../../lib/api";
import {
  UserPlus,
  Loader2,
  Shield,
  Key,
  Briefcase,
  Award,
  Zap,
  ChevronRight,
  Fingerprint,
  Building2,
  AtSign,
  GraduationCap,
} from "lucide-react";
import { toast } from "react-toastify";

interface FacultyFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  department?: string;
  specialization?: string;
}

const RegisterFaculty = () => {
  const [formData, setFormData] = useState<FacultyFormData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    department: "",
    specialization: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.password
    ) {
      toast.warning("Missing required identity protocols.");
      return;
    }

    if (!formData.email.includes("@")) {
      toast.warning("Invalid credential syntax.");
      return;
    }

    if (formData.password.length < 6) {
      toast.warning("Security breach: Password insufficient length.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/admin/users/register-faculty", {
        ...formData,
        role: "Faculty",
      });
      toast.success("Faculty Node initialized successfully.");
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        department: "",
        specialization: "",
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(
        error.response?.data?.message ||
          "Protocol Error: Faculty registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/80 backdrop-blur-xl p-8 rounded-[3rem] border border-white/20 shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="h-16 w-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Shield className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-950 tracking-tighter uppercase font-sans">
              Faculty Node Initialization
            </h2>
            <p className="text-xs text-slate-500 font-bold tracking-[0.2em] uppercase mt-1">
              Deploying Advanced Academic Credentials
            </p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-3 px-6 py-2 bg-indigo-50/50 backdrop-blur-md rounded-full border border-indigo-100 text-[10px] font-black uppercase tracking-widest text-indigo-600">
          <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          Secure Protocol Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Form Section */}
        <div className="lg:col-span-7 space-y-8">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl p-10 sm:p-14 relative overflow-hidden"
          >
            <div className="space-y-10 relative z-10">
              {/* Identity Group */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <Fingerprint className="h-5 w-5 text-indigo-500" />
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">
                    Core Identity
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-500 transition-colors">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      placeholder="Julian"
                      className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-950 placeholder:text-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-500 transition-colors">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      placeholder="Wright"
                      className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-950 placeholder:text-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-500 transition-colors flex items-center gap-2">
                    System Access Email
                  </label>
                  <div className="relative">
                    <AtSign className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="faculty@studio-nexus.edu"
                      className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-950 placeholder:text-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-500 transition-colors flex items-center gap-2">
                    Authorization Key
                  </label>
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Key className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                      <input
                        type="text"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Secure credential"
                        className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-950 placeholder:text-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="px-6 bg-slate-950 text-white border border-slate-950 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white hover:text-slate-950 transition-all shadow-lg shadow-slate-950/20 active:scale-95 flex items-center gap-2"
                    >
                      <Zap className="h-3 w-3" /> Auto
                    </button>
                  </div>
                </div>
              </div>

              {/* Academic Group */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <GraduationCap className="h-5 w-5 text-indigo-500" />
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">
                    Academic Profile
                  </h3>
                </div>

                <div className="space-y-3 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-500 transition-colors flex items-center gap-2">
                    Department Node
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="E.g., Parametric Architecture"
                      className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-950 placeholder:text-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-500 transition-colors flex items-center gap-2">
                    Specialized Velocity
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      placeholder="E.g., Kinetic Structures"
                      className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-950 placeholder:text-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-12 mt-8 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-4 px-12 py-5 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-indigo-600/30 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ring-4 ring-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Initialize Faculty
                    <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live ID Preview */}
        <div className="lg:col-span-5 sticky top-10">
          <div className="bg-slate-950 rounded-[3.5rem] p-8 border border-slate-800 shadow-3xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-20 opacity-10 blur-3xl bg-indigo-500 rounded-full pointer-events-none" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div className="h-12 w-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <Award className="h-6 w-6 text-indigo-400" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-1">
                    Access Level
                  </p>
                  <p className="text-xl font-black uppercase tracking-widest text-white">
                    Faculty
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-center mb-12">
                <div className="h-32 w-32 bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-2xl shadow-indigo-900/50 mb-6 border-4 border-slate-900">
                  {formData.first_name?.[0] || formData.last_name?.[0] || "?"}
                </div>
                <h3 className="text-2xl font-black tracking-tight text-white/90">
                  {formData.first_name || "Faculty"}{" "}
                  {formData.last_name || "Member"}
                </h3>
                <p className="text-xs font-medium text-slate-400 font-mono">
                  {formData.email || "ID: PENDING-ALLOCATION"}
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-2xl p-5 border border-white/5 backdrop-blur-sm">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">
                    Department
                  </p>
                  <p className="text-sm font-bold text-indigo-200">
                    {formData.department || "No department specified"}
                  </p>
                </div>
                <div className="bg-white/5 rounded-2xl p-5 border border-white/5 backdrop-blur-sm">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">
                    Specialization
                  </p>
                  <p className="text-sm font-bold text-purple-200">
                    {formData.specialization || "General Architecture"}
                  </p>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/10 flex justify-between items-center opacity-50">
                <div className="h-4 w-12 bg-white/20 rounded-full" />
                <div className="text-[8px] font-mono tracking-widest">
                  NEXUS::SECURE::ENC
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100 text-center">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-900 mb-2">
              Node Capabilities
            </h4>
            <p className="text-xs text-indigo-700/70 font-medium leading-relaxed">
              Faculty members have elevated privileges to create assignments,
              review submissions, and manage resource approvals within the Nexus
              Architecture.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterFaculty;
