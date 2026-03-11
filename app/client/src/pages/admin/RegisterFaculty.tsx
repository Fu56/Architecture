import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import {
  UserPlus,
  Loader2,
  Shield,
  Key,
  Briefcase,
  Award,
  Zap,
  Building2,
  AtSign,
  GraduationCap,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "../../lib/toast";
import { useSession } from "../../lib/auth-client";

interface UserWithRole {
  id: string | number;
  email: string;
  name?: string;
  role?: { name: string } | string;
}

interface FacultyFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  department?: string;
  specialization?: string;
  worker_id?: string;
  agreedToTerms: boolean;
}

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="flex items-center gap-1.5 text-rose-500 text-[10px] font-black uppercase tracking-wider ml-1 animate-in slide-in-from-top-1 mt-1">
      <AlertCircle className="h-3 w-3" /> {message}
    </p>
  ) : null;

const RegisterFaculty = () => {
  const { data: session } = useSession();
  const requester = session?.user as UserWithRole | undefined;
  const requesterRole = (
    (typeof requester?.role === "object"
      ? requester.role?.name
      : requester?.role) || ""
  ).toLowerCase();

  const [formData, setFormData] = useState<FacultyFormData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    department: "",
    specialization: "",
    worker_id: "",
    agreedToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FacultyFormData) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.first_name.trim()) newErrors.first_name = "First name required.";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name required.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email identifier required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email syntax.";
    }

    if (!formData.password) {
      newErrors.password = "Authorization key required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Key too short (min 6 chars).";
    }

    if (!formData.worker_id?.trim()) newErrors.worker_id = "Personnel ID required.";
    if (!formData.department?.trim()) newErrors.department = "Department required.";
    if (!formData.specialization?.trim()) newErrors.specialization = "Specialization required.";
    if (!formData.agreedToTerms) newErrors.agreedToTerms = "You must accept the terms.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.warning("Validation Failed: Check highlighted fields.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/admin/users/register-faculty", { ...formData, role: "Faculty" });
      const message =
        requesterRole === "admin"
          ? "Faculty Node initialized: Authorization required by Department Head."
          : "Faculty Node initialized and activated successfully.";
      toast.success(message);
      setFormData({ first_name: "", last_name: "", email: "", password: "", department: "", specialization: "", worker_id: "", agreedToTerms: false });
      setErrors({});
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Protocol Error: Faculty registration failed");
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) password += chars.charAt(Math.floor(Math.random() * chars.length));
    setFormData((prev: FacultyFormData) => ({ ...prev, password }));
    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
  };

  const inputBase = (hasError: boolean) =>
    `w-full rounded-[0.875rem] border-2 px-4 py-3.5 text-sm font-bold outline-none transition-all duration-300 ${
      hasError
        ? "border-rose-400 bg-rose-50 dark:bg-rose-900/10 text-rose-800 dark:text-rose-300 ring-4 ring-rose-400/10"
        : "border-[#D9D9C2]/60 dark:border-white/10 bg-white dark:bg-white/5 text-[#5A270F] dark:text-white focus:border-[#DF8142] focus:ring-4 focus:ring-[#DF8142]/10"
    }`;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* ── Page Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#5A270F] to-[#6C3B1C] rounded-[2rem] p-10 shadow-[0_30px_80px_-20px_rgba(90,39,15,0.5)]">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#DF8142]/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 bg-white/10 border border-white/10 backdrop-blur-md rounded-[1.25rem] flex items-center justify-center shadow-2xl">
              <GraduationCap className="h-7 w-7 text-[#EEB38C]" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="h-[1px] w-6 bg-[#EEB38C]/40" />
                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[#EEB38C]/70">Admin Registry</p>
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-white uppercase leading-none">
                Faculty <span className="text-[#DF8142] italic">Registration</span>
              </h2>
              <p className="text-sm text-[#EEB38C]/60 font-medium mt-1">
                Initialize a faculty node and assign institutional credentials.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm self-start">
            <Shield className="h-4 w-4 text-[#EEB38C]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#EEB38C]">Privileged Access</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Form Panel ── */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 01: Core Identity */}
          <div className="bg-[#FAF8F4] dark:bg-[#1A0B04] rounded-[2rem] border border-[#D9D9C2]/40 dark:border-white/5 shadow-[0_8px_30px_-8px_rgba(90,39,15,0.08)] overflow-hidden">
            <div className="flex items-center gap-4 px-8 py-6 border-b border-[#D9D9C2]/40 dark:border-white/5 bg-gradient-to-r from-[#5A270F]/5 to-transparent">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#5A270F] to-[#6C3B1C] text-[#EEB38C] text-xs font-black shadow-lg shadow-[#5A270F]/20">01</div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C]">Core Identity</h4>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#D9D9C2] to-transparent dark:from-white/10" />
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="first_name" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1">First Name</label>
                  <input id="first_name" name="first_name" placeholder="Julian" value={formData.first_name} onChange={handleChange} className={inputBase(!!errors.first_name)} />
                  <FieldError message={errors.first_name} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="last_name" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1">Last Name</label>
                  <input id="last_name" name="last_name" placeholder="Wright" value={formData.last_name} onChange={handleChange} className={inputBase(!!errors.last_name)} />
                  <FieldError message={errors.last_name} />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1">System Email</label>
                <div className="relative">
                  <AtSign className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${errors.email ? "text-rose-400" : "text-[#92664A]/50"}`} />
                  <input id="email" name="email" type="email" placeholder="faculty@studio-nexus.edu" value={formData.email} onChange={handleChange} className={`${inputBase(!!errors.email)} pl-11`} />
                </div>
                <FieldError message={errors.email} />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1">Authorization Key</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Key className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${errors.password ? "text-rose-400" : "text-[#92664A]/50"}`} />
                    <input id="password" name="password" type="text" placeholder="Secure credential" value={formData.password} onChange={handleChange} className={`${inputBase(!!errors.password)} pl-11 font-mono`} />
                  </div>
                  <button type="button" onClick={generatePassword} title="Auto-generate password" className="px-4 py-3 bg-[#5A270F] text-[#EEB38C] rounded-[0.875rem] hover:bg-[#6C3B1C] transition-all shadow-lg active:scale-95 border border-white/5">
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
                <FieldError message={errors.password} />
              </div>
            </div>
          </div>

          {/* Section 02: Academic Profile */}
          <div className="bg-[#FAF8F4] dark:bg-[#1A0B04] rounded-[2rem] border border-[#D9D9C2]/40 dark:border-white/5 shadow-[0_8px_30px_-8px_rgba(90,39,15,0.08)] overflow-hidden">
            <div className="flex items-center gap-4 px-8 py-6 border-b border-[#D9D9C2]/40 dark:border-white/5 bg-gradient-to-r from-[#5A270F]/5 to-transparent">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#5A270F] to-[#6C3B1C] text-[#EEB38C] text-xs font-black shadow-lg shadow-[#5A270F]/20">02</div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C]">Academic Profile</h4>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#D9D9C2] to-transparent dark:from-white/10" />
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label htmlFor="worker_id" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1">Worker ID</label>
                <div className="relative">
                  <Shield className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${errors.worker_id ? "text-rose-400" : "text-[#92664A]/50"}`} />
                  <input id="worker_id" name="worker_id" placeholder="e.g. F-7728-ARCH" value={formData.worker_id} onChange={handleChange} className={`${inputBase(!!errors.worker_id)} pl-11 font-mono`} />
                </div>
                <FieldError message={errors.worker_id} />
              </div>

              <div className="space-y-2">
                <label htmlFor="department" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1">Department</label>
                <div className="relative">
                  <Building2 className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${errors.department ? "text-rose-400" : "text-[#92664A]/50"}`} />
                  <input id="department" name="department" placeholder="e.g. Parametric Architecture" value={formData.department} onChange={handleChange} className={`${inputBase(!!errors.department)} pl-11`} />
                </div>
                <FieldError message={errors.department} />
              </div>

              <div className="space-y-2">
                <label htmlFor="specialization" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1">Specialization</label>
                <div className="relative">
                  <Briefcase className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${errors.specialization ? "text-rose-400" : "text-[#92664A]/50"}`} />
                  <input id="specialization" name="specialization" placeholder="e.g. Kinetic Structures" value={formData.specialization} onChange={handleChange} className={`${inputBase(!!errors.specialization)} pl-11`} />
                </div>
                <FieldError message={errors.specialization} />
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className={`rounded-[1.5rem] border-2 p-6 transition-all duration-300 ${errors.agreedToTerms ? "border-rose-400 bg-rose-50/60 dark:bg-rose-900/10" : "border-[#D9D9C2]/60 dark:border-white/10 bg-[#FAF8F4] dark:bg-[#1A0B04]"}`}>
            <div className="flex items-start gap-4">
              <div className="relative flex items-center h-6 pt-0.5">
                <input
                  id="agreedToTerms"
                  name="agreedToTerms"
                  type="checkbox"
                  className="h-5 w-5 rounded-lg border-2 border-[#D9D9C2] dark:border-white/10 cursor-pointer accent-[#DF8142]"
                  checked={formData.agreedToTerms}
                  onChange={(e) => {
                    setFormData((prev: FacultyFormData) => ({ ...prev, agreedToTerms: e.target.checked }));
                    if (errors.agreedToTerms) setErrors((prev) => ({ ...prev, agreedToTerms: "" }));
                  }}
                />
              </div>
              <div>
                <label htmlFor="agreedToTerms" className={`text-[10px] font-black uppercase tracking-widest cursor-pointer ${errors.agreedToTerms ? "text-rose-700" : "text-[#5A270F] dark:text-[#EEB38C]"}`}>
                  Accept Operational Protocols
                </label>
                <p className={`text-[10px] font-medium leading-relaxed mt-1 ${errors.agreedToTerms ? "text-rose-600" : "text-[#92664A] dark:text-[#EEB38C]/40"}`}>
                  By initializing this node, you agree to the{" "}
                  <Link to="/terms" className={`underline ${errors.agreedToTerms ? "text-rose-800" : "text-[#DF8142]"}`}>
                    Terms of Operation
                  </Link>
                  . Prohibits malicious files, indecent materials, and illegal content under Ethiopian law.
                </p>
                <FieldError message={errors.agreedToTerms} />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit as unknown as React.MouseEventHandler}
            disabled={loading}
            className="w-full py-5 bg-[#5A270F] text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-[1.25rem] hover:bg-[#1A0B04] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 shadow-[0_20px_40px_-12px_rgba(90,39,15,0.4)] group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin text-[#EEB38C]" /> Processing...</>
            ) : (
              <><UserPlus className="h-4 w-4 text-[#DF8142]" /> Initialize Faculty Member</>
            )}
          </button>
        </div>

        {/* ── Live ID Preview ── */}
        <div className="lg:col-span-5 sticky top-10 space-y-6">
          {/* ID Card */}
          <div className="bg-[#5A270F] rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(90,39,15,0.5)] border border-white/5 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#DF8142]/25 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 p-10">
              <div className="flex justify-between items-start mb-8">
                <div className="h-12 w-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                  <Award className="h-6 w-6 text-[#DF8142]" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-black tracking-[0.3em] text-[#EEB38C]">Access Level</p>
                  <p className="text-2xl font-black tracking-tighter text-white">FACULTY</p>
                </div>
              </div>

              <div className="text-center space-y-4 mb-8">
                <div className="h-28 w-28 bg-gradient-to-br from-[#DF8142] via-[#6C3B1C] to-[#5A270F] mx-auto rounded-[1.75rem] flex items-center justify-center text-4xl font-black text-white shadow-2xl border-4 border-white/10">
                  {formData.first_name?.[0]?.toUpperCase() || formData.last_name?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight uppercase text-white">
                    {formData.first_name || "Faculty"} {formData.last_name || "Member"}
                  </h3>
                  <p className="text-[10px] text-[#EEB38C]/50 font-bold uppercase tracking-[0.2em] mt-0.5">
                    {formData.email || "email: pending"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Department", value: formData.department },
                  { label: "Specialization", value: formData.specialization },
                  { label: "Worker ID", value: formData.worker_id },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-colors group">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#EEB38C]/50 font-black mb-0.5">{label}</p>
                    <p className="text-sm font-bold text-white uppercase tracking-wide">
                      {value || <span className="text-white/30 italic normal-case font-medium">not set</span>}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-white/10 flex justify-between items-center opacity-50">
                <div className="h-2 w-8 bg-white/30 rounded-full" />
                <p className="text-[9px] font-mono tracking-widest text-white">SECURE::ENC</p>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-gradient-to-br from-[#EEB38C]/15 to-[#DF8142]/5 rounded-[1.5rem] border border-[#DF8142]/20 dark:border-white/10 p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#DF8142] to-[#EEB38C] rounded-l-full" />
            <div className="flex items-start gap-4 pl-4">
              <div className="p-3 bg-[#DF8142]/15 rounded-xl">
                <Zap className="h-5 w-5 text-[#DF8142]" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-tight">Privileged Access</h4>
                <p className="text-xs text-[#92664A] dark:text-[#EEB38C]/50 font-medium leading-relaxed mt-1">
                  Faculty nodes handle assignment creation and resource validation within the system matrix.
                </p>
              </div>
            </div>
          </div>

          {/* Status hint */}
          {formData.first_name && formData.email && formData.worker_id && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl animate-in slide-in-from-bottom-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Node data looks valid. Ready to initialize.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterFaculty;
