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
    return <div className="text-center py-20 text-[#5A270F] dark:text-[#EEB38C] font-bold">Assignment not found</div>;

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
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <Link
        to={`${basePath}/assignments`}
        className="flex items-center gap-2 text-[#92664A] dark:text-[#EEB38C]/40 hover:text-[#5A270F] dark:text-[#EEB38C] font-bold text-sm uppercase tracking-widest mb-10 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Assignments
      </Link>

      <div className="bg-white dark:bg-card rounded-[3rem] p-10 shadow-xl border border-[#EEB38C]/30 dark:border-white/10 mb-10 relative overflow-hidden transition-all duration-500">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#DF8142]/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1.5 bg-[#DF8142]/10 text-[#DF8142] rounded-full text-xs font-black uppercase tracking-widest border border-[#DF8142]/20">
                Brief
              </span>
              {(assignment.design_stage || assignment.custom_design_stage) && (
                <span className="px-4 py-1.5 bg-[#EFEDED] dark:bg-white/5 text-[#92664A] dark:text-[#EEB38C] rounded-full text-xs font-black uppercase tracking-widest border border-[#EEB38C]/40 dark:border-white/10">
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
            <h1 className="text-4xl font-black text-[#5A270F] dark:text-foreground mb-6 leading-tight transition-colors">
              {assignment.title}
            </h1>
            <div className="prose prose-lg max-w-none text-[#92664A] dark:text-foreground/60 font-medium leading-relaxed whitespace-pre-wrap transition-colors">
              {assignment.description || "No description provided."}
            </div>
          </div>

          <div className="w-full md:w-80 flex-shrink-0 space-y-4">
            <div className="bg-[#EFEDED] dark:bg-background/50 dark:bg-white/5 rounded-3xl p-6 border border-[#EEB38C]/30 dark:border-white/10 transition-colors">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-white dark:bg-card rounded-2xl flex items-center justify-center shadow-sm border border-[#EEB38C]/20 dark:border-white/10 transition-colors">
                    <Calendar className="h-6 w-6 text-[#DF8142]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#92664A] dark:text-foreground/40 uppercase tracking-widest transition-colors flex items-center justify-between w-full">
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
                          className="hover:text-[#DF8142] transition-colors ml-2 p-1 bg-white/50 dark:bg-black/20 rounded-md"
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
                          className="w-full text-xs p-2 rounded-lg border border-[#EEB38C]/30 bg-white dark:bg-black/50 text-[#5A270F] dark:text-[#EEB38C] focus:outline-none focus:border-[#DF8142]"
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
                            className="bg-gray-200 text-gray-700 dark:bg-white/10 dark:text-gray-300 text-[10px] uppercase font-bold py-1 px-3 rounded-lg hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="font-bold text-[#5A270F] dark:text-[#EEB38C] transition-colors">
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
                  <div className="h-12 w-12 bg-white dark:bg-card rounded-2xl flex items-center justify-center shadow-sm border border-[#EEB38C]/20 dark:border-white/10 transition-colors">
                    <User className="h-6 w-6 text-[#DF8142]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#92664A] dark:text-foreground/40 uppercase tracking-widest transition-colors">
                      Instructor
                    </p>
                    <p className="font-bold text-[#5A270F] dark:text-[#EEB38C] transition-colors">
                      {assignment.creator.first_name}{" "}
                      {assignment.creator.last_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-white dark:bg-card rounded-2xl flex items-center justify-center shadow-sm border border-[#EEB38C]/20 dark:border-white/10 transition-colors">
                    <Clock className="h-6 w-6 text-[#DF8142]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#92664A] dark:text-foreground/40 uppercase tracking-widest transition-colors">
                      Posted On
                    </p>
                    <p className="font-bold text-[#5A270F] dark:text-[#EEB38C] transition-colors">
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
                  className="w-full flex items-center justify-center gap-2 bg-[#FAF8F4] dark:bg-white/5 text-[#5A270F] dark:text-[#EEB38C] p-4 rounded-3xl font-black text-xs uppercase tracking-widest border-2 border-[#6C3B1C]/20 hover:border-[#DF8142] transition-all"
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
                  className="w-full flex items-center justify-center gap-2 bg-[#5A270F] text-white p-5 rounded-[2rem] font-black text-lg shadow-xl shadow-[#5A270F]/20 hover:bg-[#6C3B1C] transition-all hover:scale-[1.02] active:scale-[0.98]"
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
        <div className="bg-white dark:bg-card rounded-[2.5rem] p-8 border border-[#EEB38C]/30 dark:border-white/10 mb-10 relative overflow-hidden transition-all duration-500">
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#5A270F]/5 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />
          
          <h2 className="text-2xl font-black text-[#5A270F] dark:text-foreground mb-6 flex items-center gap-3 relative z-10 transition-colors">
            <Upload className="h-6 w-6 text-[#DF8142]" />
            Submit Your Work
          </h2>

          {hasSubmitted && (
            <div className="space-y-4 mb-8 relative z-10 w-full">
              <h3 className="text-xl font-bold text-[#5A270F] dark:text-[#EEB38C] mb-4">
                Your Submission History
              </h3>
              {assignment.submissions?.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-[#EFEDED] dark:bg-black/20 border border-[#EEB38C]/30 dark:border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col gap-4"
                >
                  <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                    <div className="flex gap-4 items-center">
                      <div className="bg-white dark:bg-white/5 h-12 w-12 rounded-full flex items-center justify-center shadow-sm">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#5A270F] dark:text-foreground text-sm uppercase tracking-wider">
                          {sub.submission_type === "progress"
                            ? "Progress Update"
                            : "Final Submission"}
                        </h4>
                        <p className="text-xs text-[#92664A] dark:text-foreground/60 font-medium">
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
                    <div className="mt-2 bg-[#DF8142]/10 rounded-xl p-4 border border-[#DF8142]/20">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#DF8142] mb-1">
                        Faculty Feedback
                      </p>
                      <p className="text-sm font-medium text-[#5A270F] dark:text-[#EEB38C]">
                        {sub.feedback}
                      </p>
                    </div>
                  )}

                  {sub.resource_upload_status === "requested" && (
                    <div className="mt-4 p-5 bg-[#5A270F] bg-opacity-5 border-2 border-dashed border-[#DF8142] rounded-2xl">
                      <p className="text-sm font-bold text-[#5A270F] dark:text-[#EEB38C] mb-3">
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
                          className="px-4 py-2 bg-white dark:bg-white/5 text-[#92664A] text-[10px] font-black uppercase tracking-widest border border-[#EEB38C]/30 rounded-xl hover:bg-gray-50 transition-all"
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
                <div className="border-2 border-dashed border-[#EEB38C] dark:border-white/10 rounded-[2rem] py-12 text-center group-hover:border-[#DF8142] group-hover:bg-[#DF8142]/5 dark:group-hover:bg-white/5 dark:bg-card/5 transition-all">
                  <div className="h-16 w-16 bg-[#EFEDED] dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-[#DF8142]/10 group-hover:text-[#DF8142] transition-all">
                    <Upload className="h-8 w-8 text-[#92664A] dark:text-foreground/40" />
                  </div>
                  <p className="text-lg font-black text-[#5A270F] dark:text-foreground mb-1 transition-colors">
                    {submissionFile
                      ? submissionFile.name
                      : "Choose your submission file"}
                  </p>
                  <p className="text-[#92664A] dark:text-foreground/40 font-medium text-sm transition-colors">
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
          <div className="bg-white dark:bg-card rounded-[2.5rem] p-8 border border-[#EEB38C]/30 dark:border-white/10 mb-10 relative overflow-hidden transition-all duration-500">
            <h2 className="text-2xl font-black text-[#5A270F] dark:text-foreground mb-6 flex items-center gap-3 relative z-10 transition-colors">
              <User className="h-6 w-6 text-[#DF8142]" />
              Student Submissions
            </h2>
            <div className="space-y-4 relative z-10">
              {assignment.submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-[#EFEDED] dark:bg-background/50 dark:bg-white/5 rounded-2xl p-6 flex justify-between items-center border border-[#EEB38C]/20 dark:border-white/10 transition-colors"
                >
                  <div>
                    <h4 className="font-bold text-[#5A270F] dark:text-foreground transition-colors">
                      {sub.student
                        ? `${sub.student.first_name} ${sub.student.last_name}`
                        : "Unknown Student"}
                    </h4>
                    <p className="text-sm text-[#92664A] dark:text-foreground/60 transition-colors">
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
                      <div className="mt-4 bg-[#DF8142]/10 p-4 rounded-xl border border-[#DF8142]/20">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#DF8142] mb-1">
                          Given Feedback
                        </p>
                        <p className="text-sm font-medium text-[#5A270F] dark:text-[#EEB38C]">
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
                          className="w-full text-xs p-3 rounded-[1rem] border-2 border-[#DF8142]/30 bg-white dark:bg-black/50 text-[#5A270F] dark:text-[#EEB38C] focus:outline-none focus:border-[#DF8142] focus:ring-4 focus:ring-[#DF8142]/10"
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
                            className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-white/10 dark:text-gray-300 text-[10px] uppercase font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
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
                          className="p-3 bg-white dark:bg-card dark:bg-white/5 text-[#DF8142] dark:text-[#EEB38C] rounded-xl font-bold shadow-sm hover:bg-[#DF8142]/10 border border-[#EEB38C]/20 dark:border-white/10 transition-colors flex items-center justify-center"
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
                          className="p-3 bg-[#FAF8F4] dark:bg-white/5 text-[#5A270F] dark:text-[#EEB38C] rounded-xl font-bold border-2 border-[#6C3B1C]/10 hover:border-[#DF8142] transition-colors flex items-center justify-center"
                          title="View Online"
                        >
                          <Eye className="h-5 w-5" />
                        </a>
                        <button
                          onClick={() => {
                            setActiveFeedbackId(sub.id);
                            setFeedbackText(sub.feedback || "");
                          }}
                          className="px-4 py-2 bg-white dark:bg-black/20 text-[#DF8142] border border-[#DF8142] rounded-xl font-bold hover:bg-[#DF8142]/10 transition-colors text-sm shadow-sm"
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

      <div className="bg-[#EFEDED] dark:bg-background/80 dark:bg-white/5 rounded-[2.5rem] p-8 border border-[#EEB38C]/40 dark:border-white/10 flex items-center gap-6 relative overflow-hidden transition-all duration-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#DF8142]/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="h-16 w-16 bg-white dark:bg-card dark:bg-white/5 rounded-3xl flex items-center justify-center shadow-sm text-[#DF8142] dark:text-[#EEB38C] relative z-10 border border-[#EEB38C]/20 dark:border-white/10 transition-colors">
          <FileText className="h-8 w-8" />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-[#5A270F] dark:text-foreground transition-colors">
            Submission Guidelines
          </h3>
          <p className="text-[#92664A] dark:text-foreground/40 font-medium transition-colors">
            Please follow the instructions above carefully. Submit your work
            before the deadline using the form above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetails;
