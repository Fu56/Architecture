import { useState } from "react";
import { api } from "../../lib/api";
import {
  UserPlus,
  Loader2,
  Shield,
  Mail,
  Key,
  Briefcase,
  Award,
  Zap,
  ChevronRight,
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

    // Validation
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.password
    ) {
      toast.warning(
        "Missing identity fields: All required protocols must be filled"
      );
      return;
    }

    if (!formData.email.includes("@")) {
      toast.warning("Invalid credential format: Studio email required");
      return;
    }

    if (formData.password.length < 6) {
      toast.warning("Security breach: Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await api.post("/admin/users/register-faculty", {
        ...formData,
        role: "Faculty",
      });
      toast.success("Faculty node successfully integrated into system");
      // Reset form
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
    <div className="max-w-4xl space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50 p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="h-14 w-14 bg-slate-950 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950 tracking-tighter uppercase">
              Faculty Node Initialization
            </h2>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
              Deploying Advanced Academic Credentials
            </p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <Zap className="h-3 w-3 text-indigo-500" />
          Protocol: Secure
        </div>
      </div>

      <div className="bg-white rounded-[4rem] border border-slate-100 shadow-3xl p-10 sm:p-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-[0.02] pointer-events-none">
          <UserPlus className="h-96 w-96" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Identity Group */}
            <div className="space-y-8">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] ml-1 mb-2">
                Core Identity Protocol
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    placeholder="E.g., Julian"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-black text-slate-950 placeholder:text-slate-200 focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    placeholder="E.g., Wright"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-black text-slate-950 placeholder:text-slate-200 focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Mail className="h-3 w-3" /> System Access Email{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="faculty.name@studio-nexus.edu"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-black text-slate-950 placeholder:text-slate-200 focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Key className="h-3 w-3" /> Authorization Credential{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter secure password"
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-black text-slate-950 placeholder:text-slate-200 focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="px-6 bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 rounded-2xl hover:bg-slate-50 hover:text-slate-950 transition-all shadow-sm active:scale-95"
                  >
                    Auto
                  </button>
                </div>
              </div>
            </div>

            {/* Academic Group */}
            <div className="space-y-8">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] ml-1 mb-2">
                Academic Specialization Protocol
              </h3>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Briefcase className="h-3 w-3" /> Department Node
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g., Parametric Architecture"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-black text-slate-950 placeholder:text-slate-200 focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Award className="h-3 w-3" /> Specialized Velocity
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="e.g., Kinetic Structures"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-black text-slate-950 placeholder:text-slate-200 focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all outline-none"
                />
              </div>

              <div className="p-8 bg-indigo-50/30 rounded-[2.5rem] border border-indigo-100/50">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-indigo-200">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-indigo-950 uppercase tracking-[0.2em] mb-1">
                      Node Permissions
                    </h4>
                    <p className="text-[10px] text-indigo-600/70 font-bold uppercase leading-relaxed tracking-wider">
                      FACULTY NODES GAIN ELEVATED CLEARANCE FOR CONTENT APPROVAL
                      AND ACADEMIC OVERSIGHT.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-10 border-t border-slate-50">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-4 px-12 py-5 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all hover:-translate-y-1 shadow-2xl shadow-slate-950/20 disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing Initialization...
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  Initialize Faculty Member
                  <ChevronRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterFaculty;
