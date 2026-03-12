import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { api } from "../../lib/api";
import { toast } from "../../lib/toast";
import {
  UploadCloud,
  Loader2,
  ArrowLeft,
  Calendar,
  FileText,
  AlignLeft,
  Send,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import type { DesignStage } from "../../models";
import Select from "../../components/ui/Select";
import { Database, ShieldCheck } from "lucide-react";

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <p className="text-[10px] font-black text-rose-600 uppercase tracking-wide mt-2 ml-1 animate-in fade-in slide-in-from-top-1">
      {message}
    </p>
  );
};

/* shared label + input styles */
const labelCls =
  "flex items-center gap-2 text-[12px] font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-[0.2em] mb-2";

const inputCls = (hasError: boolean) =>
  `w-full px-4 py-3 bg-white dark:bg-white/5 border-2 rounded-xl
   text-xs font-semibold text-[#5A270F] dark:text-[#EEB38C]
   placeholder:text-[#92664A]/50 dark:placeholder:text-white/20
   focus:outline-none focus:ring-4 focus:ring-[#DF8142]/15 focus:border-[#DF8142]
   transition-all duration-300
   ${hasError
     ? "border-rose-400 bg-rose-50/20"
     : "border-[#92664A]/40 dark:border-white/10 hover:border-[#DF8142]/60"}`;

