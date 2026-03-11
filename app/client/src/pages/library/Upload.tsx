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
  ArrowRight
} from "lucide-react";
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
    agreedToTerms: false,
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
      <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mt-2 ml-1 animate-in fade-in slide-in-from-top-1">
        {message}
      </p>
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setErrors((prev) => ({ ...prev, file: "" }));
      toast.info(`Asset node identified: ${e.target.files[0].name}`);
    }
  };

  const handleMetaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setMetadata({ ...metadata, [name]: val });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!file) newErrors.file = "Critical: Asset Core Missing (File Req.)";
    if (!metadata.title.trim()) newErrors.title = "Protocol Breach: Title Required";
    if (!metadata.author.trim()) newErrors.author = "Protocol Breach: Author Required";
    if (!metadata.keywords.trim()) newErrors.keywords = "Protocol Breach: Metadata Tags Required";
    if (!metadata.design_stage_id) newErrors.design_stage_id = "Protocol Breach: Design Phase Required";
    if (metadata.design_stage_id === "others" && !metadata.customStageName.trim()) newErrors.customStageName = "Title Req for Other Stages";

    const yearNum = parseInt(metadata.forYearStudents);
    if (!metadata.forYearStudents.trim() || isNaN(yearNum) || yearNum < 1 || yearNum > 5) {
      newErrors.forYearStudents = "Target Year must be 1-5";
    }

    if (!metadata.semester.trim()) {
      newErrors.semester = "Academic Semester Required";
    } else {
      const semNum = parseInt(metadata.semester);
      if (isNaN(semNum) || semNum < 1 || semNum > 2) newErrors.semester = "Sem must be 1-2";
    }

    if (!metadata.batch || isNaN(parseInt(metadata.batch))) newErrors.batch = "Batch Identity Node Required";
    if (!metadata.agreedToTerms) newErrors.agreedToTerms = "Protocol Consensus Missing";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Integrity validation failed. Check protocols.");
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
    if (metadata.isPriority) formData.append("priority_tag", "Faculty Priority");

    try {
      const { data } = await api.post("/resources", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Intelligence successfully injected into library matrix.");
      if (isBaseAdmin) {
        navigate("/admin/resources");
      } else {
        navigate(`/resources/${data.id}`);
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error("Protocol Error: Uplink failure.");
    } finally {
      setLoading(false);
    }
  };

  const inputBase = (hasError: boolean) => `
    w-full bg-[#FAF8F4]/50 dark:bg-white/5 border-2 rounded-[1.25rem] px-6 py-5 
    text-sm font-bold text-[#5A270F] dark:text-[#EEB38C] focus:border-[#DF8142] 
    transition-all outline-none shadow-[0_4px_12px_-4px_rgba(26,11,4,0.06)] 
    focus:shadow-[0_8px_24px_-8px_rgba(223,129,66,0.3)]
    ${hasError ? 'border-rose-400' : 'border-[#D9D9C2]/60 dark:border-white/10'}
  `;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 bg-[#FAF8F4] dark:bg-[#0C0603] min-h-screen">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-10 mb-20 px-4">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-2 w-16 bg-[#DF8142] rounded-full" />
            <p className="text-[11px] font-black uppercase tracking-[0.8em] text-[#5A270F]/60 dark:text-[#EEB38C]/60">
              Nexus Ingestion
            </p>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-[#5A270F] dark:text-white tracking-tighter uppercase leading-[0.85] font-space-grotesk italic">
            RESOURCE <span className="text-[#DF8142]">UPLINK</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-8 bg-white dark:bg-card/40 p-8 rounded-[3rem] border border-[#D9D9C2] dark:border-white/5 shadow-2xl">
           <div className="h-16 w-16 bg-[#5A270F] rounded-2xl flex items-center justify-center text-[#EEB38C] shadow-lg">
             <UploadCloud className="h-8 w-8" />
           </div>
           <div>
              <p className="text-[10px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.4em] mb-1">Authorization</p>
              <p className="text-sm font-black text-[#5A270F] dark:text-white uppercase tracking-widest">{userRole || 'Verifying...'}</p>
           </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-12">
        {/* ── Left Side: File & Core Identity ── */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Payload Section */}
          <div className="bg-white dark:bg-card/40 rounded-[4rem] border border-[#D9D9C2] dark:border-white/5 shadow-2xl p-10 md:p-14 relative overflow-hidden group/payload">
             <div className="absolute inset-0 architectural-dot-grid dark:architectural-dot-grid-dark opacity-5" />
             
             <div className="relative z-10 space-y-12">
                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <h4 className="text-xs font-black uppercase tracking-[0.4em] text-[#5A270F] dark:text-[#EEB38C]">Payload Identification</h4>
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#92664A] dark:text-white/20 italic">Node integrity verification required</p>
                   </div>
                   <div className="text-[10px] font-black text-[#5A270F]/20 dark:text-white/10 uppercase tracking-widest">Protocol-01</div>
                </div>

                <div className="relative group/drop">
                  <input
                    id="file-upload" type="file" onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                    title="Upload File"
                  />
                  <div className={`
                    relative z-10 p-16 md:p-24 border-4 border-dashed rounded-[3.5rem] text-center transition-all duration-700
                    ${errors.file ? 'bg-rose-50/20 border-rose-400' : 'bg-[#FAF8F4] dark:bg-white/5 border-[#D9D9C2] group-hover/drop:border-[#DF8142] group-hover/drop:bg-white dark:group-hover/drop:bg-white/5'}
                  `}>
                    <div className="h-24 w-24 bg-[#5A270F] rounded-[2rem] flex items-center justify-center text-[#EEB38C] mx-auto mb-10 shadow-2xl transform group-hover/drop:scale-110 group-hover/drop:rotate-6 transition-all duration-500">
                      {file ? <CheckCircle2 className="h-12 w-12" /> : <UploadCloud className="h-12 w-12" />}
                    </div>
                    {file ? (
                      <div className="space-y-4 animate-in zoom-in-95">
                        <p className="text-3xl font-black text-[#5A270F] dark:text-white tracking-tighter uppercase italic">{file.name}</p>
                        <p className="text-xs font-black text-[#DF8142] uppercase tracking-[0.5em]">Capacity: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <p className="text-4xl font-black text-[#5A270F] dark:text-white tracking-tighter uppercase italic">Inject Artifact Matrix</p>
                        <div className="text-[10px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.5em] flex items-center justify-center gap-4">
                          <Zap className="h-4 w-4 text-[#DF8142]" /> 
                          MAX PAYLOAD: 5GB • ARCHITECTURAL SCHEMATICS
                        </div>
                      </div>
                    )}
                    <FieldError message={errors.file} />
                  </div>
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.6em] ml-2">Registry Title / Identity</label>
                   <div className="relative">
                      <FileText className={`absolute left-8 top-1/2 -translate-y-1/2 h-6 w-6 ${errors.title ? "text-rose-500" : "text-[#5A270F]/20"}`} />
                      <input
                        name="title" placeholder="e.g. Urban Nexus Phase IV"
                        value={metadata.title} onChange={handleMetaChange}
                        className={`${inputBase(!!errors.title)} pl-20 bg-[#FAF8F4] h-24 text-2xl tracking-tighter italic placeholder:text-[#5A270F]/5`}
                      />
                   </div>
                   <FieldError message={errors.title} />
                </div>
             </div>
          </div>

          {/* Context Matrix Section */}
          <div className="bg-white dark:bg-card/40 rounded-[4rem] border border-[#D9D9C2] dark:border-white/5 shadow-2xl p-10 md:p-14 space-y-12">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <h4 className="text-xs font-black uppercase tracking-[0.4em] text-[#5A270F] dark:text-[#EEB38C]">Metadatabase Indexing</h4>
                   <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#92664A] dark:text-white/20 italic">Establishing authorship and search nexus</p>
                </div>
                <div className="text-[10px] font-black text-[#5A270F]/20 dark:text-white/10 uppercase tracking-widest">Protocol-02</div>
             </div>

             <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.6em] ml-2">Author Authority</label>
                  <div className="relative">
                    <AtSign className={`absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 ${errors.author ? "text-rose-500" : "text-[#5A270F]/20"}`} />
                    <input name="author" placeholder="Principal Architect" value={metadata.author} onChange={handleMetaChange} className={`${inputBase(!!errors.author)} pl-16 h-20 uppercase tracking-widest text-base shadow-inner`} />
                  </div>
                  <FieldError message={errors.author} />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.6em] ml-2">Intelligence Tags</label>
                  <div className="relative">
                    <Tag className={`absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 ${errors.keywords ? "text-rose-500" : "text-[#5A270F]/20"}`} />
                    <input name="keywords" placeholder="Brutalism, Concrete, Urban" value={metadata.keywords} onChange={handleMetaChange} className={`${inputBase(!!errors.keywords)} pl-16 h-20 uppercase tracking-widest text-sm shadow-inner`} />
                  </div>
                  <FieldError message={errors.keywords} />
                </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.6em] ml-2">Year Node</label>
                  <input type="number" name="forYearStudents" placeholder="1-5" value={metadata.forYearStudents} onChange={handleMetaChange} className={`${inputBase(!!errors.forYearStudents)} h-20 text-center text-xl shadow-inner`} />
                  <FieldError message={errors.forYearStudents} />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.6em] ml-2">Semester Cycle</label>
                  <input type="number" name="semester" placeholder="1-2" value={metadata.semester} onChange={handleMetaChange} className={`${inputBase(!!errors.semester)} h-20 text-center text-xl shadow-inner`} />
                  <FieldError message={errors.semester} />
                </div>
                <div className="space-y-4 col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.6em] ml-2">Batch Identity</label>
                  <input type="number" name="batch" placeholder="202X" value={metadata.batch} onChange={handleMetaChange} className={`${inputBase(!!errors.batch)} h-20 text-center text-xl shadow-inner`} />
                  <FieldError message={errors.batch} />
                </div>
             </div>

             <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.6em] ml-2">Design Phase Specification</label>
                  <div className="relative">
                    <Database className={`absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 ${errors.design_stage_id ? "text-rose-500" : "text-[#5A270F]/20"}`} />
                    <select
                      name="design_stage_id" title="Course Type"
                      value={metadata.design_stage_id} onChange={handleMetaChange}
                      className={`${inputBase(!!errors.design_stage_id)} pl-16 h-20 appearance-none cursor-pointer uppercase tracking-[0.2em] font-black bg-white dark:bg-[#110804]`}
                    >
                      <option value="" disabled>Select Core Phase</option>
                      {designStages.filter((s) => s.name.toLowerCase() !== "others").map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                      <option value="others">Custom Protocol Node...</option>
                    </select>
                  </div>
                  <FieldError message={errors.design_stage_id} />
                </div>

                {metadata.design_stage_id === "others" && (
                  <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                    <label className="text-[10px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.6em] ml-2">Custom Phase Node Identity</label>
                    <input name="customStageName" placeholder="Enter course name node" value={metadata.customStageName} onChange={handleMetaChange} className={`${inputBase(!!errors.customStageName)} h-20 uppercase tracking-widest text-base shadow-inner`} />
                    <FieldError message={errors.customStageName} />
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* ── Right Side: Action Side ── */}
        <div className="lg:col-span-4 space-y-12">
          
          <div className="bg-[#1A0B03] rounded-[4rem] p-12 text-white relative overflow-hidden shadow-[0_60px_100px_-20px_rgba(26,11,3,0.5)] border border-white/5">
             <div className="absolute top-0 right-0 w-80 h-80 bg-[#DF8142]/20 blur-[120px] rounded-full" />
             
             <div className="relative z-10 space-y-12">
                <div className="flex items-center gap-6">
                   <div className="h-10 w-10 rounded-xl bg-[#DF8142] flex items-center justify-center text-white shadow-lg">
                      <Shield className="h-5 w-5" />
                   </div>
                   <h6 className="text-[12px] font-black uppercase tracking-[0.4em] text-[#EEB38C]">Security Consensus</h6>
                </div>

                <div className="space-y-6">
                   <div className={`p-6 rounded-[2.5rem] border transition-all duration-500 flex items-start gap-4 ${metadata.agreedToTerms ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                      <input
                        type="checkbox" id="agreedToTerms" name="agreedToTerms"
                        checked={metadata.agreedToTerms} onChange={handleMetaChange}
                        className="mt-1 h-6 w-6 rounded-lg border-2 border-white/20 text-[#DF8142] focus:ring-0 cursor-pointer accent-[#DF8142]"
                        title="Accept Terms"
                      />
                      <label htmlFor="agreedToTerms" className="text-[10px] font-bold text-white/60 leading-relaxed uppercase tracking-widest cursor-pointer select-none">
                        I hereby verify the academic integrity of this asset and agree to the <Link to="/terms" className="text-[#DF8142] underline underline-offset-4 decoration-dotted">Legal Matrix Protocols</Link>.
                      </label>
                   </div>
                   <FieldError message={errors.agreedToTerms} />

                   {(["Faculty", "Admin", "SuperAdmin", "DepartmentHead", "admin"] as string[]).includes(userRole) && (
                    <div className={`p-6 rounded-[2.5rem] border transition-all duration-500 flex items-start gap-4 ${metadata.isPriority ? 'bg-[#DF8142]/20 border-[#DF8142]/40' : 'bg-white/5 border-white/10 opacity-40 hover:opacity-100'}`}>
                      <input
                        type="checkbox" id="isPriority" name="isPriority"
                        checked={metadata.isPriority} onChange={handleMetaChange}
                        className="mt-1 h-6 w-6 rounded-lg border-2 border-white/20 text-[#DF8142] focus:ring-0 cursor-pointer accent-[#DF8142]"
                        title="Priority Tag"
                      />
                      <div className="space-y-1">
                        <label htmlFor="isPriority" className="text-[11px] font-black text-white uppercase tracking-widest cursor-pointer leading-none">Faculty High Fidelity</label>
                        <p className="text-[8px] font-bold text-[#EEB38C]/60 uppercase tracking-widest">Mark as verified priority node</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-10 border-t border-white/10">
                   <button
                    type="submit" disabled={loading}
                    className="w-full h-24 flex items-center justify-center gap-6 bg-white text-[#5A270F] rounded-[2rem] text-[14px] font-black uppercase tracking-[0.5em] hover:bg-[#EEB38C] transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-30 group shadow-2xl"
                  >
                    {loading ? (
                      <Loader2 className="h-8 w-8 animate-spin" />
                    ) : (
                      <>
                        Initialize Uplink 
                        <ArrowRight className="h-6 w-6 transform group-hover:translate-x-3 transition-transform duration-500" />
                      </>
                    )}
                  </button>
                  <p className="mt-8 text-[9px] font-black uppercase tracking-[0.5em] text-[#EEB38C]/20 text-center italic">Encryption active • Secure Link established</p>
                </div>
             </div>
          </div>

          <div className="bg-white dark:bg-card/40 rounded-[3rem] p-10 border border-[#D9D9C2] dark:border-white/5 space-y-8 shadow-2xl">
            <h5 className="text-[11px] font-black uppercase tracking-[0.6em] text-[#5A270F] dark:text-[#EEB38C] flex items-center gap-4">
              <Info className="h-5 w-5 text-[#DF8142]" /> SYSTEM DIRECTIVE
            </h5>
            <p className="text-sm font-medium text-[#5A270F]/60 dark:text-white/40 leading-relaxed italic border-l-4 border-[#DF8142]/20 pl-6">
              "All submitted architectural assets undergo a formal validation cycle in the nexus core. Malicious code injection or proprietary infringement results in immediate node sequestration."
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Upload;
