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
  User,
  FileText,
  Share2,
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
  const isAuthorizedManager = role === "DepartmentHead" || role === "SuperAdmin";
  const isAuth = isAuthenticated();
  const isNested = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/admin");

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
    <div className={`min-h-screen bg-[#FAF8F4] dark:bg-[#0C0603] selection:bg-[#DF8142]/30 transition-colors duration-700`}>
      {/* ── Dynamic Top Navigation Bar ── */}
      <nav className="sticky top-0 z-50 backdrop-blur-3xl border-b border-[#92664A]/10 dark:border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
        <button 
          onClick={() => navigate("/browse")} 
          title="Return to Collection"
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C] hover:text-[#DF8142] transition-all"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-2 transition-transform" />
          Back to Collection
        </button>
        <div className="flex items-center gap-4">
           <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors ${resource.status === 'archived' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-[#DF8142]/10 border-[#DF8142]/20 text-[#DF8142]'}`}>
             {resource.status}
           </div>
           <button title="Share Project" className="h-10 w-10 flex items-center justify-center rounded-full border border-neutral-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/5 transition-all">
             <Share2 className="h-4 w-4 text-[#5A270F] dark:text-white" />
           </button>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* ── Primary Information Architecture (LHS) ── */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* 1. The Hero Specification Section */}
            <header className="relative group">
              <div className="flex items-end gap-6 mb-8">
                <div className="w-16 h-1 bg-[#DF8142]" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#DF8142]/60">Project Specification</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-[#5A270F] dark:text-white tracking-tighter uppercase leading-[0.85] mb-12">
                {resource.title}
              </h1>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-12 border-y border-[#92664A]/10 dark:border-white/5 py-10">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-[#92664A] uppercase tracking-widest opacity-40">Primary Architect</p>
                  <p className="text-xl font-black text-[#5A270F] dark:text-[#EEB38C] uppercase flex items-center gap-3">
                    <User className="h-5 w-5 text-[#DF8142]" />
                    {resource.author}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-[#92664A] uppercase tracking-widest opacity-40">Project Stage</p>
                  <p className="text-xl font-black text-[#5A270F] dark:text-[#EEB38C] uppercase flex items-center gap-3 italic">
                    <Zap className="h-5 w-5 text-[#DF8142]" />
                    {resource.designStage?.name || "Internal Study"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-[#92664A] uppercase tracking-widest opacity-40">Classification</p>
                  <p className="text-xl font-black text-[#5A270F] dark:text-[#EEB38C] uppercase flex items-center gap-3">
                    <FileText className="h-5 w-5 text-[#DF8142]" />
                    {resource.fileType?.split('/').pop()?.toUpperCase() || "ASSET"}
                  </p>
                </div>
              </div>
            </header>

            {/* 2. Qualitative Intelligence Section (Review) */}
            <section className="bg-white dark:bg-[#150A05] rounded-[3rem] p-12 shadow-2xl shadow-[#5A270F]/5 relative overflow-hidden group border border-[#92664A]/5">
              <div className="absolute top-0 right-0 w-full h-full architectural-dot-grid opacity-[0.03] pointer-events-none" />
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-[#5A270F] dark:text-white uppercase tracking-tighter">Peer Evaluation</h3>
                    <p className="text-sm text-[#92664A] dark:text-[#EEB38C]/40 italic font-medium">Contribute to the collective project intelligence.</p>
                  </div>
                  <div className="flex items-center gap-6 bg-[#FAF8F4] dark:bg-black/40 px-8 py-5 rounded-3xl border border-[#92664A]/10">
                    <div className="text-center">
                      <p className="text-4xl font-black text-[#5A270F] dark:text-[#DF8142] tracking-tighter">{averageRating.toFixed(1)}</p>
                      <p className="text-[9px] font-black uppercase text-[#92664A]">Score</p>
                    </div>
                    <div className="w-px h-12 bg-[#92664A]/20" />
                    <div className="text-center">
                      <p className="text-4xl font-black text-[#5A270F] dark:text-[#DF8142] tracking-tighter">{ratingCount}</p>
                      <p className="text-[9px] font-black uppercase text-[#92664A]">Reviews</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        title={`Rate ${star} Star${star > 1 ? 's' : ''}`}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => handleRatingClick(star)}
                        className="transition-transform duration-500 hover:scale-125 hover:rotate-6"
                      >
                        <Star className={`h-8 w-8 ${ (hoverRating || pendingRating || userRating || Math.round(averageRating)) >= star ? "text-[#DF8142] fill-[#DF8142]" : "text-neutral-200 dark:text-white/5" }`} />
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <textarea 
                      rows={3}
                      value={evaluationComment}
                      onChange={(e) => setEvaluationComment(e.target.value)}
                      placeholder="Share your technical expertise or design insights..."
                      className="w-full bg-white dark:bg-black/20 border-2 border-[#FAF8F4] dark:border-white/5 rounded-[2rem] p-6 text-base font-medium text-[#5A270F] dark:text-white outline-none focus:border-[#DF8142] transition-all shadow-inner"
                    />
                    <button
                      onClick={handleSubmitEvaluation}
                      disabled={submittingEvaluation || !isAuth || pendingRating === 0}
                      className="mt-6 px-12 py-5 bg-[#5A270F] text-[#EEB38C] rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#DF8142] hover:text-white shadow-xl transition-all active:scale-95 disabled:opacity-30"
                    >
                      Broadcast Evaluation
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Global Synchronized Commentary */}
            <section className="space-y-10">
              <div className="flex items-center justify-between border-b pb-6 border-[#92664A]/10">
                <h3 className="text-2xl font-black text-[#5A270F] dark:text-white uppercase tracking-tighter">Project Nexus <span className="text-[#DF8142]">Feed</span></h3>
                <span className="px-4 py-2 bg-[#5A270F] text-[#EEB38C] rounded-xl text-[10px] font-black uppercase tracking-widest">{comments.length} Log Entries</span>
              </div>

              <form onSubmit={handleSubmitComment} className="flex gap-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Annotate technical insights..."
                  className="flex-grow bg-white dark:bg-white/5 border border-[#92664A]/20 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-[#5A270F] dark:text-white outline-none focus:border-[#DF8142] transition-all"
                />
                <button type="submit" disabled={submittingComment || !newComment.trim()} className="px-10 bg-[#5A270F] text-[#EEB38C] rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] hover:bg-[#6C3B1C] shadow-lg">
                  Transmit
                </button>
              </form>

              <div className="grid gap-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-white dark:bg-white/5 p-8 rounded-[2rem] border border-[#92664A]/5 hover:border-[#DF8142]/30 transition-all group">
                    <div className="flex gap-6 items-start">
                      <div className="h-14 w-14 rounded-2xl bg-[#5A270F] flex items-center justify-center text-[#EEB38C] text-xl font-black shadow-lg">
                        {(comment.user.first_name || comment.user.firstName)?.[0]}
                      </div>
                      <div className="space-y-3 flex-grow">
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-black text-[#5A270F] dark:text-white uppercase tracking-tighter italic">
                            {comment.user.first_name || comment.user.firstName} {comment.user.last_name || comment.user.lastName}
                          </p>
                          <p className="text-[10px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.2em]">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-base text-[#5A270F]/80 dark:text-[#EEB38C]/80 italic leading-relaxed font-medium">"{comment.text}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── Action Infrastructure Sidebar (RHS) ── */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
            
            {/* Action Matrix */}
            <div className="bg-[#1A0B05] dark:bg-[#1A0B05] p-10 rounded-[3rem] text-white shadow-2xl border border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-full h-full architectural-dot-grid opacity-5" />
               <div className="relative z-10 space-y-10">
                  <div className="space-y-3">
                     <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#DF8142]/60">Operational Logic</h4>
                     <div className="h-1 w-12 bg-[#DF8142]" />
                  </div>

                  <div className="grid gap-4">
                    <a href={`${import.meta.env.VITE_API_URL}/resources/${id}/view?token=${encodeURIComponent(localStorage.getItem("token") || "")}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-4 h-16 bg-white/10 hover:bg-white hover:text-[#5A270F] text-white border border-white/10 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all group">
                      <Eye className="h-6 w-6 group-hover:scale-110 transition-transform" /> Visual Audit
                    </a>
                    <a href={`${import.meta.env.VITE_API_URL}/resources/${id}/download?token=${encodeURIComponent(localStorage.getItem("token") || "")}`} className="flex items-center justify-center gap-4 h-16 bg-[#DF8142] text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#5A270F] transition-all shadow-xl shadow-[#DF8142]/20">
                      <Download className="h-6 w-6" /> Archive Access
                    </a>
                  </div>

                  {isAuthorizedManager && (
                     <div className="pt-6 border-t border-white/10 space-y-4">
                        <button onClick={handleToggleVisibility} className={`w-full h-14 border rounded-2xl flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${resource.is_public ? "bg-[#DF8142]/10 border-[#DF8142] text-[#DF8142]" : "bg-white/5 border-white/10 text-white hover:bg-white hover:text-black"}`}>
                           <ShieldAlert className="h-5 w-5" /> Visibility: {resource.is_public ? "Public" : "Private"}
                        </button>
                        {resource.status === 'archived' ? (
                          <button onClick={handleRestore} className="w-full h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center gap-4 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-500/20 transition-all">
                            <RotateCcw className="h-5 w-5" /> Restore Matrix
                          </button>
                        ) : (
                          <button onClick={handleArchive} className="w-full h-14 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center gap-4 text-red-400 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-500/20 transition-all">
                            <Trash2 className="h-5 w-5" /> Sequester Node
                          </button>
                        )}
                     </div>
                  )}

                  <div className="flex items-center justify-between p-6 bg-black/40 rounded-3xl border border-white/5">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Registry ID</p>
                      <p className="text-xl font-black text-[#EEB38C] font-mono tracking-tighter">#{String(id).padStart(6, '0')}</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-neutral-500" />
                    </div>
                  </div>
               </div>
            </div>

            {/* Related Artifact Registry */}
            <div className="bg-white dark:bg-white/5 p-10 rounded-[3.5rem] shadow-xl border border-[#92664A]/10 relative overflow-hidden group">
               <div className="flex items-center justify-between mb-10">
                 <h5 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#5A270F] dark:text-[#EEB38C]">Synaptic Nodes</h5>
                 <ChevronRight className="h-5 w-5 text-[#DF8142]" />
               </div>
               <div className="grid gap-6">
                 {recentResources.map((recent) => (
                   <Link key={recent.id} to={isNested ? (role === 'Admin' || role === 'SuperAdmin' || role === 'admin' ? `/admin/resources/${recent.id}` : `/dashboard/resources/${recent.id}`) : `/resources/${recent.id}`} className="flex items-center gap-6 group/item">
                      <div className="h-14 w-14 shrink-0 rounded-2xl bg-[#5A270F] flex items-center justify-center text-[#EEB38C] font-black text-xs shadow-lg group-hover/item:scale-110 group-hover/item:rotate-6 transition-all">
                        {recent.fileType?.[0]?.toUpperCase() || 'A'}
                      </div>
                      <div className="overflow-hidden space-y-1">
                         <p className="text-sm font-black text-[#5A270F] dark:text-white uppercase truncate group-hover/item:text-[#DF8142] transition-colors tracking-tighter italic">{recent.title}</p>
                         <p className="text-[9px] font-black text-[#92664A]/50 uppercase tracking-widest leading-none">Arch. {recent.author}</p>
                      </div>
                   </Link>
                 ))}
               </div>
               <button 
                 title="Explore Related Artifacts"
                 className="w-full mt-10 py-5 border-2 border-dashed border-[#92664A]/10 rounded-[2rem] text-[9px] font-black uppercase tracking-[0.3em] text-[#92664A] hover:border-[#DF8142] hover:text-[#DF8142] transition-all"
               >
                 Explore Cluster
               </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetails;
