import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { UploadCloud, Loader2, Sparkles, Shield, Info } from "lucide-react";
import { toast } from "react-toastify";
import type { DesignStage } from "../../models";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState({
    title: "",
    author: "",
    keywords: "",
    design_stage_id: "",
    forYearStudents: "",
    semester: "",
    batch: "",
    isPriority: false,
  });
  const [designStages, setDesignStages] = useState<DesignStage[]>([]);
  const [loading, setLoading] = useState(false);

  const [isReady] = useState(() => {
    return !!localStorage.getItem("token") && !!localStorage.getItem("user");
  });

  const [userRole] = useState(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const role = user.role?.name || user.role || "";
        return role;
      } catch {
        return "";
      }
    }
    return "";
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!isReady) {
      navigate("/login", { replace: true, state: { from: "/upload" } });
    }
  }, [isReady, navigate]);

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

  if (!isReady) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      toast.info(`File selected: ${e.target.files[0].name}`);
    }
  };

  const handleMetaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setMetadata({ ...metadata, [name]: val });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.warning("Resource required: Please select a file to transmit");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", metadata.title);
    formData.append("author", metadata.author);
    formData.append("keywords", metadata.keywords);
    formData.append("design_stage_id", metadata.design_stage_id);
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
      navigate(`/resources/${data.id}`);
    } catch (err: unknown) {
      const errorMessage = (
        err as { response?: { data?: { message?: string } } }
      ).response?.data?.message;
      toast.error(
        errorMessage || "Protocol Error: Resource integration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-slate-950 rounded-[3rem] p-8 sm:p-12 mb-10 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[80px] -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-6">
            <Sparkles className="h-3 w-3" /> Digital Archive
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4">
            Resource Integration
          </h1>
          <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-xs">
            System Upload Protocol Node 04
          </p>
        </div>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* File Input */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
              <div className="p-2 bg-slate-950 text-white rounded-xl">01</div>
              Select Core Asset
            </h3>
            <div className="mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-slate-200 border-dashed rounded-[2rem] bg-slate-50 hover:bg-white hover:border-indigo-400 transition-all group">
              <div className="space-y-2 text-center">
                <div className="p-4 bg-white rounded-2xl shadow-sm w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="flex text-sm text-slate-600 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer font-black text-indigo-600 hover:text-indigo-700 focus-within:outline-none"
                  >
                    <span>Deploy File</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      required
                    />
                  </label>
                  <p className="pl-1 font-medium italic">or drag-and-drop</p>
                </div>
                {file ? (
                  <p className="text-sm text-indigo-600 font-black mt-2 bg-indigo-50 py-2 px-4 rounded-full inline-block">
                    {file.name}
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    MAX PAYLOAD: 5GB • ARCHITECTURAL SCHEMATICS & MEDIA
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Metadata Input */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
              <div className="p-2 bg-slate-950 text-white rounded-xl">02</div>
              Asset Metadata
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  Project Title
                </label>
                <input
                  name="title"
                  placeholder="e.g. Urban Nexus Schematic"
                  value={metadata.title}
                  onChange={handleMetaChange}
                  required
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                    Author Authority
                  </label>
                  <input
                    name="author"
                    placeholder="Principal Architect"
                    value={metadata.author}
                    onChange={handleMetaChange}
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                    Search Tags
                  </label>
                  <input
                    name="keywords"
                    placeholder="Urban, Design, Matrix"
                    value={metadata.keywords}
                    onChange={handleMetaChange}
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                    Phase
                  </label>
                  <select
                    name="design_stage_id"
                    value={metadata.design_stage_id}
                    onChange={handleMetaChange}
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Select Phase
                    </option>
                    {designStages.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                    Target Year
                  </label>
                  <input
                    type="number"
                    name="forYearStudents"
                    placeholder="1-5"
                    value={metadata.forYearStudents}
                    onChange={handleMetaChange}
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                    Semester
                  </label>
                  <input
                    type="number"
                    name="semester"
                    placeholder="1-2"
                    value={metadata.semester}
                    onChange={handleMetaChange}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                    Batch Node
                  </label>
                  <input
                    type="number"
                    name="batch"
                    placeholder="Year"
                    value={metadata.batch}
                    onChange={handleMetaChange}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            {(userRole === "Faculty" ||
              userRole === "Admin" ||
              userRole === "SuperAdmin" ||
              userRole === "admin") && (
              <div className="flex items-center gap-4 bg-indigo-50 p-6 rounded-[1.5rem] border border-indigo-100 shadow-inner">
                <input
                  type="checkbox"
                  name="isPriority"
                  checked={metadata.isPriority}
                  onChange={handleMetaChange}
                  className="h-6 w-6 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded-lg cursor-pointer"
                  id="priority"
                />
                <label
                  htmlFor="priority"
                  className="font-black text-indigo-900 cursor-pointer select-none text-sm uppercase tracking-tight"
                >
                  Authorize as Priority Asset
                  <span className="block text-[10px] text-indigo-600/60 font-bold uppercase tracking-widest mt-1">
                    Featured at system peak
                  </span>
                </label>
                <div className="ml-auto">
                  <Shield className="h-6 w-6 text-indigo-400 opacity-30" />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-slate-50">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-4 py-5 px-4 bg-slate-950 text-white text-sm font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-900/10 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Transmitting...
                </>
              ) : (
                <>
                  Integrate Resource
                  <Sparkles className="h-5 w-5" />
                </>
              )}
            </button>
            <div className="mt-6 flex items-center justify-center gap-2 text-slate-400">
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
