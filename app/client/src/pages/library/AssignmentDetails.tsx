import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { api } from "../../lib/api";
import { toast } from "../../lib/toast";
import {
  Loader2,
  Calendar,
  User,
  Download,
  ArrowLeft,
  Trash2,
  Clock,
  FileText,
  Upload,
  Eye,
  CheckCircle,
  AlertCircle,
  Edit3,
} from "lucide-react";
import { currentRole, getUser } from "../../lib/auth";
import Select from "../../components/ui/Select";
import { useTheme } from "../../context/useTheme";

interface AssignmentWithSubmissions {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  file_path?: string;
  file_type?: string;
  file_size?: number;
  creator: {
    id: string;
    first_name: string;
    last_name: string;
  };
  design_stage?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
  academic_year?: number;
  semester?: number;
  isPastDeadline?: boolean;
  submissions?: Array<{
    id: number;
    submitted_at: string;
    file_path: string;
    student?: {
      id: string;
      first_name: string;
      last_name: string;
      year?: number;
      batch?: number;
    };
    status?: string;
    submission_type?: string;
    feedback?: string;
    resource_upload_status?: string;
  }>;
  allow_progress_updates?: boolean;
  custom_design_stage?: string;
}

const AssignmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [assignment, setAssignment] =
    useState<AssignmentWithSubmissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submissionType, setSubmissionType] = useState<string>("final");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState(false);
  const [newDeadline, setNewDeadline] = useState("");
  const [updatingDeadline, setUpdatingDeadline] = useState(false);
  
  const [activeFeedbackId, setActiveFeedbackId] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const role = currentRole();
  const currentUser = getUser();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const isBaseAdmin = location.pathname.startsWith("/admin");
  const basePath = isBaseAdmin ? "/admin" : "/dashboard";

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await api.get(`/assignments/${id}`);
        setAssignment(data);
      } catch (error) {
        console.error("Failed to fetch assignment:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this assignment?"))
      return;
    try {
      await api.delete(`/assignments/${id}`);
      navigate(`${basePath}/assignments`);
    } catch (error) {
      console.error("Failed to delete assignment:", error);
      toast.error("Failed to delete assignment. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Critical Submission Validation
    if (!submissionFile) {
      toast.warn(
        "Transmission Failed: No artifact file selected for submission."
      );
      return;
    }

    if (assignment?.isPastDeadline) {
      toast.error(
        "Protocol Breach: Submission attempt after established deadline."
      );
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("file", submissionFile);
    formData.append("submission_type", submissionType);

    try {
      await api.post(`/assignments/${id}/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSubmitSuccess(true);
      setSubmissionFile(null);
      // Refresh assignment data
      const { data } = await api.get(`/assignments/${id}`);
      setAssignment(data);
      setTimeout(() => setSubmitSuccess(false), 3000);
      toast.success("Assignment submitted successfully!");
    } catch (error: unknown) {
      const errorMessage = (
        error as { response?: { data?: { message?: string } } }
      ).response?.data?.message;
      toast.error(
        errorMessage || "Failed to submit assignment. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestUpload = async (submissionId: number) => {
    try {
      await api.post(`/assignments/submissions/${submissionId}/request-upload`);
      toast.success("Upload request sent to student!");
      const { data } = await api.get(`/assignments/${id}`);
      setAssignment(data);
    } catch (error) {
      console.error("Failed to request upload:", error);
      toast.error("Failed to send request.");
    }
  };

  const handlePermitUpload = async (submissionId: number) => {
    try {
      await api.post(`/assignments/submissions/${submissionId}/permit-upload`);
      toast.success("Work published to Library!");
      const { data } = await api.get(`/assignments/${id}`);
      setAssignment(data);
    } catch (error) {
      console.error("Failed to permit:", error);
      toast.error("Failed to publish work.");
    }
  };

  const handleDenyUpload = async (submissionId: number) => {
    try {
      await api.post(`/assignments/submissions/${submissionId}/deny-upload`);
      toast.warn("Upload request declined.");
      const { data } = await api.get(`/assignments/${id}`);
      setAssignment(data);
    } catch (error) {
      console.error("Failed to deny:", error);
      toast.error("Failed to decline request.");
    }
  };
  
  const handleReject = async (submissionId: number) => {
    if (!window.confirm("Are you sure you want to reject this submission?"))
      return;
    try {
      await api.post(`/assignments/submissions/${submissionId}/reject`);
      toast.success("Submission rejected.");
      const { data } = await api.get(`/assignments/${id}`);
      setAssignment(data);
    } catch (error) {
      console.error("Failed to reject:", error);
      toast.error("Failed to reject submission.");
    }
  };

  const handleSubmitFeedback = async (submissionId: number) => {
    if (!feedbackText.trim()) return;
    setSubmittingFeedback(true);
    try {
      await api.post(`/assignments/submissions/${submissionId}/feedback`, { feedback: feedbackText });
      toast.success("Feedback saved successfully.");
      setActiveFeedbackId(null);
      setFeedbackText("");
      const { data } = await api.get(`/assignments/${id}`);
      setAssignment(data);
    } catch (error) {
      console.error("Failed to add feedback:", error);
      toast.error("Failed to add feedback.");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleUpdateDeadline = async () => {
    if (!newDeadline) return;
    setUpdatingDeadline(true);
    try {
      await api.patch(`/assignments/${id}/deadline`, { due_date: new Date(newDeadline).toISOString() });
      toast.success("Assignment deadline updated successfully.");
      setEditingDeadline(false);
      const { data } = await api.get(`/assignments/${id}`);
      setAssignment(data);
    } catch (error) {
      console.error("Failed to update deadline:", error);
      toast.error("Failed to update deadline.");
    } finally {
      setUpdatingDeadline(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <Loader2 className="h-12 w-12 animate-spin text-[#DF8142]" />
      </div>
    );
  }

  if (!assignment)
    return <div className={`text-center py-20 font-bold ${isLight ? "text-[#5A270F]" : "text-[#EEB38C]"}`}>Assignment not found</div>;

  const isCreatorOrAdmin =
    currentUser?.id === assignment.creator.id ||
    role === "Admin" ||
    role === "SuperAdmin" ||
    role === "Faculty";

  const isStudent = role === "Student";
  const hasSubmitted =
    assignment.submissions && assignment.submissions.length > 0;
  const isPastDeadline = assignment.isPastDeadline;

  return (
    <div className={`container mx-auto px-4 py-12 max-w-5xl transition-colors duration-500 ${isLight ? "text-[#5A270F]" : "text-[#EEB38C]"}`}>
      <Link
        to={`${basePath}/assignments`}
        className={`flex items-center gap-2 font-bold text-sm uppercase tracking-widest mb-10 transition-colors ${isLight ? "text-[#92664A] hover:text-[#5A270F]" : "text-[#EEB38C]/60 hover:text-[#EEB38C]"}`}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Assignments
      </Link>

      <div className={`rounded-[3rem] p-10 shadow-xl border mb-10 relative overflow-hidden transition-all duration-500 ${isLight ? "bg-white border-[#BCAF9C]/30 shadow-[#5A270F]/5" : "bg-[#6C3B1C] border-[#EEB38C]/20"}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#DF8142]/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1.5 bg-[#DF8142]/10 text-[#DF8142] rounded-full text-xs font-black uppercase tracking-widest border border-[#DF8142]/20">
                Brief
              </span>
              {(assignment.design_stage || assignment.custom_design_stage) && (
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-[#EEB38C]/40 ${isLight ? "bg-[#EEB38C]/20 text-[#92664A] border-[#92664A]/20" : "bg-white/5 text-[#EEB38C]"}`}>
                  {assignment.design_stage 
                    ? assignment.design_stage.name 
                    : assignment.custom_design_stage}
                </span>
              )}
              {isPastDeadline && (
                <span className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-black uppercase tracking-widest border border-red-100">
                  Deadline Passed
                </span>
              )}
            </div>
            <h1 className={`text-4xl font-black mb-6 leading-tight transition-colors ${isLight ? "text-[#5A270F]" : "text-white"}`}>
              {assignment.title}
            </h1>
            <div className={`prose prose-lg max-w-none font-medium leading-relaxed whitespace-pre-wrap transition-colors ${isLight ? "text-[#5A270F]/80" : "text-[#EEB38C]/80"}`}>
              {assignment.description || "No description provided."}
            </div>
          </div>

          <div className="w-full md:w-80 flex-shrink-0 space-y-4">
            <div className={`rounded-3xl p-6 border transition-colors ${isLight ? "bg-[#EEB38C]/10 border-[#92664A]/20" : "bg-[#5A270F] border-[#EEB38C]/20"}`}>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm border transition-colors ${isLight ? "bg-white border-[#DF8142]/20" : "bg-[#6C3B1C] border-[#EEB38C]/20"}`}>
                    <Calendar className="h-6 w-6 text-[#DF8142]" />
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-between w-full ${isLight ? "text-[#5A270F]/50" : "text-[#EEB38C]/50"}`}>
                      <span>Due Date</span>
                      {isCreatorOrAdmin && (
                        <button
                          onClick={() => {
                            setEditingDeadline(!editingDeadline);
                            if (assignment.due_date) {
                              const d = new Date(assignment.due_date);
                              // Format as YYYY-MM-DDThh:mm for datetime-local
                              const offset = d.getTimezoneOffset() * 60000;
                              const localISOTime = (new Date(d.getTime() - offset)).toISOString().slice(0, 16);
                              setNewDeadline(localISOTime);
                            }
                          }}
                          className={`hover:text-[#DF8142] transition-colors ml-2 p-1 rounded-md ${isLight ? "bg-[#EEB38C]/30 hover:bg-[#EEB38C]/50" : "bg-black/20 hover:bg-black/40"}`}
                          title="Edit Deadline"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                      )}
                    </p>
                    {editingDeadline ? (
                      <div className="mt-2 flex flex-col gap-2">
                        <input
                          type="datetime-local"
                          title="Edit Deadline"
                          aria-label="Edit Deadline"
                          value={newDeadline}
                          onChange={(e) => setNewDeadline(e.target.value)}
                          className={`w-full text-xs p-2 rounded-lg border focus:outline-none transition-colors ${isLight ? "bg-white border-[#92664A]/30 text-[#5A270F] focus:border-[#DF8142]" : "bg-[#6C3B1C]/50 border-[#EEB38C]/20 text-[#EEB38C] focus:border-[#DF8142]"}`}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleUpdateDeadline}
                            disabled={updatingDeadline || !newDeadline}
                            className="bg-[#5A270F] text-white text-[10px] uppercase font-bold py-1 px-3 rounded-lg hover:bg-[#6C3B1C] transition-colors disabled:opacity-50"
                          >
                            {updatingDeadline ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={() => setEditingDeadline(false)}
                            className={`text-[10px] uppercase font-bold py-1 px-3 rounded-lg transition-colors ${isLight ? "bg-[#EEB38C]/20 text-[#5A270F] hover:bg-[#EEB38C]/30" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className={`font-bold transition-colors ${isLight ? "text-[#5A270F]" : "text-[#EEB38C]"}`}>
                        {assignment.due_date
                          ? new Date(assignment.due_date).toLocaleString([], {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "No deadline"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm border transition-colors ${isLight ? "bg-white border-[#DF8142]/20" : "bg-[#6C3B1C] border-[#EEB38C]/20"}`}>
                    <User className="h-6 w-6 text-[#DF8142]" />
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isLight ? "text-[#5A270F]/50" : "text-[#EEB38C]/50"}`}>
                      Instructor
                    </p>
                    <p className={`font-bold transition-colors ${isLight ? "text-[#5A270F]" : "text-[#EEB38C]"}`}>
                      {assignment.creator.first_name}{" "}
                      {assignment.creator.last_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm border transition-colors ${isLight ? "bg-white border-[#DF8142]/20" : "bg-[#6C3B1C] border-[#EEB38C]/20"}`}>
                    <Clock className="h-6 w-6 text-[#DF8142]" />
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isLight ? "text-[#5A270F]/50" : "text-[#EEB38C]/50"}`}>
                      Posted On
                    </p>
                    <p className={`font-bold transition-colors ${isLight ? "text-[#5A270F]" : "text-[#EEB38C]"}`}>
                      {new Date(assignment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {assignment.file_path && (
              <div className="flex flex-col gap-3">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${
                    import.meta.env.VITE_API_URL
                  }/assignments/${id}/view?token=${encodeURIComponent(
                    localStorage.getItem("token") || ""
                  )}`}
                  className={`w-full flex items-center justify-center gap-2 p-4 rounded-3xl font-black text-xs uppercase tracking-widest border-2 transition-all ${isLight ? "bg-[#EEB38C]/10 text-[#5A270F] border-[#92664A]/30 hover:border-[#DF8142]" : "bg-white/5 text-[#EEB38C] border-[#6C3B1C]/20 hover:border-[#DF8142]"}`}
                >
                  <Eye className="h-4 w-4" />
                  View Brief
                </a>
                <a
                  href={`${
                    import.meta.env.VITE_API_URL
                  }/assignments/${id}/download?token=${encodeURIComponent(
                    localStorage.getItem("token") || ""
                  )}`}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-[#DF8142] to-[#5A270F] text-white p-5 rounded-[2rem] font-black text-lg shadow-xl shadow-[#DF8142]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Download className="h-6 w-6" />
                  Download
                </a>
              </div>
            )}

            {isCreatorOrAdmin && (
              <button
                onClick={handleDelete}
                className="w-full flex items-center justify-center gap-2 text-red-500 font-bold p-4 rounded-3xl border border-red-50 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
                Delete Assignment
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Submission Section for Students */}
      {isStudent && (
        <div className={`rounded-[2.5rem] p-8 border mb-10 relative overflow-hidden transition-all duration-500 ${isLight ? "bg-white border-[#92664A]/30" : "bg-[#6C3B1C]/40 border-[#EEB38C]/20"}`}>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#5A270F]/5 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />
          
          <h2 className={`text-2xl font-black mb-6 flex items-center gap-3 relative z-10 transition-colors ${isLight ? "text-[#5A270F]" : "text-white"}`}>
            <Upload className="h-6 w-6 text-[#DF8142]" />
            Submit Your Work
          </h2>

          {hasSubmitted && (
            <div className="space-y-4 mb-8 relative z-10 w-full">
              <h3 className={`text-xl font-bold mb-4 ${isLight ? "text-[#5A270F]" : "text-[#EEB38C]"}`}>
                Your Submission History
              </h3>
              {assignment.submissions?.map((sub) => (
                <div
                  key={sub.id}
                  className={`rounded-2xl p-6 relative overflow-hidden flex flex-col gap-4 border ${isLight ? "bg-[#EEB38C]/10 border-[#92664A]/30" : "bg-black/20 border-[#EEB38C]/20"}`}
                >
                  <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                    <div className="flex gap-4 items-center">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center shadow-sm ${isLight ? "bg-white" : "bg-white/5"}`}>
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm uppercase tracking-wider ${isLight ? "text-[#5A270F]" : "text-white"}`}>
                          {sub.submission_type === "progress"
                            ? "Progress Update"
                            : "Final Submission"}
                        </h4>
                        <p className={`text-xs font-medium ${isLight ? "text-[#92664A]" : "text-[#EEB38C]/60"}`}>
                          {new Date(sub.submitted_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {sub.status && (
                      <span
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest self-start sm:self-auto shadow-sm ${
                          sub.status === "approved"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : sub.status === "rejected"
                            ? "bg-red-100 text-red-600 border border-red-200"
                            : "bg-white text-[#92664A] border border-[#EEB38C]/50"
                        }`}
                      >
                        {sub.status}
                      </span>
                    )}
                  </div>
                  {sub.feedback && (
                    <div className={`mt-2 rounded-xl p-4 border ${isLight ? "bg-[#DF8142]/10 border-[#DF8142]/20 text-[#5A270F]" : "bg-[#DF8142]/20 border-[#DF8142]/30 text-[#EEB38C]"}`}>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#DF8142] mb-1">
                        Faculty Feedback
                      </p>
                      <p className="text-sm font-medium">
                        {sub.feedback}
                      </p>
                    </div>
                  )}

                  {sub.resource_upload_status === "requested" && (
                    <div className={`mt-4 p-5 border-2 border-dashed border-[#DF8142] rounded-2xl ${isLight ? "bg-[#5A270F]/5" : "bg-[#5A270F]/20"}`}>
                      <p className={`text-sm font-bold mb-3 ${isLight ? "text-[#5A270F]" : "text-[#EEB38C]"}`}>
                        The faculty would like to publish your work as a public resource. Do you permit this?
                      </p>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handlePermitUpload(sub.id)}
                          className="px-4 py-2 bg-[#5A270F] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#6C3B1C] transition-all"
                        >
                          Permit Upload
                        </button>
                        <button 
                          onClick={() => handleDenyUpload(sub.id)}
                          className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border rounded-xl transition-all ${isLight ? "bg-white text-[#92664A] border-[#EEB38C]/30 hover:bg-gray-50" : "bg-white/5 text-[#EEB38C] border-[#EEB38C]/30 hover:bg-white/10"}`}
                        >
                          No Thanks
                        </button>
                      </div>
                    </div>
                  )}
                  {sub.resource_upload_status === "permitted" && (
                    <div className="mt-2 flex items-center gap-2 text-green-600 font-bold text-xs">
                      <CheckCircle className="h-4 w-4" />
                      Work published as a Resource
                    </div>
                  )}
                  {sub.resource_upload_status === "denied" && (
                    <div className="mt-2 text-[#92664A] italic text-[10px] uppercase font-bold">
                      Submission private (Upload denied)
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {isPastDeadline ? (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-4 relative z-10">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-red-900 mb-1">Deadline Passed</h3>
                <p className="text-red-700 text-sm">
                  The submission deadline for this assignment has passed. New
                  submissions are no longer accepted.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="relative group">
                <input
                  id="submission-file"
                  type="file"
                  title="Choose your submission file"
                  onChange={(e) =>
                    setSubmissionFile(e.target.files?.[0] || null)
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={submitting}
                />
                <div className={`border-2 border-dashed rounded-[2rem] py-12 text-center transition-all ${isLight ? "border-[#92664A]/30 hover:border-[#DF8142] hover:bg-[#DF8142]/5" : "border-[#EEB38C]/20 hover:border-[#DF8142] hover:bg-white/5"}`}>
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-[#DF8142]/10 group-hover:text-[#DF8142] transition-all ${isLight ? "bg-[#EEB38C]/20" : "bg-white/5 text-white/50"}`}>
                    <Upload className={`h-8 w-8 transition-colors ${isLight ? "text-[#5A270F]" : "text-[#EEB38C]/60"}`} />
                  </div>
                  <p className={`text-lg font-black mb-1 transition-colors ${isLight ? "text-[#5A270F]" : "text-white"}`}>
                    {submissionFile
                      ? submissionFile.name
                      : "Choose your submission file"}
                  </p>
                  <p className={`font-medium text-sm transition-colors ${isLight ? "text-[#92664A]" : "text-[#EEB38C]/60"}`}>
                    All supported file types accepted
                  </p>
                </div>
              </div>

              {assignment.allow_progress_updates && (
                <div className="flex flex-col gap-2">
                  <Select
                    label="Submission Type"
                    value={submissionType}
                    options={[
                      { id: "progress", name: "Weekly Progress Update" },
                      { id: "final", name: "Final Submission" },
                    ]}
                    onChange={(val) => setSubmissionType(val)}
                    className="w-full"
                  />
                </div>
              )}

              {submitSuccess && (
                <div className="bg-green-50 text-green-600 p-6 rounded-3xl font-bold flex items-center gap-3 border border-green-100">
                  <CheckCircle className="h-6 w-6" />
                  Assignment submitted successfully!
                </div>
              )}

              <button
                type="submit"
                disabled={!submissionFile || submitting}
                className="w-full flex justify-center items-center gap-3 py-5 px-10 bg-[#5A270F] text-white text-lg font-black rounded-[2rem] shadow-2xl shadow-[#5A270F]/20 hover:bg-[#6C3B1C] hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="h-6 w-6" />
                    Submit Assignment
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Admin/Faculty Review Section */}
      {isCreatorOrAdmin &&
        assignment.submissions &&
        assignment.submissions.length > 0 && (
          <div className={`rounded-[2.5rem] p-8 border mb-10 relative overflow-hidden transition-all duration-500 ${isLight ? "bg-white border-[#92664A]/30" : "bg-[#6C3B1C]/40 border-[#EEB38C]/20"}`}>
            <h2 className={`text-2xl font-black mb-6 flex items-center gap-3 relative z-10 transition-colors ${isLight ? "text-[#5A270F]" : "text-white"}`}>
              <User className="h-6 w-6 text-[#DF8142]" />
              Student Submissions
            </h2>
            <div className="space-y-4 relative z-10">
              {assignment.submissions.map((sub) => (
                <div
                  key={sub.id}
                  className={`rounded-2xl p-6 flex justify-between items-center border transition-colors ${isLight ? "bg-[#EEB38C]/10 border-[#92664A]/20" : "bg-white/5 border-[#EEB38C]/20"}`}
                >
                  <div>
                    <h4 className={`font-bold transition-colors ${isLight ? "text-[#5A270F]" : "text-white"}`}>
                      {sub.student
                        ? `${sub.student.first_name} ${sub.student.last_name}`
                        : "Unknown Student"}
                    </h4>
                    <p className={`text-sm transition-colors ${isLight ? "text-[#92664A]" : "text-[#EEB38C]/60"}`}>
                      Year {sub.student?.year} | Submitted:{" "}
                      {new Date(sub.submitted_at).toLocaleDateString()}
                      {sub.submission_type === "progress" ? " (Progress Update)" : ""}
                    </p>
                    {sub.status === "approved" && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        Approved
                      </span>
                    )}
                    {sub.status === "rejected" && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                        Rejected
                      </span>
                    )}
                    {sub.feedback && (
                      <div className={`mt-4 p-4 rounded-xl border ${isLight ? "bg-[#DF8142]/10 border-[#DF8142]/20 text-[#5A270F]" : "bg-[#DF8142]/20 border-[#DF8142]/30 text-[#EEB38C]"}`}>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#DF8142] mb-1">
                          Given Feedback
                        </p>
                        <p className="text-sm font-medium">
                          {sub.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {activeFeedbackId === sub.id ? (
                      <div className="flex flex-col gap-2 items-end w-full sm:w-80 mt-2">
                        <textarea
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          className={`w-full text-xs p-3 rounded-[1rem] border-2 focus:outline-none focus:ring-4 focus:ring-[#DF8142]/10 transition-colors ${isLight ? "bg-white border-[#DF8142]/30 text-[#5A270F] focus:border-[#DF8142]" : "bg-black/50 border-[#DF8142]/40 text-[#EEB38C] focus:border-[#DF8142]"}`}
                          placeholder="Type your detailed constructive feedback here..."
                          rows={3}
                          disabled={submittingFeedback}
                        />
                        <div className="flex gap-2 w-full justify-end">
                          <button
                            onClick={() => {
                              setActiveFeedbackId(null);
                              setFeedbackText("");
                            }}
                            disabled={submittingFeedback}
                            className={`px-4 py-2 text-[10px] uppercase font-bold rounded-xl transition-colors ${isLight ? "bg-[#EEB38C]/20 text-[#5A270F] hover:bg-[#EEB38C]/30" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSubmitFeedback(sub.id)}
                            disabled={!feedbackText.trim() || submittingFeedback}
                            className="px-4 py-2 bg-[#DF8142] text-white text-[10px] uppercase font-black rounded-xl hover:bg-[#c9743a] transition-all disabled:opacity-50"
                          >
                            {submittingFeedback ? "Saving..." : "Save Feedback"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <a
                          href={`${
                            import.meta.env.VITE_API_URL
                          }/assignments/submissions/${
                            sub.id
                          }/download?token=${encodeURIComponent(
                            localStorage.getItem("token") || ""
                          )}`}
                          className={`p-3 rounded-xl font-bold shadow-sm hover:bg-[#DF8142]/10 border transition-colors flex items-center justify-center ${isLight ? "bg-white text-[#DF8142] border-[#EEB38C]/50" : "bg-white/5 text-[#EEB38C] border-white/10"}`}
                          title="Download to Review"
                        >
                          <Download className="h-5 w-5" />
                        </a>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`${
                            import.meta.env.VITE_API_URL
                          }/assignments/submissions/${
                            sub.id
                          }/view?token=${encodeURIComponent(
                            localStorage.getItem("token") || ""
                          )}`}
                          className={`p-3 rounded-xl font-bold border-2 hover:border-[#DF8142] transition-colors flex items-center justify-center ${isLight ? "bg-[#EEB38C]/10 text-[#5A270F] border-[#92664A]/20" : "bg-white/5 text-[#EEB38C] border-white/10"}`}
                          title="View Online"
                        >
                          <Eye className="h-5 w-5" />
                        </a>
                        <button
                          onClick={() => {
                            setActiveFeedbackId(sub.id);
                            setFeedbackText(sub.feedback || "");
                          }}
                          className={`px-4 py-2 text-[#DF8142] border border-[#DF8142] rounded-xl font-bold hover:bg-[#DF8142]/10 transition-colors text-sm shadow-sm ${isLight ? "bg-white" : "bg-black/20"}`}
                        >
                          {sub.feedback ? "Edit Feedback" : "Add Feedback"}
                        </button>
                      </div>
                    )}
                    
                    {activeFeedbackId !== sub.id && (
                      <div className="flex gap-2 mt-1">
                        {sub.status !== "approved" && sub.status !== "rejected" && sub.status !== "featured" && (
                          <>
                            {sub.resource_upload_status === "none" ? (
                              <button
                                onClick={() => handleRequestUpload(sub.id)}
                                className="px-4 py-2 bg-[#5A270F] text-white rounded-xl font-bold hover:bg-[#6C3B1C] transition-colors text-sm shadow-sm"
                              >
                                Request to Upload
                              </button>
                            ) : sub.resource_upload_status === "requested" ? (
                              <span className="px-4 py-2 bg-orange-50 text-orange-600 text-xs font-bold border border-orange-100 rounded-xl italic">
                                Awaiting Student Permission...
                              </span>
                            ) : sub.resource_upload_status === "permitted" ? (
                              <span className="px-4 py-2 bg-green-50 text-green-700 text-xs font-bold border border-green-100 rounded-xl">
                                Work Published
                              </span>
                            ) : (
                              <span className="px-4 py-2 bg-gray-50 text-gray-500 text-xs font-bold border border-gray-100 rounded-xl">
                                Request Denied
                              </span>
                            )}
                            
                            <button
                              onClick={() => handleReject(sub.id)}
                              className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors text-sm shadow-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {sub.status === "featured" && (
                          <span className="px-4 py-2 bg-green-50 text-green-700 text-xs font-bold border border-green-100 rounded-xl">
                            Featured as Resource
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      <div className={`rounded-[2.5rem] p-8 border flex items-center gap-6 relative overflow-hidden transition-all duration-500 ${isLight ? "bg-[#EEB38C]/10 border-[#92664A]/30" : "bg-white/5 border-white/10"}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#DF8142]/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className={`h-16 w-16 rounded-3xl flex items-center justify-center shadow-sm relative z-10 border transition-colors ${isLight ? "bg-white text-[#DF8142] border-[#92664A]/20" : "bg-white/5 text-[#EEB38C] border-white/10"}`}>
          <FileText className="h-8 w-8" />
        </div>
        <div className="relative z-10">
          <h3 className={`text-xl font-bold transition-colors ${isLight ? "text-[#5A270F]" : "text-white"}`}>
            Submission Guidelines
          </h3>
          <p className={`font-medium transition-colors ${isLight ? "text-[#92664A]" : "text-[#EEB38C]/60"}`}>
            Please follow the instructions above carefully. Submit your work
            before the deadline using the form above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetails;
