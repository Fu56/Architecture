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
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleMetaChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mission Control Validation
    if (!metadata.title.trim()) {
      toast.warn("Protocol Error: Assignment Title identifier required.");
      return;
    }

    if (!metadata.description.trim()) {
      toast.warn("Protocol Error: Brief Description narrative missing.");
      return;
    }

    if (!metadata.academic_year) {
      toast.warn("Protocol Error: Target Academic Year not specified.");
      return;
    }

    if (!metadata.semester) {
      toast.warn("Protocol Error: Academic Semester sequence required.");
      return;
    }

    if (!metadata.design_stage_id) {
      toast.warn("Protocol Error: Phase Matrix selection required.");
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
        errorMessage || "Failed to post assignment. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link
        to={`${basePath}/assignments`}
        className="inline-flex items-center gap-2 text-gray-400 hover:text-indigo-600 font-bold text-sm uppercase tracking-widest mb-10 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Assignments
      </Link>

      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4">
          Post Assignment
        </h1>
        <p className="text-xl text-gray-500 font-medium">
          Create a new academic brief for your students.
        </p>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                  <FileText className="h-3.5 w-3.5" /> Assignment Title
                </label>
                <input
                  required
                  name="title"
                  placeholder="e.g. Master Plan Urban Project - Phase 1"
                  value={metadata.title}
                  onChange={handleMetaChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-900 placeholder:text-gray-300"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                  <Calendar className="h-3.5 w-3.5" /> Due Date & Time
                  (Optional)
                </label>
                <input
                  id="due_date"
                  type="datetime-local"
                  name="due_date"
                  title="Due Date & Time"
                  value={metadata.due_date}
                  onChange={handleMetaChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                  Target Audience
                </label>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <select
                    id="academic_year"
                    name="academic_year"
                    title="Target Academic Year"
                    value={metadata.academic_year}
                    onChange={handleMetaChange}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-900"
                  >
                    <option value="">Year</option>
                    {[1, 2, 3, 4, 5].map((y) => (
                      <option key={y} value={y}>
                        Year {y}
                      </option>
                    ))}
                  </select>
                  <select
                    id="semester"
                    name="semester"
                    title="Academic Semester"
                    value={metadata.semester}
                    onChange={handleMetaChange}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-900"
                  >
                    <option value="">Semester</option>
                    {[1, 2].map((s) => (
                      <option key={s} value={s}>
                        Sem {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                  Design Stage
                </label>
                <select
                  id="design_stage_id"
                  name="design_stage_id"
                  title="Design Stage"
                  value={metadata.design_stage_id}
                  onChange={handleMetaChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-900"
                >
                  <option value="">Select Stage</option>
                  {designStages.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                  <AlignLeft className="h-3.5 w-3.5" /> Brief Description
                </label>
                <textarea
                  name="description"
                  placeholder="Describe the goals, requirements, and scope of this assignment..."
                  value={metadata.description}
                  onChange={handleMetaChange}
                  rows={8}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-900 placeholder:text-gray-300 resize-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
              <UploadCloud className="h-3.5 w-3.5" /> Attachment (Brief PDF/Doc)
            </label>
            <div className="relative group">
              <input
                id="brief-file"
                type="file"
                title="Choose brief file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-gray-200 rounded-[2.5rem] py-12 text-center group-hover:border-indigo-400 group-hover:bg-indigo-50 transition-all">
                <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:text-indigo-600 transition-all">
                  <UploadCloud className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-lg font-black text-gray-900 mb-1">
                  {file ? file.name : "Choose brief file"}
                </p>
                <p className="text-gray-400 font-medium text-sm">
                  PDF, DOCX, TXT, MD up to 50MB
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-3 py-6 px-10 bg-indigo-600 text-white text-xl font-black rounded-[2rem] shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 hover:scale-[1.01] transition-all disabled:opacity-50 active:scale-[0.99]"
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
