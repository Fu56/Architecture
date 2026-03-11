import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import {
  UserPlus,
  Loader2,
  Key,
  GraduationCap,
  Award,
  Zap,
  AtSign,
  Calendar,
  Layers,
  Hash,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "../../lib/toast";
import { useSession } from "../../lib/auth-client";

interface UserWithRole {
  id: string | number;
  email: string;
  name?: string;
  role?: { name: string } | string;
}

interface StudentFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  university_id: string;
  batch: string;
  year: string;
  semester: string;
  agreedToTerms: boolean;
}

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="flex items-center gap-1.5 text-rose-500 text-[10px] font-black uppercase tracking-wider ml-1 animate-in slide-in-from-top-1 mt-1">
      <AlertCircle className="h-3 w-3" /> {message}
    </p>
  ) : null;

const RegisterStudent = () => {
  const { data: session } = useSession();
  const requester = session?.user as UserWithRole | undefined;
  const requesterRole = (
    (typeof requester?.role === "object"
      ? requester.role?.name
      : requester?.role) || ""
  ).toLowerCase();

  const [formData, setFormData] = useState<StudentFormData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    university_id: "",
    batch: "",
    year: "",
    semester: "",
    agreedToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: StudentFormData) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.first_name.trim()) newErrors.first_name = "First name required.";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name required.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email syntax.";
    }

    if (!formData.password) {
      newErrors.password = "Authorization key required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Key too short (min 6 chars).";
    }

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
      await api.post("/admin/users/create", {
        firstName: formData.first_name,
        lastName: formData.last_name,
        email: formData.email,
        password: formData.password,
        universityId: formData.university_id,
        batch: formData.batch,
        year: formData.year,
        semester: formData.semester,
        roleName: "Student",
      });

      const message =
        requesterRole === "admin"
          ? "Student Node initialized: Authorization required by Department Head."
          : "Student Node initialized and activated successfully.";

      toast.success(message);
      setFormData({ first_name: "", last_name: "", email: "", password: "", university_id: "", batch: "", year: "", semester: "", agreedToTerms: false });
      setErrors({});
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Protocol Error: Student registration failed");
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) password += chars.charAt(Math.floor(Math.random() * chars.length));
    setFormData((prev: StudentFormData) => ({ ...prev, password }));
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
      <div className="relative overflow-hidden bg-gradient-to-br from-[#5A270F] to-[#92664A] rounded-[2rem] p-10 shadow-[0_30px_80px_-20px_rgba(90,39,15,0.5)]">
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
                Student <span className="text-[#EEB38C] italic">Registration</span>
              </h2>
              <p className="text-sm text-[#EEB38C]/60 font-medium mt-1">
                Initialize a new student node within the system registry.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm self-start">
            <GraduationCap className="h-4 w-4 text-[#EEB38C]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#EEB38C]">Student Access</span>
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

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="university_id" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1">University ID</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#92664A]/50" />
                    <input id="university_id" name="university_id" placeholder="U-ARCH-001" value={formData.university_id} onChange={handleChange} className={`${inputBase(!!errors.university_id)} pl-11 font-mono`} />
                  </div>
                  <FieldError message={errors.university_id} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1">System Email</label>
                  <div className="relative">
                    <AtSign className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${errors.email ? "text-rose-400" : "text-[#92664A]/50"}`} />
                    <input id="email" name="email" type="email" placeholder="student@nexus.edu" value={formData.email} onChange={handleChange} className={`${inputBase(!!errors.email)} pl-11`} />
                  </div>
                  <FieldError message={errors.email} />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1">Authorization Key</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Key className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${errors.password ? "text-rose-400" : "text-[#92664A]/50"}`} />
                    <input id="password" name="password" type="text" placeholder="Secure credential" value={formData.password} onChange={handleChange} className={`${inputBase(!!errors.password)} pl-11 font-mono`} />
                  </div>
                  <button type="button" onClick={generatePassword} title="Auto-generate" className="px-4 py-3 bg-[#5A270F] text-[#EEB38C] rounded-[0.875rem] hover:bg-[#6C3B1C] transition-all shadow-lg active:scale-95 border border-white/5">
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
                <FieldError message={errors.password} />
              </div>
            </div>
          </div>

          {/* Section 02: Academic Period */}
          <div className="bg-[#FAF8F4] dark:bg-[#1A0B04] rounded-[2rem] border border-[#D9D9C2]/40 dark:border-white/5 shadow-[0_8px_30px_-8px_rgba(90,39,15,0.08)] overflow-hidden">
            <div className="flex items-center gap-4 px-8 py-6 border-b border-[#D9D9C2]/40 dark:border-white/5 bg-gradient-to-r from-[#5A270F]/5 to-transparent">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#5A270F] to-[#6C3B1C] text-[#EEB38C] text-xs font-black shadow-lg shadow-[#5A270F]/20">02</div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C]">Academic Period</h4>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#D9D9C2] to-transparent dark:from-white/10" />
            </div>
            <div className="p-8">
              <div className="grid grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label htmlFor="batch" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1">Batch</label>
                  <div className="relative">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#92664A]/50" />
                    <input id="batch" name="batch" type="number" placeholder="2024" value={formData.batch} onChange={handleChange} className={`${inputBase(!!errors.batch)} pl-11 font-mono`} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="year" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1">Year</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#92664A]/50" />
                    <input id="year" name="year" type="number" placeholder="1" value={formData.year} onChange={handleChange} className={`${inputBase(!!errors.year)} pl-11 font-mono`} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="semester" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1">Semester</label>
                  <input id="semester" name="semester" type="number" placeholder="1" value={formData.semester} onChange={handleChange} className={`${inputBase(!!errors.semester)} font-mono`} />
                </div>
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
                    setFormData((prev: StudentFormData) => ({ ...prev, agreedToTerms: e.target.checked }));
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
              <><UserPlus className="h-4 w-4 text-[#DF8142]" /> Initialize Student Node</>
            )}
          </button>
        </div>

        {/* ── Live ID Preview ── */}
        <div className="lg:col-span-5 sticky top-10 space-y-6">
          {/* ID Card */}
          <div className="bg-gradient-to-br from-[#5A270F] to-[#92664A] rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(90,39,15,0.5)] border border-white/5 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#EEB38C]/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 p-10">
              <div className="flex justify-between items-start mb-8">
                <div className="h-12 w-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                  <Award className="h-6 w-6 text-[#EEB38C]" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-black tracking-[0.3em] text-[#EEB38C]">Access Level</p>
                  <p className="text-2xl font-black tracking-tighter text-white">STUDENT</p>
                </div>
              </div>

              <div className="text-center space-y-4 mb-8">
                <div className="h-28 w-28 bg-gradient-to-br from-[#EEB38C] via-[#DF8142] to-[#6C3B1C] mx-auto rounded-[1.75rem] flex items-center justify-center text-4xl font-black text-white shadow-2xl border-4 border-white/10">
                  {formData.first_name?.[0]?.toUpperCase() || formData.last_name?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight uppercase text-white">
                    {formData.first_name || "Student"} {formData.last_name || "Member"}
                  </h3>
                  <p className="text-[10px] text-[#EEB38C]/50 font-bold uppercase tracking-[0.2em] mt-0.5">
                    {formData.email || "email: pending"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#EEB38C]/50 font-black mb-0.5">University ID</p>
                  <p className="text-sm font-bold text-white font-mono">
                    {formData.university_id || <span className="text-white/30 italic font-sans font-medium">not assigned</span>}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#EEB38C]/50 font-black mb-0.5">Batch</p>
                    <p className="text-sm font-bold text-[#EEB38C]">{formData.batch || "—"}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#EEB38C]/50 font-black mb-0.5">Yr / Sem</p>
                    <p className="text-sm font-bold text-[#EEB38C]">{formData.year || "?"} / {formData.semester || "?"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10 flex justify-between items-center opacity-50">
                <div className="h-2 w-8 bg-white/30 rounded-full" />
                <p className="text-[9px] font-mono tracking-widest text-white">SECURE::ENC</p>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-gradient-to-br from-[#EEB38C]/15 to-[#DF8142]/5 rounded-[1.5rem] border border-[#DF8142]/20 dark:border-white/10 p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#92664A] to-[#EEB38C] rounded-l-full" />
            <div className="flex items-start gap-4 pl-4">
              <div className="p-3 bg-[#DF8142]/15 rounded-xl">
                <Zap className="h-5 w-5 text-[#DF8142]" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-tight">Registry Inclusion</h4>
                <p className="text-xs text-[#92664A] dark:text-[#EEB38C]/50 font-medium leading-relaxed mt-1">
                  Student nodes are granted access to the library, assignments, and architectural design resources.
                </p>
              </div>
            </div>
          </div>

          {/* Readiness hint */}
          {formData.first_name && formData.email && formData.university_id && (
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

export default RegisterStudent;
