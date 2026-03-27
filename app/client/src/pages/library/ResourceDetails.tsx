import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { api } from "../../lib/api";
import type { Resource, Comment as CommentModel } from "../../models";
import {
  Loader2,
  ServerCrash,
  Download,
  Eye,
  Star,
  ShieldAlert,
  ArrowLeft,
  RotateCcw,
  Trash2,
  ChevronRight,
  ShieldCheck,
  Zap,
  FileText,
  Share2,
  X,
  Layers,
  Layout,
  Info,
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
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [submittingFlag, setSubmittingFlag] = useState(false);

  const role = currentRole();
  const isAuthorizedManager = role === "DepartmentHead" || role === "SuperAdmin";
  const isAuth = isAuthenticated();
  const isNested = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/admin");
  const basePath = location.pathname.startsWith("/admin") ? "/admin" : "/dashboard";

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
          setRecentResources(recentData.filter((r: Resource) => r.id !== Number(id)));
        }

        if (data.ratings && data.ratings.length > 0) {
          const sum = data.ratings.reduce((acc: number, r: Rating) => acc + r.rate, 0);
          setAverageRating(sum / data.ratings.length);
          setRatingCount(data.ratings.length);

          const userStr = localStorage.getItem("user");
          if (userStr) {
            const currentUser = JSON.parse(userStr);
            const myRating = data.ratings.find((r: Rating) => r.user_id === currentUser.id);
            if (myRating) setUserRating(myRating.rate);
          }
        }
      } catch (err) {
        console.error("Failed to fetch resource details:", err);
        setError("The requested architectural asset could not be retrieved from the nexus at this time.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleRatingClick = (rateValue: number) => {
    if (!isAuth) {
      toast.info("Authentication is required to participate in project evaluations");
      return;
    }
    setPendingRating(rateValue);
  };

  const handleSubmitEvaluation = async () => {
    if (!isAuth || pendingRating === 0) return;

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

      toast.success(`Broadcasting evaluation complete. Thank you for your review.`);
      const { data } = await api.get(`/resources/${id}`);
      if (data.ratings && data.ratings.length > 0) {
        const sum = data.ratings.reduce((acc: number, r: Rating) => acc + r.rate, 0);
        setAverageRating(sum / data.ratings.length);
        setRatingCount(data.ratings.length);
      }

      setEvaluationComment("");
      setPendingRating(0);
    } catch {
        toast.error("Evaluation transmission failed. Please try again.");
      } finally {
      setSubmittingEvaluation(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      await api.post(`/resources/${id}/comments`, { text: newComment });
      toast.success("Intelligence successfully synchronized with the project nexus.");
      const { data: updatedResource } = await api.get(`/resources/${id}`);
      setComments(updatedResource.comments || []);
      setNewComment("");
    } catch {
        toast.error("Communication packet rejected. Check your connection.");
      } finally {
      setSubmittingComment(false);
    }
  };

  const handleArchive = async () => {
    toast(`Archive this asset?`, {
      description: "Project visibility will be restricted to administrative roles only.",
      action: {
        label: "Archive",
        onClick: async () => {
          try {
            await api.patch(`/admin/resources/${id}/archive`);
            toast.success("Asset sequestered successfully");
            const { data } = await api.get(`/resources/${id}`);
            setResource(data);
          } catch {
            toast.error("Failed to archive asset node");
          }
        }
      }
    });
  };

  const handleRestore = async () => {
    toast(`Restore this asset?`, {
        description: "Standard access permissions will be restored for all users.",
        action: {
          label: "Restore",
          onClick: async () => {
            try {
              await api.patch(`/admin/resources/${id}/restore`);
              toast.success("Asset restored to the active registry");
              const { data } = await api.get(`/resources/${id}`);
              setResource(data);
            } catch {
              toast.error("Failed to restore asset presence");
            }
          }
        }
    });
  };

  const handleToggleVisibility = async () => {
    if (!resource) return;
    const newIsPublic = !resource.is_public;
    try {
      await api.patch(`/admin/resources/${id}/status`, { is_public: newIsPublic });
      toast.success(`Visibility: ${newIsPublic ? 'Global Presence' : 'Internal Only'}`);
      setResource({ ...resource, is_public: newIsPublic });
    } catch {
      toast.error("Failed to update visibility signature");
    }
  };

  const handleFlagResource = async () => {
    if (!flagReason.trim()) return;
    setSubmittingFlag(true);
    try {
      await api.post(`/resources/${id}/flag`, { reason: flagReason });
      toast.success("Security breach report synchronized.");
      setShowFlagModal(false);
      setFlagReason("");
    } catch {
      toast.error("Failed to transmit violation protocol.");
    } finally {
      setSubmittingFlag(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-40 bg-[#FAF8F4] dark:bg-[#0C0603] min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-[#DF8142] mb-6" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#5A270F]/40 dark:text-[#EEB38C]/40 animate-pulse">
          Retrieving Architectural Core
        </p>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="flex flex-col items-center justify-center py-40 px-6 text-center bg-[#FAF8F4] dark:bg-[#0C0603] min-h-screen">
        <div className="mb-8 p-10 bg-white dark:bg-white/5 rounded-[3rem] shadow-2xl">
          <ServerCrash className="h-20 w-20 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-[#5A270F] dark:text-white uppercase tracking-tighter italic mb-4">Registry Fault</h2>
          <p className="max-w-md text-[#92664A] dark:text-[#EEB38C]/60 text-sm font-medium italic">{error || "Asset not found."}</p>
        </div>
        <button onClick={() => navigate(-1)} className="px-10 py-4 bg-[#5A270F] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#DF8142] transition-all">
          Return to Library
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#0C0603] selection:bg-[#DF8142]/30 transition-colors duration-700">
      {/* ── RETURN NAVIGATION ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-8">
        <Link
          to={isNested ? `${basePath}/browse` : "/browse"}
          title="Return to Collection Nexus"
          className="inline-flex items-center gap-3 bg-white dark:bg-[#1A0B04] px-5 py-2.5 rounded-xl border-2 border-[#92664A]/10 shadow-sm text-[9px] font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C]/60 hover:border-[#DF8142] hover:text-[#DF8142] transition-all group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Archive
        </Link>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* ── Left Content: The Resource Core ── */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* 1. Main Resource Specification Card */}
            <div className="relative group/resource">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#DF8142] to-[#5A270F] rounded-[3.5rem] blur opacity-10 group-hover/resource:opacity-20 transition duration-1000" />
              <div className="relative bg-white dark:bg-[#1A0B04] rounded-[3rem] border-2 border-[#92664A]/10 dark:border-white/5 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 architectural-dot-grid dark:architectural-dot-grid-dark opacity-5" />
                
                <div className="flex flex-col lg:grid lg:grid-cols-12 relative z-10">
                  {/* Visual/Icon Identity Column */}
                  <div className="lg:col-span-4 p-8 bg-[#EEB38C]/5 dark:bg-black/20 flex flex-col items-center justify-center text-center space-y-6 border-r-2 border-[#92664A]/10">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-[2rem] bg-[#5A270F] flex items-center justify-center text-[#EEB38C] shadow-xl relative z-10">
                        <FileText className="h-10 w-10" />
                      </div>
                      <div className="absolute -bottom-3 -right-3 h-10 w-10 rounded-xl bg-[#DF8142] flex items-center justify-center text-white shadow-lg animate-bounce">
                        <Zap className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-[#92664A] mb-1.5">{resource.fileType?.split('/').pop()?.toUpperCase()} PROTOCOL</h4>
                      <div className="flex items-center gap-1.5 justify-center">
                        <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[8px] font-black uppercase text-emerald-600 tracking-widest">Active_Node</span>
                      </div>
                    </div>
                  </div>

                  {/* Specification Details Column */}
                  <div className="lg:col-span-8 p-8 lg:p-10 space-y-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 bg-[#DF8142] text-white rounded-lg text-[8px] font-black uppercase tracking-[0.3em] shadow-lg shadow-[#DF8142]/20 italic">
                        Verified_Asset
                      </span>
                      <span className="px-3 py-1 bg-[#EEB38C]/10 dark:bg-white/5 text-[#92664A] dark:text-[#EEB38C]/60 rounded-lg text-[8px] font-black uppercase tracking-[0.3em] border border-[#92664A]/20">
                        {resource.designStage?.name || "Global_Nexus"}
                      </span>
                    </div>

                    <h1 className="text-3xl lg:text-4xl font-black text-[#5A270F] dark:text-white uppercase tracking-tighter italic leading-none font-space-grotesk">
                      {resource.title}
                    </h1>

                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#92664A]/10">
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-[#92664A] uppercase tracking-[0.4em]">Primary Architect</p>
                        <p className="text-xs font-black text-[#5A270F] dark:text-white uppercase italic">{resource.author}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[8px] font-black text-[#92664A] uppercase tracking-[0.4em]">Synchronized</p>
                        <p className="text-xs font-black text-[#5A270F] dark:text-white uppercase italic">{new Date(resource.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Rating & Critique Section */}
            <section className="bg-white dark:bg-[#1A0B04] rounded-[2.5rem] p-8 lg:p-10 border-2 border-[#92664A]/10 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-48 h-48 bg-[#DF8142]/5 blur-[80px] rounded-full" />
               <div className="relative z-10 flex flex-col md:grid md:grid-cols-12 gap-10">
                  <div className="md:col-span-4 space-y-5">
                    <div className="space-y-3">
                      <h3 className="text-xl font-black text-[#5A270F] dark:text-white uppercase tracking-tighter italic flex items-center gap-2.5">
                        <Star className="h-5 w-5 text-[#DF8142]" /> Matrix_Score
                      </h3>
                      <div className="p-6 rounded-[2rem] bg-[#5A270F] text-white text-center shadow-xl relative group/rating overflow-hidden">
                         <div className="absolute inset-0 architectural-dot-grid opacity-10" />
                         <span className="text-5xl font-black italic relative z-10 font-space-grotesk">{averageRating.toFixed(1)}</span>
                         <p className="text-[9px] font-black uppercase tracking-[0.5em] text-[#EEB38C] mt-1.5 relative z-10">Sync_Average</p>
                      </div>
                    </div>
                    <p className="text-[9px] font-bold text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.2em] leading-relaxed italic">
                      Based on {ratingCount} evaluations.
                    </p>
                  </div>

                  <div className="md:col-span-8 flex flex-col justify-center space-y-6">
                     <div className="space-y-3">
                        <p className="text-[9px] font-black text-[#92664A] uppercase tracking-[0.3em]">Calibrate Evaluation</p>
                        <div className="flex items-center gap-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => handleRatingClick(star)}
                              title={`Protocol Rate ${star}`}
                              className="transition-all duration-300 hover:scale-110"
                            >
                              <Star className={`h-8 w-8 ${ (hoverRating || pendingRating || userRating || Math.round(averageRating)) >= star ? "text-[#DF8142] fill-[#DF8142]" : "text-[#EEB38C]/20" }`} />
                            </button>
                          ))}
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <input 
                          type="text" 
                          value={evaluationComment}
                          onChange={(e) => setEvaluationComment(e.target.value)}
                          placeholder="Technical insights..."
                          className="flex-1 bg-[#EEB38C]/5 dark:bg-white/5 border border-[#92664A]/20 rounded-xl px-5 py-3.5 text-[11px] font-black uppercase tracking-widest text-[#5A270F] dark:text-white outline-none focus:border-[#DF8142]"
                        />
                        <button 
                          onClick={handleSubmitEvaluation}
                          disabled={submittingEvaluation || !isAuth || pendingRating === 0}
                          className="px-8 bg-[#5A270F] text-[#EEB38C] rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#6C3B1C] shadow-lg transition-all disabled:opacity-30"
                        >
                          Execute
                        </button>
                     </div>
                  </div>
               </div>
            </section>

            {/* 3. Global Feed Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-[#5A270F] dark:text-white uppercase tracking-tighter italic flex items-center gap-3">
                  <Share2 className="h-5 w-5 text-[#DF8142]" /> Broadcast_Log
                </h3>
                <div className="h-px flex-1 mx-6 bg-[#92664A]/10" />
                <span className="text-[9px] font-black text-[#92664A] uppercase tracking-widest italic">{comments.length} Signals</span>
              </div>

              <div className="grid gap-5">
                {comments.map((comment) => (
                  <div key={comment.id} className="relative group/comment animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <div className="bg-white dark:bg-[#1A0B04] p-6 rounded-[2rem] border border-[#92664A]/10 shadow-lg relative z-10 group-hover/comment:border-[#DF8142]/40 transition-colors">
                      <div className="flex gap-4 items-start">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-[#5A270F] flex items-center justify-center text-[#EEB38C] font-black text-sm shadow-md">
                          {(comment.user.first_name || comment.user.firstName)?.[0]}
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-[#5A270F] dark:text-white uppercase tracking-widest italic">Node_{comment.user.id.slice(0, 4)}</span>
                            <span className="text-[8px] font-black text-[#92664A]/40 uppercase tracking-[0.2em]">{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs font-medium text-[#5A270F]/80 dark:text-[#EEB38C]/60 italic leading-relaxed">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmitComment} className="relative group/form">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Transmit intelligence packet..."
                  className="w-full bg-white dark:bg-[#1A0B04] border-2 border-[#92664A]/10 rounded-2xl p-4 pr-32 text-[11px] font-black uppercase tracking-widest text-[#5A270F] dark:text-white outline-none focus:border-[#DF8142] shadow-lg"
                />
                <button 
                  type="submit" 
                  disabled={submittingComment || !newComment.trim()}
                  className="absolute right-3 top-3 bottom-3 px-6 bg-[#5A270F] text-[#EEB38C] rounded-xl font-black uppercase tracking-widest text-[8px] hover:bg-[#DF8142] hover:text-white transition-all disabled:opacity-30"
                >
                  Sync_Signal
                </button>
              </form>
            </section>
          </div>

          {/* ── Right Sidebar: Operations & Registry ── */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-8">
            
            {/* Operational Panel */}
            <div className="bg-[#5A270F] p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group/ops">
               <div className="absolute inset-0 architectural-dot-grid opacity-10" />
               <div className="absolute -bottom-10 -right-10 h-48 w-48 bg-[#DF8142]/20 blur-3xl rounded-full" />
               
               <div className="relative z-10 space-y-8">
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#EEB38C]">Operations</h4>
                    <div className="h-1 w-10 bg-[#DF8142]" />
                  </div>

                  <div className="space-y-3">
                    <a 
                      href={`${import.meta.env.VITE_API_URL}/resources/${id}/view?token=${encodeURIComponent(localStorage.getItem("token") || "")}`} 
                      target="_blank" rel="noreferrer" 
                      title="Visual System Audit"
                      className="flex items-center justify-center gap-3 h-14 bg-white/10 hover:bg-white hover:text-[#5A270F] text-white border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all group/btn"
                    >
                      <Eye className="h-5 w-5 group-hover/btn:scale-110 transition-transform" /> Visual Audit
                    </a>
                    <a 
                      href={`${import.meta.env.VITE_API_URL}/resources/${id}/download?token=${encodeURIComponent(localStorage.getItem("token") || "")}`} 
                      title="Initiate Archive Access"
                      className="flex items-center justify-center gap-3 h-14 bg-[#DF8142] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-[#DF8142]/30"
                    >
                      <Download className="h-5 w-5" /> Archive Access
                    </a>
                  </div>

                  {isAuthorizedManager && (
                     <div className="pt-6 border-t border-white/10 space-y-3">
                        <button 
                          onClick={handleToggleVisibility} 
                          title="Calibrate Privacy Signature"
                          className={`w-full h-12 border rounded-lg flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] transition-all ${resource.is_public ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-white/5 border-white/10 text-white hover:bg-white hover:text-black"}`}
                        >
                           <ShieldAlert className="h-4 w-4" /> {resource.is_public ? "Global" : "Internal"}
                        </button>
                        {resource.status === 'archived' ? (
                          <button onClick={handleRestore} title="Restore Node Sync" className="w-full h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-center gap-3 text-emerald-400 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-emerald-500/20 transition-all">
                            <RotateCcw className="h-4 w-4" /> Restore Matrix
                          </button>
                        ) : (
                          <button onClick={handleArchive} title="Initiate Secure Sequestration" className="w-full h-12 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-center gap-3 text-red-400 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-red-500/20 transition-all">
                            <Trash2 className="h-4 w-4" /> Sequester Node
                          </button>
                        )}
                     </div>
                  )}

                  <button 
                    onClick={() => setShowFlagModal(true)}
                    title="Initiate Breach Protocol"
                    className="w-full py-3 rounded-lg border border-dashed border-white/20 text-white/60 text-[8px] font-black uppercase tracking-[0.4em] hover:border-red-500 hover:text-red-500 transition-all"
                  >
                    Report Breach
                  </button>

                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                    <div className="space-y-0.5">
                      <p className="text-[7px] font-black text-[#EEB38C]/40 uppercase tracking-widest">Registry_Handle</p>
                      <p className="text-lg font-black text-[#EEB38C] font-mono tracking-tighter">#{String(id).padStart(6, '0')}</p>
                    </div>
                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <ShieldCheck className="h-4 w-4 text-neutral-500" />
                    </div>
                  </div>
               </div>
            </div>

            {/* Synaptic Nodes: Related Artifacts Grid */}
            <div className="bg-white dark:bg-[#1A0B04] p-8 rounded-[2.5rem] border-2 border-[#92664A]/10 shadow-xl space-y-8 relative overflow-hidden group/synapse">
               <div className="flex items-center justify-between">
                 <h5 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#5A270F] dark:text-[#EEB38C]">Synaptic_Nodes</h5>
                 <Layers className="h-4 w-4 text-[#DF8142] animate-pulse" />
               </div>
               
               <div className="grid gap-4">
                 {recentResources.map((recent) => (
                   <Link key={recent.id} to={isNested ? `${basePath}/resources/${recent.id}` : `/resources/${recent.id}`} className="flex items-center gap-3 group/node transition-all">
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-[#EEB38C]/10 dark:bg-white/5 flex items-center justify-center text-[#DF8142] group-hover/node:bg-[#5A270F] group-hover/node:text-[#EEB38C] transition-all shadow-md">
                        <Layout className="h-5 w-5" />
                      </div>
                      <div className="overflow-hidden">
                         <p className="text-[11px] font-black text-[#5A270F] dark:text-white uppercase truncate tracking-tighter italic">{recent.title}</p>
                         <p className="text-[8px] font-black text-[#92664A]/60 uppercase tracking-widest mt-0.5">Arch. {recent.author}</p>
                      </div>
                   </Link>
                 ))}
               </div>

               <Link 
                 to={isNested ? `${basePath}/browse` : "/browse"}
                 className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-[#92664A]/20 rounded-xl text-[8px] font-black uppercase tracking-widest text-[#92664A] hover:border-[#DF8142] hover:text-[#DF8142] transition-all"
               >
                 View Index <ChevronRight className="h-3.5 w-3.5" />
               </Link>
            </div>

            <div className="bg-[#DF8142] p-6 rounded-[2rem] text-white flex items-center justify-between">
               <div className="space-y-0.5">
                  <h5 className="text-[9px] font-black uppercase tracking-[0.4em]">Arch_Nexus_V2</h5>
                  <p className="text-[7px] font-bold opacity-60 uppercase tracking-widest">Restricted Internal Node</p>
               </div>
               <Info className="h-6 w-6 opacity-40" />
            </div>
          </aside>
        </div>
      </div>

      {/* ── Flag Content Modal Overlay ── */}
      {showFlagModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#5A270F]/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setShowFlagModal(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1A0B04] rounded-[3rem] p-10 space-y-8 animate-in zoom-in-95 shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-2 border-[#DF8142]/30">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-[#5A270F] dark:text-white uppercase tracking-tighter italic">Breach_Protocol</h3>
                <p className="text-[10px] font-black text-[#DF8142] uppercase tracking-[0.4em]">Security integrity reporting nexus</p>
              </div>
              <button 
                onClick={() => setShowFlagModal(false)}
                title="Abort Protocol"
                className="h-10 w-10 rounded-full bg-[#FAF8F4] dark:bg-white/5 flex items-center justify-center hover:scale-110 transition-transform"
              >
                <X className="h-5 w-5 text-[#92664A]" />
              </button>
            </div>

            <div className="space-y-6">
               <div className="space-y-3">
                 <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#92664A] ml-2">Reason for synchronization</label>
                 <textarea 
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    placeholder="Specify the violation or data corruption reason..."
                    className="w-full bg-[#FAF8F4] dark:bg-black/40 border-2 border-[#92664A]/10 rounded-[2rem] p-6 text-sm font-black uppercase tracking-widest text-[#5A270F] dark:text-white outline-none focus:border-red-500 transition-all min-h-[160px]"
                 />
               </div>

               <div className="flex gap-4">
                 <button 
                    onClick={() => setShowFlagModal(false)}
                    title="Cancel Protocol"
                    className="flex-1 py-5 bg-[#EEB38C]/10 text-[#5A270F] dark:text-[#EEB38C] rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#EEB38C]/20 transition-all"
                 >
                   Abort
                 </button>
                 <button 
                    onClick={handleFlagResource}
                    disabled={submittingFlag || !flagReason.trim()}
                    title="Transmit Breach Signal"
                    className="flex-1 py-5 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl shadow-red-600/20 disabled:opacity-30"
                 >
                   {submittingFlag ? "Transmitting..." : "Sync_Violation"}
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceDetails;
