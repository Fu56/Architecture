import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { api } from "../../lib/api";
import {
  UploadCloud,
  Loader2,
  Shield,
  Info,
  CheckCircle2,
  FileText,
  Database,
  Zap,
  Tag,
  AtSign,
  ArrowRight,
} from "lucide-react";
import { toast } from "../../lib/toast";
import type { DesignStage } from "../../models";
import { useSession } from "../../lib/auth-client";
import Select from "../../components/ui/Select";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState({
    title: "",
    author: "",
    keywords: "",
    design_stage_id: "",
    customStageName: "",
    forYearStudents: "",
    semester: "",
    batch: "",
    isPriority: false,
    agreedToTerms: false,
  });
  const [designStages, setDesignStages] = useState<DesignStage[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  interface UserWithRole {
    role?: string | { name: string };
  }

  const { data: session } = useSession();
  const user = session?.user as unknown as UserWithRole;
  const userRole =
    typeof user?.role === "object" ? user.role.name : user?.role || "";

  const navigate = useNavigate();
  const location = useLocation();
  const isBaseAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const { data } = await api.get("/common/design-stages");
        setDesignStages(data);
      } catch {
        toast.error("Network synchronization error: Design stages unavailable");
      }
    };
    fetchStages();
  }, []);

  const FieldError = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mt-2 ml-1 animate-in fade-in slide-in-from-top-1">
        {message}
      </p>
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setErrors((prev) => ({ ...prev, file: "" }));
      toast.info(`Asset identified: ${e.target.files[0].name}`);
    }
  };

  const handleMetaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setMetadata({ ...metadata, [name]: val });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!file) newErrors.file = "File is required.";
    if (!metadata.title.trim()) newErrors.title = "Title is required.";
    if (!metadata.author.trim()) newErrors.author = "Author is required.";
    if (!metadata.keywords.trim()) newErrors.keywords = "Keywords are required.";
    if (!metadata.design_stage_id) newErrors.design_stage_id = "Design stage is required.";
    if (metadata.design_stage_id === "others" && !metadata.customStageName.trim())
      newErrors.customStageName = "Custom stage name is required.";

    const yearNum = parseInt(metadata.forYearStudents);
    if (!metadata.forYearStudents.trim() || isNaN(yearNum) || yearNum < 1 || yearNum > 5)
      newErrors.forYearStudents = "Year must be 1–5.";

    if (!metadata.semester.trim()) {
      newErrors.semester = "Semester is required.";
    } else {
      const semNum = parseInt(metadata.semester);
      if (isNaN(semNum) || semNum < 1 || semNum > 2) newErrors.semester = "Semester must be 1 or 2.";
    }

    if (!metadata.batch || isNaN(parseInt(metadata.batch)))
      newErrors.batch = "Batch year is required.";
    if (!metadata.agreedToTerms) newErrors.agreedToTerms = "You must agree to the terms.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setErrors({});

    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("title", metadata.title);
    formData.append("author", metadata.author);
    formData.append("keywords", metadata.keywords);
    formData.append("design_stage_id", metadata.design_stage_id);
    if (metadata.design_stage_id === "others")
      formData.append("design_stage_name", metadata.customStageName);
    formData.append("forYearStudents", metadata.forYearStudents);
    if (metadata.semester) formData.append("semester", metadata.semester);
    if (metadata.batch) formData.append("batch", metadata.batch);
    if (metadata.isPriority) formData.append("priority_tag", "Faculty Priority");

    try {
      const { data } = await api.post("/resources", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Resource uploaded successfully!");
      if (isBaseAdmin) navigate("/admin/resources");
      else navigate(`/resources/${data.id}`);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* shared input style */
  const inputCls = (hasError: boolean) =>
    `w-full bg-white dark:bg-white/5 border-2 rounded-xl px-4 py-3
     text-xs font-semibold text-[#5A270F] dark:text-[#EEB38C]
     placeholder:text-[#92664A]/40 dark:placeholder:text-white/20
     focus:border-[#DF8142] focus:outline-none focus:ring-4 focus:ring-[#DF8142]/10
     transition-all duration-300
     ${hasError ? "border-rose-400 bg-rose-50/30" : "border-[#92664A]/25 dark:border-white/10 hover:border-[#DF8142]/40"}`;

  const labelCls =
    "block text-[11px] font-black uppercase tracking-[0.25em] text-[#5A270F] dark:text-[#EEB38C] mb-2";

  return (
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#0C0603] px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-700 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">

      {/* ── Page Header ─────────────────────────────── */}
      <div className="mb-10 sm:mb-14 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-1 w-10 bg-[#DF8142] rounded-full" />
            <p className="text-[7.5px] font-black uppercase tracking-[0.5em] text-[#92664A] dark:text-[#EEB38C]/40">
              SYNCHRONIZATION_MODULE // v2.0
            </p>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#5A270F] dark:text-white tracking-tighter uppercase leading-none italic font-space-grotesk">
            ASSET_CLUSTER <br /> <span className="text-[#DF8142] uppercase not-italic">SUBMISSION.</span>
          </h1>
          <p className="text-[7px] font-black uppercase tracking-[0.6em] text-[#6C3B1C] dark:text-[#EEB38C]/30 italic">
            CONTRIBUTE_TO_MASTER_REPOSITORY_MATRIX
          </p>
        </div>

        {/* Auth chip */}
        <div className="flex items-center gap-4 bg-white dark:bg-[#1A0B04] px-5 py-4 rounded-2xl border-2 border-[#D9D9C2] dark:border-white/5 shadow-lg self-start sm:self-auto group">
          <div className="h-11 w-11 bg-[#5A270F] rounded-xl flex items-center justify-center text-[#EEB38C] shadow-md flex-shrink-0 group-hover:bg-[#DF8142] transition-colors">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[8px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.3em] mb-0.5">
              UP_LINK_AUTH_0x8C
            </p>
            <p className="text-[11px] font-black text-[#5A270F] dark:text-white uppercase tracking-widest">
              {userRole || "IDENTIFYING..."}
            </p>
          </div>
        </div>
      </div>

      {/* ── Form ────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* ── LEFT: File + Metadata ────────────────── */}
        <div className="lg:col-span-2 space-y-8">

          {/* File Drop Zone */}
          <div className="bg-white dark:bg-[#1A0B04] rounded-3xl border-2 border-[#92664A]/20 dark:border-white/10 shadow-xl p-6 sm:p-10 relative overflow-hidden">
            <div className="absolute inset-0 architectural-dot-grid dark:architectural-dot-grid-dark opacity-5 pointer-events-none" />
            <div className="relative z-10 space-y-8">

              {/* Section label */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.35em] text-[#5A270F] dark:text-[#EEB38C]">
                    File Upload
                  </h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#6C3B1C] dark:text-[#EEB38C] mt-1">
                    Select your architectural document
                  </p>
                </div>
                <span className="text-[9px] font-black text-[#92664A] dark:text-[#EEB38C] uppercase tracking-[0.3em] bg-[#EEB38C]/10 px-3 py-1 rounded-full">
                  Step 01
                </span>
              </div>

              {/* Drop Area */}
              <div className="relative group">
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                  title="Upload File"
                />
                <div
                  className={`relative z-10 p-8 sm:p-14 border-2 border-dashed rounded-2xl text-center transition-all duration-500 ${
                    errors.file
                      ? "bg-rose-50/20 border-rose-400"
                      : "bg-[#EEB38C]/5 border-[#92664A]/25 group-hover:border-[#DF8142] group-hover:bg-[#EEB38C]/10"
                  }`}
                >
                  <div className="h-16 w-16 sm:h-20 sm:w-20 bg-[#5A270F] rounded-2xl flex items-center justify-center text-[#EEB38C] mx-auto mb-6 shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    {file ? (
                      <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10" />
                    ) : (
                      <UploadCloud className="h-8 w-8 sm:h-10 sm:w-10" />
                    )}
                  </div>
                  {file ? (
                    <div className="space-y-2 animate-in zoom-in-95">
                      <p className="text-lg sm:text-2xl font-black text-[#5A270F] dark:text-white tracking-tighter italic break-all">
                        {file.name}
                      </p>
                      <p className="text-xs font-black text-[#DF8142] uppercase tracking-[0.4em]">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xl sm:text-3xl font-black text-[#5A270F] dark:text-white tracking-tighter italic">
                        Click to Upload File
                      </p>
                      <div className="text-[10px] font-bold text-[#6C3B1C] dark:text-[#EEB38C] uppercase tracking-[0.4em] flex items-center justify-center gap-3">
                        <Zap className="h-3.5 w-3.5 text-[#DF8142]" />
                        Max 5GB · PDF, DWG, CAD, Images
                      </div>
                    </div>
                  )}
                  <FieldError message={errors.file} />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className={labelCls}>Resource Title</label>
                <div className="relative">
                  <FileText
                    className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${errors.title ? "text-rose-500" : "text-[#DF8142]"}`}
                  />
                  <input
                    name="title"
                    placeholder="e.g. Urban Design Phase IV"
                    value={metadata.title}
                    onChange={handleMetaChange}
                    className={`${inputCls(!!errors.title)} pl-12 h-14 text-base sm:text-lg font-bold italic`}
                  />
                </div>
                <FieldError message={errors.title} />
              </div>
            </div>
          </div>

          {/* Metadata Card */}
          <div className="bg-white dark:bg-[#1A0B04] rounded-3xl border-2 border-[#92664A]/20 dark:border-white/10 shadow-xl p-6 sm:p-10 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.35em] text-[#5A270F] dark:text-[#EEB38C]">
                  Resource Details
                </h4>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6C3B1C] dark:text-[#EEB38C] mt-1">
                  Author, keywords &amp; classification
                </p>
              </div>
              <span className="text-[9px] font-black text-[#92664A] dark:text-[#EEB38C] uppercase tracking-[0.3em] bg-[#EEB38C]/10 px-3 py-1 rounded-full">
                Step 02
              </span>
            </div>

            {/* Author + Keywords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Author</label>
                <div className="relative">
                  <AtSign
                    className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${errors.author ? "text-rose-500" : "text-[#DF8142]"}`}
                  />
                  <input
                    name="author"
                    placeholder="Principal Architect"
                    value={metadata.author}
                    onChange={handleMetaChange}
                    className={`${inputCls(!!errors.author)} pl-12 h-14 uppercase tracking-wider`}
                  />
                </div>
                <FieldError message={errors.author} />
              </div>
              <div>
                <label className={labelCls}>Keywords / Tags</label>
                <div className="relative">
                  <Tag
                    className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${errors.keywords ? "text-rose-500" : "text-[#DF8142]"}`}
                  />
                  <input
                    name="keywords"
                    placeholder="Brutalism, Concrete, Urban"
                    value={metadata.keywords}
                    onChange={handleMetaChange}
                    className={`${inputCls(!!errors.keywords)} pl-12 h-14 uppercase tracking-wide text-sm`}
                  />
                </div>
                <FieldError message={errors.keywords} />
              </div>
            </div>

            {/* Year · Semester · Batch */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              <div>
                <label className={labelCls}>Year (1–5)</label>
                <input
                  type="number"
                  name="forYearStudents"
                  placeholder="e.g. 3"
                  value={metadata.forYearStudents}
                  onChange={handleMetaChange}
                  className={`${inputCls(!!errors.forYearStudents)} h-14 text-center text-lg font-black`}
                />
                <FieldError message={errors.forYearStudents} />
              </div>
              <div>
                <label className={labelCls}>Semester</label>
                <input
                  type="number"
                  name="semester"
                  placeholder="1 or 2"
                  value={metadata.semester}
                  onChange={handleMetaChange}
                  className={`${inputCls(!!errors.semester)} h-14 text-center text-lg font-black`}
                />
                <FieldError message={errors.semester} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Batch Year</label>
                <input
                  type="number"
                  name="batch"
                  placeholder="202X"
                  value={metadata.batch}
                  onChange={handleMetaChange}
                  className={`${inputCls(!!errors.batch)} h-14 text-center text-lg font-black`}
                />
                <FieldError message={errors.batch} />
              </div>
            </div>

            {/* Design Stage */}
            <Select
              label="Design Stage / Course"
              options={[
                ...designStages
                  .filter((s) => s.name.toLowerCase() !== "others")
                  .map((s) => ({ id: s.id, name: s.name })),
                { id: "others", name: "Other (Custom)" },
              ]}
              value={metadata.design_stage_id}
              onChange={(val) => {
                setMetadata({ ...metadata, design_stage_id: val });
                if (errors.design_stage_id) setErrors((prev) => ({ ...prev, design_stage_id: "" }));
              }}
              placeholder="Select a stage..."
              icon={<Database className={`h-5 w-5 ${errors.design_stage_id ? "text-rose-500" : "text-[#DF8142]"}`} />}
              error={errors.design_stage_id}
            />

            {/* Custom Stage */}
            {metadata.design_stage_id === "others" && (
              <div className="animate-in slide-in-from-top-3 duration-400">
                <label className={labelCls}>Custom Stage Name</label>
                <input
                  name="customStageName"
                  placeholder="Enter stage name..."
                  value={metadata.customStageName}
                  onChange={handleMetaChange}
                  className={`${inputCls(!!errors.customStageName)} h-14 uppercase tracking-wide`}
                />
                <FieldError message={errors.customStageName} />
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Action Panel ──────────────────── */}
        <div className="space-y-6 lg:sticky lg:top-8">

          {/* Security & Submit */}
          <div className="bg-[#1A0B03] dark:bg-[#1A0B04] rounded-3xl p-7 sm:p-9 text-white relative overflow-hidden shadow-2xl shadow-[#1A0B03]/40 border border-white/5">
            <div className="absolute top-0 right-0 w-60 h-60 bg-[#DF8142]/15 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10 space-y-8">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-[#DF8142] flex items-center justify-center shadow-lg flex-shrink-0">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <h6 className="text-[12px] font-black uppercase tracking-[0.35em] text-[#EEB38C]">
                  Upload Authorization
                </h6>
              </div>

              {/* Terms */}
              <div className="space-y-4">
                <div
                  className={`p-5 rounded-2xl border transition-all duration-400 flex items-start gap-4 ${
                    metadata.agreedToTerms
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-white/5 border-white/10 hover:bg-white/8"
                  }`}
                >
                  <input
                    type="checkbox"
                    id="agreedToTerms"
                    name="agreedToTerms"
                    checked={metadata.agreedToTerms}
                    onChange={handleMetaChange}
                    className="mt-1 h-5 w-5 rounded-lg border-2 border-white/30 cursor-pointer accent-[#DF8142] flex-shrink-0"
                    title="Accept Terms"
                  />
                  <label
                    htmlFor="agreedToTerms"
                    className="text-[11px] font-semibold text-white/80 leading-relaxed uppercase tracking-wide cursor-pointer select-none"
                  >
                    I verify the academic integrity of this asset and agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-[#DF8142] underline underline-offset-4 decoration-dotted hover:text-[#EEB38C] transition-colors"
                    >
                      Terms &amp; Protocols
                    </Link>
                    .
                  </label>
                </div>
                <FieldError message={errors.agreedToTerms} />

                {/* Priority toggle — faculty/admin only */}
                {(["Faculty", "Admin", "SuperAdmin", "DepartmentHead", "admin"] as string[]).includes(userRole) && (
                  <div
                    className={`p-5 rounded-2xl border transition-all duration-400 flex items-start gap-4 ${
                      metadata.isPriority
                        ? "bg-[#DF8142]/20 border-[#DF8142]/40"
                        : "bg-white/5 border-white/10 hover:bg-white/8"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id="isPriority"
                      name="isPriority"
                      checked={metadata.isPriority}
                      onChange={handleMetaChange}
                      className="mt-1 h-5 w-5 rounded-lg border-2 border-white/30 cursor-pointer accent-[#DF8142] flex-shrink-0"
                      title="Priority Tag"
                    />
                    <div className="space-y-1">
                      <label
                        htmlFor="isPriority"
                        className="text-[11px] font-black text-white uppercase tracking-widest cursor-pointer leading-none"
                      >
                        Faculty Priority Tag
                      </label>
                      <p className="text-[9px] font-bold text-[#EEB38C] uppercase tracking-widest">
                        Mark as verified priority resource
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit button */}
              <div className="pt-6 border-t border-white/10">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 sm:h-20 flex items-center justify-center gap-4 bg-white text-[#5A270F] rounded-2xl text-[13px] font-black uppercase tracking-[0.4em] hover:bg-[#EEB38C] transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-40 group shadow-2xl"
                >
                  {loading ? (
                    <Loader2 className="h-7 w-7 animate-spin" />
                  ) : (
                    <>
                      Upload Resource
                      <ArrowRight className="h-5 w-5 transform group-hover:translate-x-2 transition-transform duration-300" />
                    </>
                  )}
                </button>
                <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.4em] text-[#EEB38C]/40 text-center italic">
                  Secure encrypted upload
                </p>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-white dark:bg-[#1A0B04] rounded-3xl p-6 sm:p-8 border-2 border-[#92664A]/20 dark:border-white/10 space-y-4 shadow-xl">
            <h5 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#5A270F] dark:text-[#EEB38C] flex items-center gap-3">
              <Info className="h-5 w-5 text-[#DF8142] flex-shrink-0" />
              Upload Guidelines
            </h5>
            <p className="text-sm font-medium text-[#5A270F] dark:text-white/70 leading-relaxed border-l-4 border-[#DF8142]/40 pl-4">
              All submitted resources undergo a formal review cycle. Ensure your
              material complies with academic integrity standards before submitting.
            </p>
          </div>
        </div>

      </form>

      {/* Mobile Submit Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-t-2 border-[#92664A]/15 z-50 shadow-[0_-10px_40px_rgba(90,39,15,0.1)]">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-14 flex items-center justify-center gap-3 bg-[#5A270F] text-white rounded-2xl text-[13px] font-black uppercase tracking-[0.35em] shadow-xl active:scale-95 disabled:opacity-50 transition-all duration-300"
        >
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <UploadCloud className="h-6 w-6" />
              Upload Resource
            </>
          )}
        </button>
      </div>
      </div>
    </div>
  );
};

export default Upload;
