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
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { currentRole, getUser } from "../../lib/auth";

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
  }>;
}

const AssignmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [assignment, setAssignment] =
    useState<AssignmentWithSubmissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
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

  const handleApprove = async (submissionId: number) => {
    try {
      await api.post(`/assignments/submissions/${submissionId}/approve`);
      toast.success("Submission approved and added to resources!");
      const { data } = await api.get(`/assignments/${id}`);
      setAssignment(data);
    } catch (error) {
      console.error("Failed to approve:", error);
      toast.error("Failed to approve submission.");
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
              {assignment.design_stage && (
                <span className="px-4 py-1.5 bg-[#EFEDED] dark:bg-white/5 text-[#92664A] dark:text-[#EEB38C] rounded-full text-xs font-black uppercase tracking-widest border border-[#EEB38C]/40 dark:border-white/10">
                  {assignment.design_stage.name}
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
                    <p className="text-[10px] font-black text-[#92664A] dark:text-foreground/40 uppercase tracking-widest transition-colors">
                      Due Date
                    </p>
                    <p className="font-bold text-[#5A270F] dark:text-[#EEB38C] transition-colors">
                      {assignment.due_date
                        ? new Date(assignment.due_date).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "No deadline"}
                    </p>
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
              <a
                href={`${
                  import.meta.env.VITE_API_URL
                }/assignments/${id}/download?token=${encodeURIComponent(
                  localStorage.getItem("token") || ""
                )}`}
                className="w-full flex items-center justify-center gap-2 bg-[#5A270F] text-white p-5 rounded-3xl font-black text-lg shadow-xl shadow-[#5A270F]/20 hover:bg-[#6C3B1C] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="h-6 w-6" />
                Download Brief
              </a>
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
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6 mb-6 flex items-start gap-4 relative z-10">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-green-900 mb-1">
                  Submission Received
                </h3>
                <p className="text-green-700 text-sm">
                  You submitted this assignment on{" "}
                  {assignment.submissions?.[0] &&
                    new Date(
                      assignment.submissions[0].submitted_at
                    ).toLocaleString()}
                </p>
              </div>
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
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`${
                        import.meta.env.VITE_API_URL
                      }/assignments/submissions/${
                        sub.id
                      }/download?token=${encodeURIComponent(
                        localStorage.getItem("token") || ""
                      )}`}
                      className="p-3 bg-white dark:bg-card dark:bg-white/5 text-[#DF8142] dark:text-[#EEB38C] rounded-xl font-bold shadow-sm hover:bg-[#DF8142]/10 border border-[#EEB38C]/20 dark:border-white/10 transition-colors"
                      title="Download to Review"
                    >
                      <Download className="h-5 w-5" />
                    </a>
                    {sub.status !== "approved" && sub.status !== "rejected" && (
                      <>
                        <button
                          onClick={() => handleApprove(sub.id)}
                          className="px-4 py-2 bg-[#5A270F] text-white rounded-xl font-bold hover:bg-[#6C3B1C] transition-colors text-sm shadow-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(sub.id)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors text-sm shadow-sm"
                        >
                          Reject
                        </button>
                      </>
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
