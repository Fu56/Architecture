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
    <div className={`${isNested ? "" : "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6"} animate-in fade-in duration-1000 bg-[#FAF8F4] dark:bg-[#0C0603]`}>
      {/* ── Page Header & Navigation ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-2">
        <div className="space-y-2">
           <button
            onClick={() => isNested ? navigate(-1) : navigate("/browse")}
            className="group flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-[#5A270F]/40 dark:text-[#EEB38C]/40 hover:text-[#DF8142] transition-colors"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Return to Nexus
          </button>
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 bg-[#DF8142] rounded-full" />
            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C]">Artifact Specification</h4>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="h-px w-12 bg-[#D9D9C2] dark:bg-white/10 hidden lg:block" />
          <div className="px-3 py-1.5 bg-white dark:bg-white/5 border border-[#D9D9C2] dark:border-white/10 rounded-lg flex items-center gap-2 shadow-sm">
             <div className={`h-1 w-1 rounded-full ${resource.status === 'archived' ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse`} />
             <span className="text-[8px] font-black uppercase tracking-widest text-[#5A270F]/60 dark:text-white/40">Log Status: {resource.status?.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* ── Main Column ── */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Immersive Title Section */}
          <section className="relative group">
            <div className="absolute -inset-4 bg-[#DF8142]/5 blur-2xl rounded-[2rem] group-hover:bg-[#DF8142]/10 transition-colors duration-1000" />
            <div className="absolute top-0 right-0 text-[60px] font-black text-[#5A270F]/5 dark:text-white/5 uppercase select-none pointer-events-none tracking-tighter -translate-y-6">
              SPEC-TX
            </div>
            <div className="relative">
              <h1 className="text-3xl md:text-5xl font-black text-[#5A270F] dark:text-white tracking-tighter uppercase leading-[0.95] font-space-grotesk italic drop-shadow-sm">
                {resource.title}
              </h1>
              <div className="mt-6 flex flex-wrap gap-6">
                <div className="space-y-0.5">
                   <p className="text-[7px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.3em]">Principal Authority</p>
                   <p className="text-lg font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-tight">{resource.author}</p>
                </div>
                <div className="h-8 w-px bg-[#D9D9C2] dark:bg-white/10" />
                <div className="space-y-0.5">
                   <p className="text-[7px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.3em]">Genesis Date</p>
                   <p className="text-lg font-black text-[#5A270F] dark:text-white uppercase tracking-tight">{new Date(resource.uploadedAt).toLocaleDateString()}</p>
                </div>
                {resource.designStage && (
                  <>
                    <div className="h-8 w-px bg-[#D9D9C2] dark:bg-white/10" />
                    <div className="space-y-0.5">
                      <p className="text-[7px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.3em]">Design Phase</p>
                      <p className="text-lg font-black text-[#DF8142] uppercase tracking-tight">{resource.designStage.name}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* Admin Context Directive */}
          {resource.adminComment && (
            <div className="bg-[#5A270F] dark:bg-[#1A0B04] p-6 rounded-[1.5rem] shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-48 h-48 bg-[#DF8142]/10 blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#DF8142]/20 transition-colors" />
               <div className="relative z-10 flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-[#DF8142] shadow-inner">
                    <ShieldAlert className="h-5 w-5 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-[9px] font-black uppercase tracking-[0.4em] text-[#EEB38C]">Operations Directive</h5>
                    <p className="text-lg text-white italic font-medium leading-relaxed max-w-lg opacity-90">
                      "{resource.adminComment}"
                    </p>
                  </div>
               </div>
            </div>
          )}

          {/* Asset Preview / File Info */}
          <div className="bg-white dark:bg-card/40 p-6 md:p-8 rounded-[1.5rem] border border-[#D9D9C2] dark:border-white/5 shadow-xl relative overflow-hidden architect-border group">
             <div className="absolute inset-0 architectural-dot-grid dark:architectural-dot-grid-dark opacity-5" />
             <div className="relative z-10 grid md:grid-cols-2 gap-6">
               <div className="space-y-4">
                 <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-[#5A270F] flex items-center justify-center text-[#EEB38C] shadow-md">
                      <Box className="h-3 w-3" />
                    </div>
                    <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#5A270F] dark:text-white">Technical Parameters</h3>
                 </div>
                 
                 <div className="space-y-3">
                    {[
                      { label: 'Data Payload', value: resource.fileSize > 1048576 ? `${(resource.fileSize/1048576).toFixed(2)} MB` : `${(resource.fileSize/1024).toFixed(2)} KB`, color: '[#5A270F]' },
                      { label: 'File Type', value: resource.fileType?.toUpperCase() || 'DOCUMENT', color: '[#DF8142]' },
                      { label: 'Academic Year', value: `Year ${resource.forYearStudents}`, color: '[#6C3B1C]' },
                      { label: 'Batch Cycle', value: resource.batchYear || '2024', color: '[#92664A]' }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-end pb-2 border-b border-[#D9D9C2]/40 dark:border-white/5 group/line">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#5A270F]/40 dark:text-white/20 group-hover/line:text-[#DF8142] transition-colors">{item.label}</span>
                        <span className={`text-[10px] font-black text-${item.color} dark:text-white uppercase tracking-widest`}>{item.value}</span>
                      </div>
                    ))}
                 </div>
               </div>

               <div className="flex flex-col justify-center gap-3">
                  <a
                    href={`${import.meta.env.VITE_API_URL}/resources/${id}/view?token=${encodeURIComponent(localStorage.getItem("token") || "")}`}
                    target="_blank" rel="noreferrer"
                    className="h-12 flex items-center justify-center gap-3 bg-[#5A270F] text-white rounded-xl text-[9px] font-black uppercase tracking-[0.3em] hover:bg-[#6C3B1C] transition-all hover:scale-[1.01] shadow-lg shadow-[#5A270F]/10 active:scale-95 group/btn"
                  >
                    <Eye className="h-5 w-5 text-[#EEB38C] group-hover/btn:scale-110 transition-transform" />
                    Visual Scan
                  </a>
                  <a
                    href={`${import.meta.env.VITE_API_URL}/resources/${id}/download?token=${encodeURIComponent(localStorage.getItem("token") || "")}`}
                    className="h-12 flex items-center justify-center gap-3 bg-[#DF8142] text-white rounded-xl text-[9px] font-black uppercase tracking-[0.3em] hover:bg-[#EEB38C] hover:text-[#5A270F] transition-all hover:scale-[1.01] shadow-lg shadow-[#DF8142]/10 active:scale-95 group/btn"
                  >
                    <Download className="h-5 w-5 group-hover/btn:translate-y-0.5 transition-transform" />
                    Archive Uplink
                  </a>
               </div>
             </div>
          </div>

          {/* Multi-Phased Evaluation Matrix */}
          {(resource.status === "approved" || resource.status === "student") && (
            <div className="bg-[#FAF8F4] dark:bg-card/20 rounded-[2.5rem] border-2 border-[#D9D9C2] dark:border-white/5 p-8 md:p-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#EEB38C]/3 blur-[100px] rounded-full" />
               
               <div className="relative z-10 flex flex-col xl:flex-row gap-10 items-start">
                  <div className="flex-1 space-y-6 w-full">
                    <div className="space-y-1">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#5A270F] dark:text-[#EEB38C]">Qualitative Matrix</h3>
                       <p className="text-[9px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.3em]">Intelligence node for peer feedback</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => handleRatingClick(star)}
                          className="focus:outline-none transition-all hover:scale-110 group/star active:scale-90 disabled:opacity-30 relative"
                          disabled={!isAuth || submittingEvaluation}
                          title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        >
                          <Star
                            className={`h-8 w-8 ${
                              (hoverRating || pendingRating || userRating || Math.round(averageRating)) >= star
                                ? "text-[#DF8142] fill-[#DF8142]"
                                : "text-[#D9D9C2] dark:text-white/5"
                            } transition-all duration-300 drop-shadow-lg`}
                          />
                          {star === Math.round(averageRating) && !hoverRating && !pendingRating && (
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-1 bg-[#DF8142] rounded-full blur-[1px]" />
                          )}
                        </button>
                      ))}
                    </div>

                    <textarea 
                      rows={3}
                      value={evaluationComment}
                      onChange={(e) => setEvaluationComment(e.target.value)}
                      placeholder="Input technical feedback node... (Optional)"
                      className="w-full bg-white dark:bg-white/5 border-2 border-[#D9D9C2] dark:border-white/10 rounded-[1.5rem] p-6 text-base font-bold text-[#5A270F] dark:text-white outline-none focus:border-[#DF8142] transition-all shadow-lg placeholder:text-[#5A270F]/20"
                    />
                    
                    <button
                      onClick={handleSubmitEvaluation}
                      disabled={submittingEvaluation || !isAuth || pendingRating === 0}
                      className="w-full md:w-auto px-10 py-4 bg-[#5A270F] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#6C3B1C] transition-all hover:-translate-y-1 shadow-lg active:scale-95 disabled:opacity-30"
                    >
                      {submittingEvaluation ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Broadcast Evaluation"}
                    </button>
                  </div>

                  <div className="w-full xl:w-64 space-y-6 bg-white dark:bg-black/40 p-6 rounded-[2rem] border border-[#D9D9C2] dark:border-white/5 shadow-xl relative overflow-hidden group/rating">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-[#DF8142]/10 blur-2xl -translate-y-1/2 translate-x-1/2 group-hover/rating:bg-[#DF8142]/20 transition-all duration-700" />
                     <div className="text-center relative z-10">
                        <p className="text-[9px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.3em] mb-2">Nexus Aggregate</p>
                        <div className="flex items-baseline justify-center gap-1">
                           <span className="text-5xl font-black text-[#5A270F] dark:text-[#DF8142] tracking-tighter italic">{averageRating.toFixed(1)}</span>
                           <div className="flex flex-col items-start -translate-y-2">
                              <span className="text-[10px] font-black text-[#D9D9C2] dark:text-white/10 uppercase tracking-tighter leading-none">AVG</span>
                              <div className="flex gap-0.5 mt-1">
                                 {[1, 2, 3, 4, 5].map((s) => (
                                    <div key={s} className={`h-1 w-2 rounded-full ${s <= Math.round(averageRating) ? 'bg-[#DF8142]' : 'bg-[#D9D9C2] dark:bg-white/5'}`} />
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="space-y-4 pt-6 border-t border-[#D9D9C2]/40 dark:border-white/10 relative z-10">
                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-[#5A270F]/60 dark:text-white/40">
                           <span>Signal Count</span>
                           <span className="text-[#5A270F] dark:text-white font-mono bg-[#FAF8F4] dark:bg-white/5 px-2 py-0.5 rounded-md">{(ratingCount || 0).toString().padStart(2, '0')}</span>
                        </div>
                        <div className="h-2 w-full bg-[#FAF8F4] dark:bg-white/5 rounded-full overflow-hidden p-0.5 border border-[#D9D9C2]/20 dark:border-white/5">
                           <div 
                              className="h-full bg-gradient-to-r from-[#5A270F] to-[#DF8142] rounded-full shadow-[0_0_10px_rgba(223,129,66,0.2)] transition-all duration-1000 ease-out" 
                              style={{ width: `${(averageRating / 5) * 100}%` } as React.CSSProperties}
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* Peer Discovery / Comments */}
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-[#5A270F] pb-6 relative">
               <div className="space-y-1">
                  <h2 className="text-3xl font-black text-[#5A270F] dark:text-white tracking-tighter uppercase italic">
                    CORE <span className="text-[#DF8142]">INTELLIGENCE</span>
                  </h2>
                  <p className="text-[10px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.4em]">Synchronized community feedback nodes</p>
               </div>
               <div className="px-6 py-3 bg-[#5A270F] rounded-full text-[10px] font-black text-[#EEB38C] uppercase tracking-[0.3em] shadow-lg">
                LOGS: {comments.length.toString().padStart(2, '0')}
              </div>
            </div>

            {isAuth ? (
              <form onSubmit={handleSubmitComment} className="flex gap-3 group">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Inject technical insight..."
                  className="flex-grow bg-white dark:bg-white/5 border-2 border-[#D9D9C2] dark:border-white/10 rounded-2xl px-6 py-4 text-base font-bold text-[#5A270F] dark:text-white outline-none focus:border-[#DF8142] transition-all shadow-md"
                />
                <button
                  type="submit"
                  disabled={submittingComment || !newComment.trim()}
                  className="px-8 bg-[#5A270F] text-[#EEB38C] rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#6C3B1C] transition-all active:scale-95 shadow-md flex items-center justify-center min-w-[140px]"
                >
                  {submittingComment ? <Loader2 className="h-5 w-5 animate-spin" /> : "Transmit"}
                </button>
              </form>
            ) : (
              <div className="p-10 bg-white dark:bg-card/40 rounded-[2.5rem] border-2 border-dashed border-[#D9D9C2] dark:border-white/5 text-center shadow-inner">
                <ShieldAlert className="h-10 w-10 text-[#DF8142] mx-auto mb-4 opacity-20" />
                <p className="text-sm font-black text-[#5A270F] dark:text-[#EEB38C]/40 uppercase tracking-[0.2em] mb-8 italic">Identity Verification Required</p>
                <Link to="/login" className="px-10 py-4 bg-[#5A270F] text-[#EEB38C] rounded-xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#DF8142] hover:text-white transition-all shadow-md">Initialize Login</Link>
              </div>
            )}

            <div className="grid gap-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white dark:bg-card/40 p-6 rounded-[2rem] border border-[#D9D9C2] dark:border-white/5 shadow-lg flex gap-6 items-start group hover:bg-[#FAF8F4] dark:hover:bg-white/5 transition-all architect-border">
                  <div className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br from-[#5A270F] to-[#2A1205] flex items-center justify-center text-[#EEB38C] text-xl font-black shadow-lg group-hover:rotate-6 transition-transform">
                    {(comment.user.first_name || comment.user.firstName)?.[0]}
                  </div>
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center gap-4">
                       <p className="text-lg font-black text-[#5A270F] dark:text-white uppercase tracking-tight">
                         {comment.user.first_name || comment.user.firstName}
                       </p>
                       <div className="h-1.5 w-1.5 rounded-full bg-[#DF8142]" />
                       <p className="text-[9px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.4em]">
                         SYNC: {new Date(comment.createdAt).toLocaleDateString()}
                       </p>
                    </div>
                    <p className="text-base font-medium text-[#5A270F]/80 dark:text-[#EEB38C]/80 leading-relaxed italic border-l-2 border-[#DF8142]/20 pl-4">"{comment.text}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Control Sidebar ── */}
        <div className="lg:col-span-4 space-y-12 lg:sticky lg:top-12">
          
          <div className="bg-[#1A0B03] p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl border border-white/5">
             <div className="absolute top-0 left-0 w-full h-full architectural-dot-grid opacity-[0.03]" />
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#DF8142]/20 blur-[80px] p-8 rounded-full -translate-y-1/2 translate-x-1/2" />
             
             <div className="relative z-10 space-y-8">
                <div className="space-y-1">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#EEB38C]">Security Layer</h4>
                   <p className="text-[9px] font-bold text-white/40 italic">Unauthorized modification restricted</p>
                </div>

                <div className="space-y-4">
                  {isAuthorizedManager && (
                     <div className="space-y-3">
                        {resource.status === 'archived' ? (
                          <button onClick={handleRestore} className="w-full h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center gap-3 text-emerald-400 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-emerald-500/20 transition-all active:scale-95 group">
                            <RotateCcw className="h-5 w-5 group-hover:-rotate-180 transition-transform duration-700" /> Restore Logic
                          </button>
                        ) : (
                          <button onClick={handleArchive} className="w-full h-14 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center gap-3 text-rose-400 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-rose-500/20 transition-all active:scale-95 group">
                            <Trash2 className="h-5 w-5 group-hover:shake transition-transform" /> Sequestrate Node
                          </button>
                        )}
                     </div>
                  )}

                  <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-6">
                     <div className="space-y-1">
                        <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">Registry Identity</p>
                        <p className="text-xl font-black text-[#EEB38C] font-mono tracking-tighter italic">#{String(id).padStart(6, '0')}</p>
                     </div>
                     <div className="h-px bg-white/10" />
                     <div className="space-y-4">
                        <div className="flex items-center gap-3 opacity-50">
                           <ShieldCheck className="h-4 w-4 text-emerald-400" />
                           <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Integrity Verified</span>
                        </div>
                        <div className="flex items-center gap-3 opacity-50">
                           <Zap className="h-4 w-4 text-[#DF8142]" />
                           <span className="text-[8px] font-black uppercase tracking-widest text-[#DF8142]">High Flux Node</span>
                        </div>
                     </div>
                  </div>
                </div>
             </div>
          </div>

          {/* Related Artifacts Matrix */}
          <div className="bg-white dark:bg-card/40 p-8 rounded-[2.5rem] border border-[#D9D9C2] dark:border-white/5 shadow-xl">
            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#5A270F] dark:text-[#EEB38C] mb-8 flex items-center gap-3">
              <Clock className="h-4 w-4 text-[#DF8142]" /> SYNAPTIC NODES
            </h5>
            <div className="grid gap-6">
              {recentResources.map((recent) => (
                <Link 
                  key={recent.id} 
                  to={isNested ? (role === 'Admin' || role === 'SuperAdmin' || role === 'admin' ? `/admin/resources/${recent.id}` : `/dashboard/resources/${recent.id}`) : `/resources/${recent.id}`}
                  className="flex items-center gap-4 group"
                >
                   <div className="h-12 w-12 shrink-0 rounded-xl bg-[#5A270F] flex items-center justify-center text-[#EEB38C] font-black text-[10px] shadow-md group-hover:scale-110 transition-all">
                    {recent.fileType?.[0]?.toUpperCase() || 'A'}
                   </div>
                   <div className="overflow-hidden space-y-0.5">
                      <p className="text-sm font-black text-[#5A270F] dark:text-white uppercase truncate group-hover:text-[#DF8142] transition-colors">{recent.title}</p>
                      <p className="text-[8px] font-bold text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.2em]">Arch. {recent.author}</p>
                   </div>
                   <ChevronRight className="h-4 w-4 ml-auto text-[#D9D9C2] group-hover:translate-x-1.5 transition-transform" />
                </Link>
              ))}
            </div>
            <button className="w-full mt-8 py-4 border-2 border-dashed border-[#D9D9C2] dark:border-white/10 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] text-[#5A270F]/40 dark:text-white/20 hover:border-[#DF8142] hover:text-[#DF8142] transition-colors">
              Expand Nexus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetails;
