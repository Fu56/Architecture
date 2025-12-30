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
    id: number;
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
      id: number;
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
    if (!submissionFile) return;

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
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!assignment)
    return <div className="text-center py-20">Assignment not found</div>;

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
        className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 font-bold text-sm uppercase tracking-widest mb-10 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Assignments
      </Link>

      <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
                Brief
              </span>
              {assignment.design_stage && (
                <span className="px-4 py-1.5 bg-gray-50 text-gray-600 rounded-full text-xs font-black uppercase tracking-widest border border-gray-100">
                  {assignment.design_stage.name}
                </span>
              )}
              {isPastDeadline && (
                <span className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-black uppercase tracking-widest border border-red-100">
                  Deadline Passed
                </span>
              )}
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
              {assignment.title}
            </h1>
            <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">
              {assignment.description || "No description provided."}
            </div>
          </div>

          <div className="w-full md:w-80 flex-shrink-0 space-y-4">
            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Calendar className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Due Date
                    </p>
                    <p className="font-bold text-gray-900">
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
                  <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <User className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Instructor
                    </p>
                    <p className="font-bold text-gray-900">
                      {assignment.creator.first_name}{" "}
                      {assignment.creator.last_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Clock className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Posted On
                    </p>
                    <p className="font-bold text-gray-900">
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
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white p-5 rounded-3xl font-black text-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 mb-10">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <Upload className="h-6 w-6 text-indigo-600" />
            Submit Your Work
          </h2>

          {hasSubmitted && (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6 mb-6 flex items-start gap-4">
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
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-4">
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <input
                  type="file"
                  onChange={(e) =>
                    setSubmissionFile(e.target.files?.[0] || null)
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={submitting}
                />
                <div className="border-2 border-dashed border-gray-200 rounded-[2rem] py-12 text-center group-hover:border-indigo-400 group-hover:bg-indigo-50 transition-all">
                  <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:text-indigo-600 transition-all">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-black text-gray-900 mb-1">
                    {submissionFile
                      ? submissionFile.name
                      : "Choose your submission file"}
                  </p>
                  <p className="text-gray-400 font-medium text-sm">
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
                className="w-full flex justify-center items-center gap-3 py-5 px-10 bg-indigo-600 text-white text-lg font-black rounded-[2rem] shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
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
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 mb-10">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <User className="h-6 w-6 text-indigo-600" />
              Student Submissions
            </h2>
            <div className="space-y-4">
              {assignment.submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-gray-50 rounded-2xl p-6 flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {sub.student
                        ? `${sub.student.first_name} ${sub.student.last_name}`
                        : "Unknown Student"}
                    </h4>
                    <p className="text-sm text-gray-500">
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
                      className="p-3 bg-white text-indigo-600 rounded-xl font-bold shadow-sm hover:bg-indigo-50 border border-gray-100"
                      title="Download to Review"
                    >
                      <Download className="h-5 w-5" />
                    </a>
                    {sub.status !== "approved" && sub.status !== "rejected" && (
                      <>
                        <button
                          onClick={() => handleApprove(sub.id)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(sub.id)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors text-sm"
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

      <div className="bg-indigo-50 rounded-[2.5rem] p-8 border border-indigo-100 flex items-center gap-6">
        <div className="h-16 w-16 bg-white rounded-3xl flex items-center justify-center shadow-sm text-indigo-600">
          <FileText className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-indigo-900">
            Submission Guidelines
          </h3>
          <p className="text-indigo-700/70 font-medium">
            Please follow the instructions above carefully. Submit your work
            before the deadline using the form above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetails;
