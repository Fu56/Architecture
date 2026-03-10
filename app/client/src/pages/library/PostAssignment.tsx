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
} from "lucide-react";
import type { DesignStage } from "../../models";

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <p className="text-[11px] font-black text-rose-600 uppercase tracking-[0.05em] mt-2 ml-1 animate-in fade-in slide-in-from-top-1 drop-shadow-sm">
      {message}
    </p>
  );
};

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
      if (errors.file) {
        setErrors((prev) => ({ ...prev, file: "" }));
      }
    }
  };

  const handleMetaChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setMetadata({ ...metadata, [name]: value });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    // Mission Control Validation Protocols
    if (!metadata.title.trim()) {
      newErrors.title = "Protocol Error: Assignment Title identifier required.";
    }

    if (!metadata.description.trim()) {
      newErrors.description =
        "Protocol Error: Brief Description narrative missing.";
    }

    if (!metadata.academic_year) {
      newErrors.academic_year =
        "Protocol Error: Target Academic Year not specified.";
    }

    if (!metadata.semester) {
      newErrors.semester =
        "Protocol Error: Academic Semester sequence required.";
    }

    if (!metadata.design_stage_id) {
      newErrors.design_stage_id = "Protocol Error: Phase Matrix selection required.";
    }

    if (!metadata.due_date) {
      newErrors.due_date = "Protocol Error: Temporal deadline required for submission.";
    }

    if (!file) {
      newErrors.file =
        "Security Breach: Brief Attachment (PDF/Doc) is mandatory.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Validation failed: Please correct the highlighted errors.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("title", metadata.title);
    formData.append("description", metadata.description);
    if (metadata.due_date) formData.append("due_date", metadata.due_date);
    if (metadata.academic_year)
      formData.append("academic_year", metadata.academic_year);
    if (metadata.semester) formData.append("semester", metadata.semester);
    if (metadata.design_stage_id)
      formData.append("design_stage_id", metadata.design_stage_id);

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
      toast.error(
        errorMessage || "Failed to post assignment. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link
        to={`${basePath}/assignments`}
        className="inline-flex items-center gap-2 text-[#92664A] hover:text-[#5A270F] font-bold text-sm uppercase tracking-widest mb-10 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Assignments
      </Link>

      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-[#5A270F] tracking-tight mb-4">
          Post Assignment
        </h1>
        <p className="text-xl text-[#92664A] font-medium">
          Create a new academic brief for your students.
        </p>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-[#EEB38C]/30 relative overflow-hidden">
        {/* Decorative architectural elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#DF8142]/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#5A270F]/5 blur-2xl rounded-full -translate-x-1/2 translate-y-1/2" />

        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-[#92664A] uppercase tracking-widest mb-3 px-1">
                  <FileText className="h-3.5 w-3.5 text-[#DF8142]" /> Assignment Title
                </label>
                <input
                  name="title"
                  placeholder="e.g. Master Plan Urban Project - Phase 1"
                  value={metadata.title}
                  onChange={handleMetaChange}
                  className={`w-full px-6 py-4 bg-[#EFEDED]/50 border ${
                    errors.title
                      ? "border-rose-400 bg-red-50/20"
                      : "border-[#EEB38C]/40"
                  } rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#DF8142]/10 focus:border-[#DF8142] transition-all font-bold text-[#5A270F] placeholder:text-[#92664A]/30`}
                />
                <FieldError message={errors.title} />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-black text-[#92664A] uppercase tracking-widest mb-3 px-1">
                  <Calendar className="h-3.5 w-3.5 text-[#DF8142]" /> Due Date & Time
                </label>
                <input
                  id="due_date"
                  type="datetime-local"
                  name="due_date"
                  title="Due Date & Time"
                  value={metadata.due_date}
                  onChange={handleMetaChange}
                  className={`w-full px-6 py-4 bg-[#EFEDED]/50 border ${
                    errors.due_date
                      ? "border-rose-400 bg-red-50/20"
                      : "border-[#EEB38C]/40"
                  } rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#DF8142]/10 focus:border-[#DF8142] transition-all font-bold text-[#5A270F]`}
                />
                <FieldError message={errors.due_date} />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-black text-[#92664A] uppercase tracking-widest mb-3 px-1">
                  Target Audience
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <select
                      id="academic_year"
                      name="academic_year"
                      title="Target Academic Year"
                      value={metadata.academic_year}
                      onChange={handleMetaChange}
                      className={`w-full px-6 py-4 bg-[#EFEDED]/50 border ${
                        errors.academic_year
                          ? "border-rose-400 bg-red-50/20"
                          : "border-[#EEB38C]/40"
                      } rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#DF8142]/10 focus:border-[#DF8142] transition-all font-bold text-[#5A270F]`}
                    >
                      <option value="">Year</option>
                      {[1, 2, 3, 4, 5].map((y) => (
                        <option key={y} value={y}>
                          Year {y}
                        </option>
                      ))}
                    </select>
                    <FieldError message={errors.academic_year} />
                  </div>
                  <div>
                    <select
                      id="semester"
                      name="semester"
                      title="Academic Semester"
                      value={metadata.semester}
                      onChange={handleMetaChange}
                      className={`w-full px-6 py-4 bg-[#EFEDED]/50 border ${
                        errors.semester
                          ? "border-rose-400 bg-red-50/20"
                          : "border-[#EEB38C]/40"
                      } rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#DF8142]/10 focus:border-[#DF8142] transition-all font-bold text-[#5A270F]`}
                    >
                      <option value="">Semester</option>
                      {[1, 2].map((s) => (
                        <option key={s} value={s}>
                          Sem {s}
                        </option>
                      ))}
                    </select>
                    <FieldError message={errors.semester} />
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-black text-[#92664A] uppercase tracking-widest mb-3 px-1">
                  Design Stage
                </label>
                <select
                  id="design_stage_id"
                  name="design_stage_id"
                  title="Design Stage"
                  value={metadata.design_stage_id}
                  onChange={handleMetaChange}
                  className={`w-full px-6 py-4 bg-[#EFEDED]/50 border ${
                    errors.design_stage_id
                      ? "border-rose-400 bg-red-50/20"
                      : "border-[#EEB38C]/40"
                  } rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#DF8142]/10 focus:border-[#DF8142] transition-all font-bold text-[#5A270F]`}
                >
                  <option value="">Select Stage</option>
                  {designStages.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.name}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.design_stage_id} />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-[#92664A] uppercase tracking-widest mb-3 px-1">
                  <AlignLeft className="h-3.5 w-3.5 text-[#DF8142]" /> Brief Description
                </label>
                <textarea
                  name="description"
                  placeholder="Describe the goals, requirements, and scope of this assignment..."
                  value={metadata.description}
                  onChange={handleMetaChange}
                  rows={8}
                  className={`w-full px-6 py-4 bg-[#EFEDED]/50 border ${
                    errors.description
                      ? "border-rose-400 bg-red-50/20"
                      : "border-[#EEB38C]/40"
                  } rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-[#DF8142]/10 focus:border-[#DF8142] transition-all font-bold text-[#5A270F] placeholder:text-[#92664A]/30 resize-none min-h-[320px]`}
                />
                <FieldError message={errors.description} />
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-black text-[#92664A] uppercase tracking-widest mb-3 px-1">
              <UploadCloud className="h-3.5 w-3.5 text-[#DF8142]" /> Attachment (Brief PDF/Doc)
            </label>
            <div className="relative group">
              <input
                id="brief-file"
                type="file"
                title="Choose brief file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div
                className={`border-2 border-dashed ${
                  errors.file
                    ? "border-rose-400 bg-red-50/10"
                    : "border-[#EEB38C]"
                } rounded-[2.5rem] py-12 text-center group-hover:border-[#DF8142] group-hover:bg-[#EEB38C]/5 transition-all relative overflow-hidden`}
              >
                <div className="h-16 w-16 bg-[#EFEDED] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-[#DF8142]/10 group-hover:text-[#DF8142] transition-all">
                  <UploadCloud className="h-8 w-8 text-[#92664A]" />
                </div>
                <p className="text-lg font-black text-[#5A270F] mb-1">
                  {file ? file.name : "Choose brief file"}
                </p>
                <p className="text-[#92664A] font-medium text-sm">
                  PDF, DOCX, TXT, MD up to 50MB
                </p>
              </div>
            </div>
            <FieldError message={errors.file} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-3 py-6 px-10 bg-[#5A270F] text-white text-xl font-black rounded-[2rem] shadow-2xl shadow-[#5A270F]/20 hover:bg-[#6C3B1C] hover:scale-[1.01] transition-all disabled:opacity-50 active:scale-[0.99]"
          >
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <>
                <Send className="h-6 w-6" />
                Broadcast Assignment
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostAssignment;
