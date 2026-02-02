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
  Calendar,
  Layers,
  Sparkles,
  Zap,
  ArrowLeft,
  MessageSquare,
  Box,
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

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;

    setIsSubmittingReport(true);
    try {
      await api.post(`/resources/${id}/flag`, { reason: reportReason });
      setReportSuccess(true);
      toast.success(
        "Security Directive: Breach report transmitted to moderator nexus",
      );
      setTimeout(() => {
        setReporting(false);
        setReportSuccess(false);
        setReportReason("");
      }, 2000);
    } catch (err) {
      console.error("Failed to report resource:", err);
      toast.error("Transmission Error: Report packet lost in transit");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleRate = async (rateValue: number) => {
    if (!isAuth) {
      toast.info("Authentication verified required for evaluation protocols");
      return;
    }
    try {
      await api.post(`/resources/${id}/rate`, { rate: rateValue });
      setUserRating(rateValue);
      toast.success(`Evaluation Confirmed: Asset rated at ${rateValue} stars`);

      const { data } = await api.get(`/resources/${id}`);
      if (data.ratings && data.ratings.length > 0) {
        const sum = data.ratings.reduce(
          (acc: number, r: Rating) => acc + r.rate,
          0,
        );
        setAverageRating(sum / data.ratings.length);
        setRatingCount(data.ratings.length);
      }
    } catch (error) {
      console.error("Failed to rate", error);
      toast.error("Evaluation Error: Ratings matrix failed to update");
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

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-40 animate-pulse">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
          Synchronizing with Matrix...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${isNested ? "" : "container mx-auto px-4"} py-24`}>
        <div className="bg-[#5A270F] p-20 rounded-[3rem] text-center border border-white/10 shadow-3xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(223,129,66,0.1),transparent_50%)]" />

          <div className="relative z-10">
            <ServerCrash className="h-20 w-20 text-[#DF8142] mx-auto mb-8 animate-bounce" />
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight uppercase">
              Node Seizure Detected
            </h2>
            <p className="mt-2 text-gray-500 font-bold uppercase tracking-widest text-xs max-w-md mx-auto leading-relaxed">
              {error}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-10 px-8 py-4 bg-white text-[#5A270F] rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#DF8142] hover:text-white transition-all transform active:scale-95 shadow-xl"
            >
              Emergency Extraction
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!resource) return null;

  return (
    <div
      className={`${
        isNested ? "" : "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-10"
      } animate-in fade-in duration-700`}
    >
      <div className="grid lg:grid-cols-12 gap-12">
        {/* Main Intelligence Content */}
        <div className="lg:col-span-8 space-y-12">
          {/* Header Module */}
          <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-[#D9D9C2] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#DF8142]/10 rounded-bl-[4rem] -translate-y-8 translate-x-8 group-hover:bg-[#DF8142]/20 transition-colors duration-700" />

            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <button
                  onClick={() =>
                    isNested ? navigate(-1) : navigate("/browse")
                  }
                  title="Go Back"
                  className="p-2.5 bg-[#5A270F] text-white rounded-xl hover:bg-[#DF8142] transition-all active:scale-90"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="h-px w-8 bg-slate-200" />
                <span className="text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 bg-[#2A1205] text-white rounded-full">
                  {resource.fileType} Protocol
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-2 border ${
                    resource.status === "student" ||
                    resource.status === "approved"
                      ? "bg-[#5A270F]/5 text-emerald-700 border-emerald-100"
                      : resource.status === "pending"
                        ? "bg-amber-50 text-amber-700 border-amber-100"
                        : "bg-red-50 text-rose-700 border-rose-100"
                  }`}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${
                      resource.status === "student" ||
                      resource.status === "approved"
                        ? "bg-[#5A270F]"
                        : resource.status === "pending"
                          ? "bg-[#DF8142]"
                          : "bg-red-700"
                    } animate-pulse`}
                  />
                  {resource.status === "student" ? "Verified" : resource.status}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-[#5A270F] tracking-tight leading-tight mb-8 max-w-2xl">
                {resource.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-4 p-3 bg-[#EFEDED] rounded-2xl border border-[#D9D9C2] hover:border-primary/40 transition-colors cursor-default">
                  <div className="h-12 w-12 rounded-xl bg-white border border-[#D9D9C2] flex items-center justify-center text-[#92664A] shadow-sm">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">
                      Authority Unit
                    </p>
                    <p className="text-base font-bold text-[#5A270F] leading-none">
                      Architect {resource.author}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 bg-[#EFEDED] rounded-2xl border border-[#D9D9C2]">
                  <div className="h-12 w-12 rounded-xl bg-white border border-[#D9D9C2] flex items-center justify-center text-[#DF8142] shadow-sm">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">
                      Genesis Date
                    </p>
                    <p className="text-base font-bold text-[#5A270F] leading-none">
                      {new Date(resource.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {resource.adminComment && (
            <div className="p-6 bg-[#2A1205] rounded-3xl text-white relative overflow-hidden shadow-xl ring-1 ring-white/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[40px] -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 flex items-start gap-5">
                <div className="h-12 w-12 shrink-0 bg-white/10 rounded-xl flex items-center justify-center text-[#DF8142] border border-white/10">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#DF8142] uppercase tracking-widest mb-2">
                    Operations Directive
                  </p>
                  <p className="text-base text-gray-400 italic font-medium leading-relaxed">
                    "{resource.adminComment}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Evaluation Matrix */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#D9D9C2] flex flex-wrap items-center justify-between gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#DF8142]" />
                <h3 className="text-xs font-black text-[#5A270F] uppercase tracking-widest">
                  Intel Evaluation
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    disabled={!isAuth}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRate(star)}
                    title={`Rate ${star} stars`}
                    className="focus:outline-none transition-all hover:scale-125 group/star"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        (hoverRating ||
                          userRating ||
                          Math.round(averageRating)) >= star
                          ? "text-[#DF8142] fill-[#DF8142]"
                          : "text-slate-100 group-hover/star:text-[#EEB38C]"
                      } transition-colors duration-200`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="h-20 w-px bg-[#F5F5DC] hidden sm:block" />

            <div className="text-right sm:text-left">
              <div className="flex items-baseline gap-1.5 mb-1 justify-end sm:justify-start">
                <span className="text-4xl font-black text-[#5A270F] tracking-tight">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-lg font-black text-gray-400">/ 5.0</span>
              </div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Verified Valuations: {ratingCount}
              </p>
            </div>
          </div>

          {/* Content Description */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#D9D9C2]">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-1 w-10 bg-[#DF8142] rounded-full" />
              <h3 className="text-lg font-black text-[#5A270F] uppercase tracking-tight">
                Technical Abstract
              </h3>
            </div>
            <div className="prose prose-slate prose-lg max-w-none prose-p:text-[#5A270F] prose-p:leading-relaxed prose-p:font-medium italic">
              <p>
                This high-voltage architectural protocol contains verified
                structural intelligence. Users are advised to inspect the
                component hierarchy and metadata matrix within the provided
                preview terminal before deploying to active BIM environments.
              </p>
            </div>
          </div>

          {/* Nexus of Intelligence (Comments) */}
          <div className="pt-8 space-y-10">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-[#2A1205] tracking-tighter uppercase flex items-center gap-4">
                <MessageSquare className="h-8 w-8 text-[#DF8142]" />
                Nexus Intelligence
              </h2>
              <div className="px-6 py-2 bg-[#EFEDED] rounded-full text-[10px] font-black text-[#5A270F] uppercase tracking-widest border border-[#D9D9C2]">
                {comments.length} Logged Pulse(s)
              </div>
            </div>

            {isAuth ? (
              <form onSubmit={handleSubmitComment} className="flex gap-4 group">
                <div className="flex-grow relative">
                  <div className="absolute inset-0 bg-[#DF8142]/5 blur-xl group-focus-within:bg-[#DF8142]/10 transition-colors" />
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Input community intelligence..."
                    className="relative w-full px-8 py-5 bg-white border border-[#D9D9C2] rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-[#DF8142]/10 focus:border-[#DF8142] transition-all text-[#5A270F] font-bold placeholder-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingComment || !newComment.trim()}
                  className="px-8 py-4 bg-[#5A270F] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#DF8142] transition-all shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {submittingComment ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  ) : (
                    "Transmit"
                  )}
                </button>
              </form>
            ) : (
              <div className="p-10 bg-[#EFEDED] rounded-[3rem] border border-[#D9D9C2] border-dashed text-center">
                <ShieldAlert className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                <p className="text-[#5A270F] font-bold uppercase tracking-widest text-xs mb-6">
                  Identity Verification Protocol Required for Transmission
                </p>
                <Link
                  to="/login"
                  className="px-8 py-3 bg-[#DF8142] text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#5A270F] transition-all shadow-xl shadow-[#DF8142]/20"
                >
                  Access Terminal
                </Link>
              </div>
            )}

            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((comment: CommentModel) => (
                  <div
                    key={comment.id}
                    className="bg-white p-8 rounded-[2.5rem] border border-[#D9D9C2] shadow-lg hover:shadow-xl transition-all flex gap-6 items-start group"
                  >
                    <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-[#5A270F] flex items-center justify-center text-white font-black text-xl shadow-xl group-hover:scale-110 transition-transform">
                      {(comment.user.first_name || comment.user.firstName)?.[0]}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <p className="font-black text-[#2A1205] text-lg tracking-tight">
                          {comment.user.first_name || comment.user.firstName}{" "}
                          {comment.user.last_name || comment.user.lastName}
                        </p>
                        <span className="h-1.5 w-1.5 bg-primary/90 rounded-full" />
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                          Log:{" "}
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-[#5A270F] font-medium leading-relaxed text-base">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 opacity-20 select-none">
                  <Box className="h-16 w-16 mx-auto text-gray-500 mb-4" />
                  <p className="text-xs font-black uppercase tracking-[0.5em] text-[#2A1205]">
                    Awaiting Signal
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Control Center Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-[#2A1205] p-10 rounded-[4rem] shadow-3xl text-white relative overflow-hidden ring-1 ring-white/10">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/90 to-transparent" />

            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 bg-[#DF8142] rounded-xl flex items-center justify-center shadow-lg shadow-[#DF8142]/20">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#DF8142]/80">
                  Control Center
                </h3>
              </div>

              <div className="space-y-4">
                <a
                  href={`${
                    import.meta.env.VITE_API_URL
                  }/resources/${id}/view?token=${encodeURIComponent(
                    localStorage.getItem("token") || "",
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full h-16 flex justify-center items-center gap-4 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl text-white hover:bg-white/10 transition-all active:scale-95 group"
                >
                  <Eye className="h-5 w-5 text-[#DF8142]/80 group-hover:scale-110 transition-transform" />
                  Scan Matrix
                </a>

                <a
                  href={`${
                    import.meta.env.VITE_API_URL
                  }/resources/${id}/download?token=${encodeURIComponent(
                    localStorage.getItem("token") || "",
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full h-16 flex justify-center items-center gap-4 bg-[#DF8142] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#DF8142]/90 shadow-xl shadow-[#DF8142]/20 transition-all hover:-translate-y-1 active:scale-95"
                >
                  <Download className="h-6 w-6" />
                  Download Resource
                </a>
              </div>

              <div className="pt-8 space-y-6 border-t border-white/10">
                {[
                  {
                    label: "Transmission Count",
                    value: resource.downloadCount.toLocaleString(),
                    icon: Download,
                  },
                  {
                    label: "Data Mass",
                    value:
                      resource.fileSize > 1024
                        ? `${(resource.fileSize / 1024).toFixed(2)} MB`
                        : `${resource.fileSize.toFixed(2)} KB`,
                    icon: Layers,
                  },
                  {
                    label: "Design Phase",
                    value: resource.designStage?.name || "Unclassified",
                    icon: Box,
                  },
                  {
                    label: "Academic Cluster",
                    value: resource.semester
                      ? `Semester ${resource.semester}`
                      : "Global Node",
                    icon: Info,
                  },
                  {
                    label: "Batch Registry",
                    value: resource.batchYear
                      ? `Class of ${resource.batchYear}`
                      : "Open Access",
                    icon: User,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center group"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 text-white/20 group-hover:text-[#DF8142]/80 transition-colors" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <span className="font-black text-white text-xs">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Temporal Links Cluster */}
          <div className="bg-white p-10 rounded-[4rem] shadow-xl border border-[#D9D9C2]">
            <h3 className="text-xs font-black text-[#2A1205] uppercase tracking-[0.3em] mb-12 flex items-center gap-4">
              <Clock className="h-5 w-5 text-[#DF8142]" />
              Related Artifacts
            </h3>
            <div className="space-y-10">
              {recentResources.length > 0 ? (
                recentResources.map((recent: Resource) => (
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
                    className="flex items-center gap-6 group"
                  >
                    <div className="h-16 w-16 shrink-0 bg-[#EFEDED] rounded-2xl flex items-center justify-center text-gray-500 group-hover:bg-[#2A1205] group-hover:text-white transition-all transform group-hover:scale-110 border border-[#D9D9C2] shadow-sm">
                      <Layers className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-black text-[#2A1205] group-hover:text-[#DF8142] transition-colors line-clamp-1 leading-tight">
                        {recent.title}
                      </h4>
                      <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">
                        Registry:{" "}
                        {new Date(recent.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                  No secondary artifacts localized.
                </p>
              )}
            </div>
          </div>

          {/* Report Peripheral */}
          <div className="text-center pt-4">
            <button
              onClick={() => setReporting(true)}
              className="inline-flex items-center gap-3 text-[9px] font-black text-gray-400 hover:text-red-700 transition-all uppercase tracking-[0.4em] py-3 px-10 border border-[#D9D9C2] rounded-full hover:border-rose-100 hover:bg-red-50/50"
            >
              <Flag className="h-3.5 w-3.5" />
              Report Protocol Violation
            </button>
          </div>
        </div>
      </div>

      {/* Security Incident Reporting Modal */}
      {reporting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#2A1205]/90 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-white rounded-[4rem] shadow-3xl p-12 sm:p-20 max-w-2xl w-full border border-[#D9D9C2] animate-in zoom-in-95 duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-3 bg-red-700" />

            {reportSuccess ? (
              <div className="text-center py-10 scale-in-center">
                <div className="h-32 w-32 bg-[#5A270F]/5 text-[#5A270F] rounded-full flex items-center justify-center mx-auto mb-10 border border-emerald-100 shadow-lg">
                  <CheckCircle className="h-14 w-14" />
                </div>
                <h3 className="text-4xl font-black text-[#2A1205] mb-6 tracking-tighter uppercase">
                  Signal Received
                </h3>
                <p className="text-[#5A270F] font-bold uppercase tracking-[0.2em] text-xs">
                  The moderator nexus has been alerted.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-12">
                  <h3 className="text-4xl font-black text-[#2A1205] mb-3 tracking-tighter uppercase">
                    Isolate Incident
                  </h3>
                  <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                    Detail the nature of the architectural breach.
                  </p>
                </div>
                <form onSubmit={handleReport} className="space-y-10">
                  <textarea
                    required
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="e.g. Intellectual property disruption, metadata distortion, unauthorized access..."
                    className="w-full px-10 py-8 bg-[#EFEDED] border border-[#D9D9C2] rounded-[3rem] focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all text-[#5A270F] font-bold placeholder-slate-400 min-h-[220px] outline-none text-lg"
                  />
                  <div className="flex gap-6">
                    <button
                      type="button"
                      onClick={() => setReporting(false)}
                      className="flex-1 py-6 px-4 rounded-3xl text-gray-500 text-[10px] font-black uppercase tracking-widest hover:bg-[#EFEDED] transition-colors"
                    >
                      Abort Mission
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingReport || !reportReason.trim()}
                      className="flex-1 bg-rose-600 text-white py-6 px-4 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] shadow-3xl shadow-rose-600/30 hover:bg-rose-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
                    >
                      {isSubmittingReport ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        "Issue Directive"
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
