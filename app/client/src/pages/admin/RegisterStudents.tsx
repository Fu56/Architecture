import { useState } from "react";
import { api } from "../../lib/api";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Loader2,
  Download,
  AlertTriangle,
  Zap,
  Database,
  ArrowRight,
  FileText,
} from "lucide-react";
import { toast } from "../../lib/toast";
import { useSession } from "../../lib/auth-client";

interface UserWithRole {
  id: string | number;
  email: string;
  name?: string;
  role?: { name: string } | string;
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

const RegisterStudents = () => {
  const { data: session } = useSession();
  const requester = session?.user as UserWithRole | undefined;
  const roleName = typeof requester?.role === "string" ? requester.role : (requester?.role as { name?: string })?.name;
  const requesterRole = (roleName || "").toLowerCase();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [uploadResult, setUploadResult] = useState<{
    success: number;
    failed: number;
    results?: RegistrationResult[];
  } | null>(null);

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
    setLoading(true);
    try {
      const reader = new FileReader();
      const safeParseInt = (val: string) => {
        const parsed = parseInt(val);
        return isNaN(parsed) ? undefined : parsed;
      };

      reader.onload = async (e) => {
        const data = e.target?.result;
        if (typeof data === "string") {
          const lines = data.split("\n");
          const students: StudentRow[] = [];
          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
              const values = lines[i].split(",").map((v) => v.trim());
              students.push({
                first_name: values[0] || "",
                last_name: values[1] || "",
                email: values[2] || "",
                university_id: values[3] || undefined,
                batch: safeParseInt(values[4]),
                year: safeParseInt(values[5]),
                semester: safeParseInt(values[6]),
                password: values[7] || undefined,
              });
            }
          }
          setPreview(students);
          validateStudents(students);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error("Error parsing file:", error);
      toast.error("Protocol Error: Failed to parse transmission file");
    } finally {
      setLoading(false);
    }
  };

  const validateStudents = (students: StudentRow[]) => {
    const errorsList: string[] = [];
    const validStudents: StudentRow[] = [];

    students.forEach((student, index) => {
      const rowErrors: string[] = [];
      if (!student.first_name) rowErrors.push(`Unit ${index + 1}: Missing source identity (First Name)`);
      if (!student.last_name) rowErrors.push(`Unit ${index + 1}: Missing source identity (Last Name)`);
      if (!student.email) rowErrors.push(`Unit ${index + 1}: Missing access endpoint (Email)`);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (student.email && !emailRegex.test(student.email)) rowErrors.push(`Unit ${index + 1}: Invalid protocol format (Email)`);
      if (rowErrors.length === 0) validStudents.push(student);
      else errorsList.push(...rowErrors);
    });

    setValidationResult({ valid: errorsList.length === 0, errors: errorsList, students: validStudents });
  };

