import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../../lib/api";
import { UploadCloud, Loader2, Sparkles, Shield, Info } from "lucide-react";
import { toast } from "../../lib/toast";
import type { DesignStage } from "../../models";
import { useSession } from "../../lib/auth-client";

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
  });
  const [designStages, setDesignStages] = useState<DesignStage[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  interface UserWithRole {
    role?:
      | string
      | {
          name: string;
        };
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
      <p className="text-[10px] font-bold text-red-700 uppercase tracking-widest mt-2 ml-2 animate-in fade-in slide-in-from-top-1">
        {message}
      </p>
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setErrors((prev) => ({ ...prev, file: "" }));
      toast.info(`File selected: ${e.target.files[0].name}`);
    }
  };

  const handleMetaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setMetadata({ ...metadata, [name]: val });
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Technical Validation Protocol
    if (!file) {
      newErrors.file = "Asset Core Missing: Please select a file to transmit.";
    }

    if (!metadata.title.trim()) {
      newErrors.title = "Protocol Error: Project Title descriptor required.";
    }

    if (!metadata.author.trim()) {
      newErrors.author =
        "Protocol Error: Author Authority must be established.";
    }

    if (!metadata.design_stage_id) {
      newErrors.design_stage_id =
        "Protocol Error: Design Phase sequencing must be defined.";
    }

    if (
      metadata.design_stage_id === "others" &&
      !metadata.customStageName.trim()
    ) {
      newErrors.customStageName =
        "Protocol Error: Custom Course Name must be established.";
    }

    const yearNum = parseInt(metadata.forYearStudents);
    if (isNaN(yearNum) || yearNum < 1 || yearNum > 5) {
      newErrors.forYearStudents =
        "Metadata Breach: Target Student Year must be between 1 and 5.";
    }

    if (metadata.semester) {
      const semNum = parseInt(metadata.semester);
      if (isNaN(semNum) || semNum < 1 || semNum > 2) {
        newErrors.semester =
          "Metadata Breach: Academic Semester out of range (1-2).";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Validation failed: Please correct the highlighted errors.");
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
    if (metadata.design_stage_id === "others") {
      formData.append("design_stage_name", metadata.customStageName);
    }
    formData.append("forYearStudents", metadata.forYearStudents);
    if (metadata.semester) formData.append("semester", metadata.semester);
    if (metadata.batch) formData.append("batch", metadata.batch);
    if (metadata.isPriority)
      formData.append("priority_tag", "Faculty Priority");

    try {
      const { data } = await api.post("/resources", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Resource successfully integrated into library matrix");
      if (isBaseAdmin) {
        navigate("/admin/resources");
      } else {
        navigate(`/resources/${data.id}`);
      }
    } catch (err: unknown) {
      const errorMessage = (
        err as { response?: { data?: { message?: string } } }
      ).response?.data?.message;
      toast.error(
        errorMessage || "Protocol Error: Resource integration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-[#2A1205] rounded-3xl p-6 sm:p-10 mb-8 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[60px] -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary/80 mb-4">
            <Sparkles className="h-3 w-3" /> Digital Archive
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Resource Integration
          </h1>
          <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
            System Upload Protocol Node 04
          </p>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-lg border border-[#D9D9C2]">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Input */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#5A270F] uppercase tracking-tight flex items-center gap-3">
              <div className="p-2 bg-[#2A1205] text-white rounded-lg">01</div>
              Select Core Asset
            </h3>
            <div
              className={`mt-1 flex justify-center px-6 pt-10 pb-10 border-2 ${
                errors.file
                  ? "border-rose-300 bg-red-50/30"
                  : "border-[#D9D9C2]"
              } border-dashed rounded-2xl bg-[#EFEDED] hover:bg-white hover:border-primary/80 transition-all group relative`}
            >
              <div className="space-y-2 text-center">
                <div className="p-4 bg-white rounded-2xl shadow-sm w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud
                    className={`h-8 w-8 ${
                      errors.file ? "text-red-700" : "text-primary"
                    }`}
                  />
                </div>
                <div className="flex text-sm text-[#5A270F]/80 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer font-black text-primary hover:text-primary/90 focus-within:outline-none"
                  >
                    <span>upload File</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1 font-medium italic">or drag-and-drop</p>
                </div>
                {file ? (
                  <p className="text-sm text-primary font-bold mt-2 bg-primary/10 py-2 px-4 rounded-full inline-block">
                    {file.name}
                  </p>
                ) : (
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    MAX PAYLOAD: 5GB • ARCHITECTURAL SCHEMATICS
                  </p>
                )}
                <FieldError message={errors.file} />
              </div>
            </div>
          </div>

          {/* Metadata Input */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#5A270F] uppercase tracking-tight flex items-center gap-3">
              <div className="p-2 bg-[#2A1205] text-white rounded-lg">02</div>
              Asset Metadata
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">
                  Project Title
                </label>
                <input
                  name="title"
                  placeholder="e.g. Urban Nexus Schematic"
                  value={metadata.title}
                  onChange={handleMetaChange}
                  className={`w-full px-6 py-3.5 bg-[#EFEDED] border ${
                    errors.title
                      ? "border-rose-400 bg-red-50/20"
                      : "border-[#D9D9C2]"
                  } rounded-xl text-[#5A270F] font-bold focus:outline-none focus:border-primary/90 focus:bg-white transition-all outline-none`}
                />
                <FieldError message={errors.title} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">
                    Author Authority
                  </label>
                  <input
                    name="author"
                    placeholder="Principal Architect"
                    value={metadata.author}
                    onChange={handleMetaChange}
                    className={`w-full px-6 py-3.5 bg-[#EFEDED] border ${
                      errors.author
                        ? "border-rose-400 bg-red-50/20"
                        : "border-[#D9D9C2]"
                    } rounded-xl text-[#5A270F] font-bold focus:outline-none focus:border-primary/90 focus:bg-white transition-all outline-none`}
                  />
                  <FieldError message={errors.author} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">
                    Search Tags
                  </label>
                  <input
                    name="keywords"
                    placeholder="Urban, Design, Matrix"
                    value={metadata.keywords}
                    onChange={handleMetaChange}
                    className="w-full px-6 py-3.5 bg-[#EFEDED] border border-[#D9D9C2] rounded-xl text-[#5A270F] font-bold focus:outline-none focus:border-primary/90 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">
                    Phase
                  </label>
                  <select
                    id="design_stage_id"
                    name="design_stage_id"
                    title="Course Type"
                    value={metadata.design_stage_id}
                    onChange={handleMetaChange}
                    className={`w-full px-6 py-3.5 bg-[#EFEDED] border ${
                      errors.design_stage_id
                        ? "border-rose-400 bg-red-50/20"
                        : "border-[#D9D9C2]"
                    } rounded-xl text-[#5A270F] font-bold focus:outline-none focus:border-primary/90 focus:bg-white transition-all appearance-none cursor-pointer`}
                  >
                    <option value="" disabled>
                      Select Course Type
                    </option>
                    {designStages
                      .filter((stage) => stage.name.toLowerCase() !== "others")
                      .map((stage) => (
                        <option key={stage.id} value={stage.id}>
                          {stage.name}
                        </option>
                      ))}
                    <option value="others">Others</option>
                  </select>
                  <FieldError message={errors.design_stage_id} />
                </div>

                {metadata.design_stage_id === "others" && (
                  <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">
                      Course Title
                    </label>
                    <input
                      name="customStageName"
                      placeholder="Enter Course name"
                      value={metadata.customStageName}
                      onChange={handleMetaChange}
                      className={`w-full px-6 py-3.5 bg-primary/50 border ${
                        errors.customStageName
                          ? "border-rose-400 bg-red-50/20"
                          : "border-primary/20"
                      } rounded-xl text-[#5A270F] font-bold focus:outline-none focus:border-primary/90 focus:bg-white transition-all outline-none animate-in fade-in slide-in-from-top-2`}
                    />
                    <FieldError message={errors.customStageName} />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">
                    Target Year
                  </label>
                  <input
                    type="number"
                    name="forYearStudents"
                    placeholder="1-5"
                    value={metadata.forYearStudents}
                    onChange={handleMetaChange}
                    className={`w-full px-6 py-3.5 bg-[#EFEDED] border ${
                      errors.forYearStudents
                        ? "border-rose-400 bg-red-50/20"
                        : "border-[#D9D9C2]"
                    } rounded-xl text-[#5A270F] font-bold focus:outline-none focus:border-primary/90 focus:bg-white transition-all outline-none`}
                  />
                  <FieldError message={errors.forYearStudents} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">
                    Semester
                  </label>
                  <input
                    type="number"
                    name="semester"
                    placeholder="1-2"
                    value={metadata.semester}
                    onChange={handleMetaChange}
                    className={`w-full px-6 py-3.5 bg-[#EFEDED] border ${
                      errors.semester
                        ? "border-rose-400 bg-red-50/20"
                        : "border-[#D9D9C2]"
                    } rounded-xl text-[#5A270F] font-bold focus:outline-none focus:border-primary/90 focus:bg-white transition-all outline-none`}
                  />
                  <FieldError message={errors.semester} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">
                    Batch Node
                  </label>
                  <input
                    type="number"
                    name="batch"
                    placeholder="Year"
                    value={metadata.batch}
                    onChange={handleMetaChange}
                    className="w-full px-6 py-3.5 bg-[#EFEDED] border border-[#D9D9C2] rounded-xl text-[#5A270F] font-bold focus:outline-none focus:border-primary/90 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            {(userRole === "Faculty" ||
              userRole === "Admin" ||
              userRole === "SuperAdmin" ||
              userRole === "admin") && (
              <div className="flex items-center gap-4 bg-primary/10 p-6 rounded-2xl border border-primary/20 shadow-inner">
                <input
                  type="checkbox"
                  name="isPriority"
                  checked={metadata.isPriority}
                  onChange={handleMetaChange}
                  className="h-5 w-5 text-primary focus:ring-primary/90 border-slate-300 rounded cursor-pointer"
                  id="priority"
                />
                <label
                  htmlFor="priority"
                  className="font-bold text-[#2A1205] cursor-pointer select-none text-sm uppercase tracking-tight"
                >
                  Authorize as Priority Asset
                  <span className="block text-[10px] text-primary/60 font-bold uppercase tracking-widest mt-1">
                    Featured at system peak
                  </span>
                </label>
                <div className="ml-auto">
                  <Shield className="h-6 w-6 text-primary/80 opacity-30" />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-slate-50">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-3 py-4 px-4 bg-[#2A1205] text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-[#6C3B1C] transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Transmitting...
                </>
              ) : (
                <>
                  Upload Resource
                  <Sparkles className="h-5 w-5" />
                </>
              )}
            </button>
            <div className="mt-6 flex items-center justify-center gap-2 text-gray-500">
              <Info className="h-4 w-4" />
              <p className="text-[10px] font-bold uppercase tracking-widest italic">
                All uploads require faculty matrix validation
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;
