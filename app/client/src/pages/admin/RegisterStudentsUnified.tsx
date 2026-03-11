import { useState } from "react";
import * as XLSX from "xlsx";
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
  Upload,
  FileSpreadsheet,
  CheckCircle,
  Download,
  AlertTriangle,
  FileText,
  Database,
  ArrowRight,
  RefreshCw,
  XCircle,
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

interface StudentRow {
  first_name: string;
  last_name: string;
  email: string;
  university_id?: string;
  batch?: number;
  year?: number;
  semester?: number;
  password?: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  students: StudentRow[];
}

interface RegistrationResult {
  email: string;
  password?: string;
  status: string;
  error?: string;
}

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="flex items-center gap-1.5 text-rose-500 text-[10px] font-black uppercase tracking-wider ml-1 animate-in slide-in-from-top-1 mt-1">
      <AlertTriangle className="h-3 w-3" /> {message}
    </p>
  ) : null;

const RegisterStudentsUnified = () => {
  const { data: session } = useSession();
  const requester = session?.user as UserWithRole | undefined;

  const roleName =
    typeof requester?.role === "string"
      ? requester.role
      : (requester?.role as { name?: string })?.name;

  const requesterRole = (roleName || "").toLowerCase();

  const [activeTab, setActiveTab] = useState<"individual" | "bulk">("individual");

  // Individual Form State
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

  const [errors, setErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({});
  const [loading, setLoading] = useState(false);

  // Bulk State
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<StudentRow[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [uploadResult, setUploadResult] = useState<{
    success: number;
    failed: number;
    results?: RegistrationResult[];
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: StudentFormData) => ({ ...prev, [name]: value }));
    if (errors[name as keyof StudentFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateIndividualForm = (): boolean => {
    const newErrors: Partial<Record<keyof StudentFormData, string>> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.first_name.trim()) newErrors.first_name = "First name required.";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name required.";
    if (!formData.university_id.trim()) newErrors.university_id = "University ID required.";
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
    if (!formData.batch) newErrors.batch = "Batch period required.";
    if (!formData.year) newErrors.year = "Academic year required.";
    if (!formData.semester) newErrors.semester = "Academic semester required.";
    if (!formData.agreedToTerms) newErrors.agreedToTerms = "Terms must be accepted.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleIndividualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateIndividualForm()) {
      toast.warning("Validation Failed: Check node specifications.");
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
          ? "Student Node initialized: Authorization required for activation."
          : "Student Node initialized and activated successfully.";

      toast.success(message);
      setFormData({
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
    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
  };

  // Bulk Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview([]);
      setValidationResult(null);
      setUploadResult(null);
      parseExcelFile(selectedFile);
    }
  };

  const parseExcelFile = async (file: File) => {
    setBulkLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];

          const students: StudentRow[] = jsonData.map((row) => ({
            first_name: row.first_name?.toString() || "",
            last_name: row.last_name?.toString() || "",
            email: row.email?.toString() || "",
            university_id: row.university_id?.toString() || undefined,
            batch: row.batch ? parseInt(row.batch.toString()) : undefined,
            year: row.year ? parseInt(row.year.toString()) : undefined,
            semester: row.semester ? parseInt(row.semester.toString()) : undefined,
            password: row.password?.toString() || undefined,
          }));

          setPreview(students);
          validateStudents(students);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error parsing file:", error);
      toast.error("Protocol Error: Failed to parse transmission file");
    } finally {
      setBulkLoading(false);
    }
  };

  const validateStudents = (students: StudentRow[]) => {
    const errorsList: string[] = [];
    const validStudents: StudentRow[] = [];

    students.forEach((student, index) => {
      const rowErrors: string[] = [];
      if (!student.first_name) rowErrors.push(`Unit ${index + 1}: Missing source identity (First Name)`);
      if (!student.last_name) rowErrors.push(`Unit ${index + 1}: Missing source identity (Last Name)`);
      if (!student.email) rowErrors.push(`Unit ${index + 1}: Missing endpoint (Email)`);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (student.email && !emailRegex.test(student.email)) rowErrors.push(`Unit ${index + 1}: Invalid protocol format (Email)`);
      
      if (rowErrors.length === 0) validStudents.push(student);
      else errorsList.push(...rowErrors);
    });

    setValidationResult({ valid: errorsList.length === 0, errors: errorsList, students: validStudents });
  };

  const handleBulkUpload = async () => {
    if (!validationResult?.students.length) return;
    setBulkLoading(true);
    try {
      const response = await api.post("/admin/users/bulk-register", {
        students: validationResult.students,
        role: "Student",
      });
      setUploadResult({
        success: response.data.success || 0,
        failed: response.data.failed || 0,
        results: response.data.results,
      });
      if (response.data.success > 0) {
        const message =
          requesterRole === "admin"
            ? `Broadcasting update: ${response.data.success} nodes integrated. Authorization required for activation.`
            : `Broadcasting update: ${response.data.success} nodes successfully integrated`;
        toast.success(message);
        setFile(null);
        setPreview([]);
        setValidationResult(null);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Protocol Breach: Bulk registration failed");
    } finally {
      setBulkLoading(false);
    }
  };

  const downloadCredentials = () => {
    if (!uploadResult?.results) return;
    const headers = "Email,Password,Status,Error\n";
    const csvContent = uploadResult.results
      .map((r) => `${r.email},${r.password || "N/A"},${r.status},${r.error || ""}`)
      .join("\n");
    const blob = new Blob([headers + csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nexus_student_credentials.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadTemplate = () => {
    const headers = [["first_name", "last_name", "email", "university_id", "batch", "year", "semester", "password"]];
    const example = [["Julien", "Wright", "julien.wright@example.com", "U12345", 2024, 1, 1, "pass123"]];
    const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...example]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Integration Template");
    XLSX.writeFile(workbook, "nexus_integration_template.xlsx");
    toast.success("Operational Matrix Template synchronized.");
  };

  const inputBase = (hasError: boolean) =>
    `w-full rounded-[0.875rem] border-2 px-4 py-3.5 text-sm font-bold outline-none transition-all duration-300 ${
      hasError
        ? "border-rose-400 bg-rose-50 dark:bg-rose-900/10 text-rose-800 dark:text-rose-300 ring-4 ring-rose-400/10"
        : "border-[#D9D9C2]/60 dark:border-white/10 bg-white dark:bg-white/5 text-[#5A270F] dark:text-white focus:border-[#DF8142] focus:ring-4 focus:ring-[#DF8142]/10"
    }`;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* ── Unified Page Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#5A270F] to-[#6C3B1C] rounded-[2.5rem] p-10 shadow-[0_30px_80px_-20px_rgba(90,39,15,0.5)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#DF8142]/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 bg-white/10 border border-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center shadow-2xl">
              <GraduationCap className="h-8 w-8 text-[#EEB38C]" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="h-[1px] w-8 bg-[#EEB38C]/40" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#EEB38C]/70">Institutional Registry</p>
              </div>
              <h2 className="text-4xl font-black tracking-tighter text-white uppercase leading-none">
                Student <span className="text-[#DF8142] italic">Integration</span>
              </h2>
              <p className="text-sm text-[#EEB38C]/60 font-medium mt-2">
                {activeTab === "individual" 
                  ? "Initialize individual student nodes within the system registry." 
                  : "Deploy bulk student population protocols via encrypted data matrix."}
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-black/20 backdrop-blur-md p-1.5 rounded-[1.25rem] border border-white/10 self-start lg:self-center">
            <button
              onClick={() => setActiveTab("individual")}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === "individual"
                  ? "bg-[#FAF8F4] text-[#5A270F] shadow-xl scale-105"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <UserPlus className="h-4 w-4" /> Individual
            </button>
            <button
              onClick={() => setActiveTab("bulk")}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === "bulk"
                  ? "bg-[#FAF8F4] text-[#5A270F] shadow-xl scale-105 ml-1"
                  : "text-white/60 hover:text-white ml-1"
              }`}
            >
              <Database className="h-4 w-4" /> Bulk Pop
            </button>
          </div>
        </div>
      </div>

      {activeTab === "individual" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Individual Form Panel */}
          <div className="lg:col-span-7 space-y-6">
            {/* Identity Section */}
            <div className="bg-[#FAF8F4] dark:bg-[#1A0B04] rounded-[2rem] border border-[#D9D9C2]/40 dark:border-white/5 shadow-[0_8px_30px_-8px_rgba(90,39,15,0.08)] overflow-hidden">
              <div className="flex items-center gap-4 px-8 py-6 border-b border-[#D9D9C2]/40 dark:border-white/5 bg-gradient-to-r from-[#5A270F]/5 to-transparent">
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#5A270F] to-[#6C3B1C] text-[#EEB38C] text-xs font-black shadow-lg shadow-[#5A270F]/20">01</div>
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C]">Core Identity</h4>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-[#D9D9C2] to-transparent dark:from-white/10" />
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1">First Name</label>
                    <input name="first_name" placeholder="Julian" value={formData.first_name} onChange={handleChange} className={inputBase(!!errors.first_name)} />
                    <FieldError message={errors.first_name} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1">Last Name</label>
                    <input name="last_name" placeholder="Wright" value={formData.last_name} onChange={handleChange} className={inputBase(!!errors.last_name)} />
                    <FieldError message={errors.last_name} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1">University ID</label>
                    <div className="relative">
                      <Hash className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${errors.university_id ? "text-rose-400" : "text-[#92664A]/50"}`} />
                      <input name="university_id" placeholder="U-ARCH-001" value={formData.university_id} onChange={handleChange} className={`${inputBase(!!errors.university_id)} pl-11 font-mono`} />
                    </div>
                    <FieldError message={errors.university_id} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1">System Email</label>
                    <div className="relative">
                      <AtSign className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${errors.email ? "text-rose-400" : "text-[#92664A]/50"}`} />
                      <input name="email" type="email" placeholder="student@nexus.edu" value={formData.email} onChange={handleChange} className={`${inputBase(!!errors.email)} pl-11`} />
                    </div>
                    <FieldError message={errors.email} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1">Authorization Key</label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Key className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${errors.password ? "text-rose-400" : "text-[#92664A]/50"}`} />
                      <input name="password" type="text" placeholder="Secure credential" value={formData.password} onChange={handleChange} className={`${inputBase(!!errors.password)} pl-11 font-mono`} />
                    </div>
                    <button
                      type="button"
                      onClick={generatePassword}
                      title="Generate Secure Password"
                      className="px-5 py-3.5 bg-[#5A270F] text-[#EEB38C] rounded-[0.875rem] hover:bg-[#1A0B04] transition-all border border-white/5 shadow-lg active:scale-95"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                  <FieldError message={errors.password} />
                </div>
              </div>
            </div>

            {/* Academic Period Section */}
            <div className="bg-[#FAF8F4] dark:bg-[#1A0B04] rounded-[2rem] border border-[#D9D9C2]/40 dark:border-white/5 shadow-[0_8px_30px_-8px_rgba(90,39,15,0.08)] overflow-hidden">
              <div className="flex items-center gap-4 px-8 py-6 border-b border-[#D9D9C2]/40 dark:border-white/5 bg-gradient-to-r from-[#5A270F]/5 to-transparent">
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#5A270F] to-[#6C3B1C] text-[#EEB38C] text-xs font-black shadow-lg shadow-[#5A270F]/20">02</div>
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C]">Academic Period</h4>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-[#D9D9C2] to-transparent dark:from-white/10" />
              </div>
              <div className="p-8">
                <div className="grid grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1">Batch</label>
                    <div className="relative">
                      <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#92664A]/40" />
                      <input name="batch" type="number" placeholder="2024" value={formData.batch} onChange={handleChange} className={`${inputBase(!!errors.batch)} pl-11 font-mono`} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1">Year</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#92664A]/40" />
                      <input name="year" type="number" placeholder="1" value={formData.year} onChange={handleChange} className={`${inputBase(!!errors.year)} pl-11 font-mono`} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1">Semester</label>
                    <input name="semester" type="number" placeholder="1" value={formData.semester} onChange={handleChange} className={`${inputBase(!!errors.semester)} font-mono`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className={`rounded-[1.5rem] border-2 p-6 transition-all duration-300 ${errors.agreedToTerms ? "border-rose-400 bg-rose-50/60" : "border-[#D9D9C2]/60 bg-[#FAF8F4] dark:bg-[#1A0B04]"}`}>
              <div className="flex items-start gap-4">
                <div className="relative flex items-center h-6 pt-0.5">
                  <input
                    id="agreedToTerms"
                    type="checkbox"
                    className="h-5 w-5 rounded-lg border-2 border-[#D9D9C2] cursor-pointer accent-[#DF8142]"
                    checked={formData.agreedToTerms}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, agreedToTerms: e.target.checked }));
                      if (errors.agreedToTerms) setErrors((prev) => ({ ...prev, agreedToTerms: undefined }));
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="agreedToTerms" className={`text-[10px] font-black uppercase tracking-widest cursor-pointer ${errors.agreedToTerms ? "text-rose-700" : "text-[#5A270F] dark:text-[#EEB38C]"}`}>
                    Accept Operational Protocols
                  </label>
                  <p className="text-[10px] text-[#92664A] dark:text-[#EEB38C]/40 font-medium leading-relaxed">
                    By initializing this node, you agree to the{" "}
                    <Link to="/terms" className="text-[#DF8142] underline">Terms of Operation</Link>. Prohibits malicious files and illegal content.
                  </p>
                  <FieldError message={errors.agreedToTerms} />
                </div>
              </div>
            </div>

            <button
              onClick={handleIndividualSubmit}
              disabled={loading}
              className="w-full py-5 bg-[#5A270F] text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-[1.25rem] hover:bg-[#1A0B04] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_-12px_rgba(90,39,15,0.4)] disabled:opacity-50 active:scale-95 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
              {loading ? <Loader2 className="h-4 w-4 animate-spin text-[#EEB38C]" /> : <UserPlus className="h-4 w-4 text-[#DF8142]" />}
              Initialize Student Node
            </button>
          </div>

          {/* ID Preview Sidebar */}
          <div className="lg:col-span-5 sticky top-10 space-y-6">
            <div className="bg-[#5A270F] rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(90,39,15,0.5)] border border-white/5 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#DF8142]/25 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative z-10 p-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="h-12 w-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                    <Award className="h-6 w-6 text-[#DF8142]" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-black tracking-[0.3em] text-[#EEB38C]/60">Access Level</p>
                    <p className="text-2xl font-black tracking-tighter text-white">STUDENT</p>
                  </div>
                </div>

                <div className="text-center space-y-4 mb-10">
                  <div className="h-32 w-32 bg-gradient-to-br from-[#DF8142] via-[#6C3B1C] to-[#5A270F] mx-auto rounded-[2rem] flex items-center justify-center text-5xl font-black text-white shadow-2xl border-4 border-white/10 transition-transform hover:scale-105 duration-500">
                    {formData.first_name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight uppercase text-white">
                      {formData.first_name || "Student"} {formData.last_name || "Member"}
                    </h3>
                    <p className="text-[10px] text-[#EEB38C]/40 font-bold uppercase tracking-[0.3em] mt-1">
                      {formData.email || "email: pending"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#EEB38C]/40 font-black mb-1">University ID</p>
                    <p className="text-sm font-bold text-white font-mono">{formData.university_id || "not_assigned"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-[#EEB38C]/40 font-black mb-1">Batch</p>
                      <p className="text-base font-black text-[#DF8142]">{formData.batch || "—"}</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-[#EEB38C]/40 font-black mb-1">Year/Sem</p>
                      <p className="text-base font-black text-white">{formData.year || "?"} / {formData.semester || "?"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center opacity-40 italic">
                  <div className="h-2 w-10 bg-[#EEB38C] rounded-full" />
                  <p className="text-[9px] font-mono tracking-widest text-white">SECURE::ENC::ARCH</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#EEB38C]/15 to-[#DF8142]/5 rounded-[1.5rem] border border-[#DF8142]/20 p-6 flex items-start gap-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#DF8142]" />
              <div className="p-3 bg-[#DF8142]/15 rounded-xl">
                <Zap className="h-5 w-5 text-[#DF8142]" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#5A270F] uppercase tracking-tight">System Registry</h4>
                <p className="text-xs text-[#92664A] font-medium leading-relaxed mt-1">Student nodes must undergo verification by the Department Head before full system activation.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Bulk Tab View */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-[#FAF8F4] dark:bg-[#1A0B04] p-12 rounded-[3.5rem] border border-[#D9D9C2]/60 dark:border-white/10 shadow-2xl text-center space-y-8 relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#EFEDED]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="h-28 w-28 bg-[#5A270F] rounded-[2.5rem] flex items-center justify-center text-[#EEB38C] mx-auto shadow-2xl relative z-10">
                  <FileSpreadsheet className="h-12 w-12" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tight uppercase">Bulk Registry Load</h3>
                  <p className="text-xs text-[#92664A] dark:text-[#EEB38C]/40 font-bold uppercase tracking-widest mt-2 px-10">Deploy CSV or Excel protocols for fast matrix population.</p>
                </div>
                
                <div className="flex flex-col gap-4 relative z-10 px-6">
                  <label className="cursor-pointer group">
                    <span className="flex items-center justify-center gap-4 px-10 py-5 bg-[#DF8142] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#5A270F] transition-all duration-300 shadow-2xl shadow-[#DF8142]/30 active:scale-95">
                      <Upload className="h-4 w-4" /> Load Matrix File
                    </span>
                    <input type="file" accept=".csv,.xlsx,.xls" className="sr-only" onChange={handleFileChange} />
                  </label>
                  <button onClick={downloadTemplate} className="text-[10px] font-black uppercase tracking-widest text-[#92664A] hover:text-[#5A270F] dark:text-[#EEB38C]/40 dark:hover:text-[#EEB38C] flex items-center justify-center gap-2 transition-colors">
                    <Download className="h-4 w-4" /> Get Protocol Template
                  </button>
                </div>

                {file && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl flex items-center justify-center gap-3 animate-in slide-in-from-top-2">
                    <FileText className="h-4 w-4 text-emerald-600" />
                    <span className="text-[10px] font-black uppercase text-emerald-700 truncate max-w-[220px] tracking-widest">{file.name}</span>
                  </div>
                )}
              </div>

              {validationResult && (
                <div className={`p-10 rounded-[2.5rem] border-2 shadow-2xl animate-in zoom-in-95 duration-500 ${validationResult.valid ? "bg-emerald-50/50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
                  <div className="flex items-start gap-6">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-xl ${validationResult.valid ? "bg-emerald-600" : "bg-rose-600"}`}>
                      {validationResult.valid ? <CheckCircle className="h-7 w-7" /> : <XCircle className="h-7 w-7" />}
                    </div>
                    <div className="space-y-3 flex-1 pt-1">
                      <h4 className={`text-sm font-black uppercase tracking-widest ${validationResult.valid ? "text-emerald-950" : "text-rose-950"}`}>
                        {validationResult.valid ? "Validation Optimal" : "Protocol Corruption"}
                      </h4>
                      <p className={`text-[10px] font-bold uppercase tracking-widest leading-relaxed ${validationResult.valid ? "text-emerald-700" : "text-rose-700"}`}>
                        {validationResult.valid 
                          ? `${validationResult.students.length} Student segments verified for deployment.` 
                          : `${validationResult.errors.length} Integrity errors detected in transmission file.`}
                      </p>
                      {!validationResult.valid && (
                        <div className="max-h-48 overflow-y-auto mt-4 pr-3 custom-scrollbar space-y-2">
                          {validationResult.errors.map((err, i) => (
                            <div key={i} className="bg-white/60 p-3 rounded-xl border border-rose-200 text-[10px] font-bold text-rose-800 flex items-center gap-2">
                              <AlertTriangle className="h-3 w-3" /> {err}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="xl:col-span-3">
              {preview.length > 0 ? (
                <div className="bg-[#FAF8F4] dark:bg-[#1A0B04] rounded-[3.5rem] border border-[#D9D9C2]/60 dark:border-white/10 shadow-3xl overflow-hidden flex flex-col h-full max-h-[750px] animate-in fade-in slide-in-from-right-6 duration-700">
                  <div className="p-8 border-b border-[#D9D9C2]/40 dark:border-white/5 bg-gradient-to-r from-[#5A270F]/5 to-transparent flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-[#5A270F] rounded-xl flex items-center justify-center text-[#EEB38C] shadow-lg">
                        <Zap className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-[0.2em]">Transmission Preview</h4>
                        <p className="text-[10px] font-bold text-[#92664A] uppercase tracking-widest mt-0.5">{preview.length} Pending Integrations</p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-auto flex-1 custom-scrollbar">
                    <table className="w-full text-left">
                      <thead className="bg-[#FAF8F4] dark:bg-[#1A0B04] border-b border-[#D9D9C2]/40 sticky top-0 z-10 transition-colors">
                        <tr>
                          {["Identity", "Endpoint", "Protocol Data"].map(h => (
                            <th key={h} className="px-10 py-5 text-[9px] font-black text-[#92664A] uppercase tracking-[0.4em]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D9D9C2]/20">
                        {preview.map((s, i) => (
                          <tr key={i} className="hover:bg-white/50 group transition-colors">
                            <td className="px-10 py-6">
                              <p className="text-xs font-black text-[#5A270F] dark:text-white uppercase tracking-tight group-hover:text-[#DF8142] transition-colors">{s.first_name} {s.last_name}</p>
                              <p className="text-[9px] font-black text-[#92664A]/40 uppercase tracking-widest mt-1">ID: {s.university_id || "PENDING"}</p>
                            </td>
                            <td className="px-10 py-6">
                              <p className="text-xs font-bold text-[#5A270F]/70 dark:text-white/60">{s.email}</p>
                            </td>
                            <td className="px-10 py-6">
                              <div className="flex gap-2">
                                <span className="px-2.5 py-1 bg-[#DF8142]/10 text-[#DF8142] text-[9px] font-black rounded-lg border border-[#DF8142]/20 whitespace-nowrap uppercase">B:{s.batch || "?"}</span>
                                <span className="px-2.5 py-1 bg-[#5A270F]/5 text-[#5A270F]/60 text-[9px] font-black rounded-lg border border-[#5A270F]/10 whitespace-nowrap uppercase">Y:{s.year || "?"}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {validationResult?.valid && (
                    <div className="p-10 bg-[#5A270F] border-t border-white/10 flex justify-between items-center mt-auto">
                      <div className="flex items-center gap-3">
                        <ArrowRight className="h-5 w-5 text-[#DF8142] animate-pulse" />
                        <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">Ready for Massive Deployment</span>
                      </div>
                      <button
                        onClick={handleBulkUpload}
                        disabled={bulkLoading}
                        className="px-10 py-4 bg-[#FAF8F4] text-[#5A270F] rounded-[1rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#DF8142] hover:text-white transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex items-center gap-3"
                      >
                        {bulkLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                        Execute Pop Protocol
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-[#FAF8F4] dark:bg-card/5 rounded-[3.5rem] border-3 border-dashed border-[#D9D9C2]/40 dark:border-white/5 p-20 text-center space-y-8 animate-in fade-in duration-1000">
                  <div className="h-32 w-32 bg-white dark:bg-card/10 rounded-[3rem] flex items-center justify-center text-[#D9D9C2]/60 shadow-2xl border border-white/10 relative overflow-hidden group">
                    <Database className="h-14 w-14 transition-transform group-hover:scale-110 duration-500" />
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#DF8142]/30 to-transparent" />
                  </div>
                  <div className="max-w-md space-y-4">
                    <h3 className="text-3xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter uppercase leading-tight">Waiting for Matrix Data</h3>
                    <p className="text-xs text-[#92664A] dark:text-[#EEB38C]/30 font-bold uppercase tracking-[0.2em] leading-relaxed">
                      Initialize the transmission process by loading a CSV or Excel student population protocol.
                    </p>
                  </div>
                </div>
              )}

              {/* Upload Result Terminal */}
              {uploadResult && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-[#1A0B04]/70 animate-in fade-in duration-500">
                  <div className="bg-[#FAF8F4] w-full max-w-2xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 overflow-hidden animate-in zoom-in-95 duration-500">
                    <div className="bg-gradient-to-br from-[#5A270F] to-[#1A0B04] p-10 text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full" />
                      <div className="relative z-10 space-y-4">
                        <div className="h-20 w-20 bg-emerald-500/20 rounded-[2rem] flex items-center justify-center text-emerald-400 mx-auto border border-emerald-500/30">
                          <CheckCircle className="h-10 w-10" />
                        </div>
                        <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Integration Sequence Complete</h3>
                        <p className="text-[10px] font-black tracking-[0.4em] text-emerald-400/70 uppercase">Nexus Segments Population Terminal</p>
                      </div>
                    </div>
                    
                    <div className="p-12 space-y-10">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-[#5A270F]/5 p-8 rounded-[2rem] border-2 border-[#5A270F]/10 text-center group transition-all hover:bg-[#5A270F] hover:scale-105 duration-500">
                          <span className="block text-5xl font-black text-[#5A270F] group-hover:text-white transition-colors">{uploadResult.success}</span>
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#92664A] group-hover:text-white/50 mt-2 block transition-colors">Nodes Activated</span>
                        </div>
                        <div className="bg-[#5A270F]/5 p-8 rounded-[2rem] border-2 border-[#5A270F]/10 text-center group transition-all hover:bg-rose-600 hover:scale-105 duration-500">
                          <span className="block text-5xl font-black text-[#5A270F] group-hover:text-white transition-colors">{uploadResult.failed}</span>
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#92664A] group-hover:text-white/50 mt-2 block transition-colors">Packet Drops</span>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button onClick={downloadCredentials} className="flex-1 flex items-center justify-center gap-4 py-5 bg-[#5A270F] text-white rounded-[1.25rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#1A0B04] transition-all shadow-xl active:scale-95">
                          <Download className="h-5 w-5 text-[#EEB38C]" /> Archive Credentials
                        </button>
                        <button onClick={() => {setUploadResult(null); setFile(null); setPreview([]);}} className="flex-1 py-5 border-2 border-[#D9D9C2] text-[#92664A] rounded-[1.25rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#FAF8F4] transition-all active:scale-95">
                          Terminate Terminal
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterStudentsUnified;
