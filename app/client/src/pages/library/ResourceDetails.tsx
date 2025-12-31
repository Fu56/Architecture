import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { api } from "../../lib/api";
import type { Resource, Comment as CommentModel } from "../../models";
import {
  Loader2,
  ServerCrash,
  Download,
  User,
  Flag,
  Eye,
  Clock,
  CheckCircle,
  Star,
  Info,
  ShieldAlert,
} from "lucide-react";
import { isAuthenticated, currentRole } from "../../lib/auth";
import { toast } from "react-toastify";

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

  const [reporting, setReporting] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const role = currentRole();
  const isAuth = isAuthenticated();
  const isNested =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/admin");

  // Redirect to nested route if logged in but on public route
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

        // Fetch recent resources for the sidebar
        const { data: recentData } = await api.get("/resources?limit=5");
        if (Array.isArray(recentData)) {
          setRecentResources(
            recentData.filter((r: Resource) => r.id !== Number(id))
          );
        }

        // Calculate ratings
        if (data.ratings && data.ratings.length > 0) {
          const sum = data.ratings.reduce(
            (acc: number, r: Rating) => acc + r.rate,
            0
          );
          setAverageRating(sum / data.ratings.length);
          setRatingCount(data.ratings.length);

          // Check if current user has rated
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const currentUser = JSON.parse(userStr);
            const myRating = data.ratings.find(
              (r: Rating) => r.user_id === currentUser.id
            );
            if (myRating) setUserRating(myRating.rate);
          }
        }
      } catch (err) {
        console.error("Failed to fetch resource details:", err);
        setError(
          "Could not load the resource. It may have been removed or the link is incorrect."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;

    setIsSubmittingReport(true);
    try {
      await api.post(`/resources/${id}/flag`, { reason: reportReason });
      setReportSuccess(true);
      toast.success("Security Alert: Report transmitted to moderation node");
      setTimeout(() => {
        setReporting(false);
        setReportSuccess(false);
        setReportReason("");
      }, 2000);
    } catch (err) {
      console.error("Failed to report resource:", err);
      toast.error("Transmission Error: Report could not be submitted");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleRate = async (rateValue: number) => {
    if (!isAuth) {
      toast.info("Authentication required for evaluation");
      return;
    }
    try {
      await api.post(`/resources/${id}/rate`, { rate: rateValue });
      setUserRating(rateValue);
      toast.success(`Asset evaluated: ${rateValue} stars registered`);

      const { data } = await api.get(`/resources/${id}`);
      if (data.ratings && data.ratings.length > 0) {
        const sum = data.ratings.reduce(
          (acc: number, r: Rating) => acc + r.rate,
          0
        );
        setAverageRating(sum / data.ratings.length);
        setRatingCount(data.ratings.length);
      }
    } catch (error) {
      console.error("Failed to rate", error);
      toast.error("Evaluation Error: Rating could not be processed");
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
      toast.success("Message logged to community nexus");
      const { data: updatedResource } = await api.get(`/resources/${id}`);
      setComments(updatedResource.comments || []);
      setNewComment("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
      toast.error("Nexus Error: Comment could not be integrated");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${
          isNested ? "" : "container mx-auto"
        } text-center py-24 bg-red-50/50 rounded-[3rem] my-8 border border-red-100 border-dashed`}
      >
        <ServerCrash className="h-16 w-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-black text-red-900 mb-2">
          Matrix Disruption
        </h2>
        <p className="mt-2 text-red-700 font-medium max-w-md mx-auto">
          {error}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-8 px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
        >
          Return to Safety
        </button>
      </div>
    );
  }

  if (!resource) return null;

  return (
    <div
      className={`${
        isNested ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      }`}
    >
      <div className="grid lg:grid-cols-12 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-10 sm:p-14 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
            <div className="mb-10">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 bg-slate-900 text-white rounded-full">
                  {resource.fileType}
                </span>
                <span
                  className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full flex items-center gap-2 border ${
                    resource.status === "student" ||
                    resource.status === "approved"
                      ? "bg-green-50 text-green-700 border-green-100"
                      : resource.status === "pending"
                      ? "bg-amber-50 text-amber-700 border-amber-100"
                      : "bg-red-50 text-red-700 border-red-100"
                  }`}
                >
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${
                      resource.status === "student" ||
                      resource.status === "approved"
                        ? "bg-green-500"
                        : resource.status === "pending"
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                  />
                  {resource.status === "student" ? "Verified" : resource.status}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                {resource.title}
              </h1>

              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 w-fit">
                <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Authority Unit
                  </p>
                  <p className="font-bold text-slate-900 leading-tight">
                    Architect {resource.author}
                  </p>
                </div>
              </div>
            </div>

            {resource.adminComment && (
              <div className="mb-10 p-6 bg-slate-950 rounded-3xl text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                    <ShieldAlert className="h-3 w-3" /> System Evaluation
                    Directive
                  </p>
                  <p className="text-sm text-slate-300 italic font-medium leading-relaxed">
                    "{resource.adminComment}"
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-6 mb-12 p-6 bg-amber-50 rounded-3xl border border-amber-100 w-fit">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    disabled={!isAuth}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRate(star)}
                    className="focus:outline-none transition-transform hover:scale-125"
                  >
                    <Star
                      className={`h-7 w-7 ${
                        (hoverRating ||
                          userRating ||
                          Math.round(averageRating)) >= star
                          ? "text-amber-500 fill-amber-500"
                          : "text-amber-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="h-8 w-px bg-amber-200 hidden sm:block" />
              <div>
                <p className="text-2xl font-black text-amber-900 leading-none">
                  {averageRating.toFixed(1)}{" "}
                  <span className="text-sm font-bold text-amber-700/50">
                    / 5.0
                  </span>
                </p>
                <p className="text-[10px] font-black text-amber-700/60 uppercase tracking-widest mt-1">
                  ({ratingCount} Valuations)
                </p>
              </div>
            </div>

            <div className="prose prose-slate max-w-none mb-12">
              <div className="flex items-center gap-2 text-slate-400 mb-4">
                <Info className="h-4 w-4" />
                <p className="text-xs font-bold uppercase tracking-widest">
                  Digital Abstract
                </p>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed text-lg italic border-l-4 border-slate-100 pl-6 py-2">
                This asset contains verified architectural intelligence. Please
                review the metadata matrix for technical specifications prior to
                deployment.
              </p>
            </div>

            {/* Comments Section */}
            <div className="mt-16 pt-12 border-t border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Nexus Intelligence
                </h2>
                <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase">
                  {comments.length} Nodes
                </div>
              </div>

              <div className="mb-10">
                {isAuth ? (
                  <form onSubmit={handleSubmitComment} className="flex gap-4">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Input community intelligence..."
                      className="flex-1 px-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-bold placeholder-slate-400"
                    />
                    <button
                      type="submit"
                      disabled={submittingComment || !newComment.trim()}
                      className="px-8 py-5 bg-slate-950 text-white text-xs font-black uppercase tracking-widest rounded-[2rem] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-950/10 active:scale-95 disabled:opacity-50"
                    >
                      {submittingComment ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Log Message"
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 border-dashed text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                      Identity Verification Required for Transmission
                    </p>
                    <Link
                      to="/login"
                      className="mt-4 inline-block text-indigo-600 font-black text-xs uppercase tracking-widest hover:text-slate-950 transition-colors"
                    >
                      Access Central Terminal
                    </Link>
                  </div>
                )}
              </div>

              <div className="space-y-10">
                {comments.length > 0 ? (
                  comments.map((comment: CommentModel) => (
                    <div key={comment.id} className="flex gap-6 group">
                      <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-slate-950 group-hover:text-white transition-colors group-hover:scale-110">
                        <User className="h-6 w-6" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <p className="font-black text-slate-900">
                            {comment.user.first_name || comment.user.firstName}{" "}
                            {comment.user.last_name || comment.user.lastName}
                          </p>
                          <span className="h-1 w-1 bg-slate-200 rounded-full" />
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 opacity-30">
                    <Info className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                      Awaiting Signal
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Metadata Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-950 p-10 rounded-[3rem] shadow-2xl shadow-indigo-200/20 text-white relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600" />

            <div className="relative z-10 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-8 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" /> Control Center
              </h3>

              <a
                href={`${
                  import.meta.env.VITE_API_URL
                }/resources/${id}/view?token=${encodeURIComponent(
                  localStorage.getItem("token") || ""
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full h-16 flex justify-center items-center gap-3 border border-indigo-500/30 text-xs font-black uppercase tracking-widest rounded-2xl text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 transition-all active:scale-95"
              >
                <Eye className="h-5 w-5" />
                Preview Matrix
              </a>

              <a
                href={`${
                  import.meta.env.VITE_API_URL
                }/resources/${id}/download?token=${encodeURIComponent(
                  localStorage.getItem("token") || ""
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full h-20 flex justify-center items-center gap-4 bg-indigo-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-500 shadow-2xl shadow-indigo-600/40 transition-all hover:-translate-y-1 active:scale-95"
              >
                <Download className="h-6 w-6" />
                Deploy Payload
              </a>

              <div className="pt-8 space-y-5 border-t border-white/5">
                <div className="flex justify-between items-center group">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-indigo-400 transition-colors">
                    Integrations
                  </span>
                  <span className="font-black text-white">
                    {resource.downloadCount}
                  </span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-indigo-400 transition-colors">
                    Mass Unit
                  </span>
                  <span className="font-black text-white">
                    {resource.fileSize.toFixed(2)} MB
                  </span>
                </div>
                {resource.semester && (
                  <div className="flex justify-between items-center group">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-indigo-400 transition-colors">
                      Semester
                    </span>
                    <span className="font-black text-white">
                      {resource.semester}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center group">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-indigo-400 transition-colors">
                    Genesis Date
                  </span>
                  <span className="font-black text-white">
                    {new Date(resource.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
              <Clock className="h-5 w-5 text-indigo-500" />
              Temporal Links
            </h3>
            <div className="space-y-8">
              {recentResources.map((recent: Resource) => (
                <Link
                  key={recent.id}
                  to={
                    isAuth
                      ? role === "Admin" ||
                        role === "SuperAdmin" ||
                        role === "admin"
                        ? `/admin/resources/${recent.id}`
                        : `/dashboard/resources/${recent.id}`
                      : `/resources/${recent.id}`
                  }
                  className="flex items-start gap-5 group"
                >
                  <div className="h-12 w-12 flex-shrink-0 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black text-[10px] uppercase border border-slate-100 group-hover:bg-slate-950 group-hover:text-white transition-all group-hover:scale-110">
                    {recent.fileType}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 leading-snug">
                      {recent.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {new Date(recent.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setReporting(true)}
              className="inline-flex items-center gap-2 text-[10px] font-black text-slate-300 hover:text-red-500 transition-all uppercase tracking-[0.3em] py-2 px-6 border border-slate-100 rounded-full hover:border-red-100 hover:bg-red-50/50"
            >
              <Flag className="h-3.5 w-3.5" />
              Report Disruption
            </button>
          </div>
        </div>
      </div>

      {/* Reporting Modal */}
      {reporting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl p-10 sm:p-14 max-w-lg w-full border border-slate-100 animate-in zoom-in-95 duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-600" />

            {reportSuccess ? (
              <div className="text-center py-10">
                <div className="h-24 w-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                  Signal Received
                </h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                  ModMatrix Node has logged the disturbance.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-10">
                  <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                    Issue Isolation
                  </h3>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                    Specify the nature of the content disruption.
                  </p>
                </div>
                <form onSubmit={handleReport} className="space-y-8">
                  <textarea
                    required
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="e.g. Integrity breach, metadata distortion, unauthorized access..."
                    className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[2rem] focus:outline-none focus:border-red-500 focus:bg-white transition-all text-slate-900 font-bold placeholder-slate-400 min-h-[160px] outline-none"
                  />
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setReporting(false)}
                      className="flex-1 py-5 px-4 rounded-2xl text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-colors"
                    >
                      Abort
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingReport || !reportReason.trim()}
                      className="flex-1 bg-red-600 text-white py-5 px-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmittingReport ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Issue Signal"
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceDetails;
