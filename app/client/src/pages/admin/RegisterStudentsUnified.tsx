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
  Hash,
  Upload,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Download,
  AlertTriangle,
  FileText,
  Database,
  ArrowRight,
} from "lucide-react";
import { toast } from "../../lib/toast";
import { useSession } from "../../lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

const RegisterStudentsUnified = () => {
  const { data: session } = useSession();
  const requester = session?.user as UserWithRole | undefined;

  const roleName =
    typeof requester?.role === "string"
      ? requester.role
      : (requester?.role as { name?: string })?.name;

  const requesterRole = (roleName || "").toLowerCase();

  const [activeTab, setActiveTab] = useState<"individual" | "bulk">(
    "individual",
  );

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

  // Bulk State
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<StudentRow[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [uploadResult, setUploadResult] = useState<{
    success: number;
    failed: number;
    results?: RegistrationResult[];
  } | null>(null);

  // Individual Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: StudentFormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIndividualSubmit = async (e: React.FormEvent) => {
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.warn("Protocol Breach: Invalid email syntax detected.");
      return;
    }

    if (formData.password.length < 6) {
      toast.warning("Security breach: Password insufficient length.");
      return;
    }

    if (!formData.agreedToTerms) {
      toast.warning(
        "You must accept the terms and safety protocols before initializing the node.",
      );
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
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(
        error.response?.data?.message ||
          "Protocol Error: Student registration failed",
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
    setFormData((prev: StudentFormData) => ({ ...prev, password }));
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
      setBulkLoading(false);
    }
  };

  const validateStudents = (students: StudentRow[]) => {
    const errors: string[] = [];
    const validStudents: StudentRow[] = [];

    students.forEach((student, index) => {
      const rowErrors: string[] = [];
      if (!student.first_name)
        rowErrors.push(
          `Unit ${index + 1}: Missing source identity (First Name)`,
        );
      if (!student.last_name)
        rowErrors.push(
          `Unit ${index + 1}: Missing source identity (Last Name)`,
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
      .map(
        (r) => `${r.email},${r.password || "N/A"},${r.status},${r.error || ""}`,
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
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-[#EEB38C]/30 shadow-md relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#DF8142]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="h-16 w-16 bg-[#5A270F] rounded-2xl flex items-center justify-center text-white shadow-2xl">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-[#5A270F] tracking-tighter uppercase">
              Student Integration
            </h2>
            <p className="text-xs text-[#92664A] font-bold tracking-[0.2em] uppercase">
              {activeTab === "individual"
                ? "Manual Identity Entry"
                : "Bulk Node Population Protocol"}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#EFEDED] p-1.5 rounded-2xl border border-[#D9D9C2] relative z-10">
          <button
            onClick={() => setActiveTab("individual")}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "individual"
                ? "bg-white text-[#5A270F] shadow-lg"
                : "text-[#92664A] hover:text-[#5A270F]"
            }`}
          >
            Individual
          </button>
          <button
            onClick={() => setActiveTab("bulk")}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "bulk"
                ? "bg-white text-[#5A270F] shadow-lg"
                : "text-[#92664A] hover:text-[#5A270F]"
            }`}
          >
            Bulk Integrate
          </button>
        </div>
      </div>

      {activeTab === "individual" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Individual Form Content */}
          <div className="lg:col-span-7">
            <Card className="shadow-2xl shadow-[#5A270F]/5 border-[#EEB38C]/30 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-[#EFEDED]/50 border-b border-[#EEB38C]/20 p-8">
                <CardTitle className="text-[#5A270F] uppercase tracking-tight font-black">
                  Core Identity
                </CardTitle>
                <CardDescription className="text-[#92664A] font-medium">
                  Enter personal and academic identifiers for the new student.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleIndividualSubmit} className="space-y-6">
                  {/* Grid fields from RegisterStudent... */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[#92664A] font-bold uppercase tracking-widest text-[10px] ml-1">
                        First Name
                      </Label>
                      <Input
                        name="first_name"
                        placeholder="Julian"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        className="rounded-xl border-[#D9D9C2] focus:border-[#DF8142] bg-[#EFEDED]/30 text-[#5A270F] font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#92664A] font-bold uppercase tracking-widest text-[10px] ml-1">
                        Last Name
                      </Label>
                      <Input
                        name="last_name"
                        placeholder="Wright"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        className="rounded-xl border-[#D9D9C2] focus:border-[#DF8142] bg-[#EFEDED]/30 text-[#5A270F] font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[#92664A] font-bold uppercase tracking-widest text-[10px] ml-1">
                        University ID
                      </Label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-2.5 h-4 w-4 text-[#92664A]" />
                        <Input
                          name="university_id"
                          placeholder="U-ARCH-001"
                          className="pl-9 rounded-xl border-[#D9D9C2] focus:border-[#DF8142] bg-[#EFEDED]/30 text-[#5A270F] font-bold"
                          value={formData.university_id}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#92664A] font-bold uppercase tracking-widest text-[10px] ml-1">
                        System Email
                      </Label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-[#92664A]" />
                        <Input
                          name="email"
                          type="email"
                          placeholder="student@nexus.edu"
                          className="pl-9 rounded-xl border-[#D9D9C2] focus:border-[#DF8142] bg-[#EFEDED]/30 text-[#5A270F] font-bold"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#92664A] font-bold uppercase tracking-widest text-[10px] ml-1">
                      Authorization Key
                    </Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Key className="absolute left-3 top-2.5 h-4 w-4 text-[#92664A]" />
                        <Input
                          name="password"
                          type="text"
                          placeholder="Secure credential"
                          className="pl-9 font-mono rounded-xl border-[#D9D9C2] focus:border-[#DF8142] bg-[#EFEDED]/30 text-[#5A270F] font-bold"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generatePassword}
                        className="rounded-xl border-[#D9D9C2] text-[#6C3B1C] font-bold"
                      >
                        <Zap className="h-4 w-4 mr-2 text-[#DF8142]" />
                        Auto
                      </Button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#EEB38C]/20">
                    <div className="flex items-center gap-2 mb-6">
                      <Calendar className="h-4 w-4 text-[#DF8142]" />
                      <h3 className="text-xs font-black uppercase tracking-widest text-[#5A270F]">
                        Academic Period
                      </h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[#92664A] font-bold uppercase tracking-widest text-[10px] ml-1">
                          Batch
                        </Label>
                        <Input
                          name="batch"
                          type="number"
                          placeholder="2024"
                          className="rounded-xl border-[#D9D9C2] bg-[#EFEDED]/30 font-bold"
                          value={formData.batch}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[#92664A] font-bold uppercase tracking-widest text-[10px] ml-1">
                          Year
                        </Label>
                        <Input
                          name="year"
                          type="number"
                          placeholder="1"
                          className="rounded-xl border-[#D9D9C2] bg-[#EFEDED]/30 font-bold"
                          value={formData.year}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[#92664A] font-bold uppercase tracking-widest text-[10px] ml-1">
                          Semester
                        </Label>
                        <Input
                          name="semester"
                          type="number"
                          placeholder="1"
                          className="rounded-xl border-[#D9D9C2] bg-[#EFEDED]/30 font-bold"
                          value={formData.semester}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#EFEDED]/50 p-6 rounded-2xl border border-[#D9D9C2] space-y-4">
                    <div className="flex items-start gap-4">
                      <input
                        id="agreedToTerms"
                        type="checkbox"
                        className="h-5 w-5 rounded-lg border-2 border-[#D9D9C2] text-[#DF8142] accent-[#DF8142]"
                        checked={formData.agreedToTerms}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            agreedToTerms: e.target.checked,
                          }))
                        }
                      />
                      <div className="flex flex-col gap-1">
                        <label
                          htmlFor="agreedToTerms"
                          className="text-[10px] font-black uppercase tracking-widest text-[#5A270F] cursor-pointer"
                        >
                          Accept Operational Protocols
                        </label>
                        <p className="text-[10px] text-[#92664A] font-medium leading-relaxed">
                          By initializing this node, you agree to the{" "}
                          <Link
                            to="/terms"
                            className="text-[#DF8142] underline"
                          >
                            Terms of Operation
                          </Link>
                          .
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#5A270F] text-white py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em]"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <UserPlus className="h-4 w-4 mr-2" />
                    )}
                    Initialize Student Node
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Individual ID Preview */}
          <div className="lg:col-span-5 sticky top-10">
            <Card className="bg-[#5A270F] text-white border-[#EEB38C]/20 shadow-2xl rounded-[3rem] overflow-hidden relative">
              <div className="absolute top-0 right-0 p-32 opacity-20 blur-3xl bg-[#DF8142] rounded-full pointer-events-none" />
              <CardHeader className="p-10 pb-6 relative z-10">
                <div className="flex justify-between items-start">
                  <Award className="h-8 w-8 text-[#DF8142]" />
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-black tracking-[0.3em] text-[#EEB38C]">
                      Access Level
                    </p>
                    <p className="text-2xl font-black tracking-tighter text-white uppercase">
                      Student
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-10 space-y-8 relative z-10 text-center">
                <div className="h-32 w-32 bg-gradient-to-br from-[#DF8142] via-[#6C3B1C] to-[#5A270F] mx-auto rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-2xl border-4 border-[#5A270F]">
                  {formData.first_name?.[0] || "?"}
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight uppercase">
                    {formData.first_name || "Student"} {formData.last_name}
                  </h3>
                  <p className="text-[10px] text-[#EEB38C]/40 font-black uppercase tracking-[0.2em]">
                    {formData.email || "ID: PENDING"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <p className="text-[9px] uppercase tracking-widest text-[#EEB38C]/50 font-black">
                      Batch
                    </p>
                    <p className="text-sm font-bold">
                      {formData.batch || "N/A"}
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <p className="text-[9px] uppercase tracking-widest text-[#EEB38C]/50 font-black">
                      Year/Sem
                    </p>
                    <p className="text-sm font-bold">
                      {formData.year || "0"} / {formData.semester || "0"}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-white/10 bg-black/10 pt-4">
                <p className="text-[9px] font-mono tracking-widest opacity-40 uppercase">
                  Secure Node Protocol::ARCH-S
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Bulk Import UI from RegisterStudents... */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
            <div className="xl:col-span-2 space-y-10">
              <div className="bg-white p-12 rounded-[3.5rem] border border-[#D9D9C2] shadow-3xl relative overflow-hidden group">
                <div className="text-center space-y-8">
                  <div className="h-24 w-24 bg-[#EFEDED] rounded-[2.5rem] flex items-center justify-center text-[#EEB38C] mx-auto">
                    <FileSpreadsheet className="h-12 w-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-[#5A270F] tracking-tight">
                      Transmission Source
                    </h3>
                    <p className="text-xs text-[#92664A] font-medium">
                      Upload CSV or XLSX protocols
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <label className="cursor-pointer">
                      <span className="flex items-center justify-center gap-4 px-10 py-5 bg-[#5A270F] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#6C3B1C] transition-all shadow-xl">
                        <Upload className="h-4 w-4" /> Load Matrix
                      </span>
                      <input
                        type="file"
                        accept=".csv"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <button
                      onClick={downloadTemplate}
                      className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#92664A] hover:text-[#DF8142] transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Fetch Integration Template
                    </button>
                  </div>
                  {file && (
                    <div className="p-4 bg-[#DF8142]/10 rounded-2xl flex items-center justify-center gap-3">
                      <FileText className="h-4 w-4 text-[#DF8142]" />
                      <span className="text-[10px] font-black uppercase tracking-widest truncate">
                        {file.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Validation Results UI... */}
              {validationResult && (
                <div
                  className={`p-8 rounded-[2.5rem] border shadow-lg ${validationResult.valid ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}
                >
                  <div className="flex items-start gap-5">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center text-white ${validationResult.valid ? "bg-emerald-600" : "bg-red-600"}`}
                    >
                      {validationResult.valid ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#5A270F]">
                        {validationResult.valid
                          ? "Validation Optimal"
                          : "Integrity Failure"}
                      </h4>
                      <p className="text-[10px] font-bold text-[#92664A] uppercase mt-1">
                        {validationResult.students.length} Units Ready
                      </p>
                      {!validationResult.valid && (
                        <div className="mt-4 space-y-2 max-h-40 overflow-auto pr-2">
                          {validationResult.errors.map((e, i) => (
                            <p
                              key={i}
                              className="flex items-center gap-2 text-[9px] text-red-700 bg-white/50 p-2 rounded-lg border border-red-100"
                            >
                              <AlertTriangle className="h-3 w-3" />
                              {e}
                            </p>
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
                <div className="bg-white rounded-[3rem] border border-[#D9D9C2] shadow-3xl overflow-hidden flex flex-col max-h-[600px]">
                  <div className="p-6 border-b bg-[#EFEDED]/50 flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#5A270F]">
                      Pre-Integration Scrutiny
                    </h3>
                    <span className="text-[10px] font-bold text-[#92664A]">
                      {preview.length} Nodes
                    </span>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <table className="w-full text-left">
                      <thead className="bg-[#EFEDED]/30 sticky top-0 backdrop-blur-md">
                        <tr>
                          {["Identity", "Endpoint", "Protocol"].map((h) => (
                            <th
                              key={h}
                              className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[#92664A]"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {preview.map((s, i) => (
                          <tr
                            key={i}
                            className="border-t border-[#EFEDED] hover:bg-[#EFEDED]/30 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <p className="text-xs font-black text-[#5A270F] uppercase">
                                {s.first_name} {s.last_name}
                              </p>
                              <p className="text-[9px] text-[#92664A] font-bold mt-0.5">
                                {s.university_id}
                              </p>
                            </td>
                            <td className="px-6 py-4 text-xs font-medium text-[#5A270F]/70">
                              {s.email}
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-[9px] font-black uppercase bg-[#DF8142]/10 text-[#DF8142] px-2 py-1 rounded">
                                B:{s.batch}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {validationResult?.valid && (
                    <div className="p-6 bg-[#5A270F] flex justify-between items-center">
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                        <ArrowRight className="h-4 w-4" /> Ready for Sequential
                        Deployment
                      </p>
                      <button
                        onClick={handleBulkUpload}
                        disabled={bulkLoading}
                        className="px-8 py-3 bg-white text-[#5A270F] text-[10px] font-black uppercase rounded-xl hover:bg-[#DF8142] hover:text-white transition-all"
                      >
                        {bulkLoading ? "In Progress..." : "Initialize Nodes"}
                      </button>
                    </div>
                  )}
                </div>
              ) : uploadResult ? (
                <div className="bg-[#5A270F] p-12 rounded-[3.5rem] text-white shadow-3xl text-center space-y-8 animate-in zoom-in-95">
                  <div className="h-20 w-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-500/10">
                    <CheckCircle className="h-10 w-10 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">
                      Integration Segment Complete
                    </h3>
                    <div className="flex justify-center gap-6 mt-6">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10 min-w-[120px]">
                        <p className="text-3xl font-black text-emerald-400">
                          {uploadResult.success}
                        </p>
                        <p className="text-[9px] font-black uppercase text-white/40 tracking-widest mt-1">
                          Success
                        </p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10 min-w-[120px]">
                        <p className="text-3xl font-black text-rose-400">
                          {uploadResult.failed}
                        </p>
                        <p className="text-[9px] font-black uppercase text-white/40 tracking-widest mt-1">
                          Failed
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-6">
                    <button
                      onClick={downloadCredentials}
                      className="flex-1 py-4 bg-white text-[#5A270F] rounded-2xl text-[10px] font-black uppercase tracking-widest"
                    >
                      Archive Credentials
                    </button>
                    <button
                      onClick={() => setUploadResult(null)}
                      className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase"
                    >
                      New Integration
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[400px] bg-[#EFEDED] rounded-[3rem] border-2 border-dashed border-[#D9D9C2] flex flex-col items-center justify-center text-center p-12 space-y-6">
                  <Database className="h-16 w-16 text-[#D9D9C2]" />
                  <div className="max-w-xs">
                    <h4 className="text-sm font-black text-[#5A270F] uppercase tracking-widest">
                      Awaiting Data Segment
                    </h4>
                    <p className="text-[10px] text-[#92664A] font-medium mt-2 leading-relaxed">
                      Population of the Nexus through bulk transmission protocol
                      requires a valid CSV source.
                    </p>
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