const PostAssignment = () => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState({
    title: "",
    description: "",
    due_date: "",
    academic_year: "",
    semester: "",
    design_stage_id: "",
  });
  const [designStages, setDesignStages] = useState<DesignStage[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const location = useLocation();

  const isBaseAdmin = location.pathname.startsWith("/admin");
  const basePath = isBaseAdmin ? "/admin" : "/dashboard";

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const { data } = await api.get("/common/design-stages");
        setDesignStages(data);
      } catch {
        console.error("Failed to fetch design stages");
      }
    };
    fetchStages();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrors((prev) => ({ ...prev, file: "" }));
    }
  };

  const handleMetaChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setMetadata({ ...metadata, [name]: value });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!metadata.title.trim()) newErrors.title = "Title is required.";
    if (!metadata.description.trim()) newErrors.description = "Description is required.";
    if (!metadata.academic_year) newErrors.academic_year = "Academic year is required.";
    if (!metadata.semester) newErrors.semester = "Semester is required.";
    if (!metadata.design_stage_id) newErrors.design_stage_id = "Design stage is required.";
    if (!metadata.due_date) newErrors.due_date = "Due date is required.";
    if (!file) newErrors.file = "Assignment brief file is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("title", metadata.title);
    formData.append("description", metadata.description);
    if (metadata.due_date) formData.append("due_date", metadata.due_date);
    if (metadata.academic_year) formData.append("academic_year", metadata.academic_year);
    if (metadata.semester) formData.append("semester", metadata.semester);
    if (metadata.design_stage_id) formData.append("design_stage_id", metadata.design_stage_id);

    try {
      const { data } = await api.post("/assignments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Assignment posted successfully!");
      navigate(`${basePath}/assignments/${data.id}`);
    } catch (err: unknown) {
      const errorMessage = (
        err as { response?: { data?: { message?: string } } }
      ).response?.data?.message;
      toast.error(errorMessage || "Failed to post assignment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#0C0603] px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">

      {/* ── Back Link ── */}
      <Link
        to={`${basePath}/assignments`}
        className="inline-flex items-center gap-2 text-[#5A270F] dark:text-[#EEB38C] font-black text-[11px] uppercase tracking-[0.3em] mb-10 hover:text-[#DF8142] transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
        Back to Assignments
      </Link>

      {/* ── Page Header ── */}
      <div className="mb-10 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-8 bg-[#DF8142] rounded-full" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#5A270F] dark:text-[#EEB38C]/60">
            Architect Interface
          </p>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter italic uppercase leading-none">
          Post <span className="text-[#DF8142]">Assignment</span>
        </h1>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#6C3B1C] dark:text-[#EEB38C]">
          Create a new academic brief for your students
        </p>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* LEFT: Main fields */}
        <div className="lg:col-span-2 space-y-8">

          {/* Card 1: Title + Description */}
          <div className="bg-white dark:bg-[#1A0B04] rounded-3xl border-2 border-[#92664A]/30 dark:border-white/10 shadow-xl p-6 sm:p-10 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#DF8142]/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.35em] text-[#5A270F] dark:text-[#EEB38C]">
                  Assignment Details
                </h4>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6C3B1C] dark:text-[#EEB38C] mt-1">
                  Title and description
                </p>
              </div>
              <span className="text-[9px] font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-[0.3em] bg-[#EEB38C]/25 px-3 py-1 rounded-full border border-[#92664A]/20">
                Step 01
              </span>
            </div>

            {/* Title */}
            <div>
              <label className={labelCls}>
                <FileText className="h-4 w-4 text-[#DF8142]" />
                Assignment Title
              </label>
              <input
                name="title"
                placeholder="e.g. Master Plan Urban Project – Phase 1"
                value={metadata.title}
                onChange={handleMetaChange}
                className={inputCls(!!errors.title)}
              />
              <FieldError message={errors.title} />
            </div>

            {/* Description */}
            <div>
              <label className={labelCls}>
                <AlignLeft className="h-4 w-4 text-[#DF8142]" />
                Brief Description
              </label>
              <textarea
                name="description"
                placeholder="Describe the goals, requirements, and scope of this assignment..."
                value={metadata.description}
                onChange={handleMetaChange}
                rows={7}
                className={`${inputCls(!!errors.description)} resize-none min-h-[180px] sm:min-h-[220px] rounded-2xl leading-relaxed`}
              />
              <FieldError message={errors.description} />
            </div>
          </div>

          {/* Card 2: Classification */}
          <div className="bg-white dark:bg-[#1A0B04] rounded-3xl border-2 border-[#92664A]/20 dark:border-white/10 shadow-xl p-6 sm:p-10 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.35em] text-[#5A270F] dark:text-[#EEB38C]">
                  Classification
                </h4>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6C3B1C] dark:text-[#EEB38C] mt-1">
                  Year, semester, stage &amp; deadline
                </p>
              </div>
              <span className="text-[9px] font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-[0.3em] bg-[#EEB38C]/25 px-3 py-1 rounded-full border border-[#92664A]/20">
                Step 02
              </span>
            </div>

            {/* Year + Semester */}
            <div className="grid grid-cols-2 gap-5">
              <Select
                label="Academic Year"
                options={[1, 2, 3, 4, 5].map((y) => ({ id: String(y), name: `Year ${y}` }))}
                value={metadata.academic_year}
                onChange={(val) => {
                  setMetadata({ ...metadata, academic_year: val });
                  if (errors.academic_year) setErrors((prev) => ({ ...prev, academic_year: "" }));
                }}
                placeholder="Select Year"
                icon={<BookOpen className="h-4 w-4 text-[#DF8142]" />}
                error={errors.academic_year}
              />
              <Select
                label="Semester"
                options={[1, 2].map((s) => ({ id: String(s), name: `Semester ${s}` }))}
                value={metadata.semester}
                onChange={(val) => {
                  setMetadata({ ...metadata, semester: val });
                  if (errors.semester) setErrors((prev) => ({ ...prev, semester: "" }));
                }}
                placeholder="Select Sem"
                icon={<ShieldCheck className="h-4 w-4 text-[#DF8142]" />}
                error={errors.semester}
              />
            </div>

            {/* Design Stage */}
            <Select
              label="Design Stage / Course"
              options={designStages.map((s) => ({ id: s.id, name: s.name }))}
              value={metadata.design_stage_id}
              onChange={(val) => {
                setMetadata({ ...metadata, design_stage_id: val });
                if (errors.design_stage_id) setErrors((prev) => ({ ...prev, design_stage_id: "" }));
              }}
              placeholder="Select Stage"
              icon={<Database className="h-4 w-4 text-[#DF8142]" />}
              error={errors.design_stage_id}
            />

            {/* Due Date */}
            <div>
              <label className={labelCls}>
                <Calendar className="h-4 w-4 text-[#DF8142]" />
                Due Date &amp; Time
              </label>
              <input
                id="due_date"
                type="datetime-local"
                name="due_date"
                title="Due Date & Time"
                value={metadata.due_date}
                onChange={handleMetaChange}
                className={`${inputCls(!!errors.due_date)}`}
              />
              <FieldError message={errors.due_date} />
            </div>
          </div>
        </div>

        {/* RIGHT: File + Submit */}
        <div className="space-y-6 lg:sticky lg:top-8">

          {/* File Upload */}
          <div className="bg-white dark:bg-[#1A0B04] rounded-3xl border-2 border-[#92664A]/30 dark:border-white/10 shadow-xl p-6 sm:p-8 space-y-5">
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.35em] text-[#5A270F] dark:text-[#EEB38C]">
                Brief Attachment
              </h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#6C3B1C] dark:text-[#EEB38C] mt-1">
                PDF, DOCX, TXT up to 50MB
              </p>
            </div>
            <div className="relative group">
              <input
                id="brief-file"
                type="file"
                title="Choose brief file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div
                className={`relative z-10 py-10 px-6 border-2 border-dashed rounded-2xl text-center transition-all duration-300 ${
                  errors.file
                    ? "border-rose-400 bg-rose-50/20"
                    : "border-[#92664A]/40 dark:border-white/10 group-hover:border-[#DF8142] group-hover:bg-[#EEB38C]/5"
                }`}
              >
                <div className="h-14 w-14 mx-auto mb-4 rounded-2xl bg-[#5A270F] flex items-center justify-center text-[#EEB38C] shadow-lg group-hover:bg-[#DF8142] group-hover:scale-110 transition-all duration-300">
                  {file ? (
                    <CheckCircle2 className="h-7 w-7" />
                  ) : (
                    <UploadCloud className="h-7 w-7" />
                  )}
                </div>
                <p className="text-sm font-black text-[#5A270F] dark:text-[#EEB38C] uppercase italic mb-1">
                  {file ? file.name : "Click to Upload"}
                </p>
                {file && (
                  <p className="text-[10px] font-bold text-[#DF8142] uppercase tracking-widest">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>
            </div>
            <FieldError message={errors.file} />
          </div>

          {/* Submit */}
          <div className="bg-[#1A0B03] dark:bg-[#1A0B04] rounded-3xl border border-white/5 shadow-2xl shadow-[#1A0B03]/30 p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#DF8142]/15 blur-[60px] rounded-full pointer-events-none" />
            <div className="relative z-10">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-16 flex items-center justify-center gap-3 bg-white text-[#5A270F] rounded-2xl text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#EEB38C] transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-40 shadow-xl"
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Post Assignment
                  </>
                )}
              </button>
              <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.4em] text-[#EEB38C]/60 text-center italic">
                Visible to students immediately
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* Mobile Submit Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-t-2 border-[#92664A]/25 z-50 shadow-[0_-10px_40px_rgba(90,39,15,0.1)]">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-14 flex items-center justify-center gap-3 bg-[#5A270F] text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.35em] shadow-xl active:scale-95 disabled:opacity-50 transition-all duration-300"
        >
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <Send className="h-5 w-5" />
              Post Assignment
            </>
          )}
        </button>
      </div>
      </div>
    </div>
  );
};

export default PostAssignment;
