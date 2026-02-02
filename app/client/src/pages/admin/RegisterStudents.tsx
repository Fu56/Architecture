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
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
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
    const errors: string[] = [];
    const validStudents: StudentRow[] = [];

    students.forEach((student, index) => {
      const rowErrors: string[] = [];
      if (!student.first_name)
        rowErrors.push(
          `Unit ${index + 1}: Missing source identity (First Name)`
        );
      if (!student.last_name)
        rowErrors.push(
          `Unit ${index + 1}: Missing source identity (Last Name)`
        );
      if (!student.email)
        rowErrors.push(`Unit ${index + 1}: Missing access endpoint (Email)`);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (student.email && !emailRegex.test(student.email)) {
        rowErrors.push(`Unit ${index + 1}: Invalid protocol format (Email)`);
      }
      if (rowErrors.length === 0) {
        validStudents.push(student);
      } else {
        errors.push(...rowErrors);
      }
    });

    setValidationResult({
      valid: errors.length === 0,
      errors,
      students: validStudents,
    });
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
        toast.success(
          `Broadcasting update: ${response.data.success} nodes successfully integrated`
        );
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
    const csvContent = uploadResult.results
      .map(
        (r) => `${r.email},${r.password || "N/A"},${r.status},${r.error || ""}`
      )
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
    const template =
      "first_name,last_name,email,university_id,batch,year,semester,password\nJulien,Wright,julien.wright@example.com,U12345,2024,1,1,pass123";
    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nexus_integration_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-[#EFEDED] p-10 rounded-[3.5rem] border border-[#D9D9C2] shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="h-16 w-16 bg-[#2A1205] rounded-[1.8rem] flex items-center justify-center text-white shadow-2xl">
            <Database className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-[#2A1205] tracking-tighter uppercase">
              Bulk Nexus Integration
            </h2>
            <p className="text-xs text-gray-500 font-bold tracking-[0.2em] uppercase">
              Student Node Population Protocol
            </p>
          </div>
        </div>
        <button
          onClick={downloadTemplate}
          className="relative z-10 flex items-center gap-3 px-8 py-4 bg-white border-2 border-[#D9D9C2] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-[#2A1205] hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-xl shadow-slate-200/50 active:scale-95"
        >
          <Download className="h-4 w-4" />
          Fetch Template Protocol
        </button>
      </div>

      {/* Upload & Validation Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
        <div className="xl:col-span-2 space-y-10">
          {/* Upload Module */}
          <div className="bg-white p-12 rounded-[3.5rem] border border-[#D9D9C2] shadow-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#EFEDED] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
            <div className="text-center space-y-8">
              <div className="h-24 w-24 bg-[#EFEDED] rounded-[2.5rem] flex items-center justify-center text-[#EEB38C] mx-auto group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-all duration-500">
                <FileSpreadsheet className="h-12 w-12" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#2A1205] tracking-tight">
                  Transmission Source
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-2">
                  Upload CSV or XLSX for processing
                </p>
              </div>
              <div className="relative">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="flex items-center justify-center gap-4 px-10 py-5 bg-[#2A1205] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-2xl shadow-[#3E1C0A]/20 active:scale-95">
                    <Upload className="h-4 w-4" />
                    Load Matrix
                  </span>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {file && (
                <div className="flex items-center justify-center gap-3 p-4 bg-indigo-50 rounded-2xl animate-in slide-in-from-bottom-2">
                  <FileText className="h-4 w-4 text-indigo-500" />
                  <span className="text-[10px] font-black text-[#2A1205] uppercase tracking-widest truncate max-w-[200px]">
                    {file.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Validation Status */}
          {validationResult && (
            <div
              className={`p-10 rounded-[3rem] border animate-in slide-in-from-left-4 duration-500 shadow-xl ${
                validationResult.valid
                  ? "bg-[#5A270F]/5/50 border-emerald-100"
                  : "bg-red-50/50 border-rose-100"
              }`}
            >
              <div className="flex items-start gap-6">
                <div
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                    validationResult.valid ? "bg-[#5A270F]" : "bg-red-700"
                  }`}
                >
                  {validationResult.valid ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <XCircle className="h-6 w-6" />
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3
                      className={`text-sm font-black uppercase tracking-widest ${
                        validationResult.valid
                          ? "text-emerald-950"
                          : "text-rose-950"
                      }`}
                    >
                      {validationResult.valid
                        ? "Validation Optimal"
                        : "Integrity Failure"}
                    </h3>
                    <p
                      className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${
                        validationResult.valid
                          ? "text-[#2A1205]"
                          : "text-rose-600"
                      }`}
                    >
                      {validationResult.students.length} Units Validated for
                      Integration
                    </p>
                  </div>
                  {!validationResult.valid && (
                    <div className="max-h-48 overflow-y-auto pr-4 space-y-2 mt-4 custom-scrollbar">
                      {validationResult.errors.map((error, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-3 bg-white/50 rounded-xl border border-rose-100/50 text-[10px] font-medium text-rose-800"
                        >
                          <AlertTriangle className="h-3 w-3" />
                          {error}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview & Action Area */}
        <div className="xl:col-span-3 space-y-10">
          {preview.length > 0 && (
            <div className="bg-white rounded-[4rem] border border-[#D9D9C2] shadow-3xl overflow-hidden flex flex-col h-full max-h-[700px]">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-[#EFEDED]/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 bg-[#2A1205] rounded-lg flex items-center justify-center text-white">
                    <Zap className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-black text-[#2A1205] uppercase tracking-widest">
                    Pre-Integration Scrutiny ({preview.length} Units)
                  </h3>
                </div>
              </div>
              <div className="overflow-auto custom-scrollbar flex-1">
                <table className="w-full text-left">
                  <thead className="bg-white/90 backdrop-blur-sm sticky top-0 z-10 border-b border-[#D9D9C2]">
                    <tr>
                      {[
                        "Identifier",
                        "Identity",
                        "Endpoint",
                        "Protocol Data",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-8 py-5 text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {preview.map((student, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-[#EFEDED]/50 transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <span className="text-[10px] font-black text-gray-500 font-mono tracking-widest uppercase bg-[#EFEDED] px-3 py-1.5 rounded-lg border border-[#D9D9C2]">
                            {student.university_id || `TMP-${idx + 1}`}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-xs font-black text-[#2A1205] uppercase">
                            {student.first_name} {student.last_name}
                          </div>
                          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                            Matrix Subject
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-xs font-medium text-[#5A270F]/80">
                            {student.email}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex gap-2">
                            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded-md border border-indigo-100 uppercase">
                              B:{student.batch || "0"}
                            </span>
                            <span className="px-2 py-1 bg-[#EFEDED] text-gray-500 text-[9px] font-black rounded-md border border-[#D9D9C2] uppercase">
                              Y:{student.year || "0"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {validationResult?.valid && (
                <div className="p-8 bg-[#2A1205] border-t border-[#3E1C0A] flex justify-between items-center mt-auto">
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" /> Final Step: Sequential
                    Deployment
                  </div>
                  <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="flex items-center gap-4 px-10 py-4 bg-white text-[#2A1205] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all shadow-2xl shadow-white/5 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Zap className="h-4 w-4" />
                    )}
                    Initialize {validationResult.students.length} Nodes
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Default Hero when no preview */}
          {preview.length === 0 && !uploadResult && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-[#EFEDED] rounded-[4rem] border border-dashed border-[#D9D9C2] p-20 text-center space-y-8">
              <div className="h-32 w-32 bg-white rounded-[3rem] flex items-center justify-center text-slate-100 shadow-2xl mb-4">
                <Database className="h-16 w-16" />
              </div>
              <div className="max-w-md space-y-4">
                <h2 className="text-3xl font-black text-[#2A1205] tracking-tighter uppercase leading-none">
                  Awaiting Data Sequential
                </h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-loose">
                  Deploy your integration files to populate the Nexus Student
                  Registry. <br />
                  Supports CSV and Excel protocols.
                </p>
              </div>
            </div>
          )}

          {/* Success Terminal */}
          {uploadResult && (
            <div className="bg-[#2A1205] p-12 rounded-[4rem] border border-white/10 shadow-3xl relative overflow-hidden animate-in zoom-in-95 duration-700">
              <div className="absolute top-0 right-0 p-20 opacity-5">
                <Zap className="h-64 w-64 text-indigo-500" />
              </div>
              <div className="relative z-10 space-y-10">
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-emerald-400 ring-1 ring-white/20">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                      Integration Segment Complete
                    </h3>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-[0.2em] mt-1">
                      Matrix Population Terminal
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                    <span className="block text-4xl font-black text-white">
                      {uploadResult.success}
                    </span>
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                      Successful Nodes
                    </span>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                    <span className="block text-4xl font-black text-white">
                      {uploadResult.failed}
                    </span>
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                      Failed Packets
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex flex-wrap gap-4">
                  <button
                    onClick={downloadCredentials}
                    className="flex-1 flex items-center justify-center gap-4 px-10 py-5 bg-white text-[#2A1205] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-400 hover:text-white transition-all shadow-xl shadow-white/5"
                  >
                    <Download className="h-4 w-4" />
                    Archive Credentials
                  </button>
                  <button
                    onClick={() => {
                      setUploadResult(null);
                      setFile(null);
                      setPreview([]);
                    }}
                    className="flex-1 flex items-center justify-center gap-4 px-10 py-5 bg-white/5 text-white/60 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all"
                  >
                    Reset Terminal
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