  const handleUpload = async () => {
    if (!validationResult?.students.length) return;
    setLoading(true);
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
        const message = requesterRole === "admin"
          ? `Broadcasting update: ${response.data.success} nodes integrated. Authorization required.`
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
      setLoading(false);
    }
  };

  const downloadCredentials = () => {
    if (!uploadResult?.results) return;
    const headers = "Email,Password,Status,Error\n";
    const csvContent = uploadResult.results.map((r) => `${r.email},${r.password || "N/A"},${r.status},${r.error || ""}`).join("\n");
    const blob = new Blob([headers + csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nexus_student_credentials.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadTemplate = () => {
    const template = "first_name,last_name,email,university_id,batch,year,semester,password\nJulien,Wright,julien.wright@example.com,U12345,2024,1,1,pass123";
    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nexus_integration_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#5A270F] to-[#1A0B04] rounded-[2.5rem] p-12 shadow-[0_40px_100px_-20px_rgba(90,39,15,0.4)] border border-white/5 group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#DF8142]/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="flex items-center gap-7">
            <div className="h-20 w-20 bg-white/10 border border-white/10 backdrop-blur-md rounded-[1.75rem] flex items-center justify-center shadow-2xl transition-transform group-hover:scale-105 duration-500">
              <Database className="h-9 w-9 text-[#EEB38C]" />
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <div className="h-[1px] w-10 bg-[#EEB38C]/40" />
                <p className="text-[11px] font-black uppercase tracking-[0.6em] text-[#EEB38C]/70">Secure Node Population</p>
              </div>
              <h2 className="text-4xl font-black tracking-tighter text-white uppercase leading-none">
                Bulk Nexus <span className="text-[#DF8142] italic">Integration</span>
              </h2>
              <p className="text-sm text-[#EEB38C]/60 font-medium mt-3 max-w-xl">Deploy large-scale student identification nodes via automated transmission protocols.</p>
            </div>
          </div>
          <button
            onClick={downloadTemplate}
            className="group/btn relative z-10 flex items-center gap-4 px-10 py-5 bg-white text-[#5A270F] rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#EEB38C] transition-all shadow-3xl active:scale-95 border-2 border-white/20"
          >
            <Download className="h-5 w-5 text-[#DF8142] group-hover/btn:-translate-y-1 transition-transform" />
            Fetch Template Protocol
          </button>
        </div>
      </div>

      {/* ── Upload & Validation Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
        <div className="xl:col-span-2 space-y-8">
          {/* Upload Module */}
          <div className="bg-[#FAF8F4] dark:bg-[#1A0B04] p-14 rounded-[3.5rem] border border-[#D9D9C2]/60 dark:border-white/5 shadow-2xl relative group overflow-hidden transition-all hover:shadow-[0_50px_100px_-30px_rgba(90,39,15,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-b from-[#EFEDED]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="text-center space-y-10 relative z-10">
              <div className="h-32 w-32 bg-[#5A270F] rounded-[2.5rem] flex items-center justify-center text-[#EEB38C] mx-auto shadow-2xl ring-8 ring-[#DF8142]/5 transition-transform group-hover:rotate-6 duration-500">
                <FileSpreadsheet className="h-14 w-14" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tight uppercase">Transmission Source</h3>
                <p className="text-[11px] text-[#92664A] dark:text-[#EEB38C]/40 font-bold uppercase tracking-[0.2em]">Deploy CSV or XLSX segments</p>
              </div>
              <label className="cursor-pointer block group/load">
                <span className="flex items-center justify-center gap-4 px-12 py-6 bg-[#5A270F] text-white rounded-[1.25rem] text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#1A0B04] transition-all shadow-2xl shadow-[#5A270F]/30 active:scale-[0.98] group-hover/load:scale-105 duration-300">
                  <Upload className="h-5 w-5 text-[#DF8142] animate-bounce" />
                  Load Matrix Data
                </span>
                <input type="file" accept=".csv,.xlsx,.xls" className="sr-only" onChange={handleFileChange} />
              </label>
              {file && (
                <div className="p-5 bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-200 dark:border-emerald-500/20 rounded-[1.25rem] flex items-center justify-center gap-4 animate-in slide-in-from-top-4">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800 truncate max-w-[240px]">{file.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Validation Status */}
          {validationResult && (
            <div className={`p-12 rounded-[3.5rem] border-2 shadow-2xl animate-in zoom-in-95 duration-500 ${validationResult.valid ? "bg-emerald-50/50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
              <div className="flex items-start gap-8">
                <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl ${validationResult.valid ? "bg-emerald-600 shadow-emerald-600/20" : "bg-rose-600 shadow-rose-600/20"}`}>
                  {validationResult.valid ? <CheckCircle className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
                </div>
                <div className="space-y-4 flex-1">
                  <div>
                    <h3 className={`text-lg font-black uppercase tracking-[0.2em] ${validationResult.valid ? "text-emerald-950" : "text-rose-950"}`}>
                      {validationResult.valid ? "Validation Optimal" : "Integrity Failure"}
                    </h3>
                    <p className={`text-[11px] font-bold uppercase tracking-widest mt-1 ${validationResult.valid ? "text-emerald-700" : "text-rose-600"}`}>
                      {validationResult.students.length} Units verified for population protocol.
                    </p>
                  </div>
                  {!validationResult.valid && (
                    <div className="max-h-56 overflow-y-auto pr-4 space-y-2 mt-6 custom-scrollbar">
                      {validationResult.errors.map((error, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-4 bg-white/80 rounded-xl border border-rose-200/50 text-[10px] font-black text-rose-800 uppercase tracking-tight">
                          <AlertTriangle className="h-4 w-4 text-rose-500" /> {error}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Preview & Action Area ── */}
        <div className="xl:col-span-3">
          {preview.length > 0 ? (
            <div className="bg-[#FAF8F4] dark:bg-[#1A0B04] rounded-[4rem] border border-[#D9D9C2]/60 dark:border-white/5 shadow-3xl overflow-hidden flex flex-col h-full max-h-[850px] animate-in slide-in-from-right-10 duration-700">
              <div className="p-10 border-b border-[#D9D9C2]/40 bg-gradient-to-r from-[#5A270F]/5 to-transparent flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 bg-gradient-to-br from-[#5A270F] to-[#1A0B04] rounded-2xl flex items-center justify-center text-[#EEB38C] shadow-lg shadow-[#5A270F]/20">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-[0.2em]">Transmission Preview</h3>
                    <p className="text-[11px] font-bold text-[#92664A] uppercase tracking-widest mt-1">{preview.length} Pending Nodes Detected</p>
                  </div>
                </div>
              </div>

              <div className="overflow-auto custom-scrollbar flex-1">
                <table className="w-full text-left">
                  <thead className="bg-[#EFEDED]/80 dark:bg-card/80 backdrop-blur-md sticky top-0 z-10 border-b border-[#D9D9C2]/40">
                    <tr>
                      {["Identifier", "Node Identity", "Endpoint", "Protocol Data"].map(h => (
                        <th key={h} className="px-10 py-6 text-[10px] font-black text-[#92664A] uppercase tracking-[0.4em]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D9D9C2]/20">
                    {preview.map((student, idx) => (
                      <tr key={idx} className="hover:bg-white group transition-all duration-300">
                        <td className="px-10 py-7 font-mono text-[10px] font-black text-[#92664A]">
                          <span className="bg-[#EFEDED] dark:bg-card px-4 py-2 rounded-lg border border-[#D9D9C2] dark:border-white/10 tracking-widest group-hover:bg-[#5A270F] group-hover:text-white transition-colors duration-300">
                            {student.university_id || `SEG-${idx + 1}`}
                          </span>
                        </td>
                        <td className="px-10 py-7">
                          <div className="text-sm font-black text-[#5A270F] dark:text-white uppercase transition-colors group-hover:text-[#DF8142]">{student.first_name} {student.last_name}</div>
                          <div className="text-[9px] text-[#92664A]/50 font-black uppercase tracking-[0.2em] mt-1">Institutional Subject</div>
                        </td>
                        <td className="px-10 py-7">
                          <div className="text-[11px] font-bold text-[#5A270F]/70">{student.email}</div>
                        </td>
                        <td className="px-10 py-7">
                          <div className="flex gap-3">
                            <span className="px-3 py-1.5 bg-[#DF8142]/10 text-[#DF8142] text-[10px] font-black rounded-xl border border-[#DF8142]/20 uppercase">B:{student.batch || "0"}</span>
                            <span className="px-3 py-1.5 bg-[#5A270F]/5 text-[#5A270F]/60 text-[10px] font-black rounded-xl border border-[#5A270F]/10 uppercase">Y:{student.year} / S:{student.semester || "0"}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {validationResult?.valid && (
                <div className="p-12 bg-[#5A270F] border-t border-white/10 flex justify-between items-center mt-auto shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center gap-4">
                    <ArrowRight className="h-6 w-6 text-[#DF8142] animate-pulse" />
                    <p className="text-[11px] font-black text-white/50 uppercase tracking-[0.4em]">Final Step: Global Initializing Protocol</p>
                  </div>
                  <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="flex items-center gap-4 px-12 py-5 bg-[#FAF8F4] text-[#5A270F] rounded-[1.25rem] text-[12px] font-black uppercase tracking-[0.3em] hover:bg-[#DF8142] hover:text-white transition-all shadow-3xl active:scale-[0.98] group/btn"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5 text-[#DF8142] group-hover/btn:text-white" />}
                    Deploy {validationResult.students.length} Nodes
                  </button>
                </div>
              )}
            </div>
          ) : !uploadResult ? (
            <div className="h-full min-h-[550px] flex flex-col items-center justify-center bg-[#EFEDED]/60 rounded-[5rem] border-4 border-dashed border-[#D9D9C2] p-20 text-center space-y-10 group overflow-hidden">
               <div className="h-40 w-40 bg-white dark:bg-card rounded-[3.5rem] flex items-center justify-center text-[#D9D9C2] shadow-3xl border-2 border-white/40 relative transform transition-transform group-hover:scale-105 duration-700">
                <Database className="h-20 w-20" />
                <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-transparent via-[#DF8142] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="max-w-lg space-y-5">
                <h2 className="text-4xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter uppercase leading-none">Awaiting Transmission</h2>
                <p className="text-xs text-[#92664A] dark:text-[#EEB38C]/40 font-bold uppercase tracking-[0.3em] leading-loose px-10">Load your institutional matrix protocols to populate the registry segments. Supports automated CSV and spreadsheet integration.</p>
              </div>
            </div>
          ) : (
            /* Success Terminal */
            <div className="bg-[#1A0B04] p-16 rounded-[5rem] border border-white/10 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.6)] relative overflow-hidden animate-in zoom-in-95 duration-1000">
              <div className="absolute -top-24 -right-24 h-96 w-96 bg-[#DF8142]/10 blur-[120px] rounded-full pointer-events-none" />
              <div className="relative z-10 space-y-12">
                <div className="flex items-center gap-8">
                  <div className="h-20 w-20 bg-emerald-500/10 border border-emerald-500/30 rounded-[2.5rem] flex items-center justify-center text-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.1)]">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white tracking-tight uppercase">Segment Populated</h3>
                    <p className="text-[11px] text-white/30 font-black uppercase tracking-[0.4em] mt-2">Operational Matrix Protocol Status: OPTIMAL</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] text-center group hover:bg-white/10 transition-all duration-500 hover:scale-[1.02]">
                    <span className="block text-6xl font-black text-white tracking-tighter group-hover:text-emerald-400 transition-colors">{uploadResult.success}</span>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mt-4 block">Nodes Verified</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] text-center group hover:bg-rose-900/10 transition-all duration-500 hover:scale-[1.02]">
                    <span className="block text-6xl font-black text-white tracking-tighter group-hover:text-rose-400 transition-colors">{uploadResult.failed}</span>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mt-4 block">Packet Failures</span>
                  </div>
                </div>

                <div className="pt-10 border-t border-white/10 flex flex-wrap gap-6">
                  <button onClick={downloadCredentials} className="flex-1 flex items-center justify-center gap-5 px-12 py-6 bg-white text-[#5A270F] rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.3em] hover:bg-[#EEB38C] transition-all shadow-3xl active:scale-95 group/archive">
                    <Download className="h-6 w-6 text-[#DF8142] group-hover/archive:-translate-y-1 transition-transform" />
                    Archive Credentials
                  </button>
                  <button onClick={() => {setUploadResult(null); setFile(null); setPreview([]);}} className="flex-1 px-12 py-6 border-2 border-white/10 text-white/50 rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.3em] hover:bg-white/5 hover:text-white transition-all active:scale-95">
                    Reset Protocol
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterStudents;
