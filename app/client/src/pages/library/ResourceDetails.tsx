import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { api } from "../../lib/api";
import type { Resource, Comment as CommentModel } from "../../models";
import {
  Loader2,
  ServerCrash,
  Download,
  Eye,
  Clock,
  Star,
  ShieldAlert,
  ArrowLeft,
  Box,
  RotateCcw,
  Trash2,
  ChevronRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { isAuthenticated, currentRole } from "../../lib/auth";
import { toast } from "../../lib/toast";

interface Rating {
  id: number;
  rate: number;
  user_id: number;
}

const ResourceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [resource, setResource] = useState<Resource | null>(null);
  const [recentResources, setRecentResources] = useState<Resource[]>([]);
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [hoverRating, setHoverRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [userRating, setUserRating] = useState(0);

  const [evaluationComment, setEvaluationComment] = useState("");
  const [pendingRating, setPendingRating] = useState(0);
  const [submittingEvaluation, setSubmittingEvaluation] = useState(false);

  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const role = currentRole();
  const isAuthorizedManager =
    role === "DepartmentHead" || role === "SuperAdmin";
  const isAuth = isAuthenticated();
  const isNested =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/admin");

  useEffect(() => {
    if (isAuth && !isNested) {
      if (role === "Admin" || role === "SuperAdmin" || role === "admin") {
        navigate(`/admin/resources/${id}`, { replace: true });
      } else {
        navigate(`/dashboard/resources/${id}`, { replace: true });
      }
    }
  }, [isAuth, isNested, id, role, navigate]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/resources/${id}`);
        setResource(data);
        setComments(data.comments || []);

        const { data: recentData } = await api.get("/resources?limit=5");
        if (Array.isArray(recentData)) {
          setRecentResources(
            recentData.filter((r: Resource) => r.id !== Number(id)),
          );
        }

        if (data.ratings && data.ratings.length > 0) {
          const sum = data.ratings.reduce(
            (acc: number, r: Rating) => acc + r.rate,
            0,
          );
          setAverageRating(sum / data.ratings.length);
          setRatingCount(data.ratings.length);

          const userStr = localStorage.getItem("user");
          if (userStr) {
            const currentUser = JSON.parse(userStr);
            const myRating = data.ratings.find(
              (r: Rating) => r.user_id === currentUser.id,
            );
            if (myRating) setUserRating(myRating.rate);
          }
        }
      } catch (err) {
        console.error("Failed to fetch resource details:", err);
        setError(
          "Access Denied: The requested asset node could not be localized or has been neutralized.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleRatingClick = (rateValue: number) => {
    if (!isAuth) {
      toast.info("Authentication verified required for evaluation protocols");
      return;
    }
    setPendingRating(rateValue);
  };

  const handleSubmitEvaluation = async () => {
    if (!isAuth) {
      toast.info("Authentication verified required for evaluation protocols");
      return;
    }
    if (pendingRating === 0) {
      toast.error("Evaluation Error: No technical valuation selected");
      return;
    }

    setSubmittingEvaluation(true);
    try {
      await api.post(`/resources/${id}/rate`, { rate: pendingRating });
      setUserRating(pendingRating);

      if (evaluationComment.trim()) {
        await api.post(`/resources/${id}/comments`, {
          text: `[Evaluation Feedback]: ${evaluationComment.trim()}`,
        });
        const { data: updatedResource } = await api.get(`/resources/${id}`);
        setComments(updatedResource.comments || []);
      }

      toast.success(`Evaluation Broadcasted: Registry updated`);

      const { data } = await api.get(`/resources/${id}`);
      if (data.ratings && data.ratings.length > 0) {
        const sum = data.ratings.reduce(
          (acc: number, r: Rating) => acc + r.rate,
          0,
        );
        setAverageRating(sum / data.ratings.length);
        setRatingCount(data.ratings.length);
      }

      setEvaluationComment("");
      setPendingRating(0);
    } catch (error) {
      console.error("Failed to broadcast evaluation", error);
      toast.error("Global Nexus Error: Evaluation transmission failed");
    } finally {
      setSubmittingEvaluation(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      await api.post(`/resources/${id}/comments`, {
        text: newComment,
      });
      toast.success("Intelligence logged to the community nexus");
      const { data: updatedResource } = await api.get(`/resources/${id}`);
      setComments(updatedResource.comments || []);
      setNewComment("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
      toast.error("Nexus Error: Communication packet rejected");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleArchive = async () => {
    toast(`Archive this node?`, {
      description: "This resource will be sequestered. Student access will be terminated.",
      action: {
        label: "Archive Node",
        onClick: async () => {
          try {
            await api.patch(`/admin/resources/${id}/archive`);
            toast.success("Resource archived in the system matrix");
            const { data } = await api.get(`/resources/${id}`);
            setResource(data);
          } catch {
            toast.error("Protocol Error: Failed to archive node");
          }
        }
      },
      cancel: { label: "Abort", onClick: () => {} }
    });
  };

  const handleRestore = async () => {
    toast(`Restore this node?`, {
        description: "Re-activating this resource will restores student access permissions.",
        action: {
          label: "Restore Node",
          onClick: async () => {
            try {
              await api.patch(`/admin/resources/${id}/restore`);
              toast.success("Resource restored to the active library");
              const { data } = await api.get(`/resources/${id}`);
              setResource(data);
            } catch {
              toast.error("Protocol Error: Failed to restore node");
            }
          }
        },
        cancel: { label: "Abort", onClick: () => {} }
    });
  };

  const handleToggleVisibility = async () => {
    if (!resource) return;
    const newIsPublic = !resource.is_public;
    try {
      await api.patch(`/admin/resources/${id}/status`, { is_public: newIsPublic });
      toast.success(`Visibility Protocol Updated: Resource is now ${newIsPublic ? 'Public' : 'Private'}`);
      setResource({ ...resource, is_public: newIsPublic });
    } catch {
      toast.error("Security Breach: Failed to update visibility signature");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-40">
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-[#DF8142] blur-3xl opacity-20 animate-pulse" />
          <Loader2 className="h-20 w-20 animate-spin text-[#DF8142] relative z-10" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[#5A270F]/40 dark:text-white/40 animate-pulse">
          Synchronizing Nexus Core...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${isNested ? "" : "container mx-auto px-4"} py-24`}>
        <div className="bg-[#5A270F] p-24 rounded-[4rem] text-center border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute inset-0 architectural-dot-grid opacity-10" />
          <ServerCrash className="h-24 w-24 text-rose-500 mx-auto mb-10 animate-bounce" />
          <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter italic">
            NODE SEIZURE DETECTED
          </h2>
          <p className="mt-2 text-[#EEB38C]/60 font-bold uppercase tracking-widest text-xs max-w-md mx-auto leading-relaxed">
            {error}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-12 px-12 py-5 bg-white text-[#5A270F] rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-[#EEB38C] transition-all transform active:scale-95 shadow-2xl"
          >
            Emergency Extraction
          </button>
        </div>
      </div>
    );
  }

  if (!resource) return null;

  return (
    <div className={`${isNested ? "" : "max-w-5xl mx-auto px-2 py-2"} animate-in fade-in duration-700 bg-[#FAF8F4] dark:bg-[#0C0603] font-inter selection:bg-[#DF8142]/20`}>
      {/* ── Page Header & Navigation ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1.5 mb-4 px-1 border-b border-[#D9D9C2]/20 pb-2">
        <div className="space-y-0.5">
           <button
            onClick={() => isNested ? navigate(-1) : navigate("/browse")}
            className="group flex items-center gap-1 text-[6.5px] font-black uppercase tracking-[0.2em] text-[#92664A] dark:text-[#EEB38C]/40 hover:text-[#DF8142] transition-all"
          >
            <ArrowLeft className="h-2.5 w-2.5 group-hover:-translate-x-1 transition-transform" />
            PROTOCOL_EXIT
          </button>
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-6 bg-[#DF8142] rounded-full" />
            <h4 className="text-[7.5px] font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C]">SPECIFICATION_NODE//TX-{id}</h4>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 bg-white dark:bg-[#1A0B02] border border-[#D9D9C2] dark:border-white/5 rounded-full flex items-center gap-2 shadow-sm border-dashed">
             <div className="flex items-center gap-1">
                <div className={`h-1 w-1 rounded-full ${resource.status === 'archived' ? 'bg-rose-500' : 'bg-[#DF8142]'} animate-pulse`} />
                <span className="text-[6.5px] font-black uppercase tracking-widest text-[#5A270F] dark:text-white/60">STATE: {resource.status?.toUpperCase()}</span>
             </div>
             <div className="h-2 w-px bg-[#D9D9C2] dark:bg-white/10" />
             <span className="text-[6.5px] font-black text-[#92664A] uppercase tracking-widest leading-none">V_1.0.4</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-4 items-start">
        {/* ── Main Intel Column ── */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Hyper-Compact Title Node */}
          <section className="relative group p-4 rounded-xl bg-white dark:bg-[#1A0B02]/40 border border-[#D9D9C2] dark:border-white/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 blueprint-grid opacity-5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 text-[40px] font-black text-[#5A270F]/5 dark:text-white/5 uppercase select-none pointer-events-none tracking-tighter translate-y-4">
              CORE
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 mb-2">
                 <span className="px-1.5 py-0.5 bg-[#5A270F] text-[#EEB38C] text-[6px] font-black uppercase tracking-[0.2em] rounded">SYSTEM_PRIMARY</span>
                 <div className="h-px flex-1 bg-gradient-to-r from-[#D9D9C2] to-transparent dark:from-white/10" />
              </div>
              
              <h1 className="text-xl md:text-2xl font-black text-[#5A270F] dark:text-white tracking-tighter uppercase leading-[0.9] italic mb-4 drop-shadow-sm">
                {resource.title}
              </h1>
              
              <div className="flex flex-wrap gap-4">
                <div className="space-y-0.5">
                   <p className="text-[6px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.2em]">Authorized Principal</p>
                   <p className="text-[10px] font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-tight italic flex items-center gap-1">
                     <span className="h-1 w-1 bg-[#DF8142] rounded-full" />
                     {resource.author}
                   </p>
                </div>
                <div className="w-px h-6 bg-[#D9D9C2] dark:bg-white/10 hidden sm:block" />
                <div className="space-y-0.5">
                   <p className="text-[6px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.2em]">Temporal Stamp</p>
                   <p className="text-[10px] font-black text-[#5A270F] dark:text-white/50 uppercase tracking-tight">
                     {new Date(resource.uploadedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                   </p>
                </div>
                {resource.designStage && (
                  <>
                    <div className="w-px h-6 bg-[#D9D9C2] dark:bg-white/10 hidden sm:block" />
                    <div className="space-y-0.5">
                       <p className="text-[6px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.2em]">Phased Alignment</p>
                       <p className="text-[10px] font-black text-[#DF8142] uppercase tracking-tight italic drop-shadow-sm">{resource.designStage.name}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* Admin Context Directive - Shrunk */}
          {resource.adminComment && (
            <div className="bg-[#5A270F] dark:bg-[#1A0B02] p-3 rounded-xl shadow-lg relative overflow-hidden group border border-white/5">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#DF8142]/10 blur-[40px] -translate-y-1/2 translate-x-1/2" />
               <div className="relative z-10 flex items-start gap-3">
                  <div className="h-8 w-8 shrink-0 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-[#DF8142]">
                    <ShieldAlert className="h-3.5 w-3.5 animate-pulse" />
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="text-[6.5px] font-black uppercase tracking-[0.3em] text-[#EEB38C]">Operations Command Directive</h5>
                    <p className="text-sm text-white italic font-medium leading-tight max-w-xl opacity-90 border-l border-[#DF8142]/40 pl-3">
                      "{resource.adminComment}"
                    </p>
                  </div>
               </div>
            </div>
          )}

          {/* Technical Core Parameters - Compact Grid */}
          <section className="bg-white dark:bg-[#1A0100]/40 p-4 rounded-xl border border-[#D9D9C2] dark:border-white/5 shadow-md relative overflow-hidden group">
             <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#DF8142] to-transparent opacity-30" />
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-lg bg-[#5A270F] flex items-center justify-center text-[#EEB38C] shadow-md">
                        <Box className="h-3 w-3" />
                      </div>
                      <h3 className="text-[8px] font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C]">TECHNICAL_CORE_PARAMETERS</h3>
                   </div>
                   <div className="flex gap-0.5">
                      <div className="h-0.5 w-4 bg-[#DF8142] rounded-full" />
                      <div className="h-0.5 w-1 bg-[#D9D9C2] rounded-full" />
                   </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      {[
                        { label: 'Asset Payload', value: resource.fileSize > 1048576 ? `${(resource.fileSize/1048576).toFixed(2)}` : `${(resource.fileSize/1024).toFixed(2)}`, unit: resource.fileSize > 1048576 ? 'MB' : 'KB', color: '[#5A270F]' },
                        { label: 'Node Extension', value: resource.fileType?.toUpperCase() || 'FMT', unit: 'FMT', color: '[#DF8142]' },
                        { label: 'Academic Year', value: `0${resource.forYearStudents}`, unit: 'LVL', color: '[#6C3B1C]' },
                        { label: 'Batch Registry', value: resource.batchYear || '2024', unit: 'CYC', color: '[#92664A]' }
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-end pb-1 border-b border-[#D9D9C2]/20 dark:border-white/5 group/line">
                          <span className="text-[7.5px] font-black uppercase tracking-[0.2em] text-[#92664A]/60 dark:text-white/20 group-hover/line:text-[#DF8142] transition-colors">{item.label}</span>
                          <div className="flex items-baseline gap-1">
                             <span className={`text-[11px] font-black text-${item.color} dark:text-white uppercase tracking-tighter italic`}>{item.value}</span>
                             <span className="text-[6.5px] font-black text-[#92664A]/40">{item.unit}</span>
                          </div>
                        </div>
                      ))}
                   </div>

                   <div className="flex flex-col justify-end gap-1.5">
                      <a
                        href={`${import.meta.env.VITE_API_URL}/resources/${id}/view?token=${encodeURIComponent(localStorage.getItem("token") || "")}`}
                        target="_blank" rel="noreferrer"
                        className="h-10 flex items-center justify-center gap-2 bg-[#5A270F] text-white rounded-lg text-[8px] font-black uppercase tracking-[0.2em] hover:bg-[#6C3B1C] transition-all group/btn shadow-md"
                      >
                        <Eye className="h-3.5 w-3.5 text-[#EEB38C] group-hover/btn:scale-110 transition-transform" />
                        Visual Scan
                      </a>
                      <a
                        href={`${import.meta.env.VITE_API_URL}/resources/${id}/download?token=${encodeURIComponent(localStorage.getItem("token") || "")}`}
                        className="h-10 flex items-center justify-center gap-2 bg-[#DF8142] text-white rounded-lg text-[8px] font-black uppercase tracking-[0.2em] hover:bg-[#5A270F] transition-all shadow-md"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Archive Uplink
                      </a>
                   </div>
                </div>
             </div>
          </section>

          {/* Qualitative Evaluation Node - Compressed */}
          {(resource.status === "approved" || resource.status === "student") && (
            <section className="bg-white dark:bg-[#1A0B02]/30 rounded-xl border border-[#D9D9C2] dark:border-white/5 p-4 relative overflow-hidden shadow-lg">
               <div className="relative z-10 flex flex-col xl:flex-row gap-6 items-center">
                  <div className="flex-1 space-y-4 w-full">
                    <div className="space-y-0.5">
                       <h3 className="text-[8.5px] font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C]">QUALITATIVE_SCAN_NODE</h3>
                       <p className="text-[7.5px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.2em]">Intelligence synchronization</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => handleRatingClick(star)}
                          className="focus:outline-none transition-all hover:scale-110 group/star disabled:opacity-30 relative"
                          disabled={!isAuth || submittingEvaluation}
                        >
                          <Star
                            className={`h-5 w-5 ${
                              (hoverRating || pendingRating || userRating || Math.round(averageRating)) >= star
                                ? "text-[#DF8142] fill-[#DF8142]"
                                : "text-[#D9D9C2] dark:text-white/5"
                            } transition-all duration-300`}
                          />
                        </button>
                      ))}
                    </div>

                    <div className="relative group">
                      <textarea 
                        rows={2}
                        value={evaluationComment}
                        onChange={(e) => setEvaluationComment(e.target.value)}
                        placeholder="Technical insight node..."
                        className="w-full bg-[#FAF8F4] dark:bg-black/20 border border-[#D9D9C2] dark:border-white/5 rounded-lg p-3 text-[10px] font-bold text-[#5A270F] dark:text-white outline-none focus:border-[#DF8142] transition-all placeholder:text-[#92664A]/30"
                      />
                    </div>
                    
                    <button
                      onClick={handleSubmitEvaluation}
                      disabled={submittingEvaluation || !isAuth || pendingRating === 0}
                      className="w-full xl:w-auto px-6 py-2 bg-[#5A270F] text-[#EEB38C] rounded-lg text-[8px] font-black uppercase tracking-[0.3em] hover:bg-[#DF8142] hover:text-white transition-all shadow-md active:scale-95 disabled:opacity-30"
                    >
                      {submittingEvaluation ? <Loader2 className="h-3 w-3 animate-spin mx-auto" /> : "BROADCAST_EVALUATION"}
                    </button>
                  </div>

                  <div className="w-full xl:w-48 space-y-4 bg-[#FAF8F4] dark:bg-black/40 p-4 rounded-xl border border-[#D9D9C2] dark:border-white/5 shadow-inner relative overflow-hidden group/readout">
                     <div className="text-center relative z-10">
                        <p className="text-[7.5px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.3em] mb-2">NEXUS_AGGREGATE</p>
                        <div className="flex items-baseline justify-center gap-1">
                           <span className="text-3xl font-black text-[#5A270F] dark:text-[#DF8142] tracking-tighter italic">{averageRating.toFixed(1)}</span>
                           <span className="text-[10px] font-black text-[#92664A] uppercase">/ 5.0</span>
                        </div>
                     </div>
                     <div className="space-y-2 pt-4 border-t border-[#D9D9C2] dark:border-white/10 relative z-10">
                        <div className="flex justify-between items-center text-[7.5px] font-black uppercase tracking-[0.2em] text-[#5A270F]/60 dark:text-white/40">
                           <span>LOG_COUNT</span>
                           <span className="text-[#5A270F] dark:text-[#EEB38C] font-mono font-black">{(ratingCount || 0).toString().padStart(3, '0')}</span>
                        </div>
                         <div className="h-1.5 w-full bg-white dark:bg-white/5 rounded-full overflow-hidden border border-[#D9D9C2]/20 dark:border-white/5 shadow-inner">
                            <div 
                               className={`h-full bg-gradient-to-r from-[#5A270F] via-[#DF8142] to-[#EEB38C] rounded-full transition-all duration-1000 ease-out ${
                                  averageRating >= 5 ? 'w-full' :
                                  averageRating >= 4.5 ? 'w-[90%]' :
                                  averageRating >= 4 ? 'w-[80%]' :
                                  averageRating >= 3.5 ? 'w-[70%]' :
                                  averageRating >= 3 ? 'w-[60%]' :
                                  averageRating >= 2.5 ? 'w-[50%]' :
                                  averageRating >= 2 ? 'w-[40%]' :
                                  averageRating >= 1.5 ? 'w-[30%]' :
                                  averageRating >= 1 ? 'w-[20%]' :
                                  averageRating >= 0.5 ? 'w-[10%]' : 'w-0'
                               }`}
                            />
                         </div>
                     </div>
                  </div>
               </div>
            </section>
          )}

          {/* Intelligence Synchronization Cluster - Tightened */}
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-4 border-b-2 border-[#5A270F] pb-2">
               <div className="space-y-0.5">
                  <h2 className="text-lg font-black text-[#5A270F] dark:text-white tracking-tighter uppercase italic leading-none">
                    CORE_<span className="text-[#DF8142]">INTELLIGENCE</span>
                  </h2>
                  <p className="text-[7.5px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.3em]">Peer insight cluster</p>
               </div>
               <div className="px-4 py-1.5 bg-[#5A270F] rounded-lg text-[8px] font-black text-[#EEB38C] uppercase tracking-[0.2em] shadow-md">
                LOGS: {comments.length.toString().padStart(3, '0')}
              </div>
            </div>

            <form onSubmit={handleSubmitComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Technical packet..."
                className="flex-grow bg-white dark:bg-white/5 border border-[#D9D9C2] dark:border-white/10 rounded-lg px-4 py-2 text-[10px] font-bold text-[#5A270F] dark:text-white outline-none focus:border-[#DF8142] transition-all shadow-sm placeholder:text-[#92664A]/20"
              />
              <button
                type="submit"
                disabled={submittingComment || !newComment.trim()}
                className="px-6 bg-[#5A270F] text-[#EEB38C] rounded-lg text-[8px] font-black uppercase tracking-[0.2em] hover:bg-[#6C3B1C] transition-all shadow-md min-w-[100px]"
              >
                {submittingComment ? <Loader2 className="h-3 w-3 animate-spin" /> : "TRANSMIT"}
              </button>
            </form>

            <div className="grid gap-2">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white dark:bg-[#1A0100]/60 p-3 rounded-lg border border-[#D9D9C2] dark:border-white/10 shadow-sm flex gap-4 items-start group hover:bg-[#FAF8F4] transition-all">
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-[#5A270F] flex items-center justify-center text-[#EEB38C] text-sm font-black shadow-md">
                    {(comment.user.first_name || comment.user.firstName)?.[0]}
                  </div>
                  <div className="space-y-1 flex-grow">
                    <div className="flex items-center gap-3">
                       <p className="text-[10px] font-black text-[#5A270F] dark:text-white uppercase tracking-tighter italic">
                         {comment.user.first_name || comment.user.firstName}
                       </p>
                       <p className="text-[6.5px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-widest">
                         SYNC_{new Date(comment.createdAt).toLocaleDateString()}
                       </p>
                    </div>
                    <p className="text-[10px] font-medium text-[#5A270F]/80 dark:text-[#EEB38C]/80 leading-tight italic border-l border-[#DF8142]/20 pl-3">"{comment.text}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Control Center Sidebar - Hyper Compact ── */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-4">
          
          <div className="bg-[#1A0B03] p-4 rounded-xl text-white relative overflow-hidden shadow-xl border border-white/5">
             <div className="absolute top-0 left-0 w-full h-full architectural-dot-grid opacity-[0.03]" />
             <div className="relative z-10 space-y-4">
                <div className="space-y-0.5">
                   <div className="flex items-center gap-1.5 mb-1">
                      <div className="h-1 w-1 bg-[#DF8142] rounded-full animate-pulse" />
                      <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-[#EEB38C]">SECURITY_LAYER</h4>
                   </div>
                   <p className="text-[8px] font-bold text-white/30 italic">Privileged modification restricted</p>
                </div>

                <div className="space-y-3">
                  {isAuthorizedManager && (
                     <div className="space-y-2">
                        {resource.status === 'archived' ? (
                          <button onClick={handleRestore} className="w-full h-10 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-center gap-2 text-emerald-400 text-[8px] font-black uppercase tracking-[0.3em] hover:bg-emerald-500/20 transition-all active:scale-95 group">
                            <RotateCcw className="h-4 w-4 group-hover:-rotate-180 transition-transform duration-700" /> RESTORE_LOGIC_CMD
                          </button>
                        ) : (
                          <div className="flex flex-col gap-2">
                             <button 
                               onClick={handleToggleVisibility}
                               className={`w-full h-10 border rounded-lg flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] transition-all active:scale-95 group ${resource.is_public ? "bg-[#DF8142]/10 border-[#DF8142] text-[#DF8142]" : "bg-[#FAF8F4] dark:bg-white/5 border-[#D9D9C2] dark:border-white/10 text-[#5A270F] dark:text-[#EEB38C]"}`}
                             >
                                <Eye className={`h-4 w-4 ${resource.is_public ? "animate-pulse" : "opacity-30"}`} /> 
                                {resource.is_public ? "VISIBILITY: PUBLIC" : "VISIBILITY: PRIVATE"}
                             </button>
                             <button onClick={handleArchive} className="w-full h-10 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center justify-center gap-2 text-rose-400 text-[8px] font-black uppercase tracking-[0.3em] hover:bg-rose-500/20 transition-all active:scale-95 group">
                                <Trash2 className="h-4 w-4" /> SEQUESTER_NODE_CMD
                             </button>
                          </div>
                        )}
                     </div>
                  )}

                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-4 relative overflow-hidden group/id">
                     <div className="space-y-1 relative z-10">
                        <p className="text-[7.5px] font-black text-white/20 uppercase tracking-[0.3em]">REGISTRY_ID</p>
                        <p className="text-lg font-black text-[#EEB38C] font-mono tracking-tighter italic">#{String(id).padStart(8, '0')}</p>
                     </div>
                     <div className="h-px bg-gradient-to-r from-white/10 to-transparent" />
                     <div className="space-y-2.5 relative z-10">
                        <div className="flex items-center gap-2 opacity-60">
                           <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                           <span className="text-[7.5px] font-black uppercase tracking-[0.2em] text-emerald-400">VERIFIED_SHA256</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-60">
                           <Zap className="h-3.5 w-3.5 text-[#DF8142]" />
                           <span className="text-[7.5px] font-black uppercase tracking-[0.2em] text-[#DF8142]">NEURAL_LINK</span>
                        </div>
                     </div>
                  </div>
                </div>
             </div>
          </div>

          {/* Related Artifact Cluster - Shrunk */}
          <div className="bg-white dark:bg-[#1A0B02]/20 p-4 rounded-xl border border-[#D9D9C2] dark:border-white/5 shadow-md relative overflow-hidden group/matrix">
            <h5 className="text-[8px] font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C] mb-4 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-[#DF8142]" /> SYNAPTIC_NODES
            </h5>
            <div className="grid gap-3">
              {recentResources.map((recent) => (
                <Link 
                  key={recent.id} 
                  to={isNested ? (role === 'Admin' || role === 'SuperAdmin' || role === 'admin' ? `/admin/resources/${recent.id}` : `/dashboard/resources/${recent.id}`) : `/resources/${recent.id}`}
                  className="flex items-center gap-3 group/item transition-all"
                >
                   <div className="h-8 w-8 shrink-0 rounded-lg bg-[#5A270F] flex items-center justify-center text-[#EEB38C] font-black text-[9px] shadow-md transform group-hover/item:scale-105 transition-all">
                    {recent.fileType?.[0]?.toUpperCase() || 'A'}
                   </div>
                   <div className="overflow-hidden space-y-0.5 flex-grow">
                      <p className="text-[9px] font-black text-[#5A270F] dark:text-white uppercase truncate group-hover/item:text-[#DF8142] transition-colors tracking-tight italic">{recent.title}</p>
                      <p className="text-[7px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.1em] opacity-80">ARCHITECT. {recent.author}</p>
                   </div>
                   <ChevronRight className="h-3 w-3 ml-auto text-[#D9D9C2] group-hover/item:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
            <button className="w-full mt-4 py-2 border border-dashed border-[#D9D9C2] dark:border-white/10 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] text-[#92664A]/60 dark:text-white/20 hover:border-[#DF8142] hover:text-[#DF8142] transition-all bg-[#FAF8F4]/50">
              EXPAND_CLUSTER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetails;
