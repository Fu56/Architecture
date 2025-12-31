import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { api } from "../../lib/api";
import type { Resource, Comment } from "../../models";
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
} from "lucide-react";
import { isAuthenticated, currentRole } from "../../lib/auth";

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
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const [rating, setRating] = useState(0);
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
          const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
          const myRating = data.ratings.find(
            (r: Rating) => r.user_id === currentUser.id
          );
          if (myRating) setUserRating(myRating.rate);
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
      setTimeout(() => {
        setReporting(false);
        setReportSuccess(false);
        setReportReason("");
      }, 2000);
    } catch (err) {
      console.error("Failed to report resource:", err);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleRate = async (rate: number) => {
    try {
      await api.post(`/resources/${id}/rate`, { rate });
      setUserRating(rate);

      // Optimistic update
      // If updating existing rating, re-calc average properly is complex without full data,
      // but for simplicity we can re-fetch or approximate.
      // Let's re-fetch to be safe and simple.
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
      alert("Failed to save rating.");
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
      // Format the new comment to match existing structure or re-fetch.
      // Re-fetching is safer for getting user details populated.
      const { data: updatedResource } = await api.get(`/resources/${id}`);
      setComments(updatedResource.comments || []);
      setNewComment("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
      alert("Failed to post comment.");
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
        } text-center py-20 bg-red-50 rounded-lg my-8`}
      >
        <ServerCrash className="h-12 w-12 text-red-500 mx-auto" />
        <p className="mt-4 text-lg font-medium text-red-700">{error}</p>
      </div>
    );
  }

  if (!resource) return null;

  return (
    <div
      className={`${
        isNested ? "" : "container mx-auto px-4 sm:px-6 lg:px-8 py-12"
      }`}
    >
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-bold uppercase px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                {resource.fileType}
              </span>
              <div className="flex flex-col gap-2">
                <span
                  className={`text-sm font-bold uppercase px-3 py-1 rounded-full w-fit flex items-center gap-1.5 ${
                    resource.status === "student" ||
                    resource.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : resource.status === "pending"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      resource.status === "student" ||
                      resource.status === "approved"
                        ? "bg-green-500"
                        : resource.status === "pending"
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                  ></span>
                  {resource.status === "student" ? "Approved" : resource.status}
                </span>
                {resource.adminComment && (
                  <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl mt-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      System Feedback
                    </p>
                    <p className="text-sm text-gray-600 italic leading-relaxed">
                      "{resource.adminComment}"
                    </p>
                  </div>
                )}
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4">
              {resource.title}
            </h1>
            <div className="flex items-center text-md text-gray-600 mt-2">
              <User className="h-5 w-5 mr-2 text-gray-400" />
              <span>Authored by {resource.author}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 w-fit">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  disabled={!isAuth}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleRate(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-6 w-6 ${
                      (hoverRating ||
                        userRating ||
                        Math.round(averageRating)) >= star
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-sm">
              <p className="font-bold text-gray-900">
                {averageRating.toFixed(1)} / 5.0
              </p>
              <p className="text-gray-500 text-xs">({ratingCount} ratings)</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              This section can contain a brief description or abstract of the
              resource, providing users with more context before they download.
            </p>
          </div>

          {/* Comments Section */}
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Community Discussion
            </h2>
            {/* New Comment Form */}
            <div className="mb-8">
              {isAuth ? (
                <form onSubmit={handleSubmitComment} className="flex gap-4">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                  />
                  <button
                    type="submit"
                    disabled={submittingComment || !newComment.trim()}
                    className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {submittingComment ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Post"
                    )}
                  </button>
                </form>
              ) : (
                <p className="text-gray-500 text-sm">
                  Please log in to add comments.
                </p>
              )}
            </div>
            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((comment: Comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {comment.user.firstName} {comment.user.lastName}
                      </p>
                      <p className="text-gray-600">{comment.text}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No comments yet. Be the first to share your thoughts!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Metadata Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
            <a
              href={`${
                import.meta.env.VITE_API_URL
              }/resources/${id}/view?token=${encodeURIComponent(
                localStorage.getItem("token") || ""
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-indigo-100 text-sm font-bold rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all hover:scale-[1.02]"
            >
              <Eye className="h-4 w-4" />
              Preview File
            </a>
            <a
              href={`${
                import.meta.env.VITE_API_URL
              }/resources/${id}/download?token=${encodeURIComponent(
                localStorage.getItem("token") || ""
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent text-base font-black rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="h-5 w-5" />
              Download File
            </a>
            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                  Downloads
                </span>{" "}
                <span className="font-bold text-gray-900">
                  {resource.downloadCount}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                  File Size
                </span>{" "}
                <span className="font-bold text-gray-900">
                  {resource.fileSize.toFixed(2)} MB
                </span>
              </div>
              {resource.semester && (
                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                    Semester
                  </span>{" "}
                  <span className="font-bold text-gray-900">
                    {resource.semester}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                  Uploaded
                </span>{" "}
                <span className="font-bold text-gray-900">
                  {new Date(resource.uploadedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                  Uploader
                </span>{" "}
                <span className="font-bold text-gray-900">
                  {resource.uploader.firstName}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-900 mb-6 tracking-tight flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" />
              Recent Uploads
            </h3>
            <div className="space-y-4">
              {recentResources.map((recent: Resource) => (
                <Link
                  key={recent.id}
                  to={
                    isAuth
                      ? role === "Admin" || role === "SuperAdmin"
                        ? `/admin/resources/${recent.id}`
                        : `/dashboard/resources/${recent.id}`
                      : `/resources/${recent.id}`
                  }
                  className="flex items-start gap-3 group"
                >
                  <div className="h-10 w-10 flex-shrink-0 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-[10px] uppercase border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {recent.fileType}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {recent.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-medium">
                      {recent.uploader?.firstName} •{" "}
                      {new Date(recent.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => setReporting(true)}
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-red-600 transition-colors uppercase tracking-widest"
            >
              <Flag className="h-3.5 w-3.5" />
              Report Content
            </button>
          </div>
        </div>
      </div>

      {/* Reporting Modal */}
      {reporting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-md w-full border border-gray-100 animate-in zoom-in-95 duration-300">
            {reportSuccess ? (
              <div className="text-center py-8">
                <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  Report Received
                </h3>
                <p className="text-gray-500 font-medium">
                  Thank you for helping us keep the library safe.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  Report Resource
                </h3>
                <p className="text-gray-500 font-medium mb-6">
                  Please provide a reason for reporting this content.
                </p>
                <form onSubmit={handleReport} className="space-y-4">
                  <textarea
                    required
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="e.g. Copyright violation, incorrect metadata, improper content..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px] text-gray-700 bg-gray-50"
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setReporting(false)}
                      className="flex-1 py-3 px-4 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingReport || !reportReason.trim()}
                      className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmittingReport ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Submit Report"
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
