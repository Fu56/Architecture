import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { api } from "../../lib/api";
import { toast } from "../../lib/toast";
import {
  Calendar,
  User,
  Download,
  ArrowLeft,
  Eye,
  AlertCircle,
  Edit3,
  Shield,
  Zap,
  Info,
  Layers,
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
  const [editingDeadline, setEditingDeadline] = useState(false);
  const [newDeadline, setNewDeadline] = useState("");
  const [activeFeedbackId, setActiveFeedbackId] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState("");

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
    if (!window.confirm("Purge this assignment brief from the Nexus?")) return;
    try {
      await api.delete(`/assignments/${id}`);
      navigate(`${basePath}/assignments`);
      toast.success("Assignment brief purged.");
    } catch (error) {
      console.error("Failed to delete assignment:", error);
      toast.error("Shield failure: Unable to purge brief.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionFile) {
      toast.warn("Transmission error: No artifact selected.");
      return;
    }
    if (assignment?.isPastDeadline) {
      toast.error("Protocol breach: Deadline expired.");
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
      setSubmissionFile(null);
      const { data } = await api.get(`/assignments/${id}`);
      setAssignment(data);
      toast.success("Artifact transmitted successfully!");
    } catch (err: unknown) {
      const errorResponse = err as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        errorResponse.response?.data?.message || "Transmission failure.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateDeadline = async () => {
    if (!newDeadline) return;
    try {
      await api.patch(`/assignments/${id}/deadline`, {
        due_date: new Date(newDeadline).toISOString(),
      });
      toast.success("Deadline protocol updated.");
      setEditingDeadline(false);
      const { data } = await api.get(`/assignments/${id}`);
      setAssignment(data);
    } catch {
      toast.error("Protocol update failed.");
    }
  };

  // Submission action logic removed as it is now redundant with current role-based flow.

  const handleSubmitFeedback = async (submissionId: number) => {
    if (!feedbackText.trim()) return;
    try {
      await api.post(`/assignments/submissions/${submissionId}/feedback`, {
        feedback: feedbackText,
      });
      toast.success("Critique synchronized.");
      setActiveFeedbackId(null);
      setFeedbackText("");
      const { data } = await api.get(`/assignments/${id}`);
      setAssignment(data);
    } catch {
      toast.error("Sync failure: Critique lost.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-3xl border-4 border-[#EEB38C]/20" />
          <div className="absolute inset-0 rounded-3xl border-4 border-t-[#DF8142] animate-spin shadow-[0_0_20px_rgba(223,129,66,0.3)]" />
          <Zap className="h-8 w-8 text-[#DF8142] animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[#5A270F] dark:text-[#EEB38C]/60">
          Loading_Brief_Nexus
        </p>
      </div>
    );
  }

  if (!assignment) return null;

  const isCreatorOrAdmin =
    currentUser?.id === assignment.creator.id ||
    ["Admin", "SuperAdmin", "Faculty"].includes(role || "");
  const isStudent = role === "Student";
  const isPastDeadline = assignment.isPastDeadline;

  return (
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#0C0603] px-4 sm:px-8 py-10 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* ── RETURN NAVIGATION ────────────────────────── */}
        <Link
          to={`${basePath}/assignments`}
          title="Return to Assignments Gallery"
          className="inline-flex items-center gap-4 bg-white dark:bg-[#1A0B04] px-6 py-3 rounded-2xl border-2 border-[#92664A]/10 shadow-sm text-[10px] font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C]/60 hover:border-[#DF8142] hover:text-[#DF8142] transition-all group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Portfolio Matrix
        </Link>

        {/* ── CORE BRIEF CARD ───────────────────────────── */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#DF8142] to-[#5A270F] rounded-[3.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000" />
          <div className="relative bg-white dark:bg-[#1A0B04] rounded-[3rem] border-2 border-[#92664A]/10 dark:border-white/5 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 architectural-dot-grid dark:architectural-dot-grid-dark opacity-5" />

            <div className="flex flex-col lg:grid lg:grid-cols-12 relative z-10">
              {/* Left Content Column */}
              <div className="lg:col-span-8 p-10 lg:p-14 space-y-10">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-4 py-1.5 bg-[#DF8142] text-white rounded-xl text-[9px] font-black uppercase tracking-[0.3em] shadow-lg shadow-[#DF8142]/20 italic">
                    Critical_Brief
                  </span>
                  {(assignment.design_stage ||
                    assignment.custom_design_stage) && (
                    <span className="px-4 py-1.5 bg-[#EEB38C]/10 dark:bg-white/5 text-[#92664A] dark:text-[#EEB38C]/60 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] border border-[#92664A]/20">
                      {assignment.design_stage
                        ? assignment.design_stage.name
                        : assignment.custom_design_stage}
                    </span>
                  )}
                  {isPastDeadline && (
                    <span className="px-4 py-1.5 bg-rose-500 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.3em] shadow-lg shadow-rose-500/20">
                      Deadline_Breached
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-6xl font-black text-[#5A270F] dark:text-white tracking-tighter uppercase italic leading-[0.9] font-space-grotesk">
                    {assignment.title}
                  </h1>
                  <div className="h-1.5 w-24 bg-[#DF8142] rounded-full" />
                </div>

                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-base font-medium leading-[1.8] text-[#5A270F]/80 dark:text-[#EEB38C]/70 whitespace-pre-wrap italic">
                    {assignment.description ||
                      "No project documentation provided."}
                  </p>
                </div>
              </div>

              {/* Right Sidebar Column */}
              <div className="lg:col-span-4 bg-[#EEB38C]/5 dark:bg-black/40 border-l border-[#92664A]/10 p-10 lg:p-14 space-y-8">
                <div className="space-y-6">
                  {/* Instructor Token */}
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-[#5A270F] flex items-center justify-center text-[#EEB38C] shadow-xl border border-[#EEB38C]/20">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#92664A] dark:text-[#EEB38C]/40 mb-1">
                        Lead Architect
                      </p>
                      <p className="text-sm font-black text-[#5A270F] dark:text-white uppercase tracking-widest italic">
                        {assignment.creator.first_name}{" "}
                        {assignment.creator.last_name}
                      </p>
                    </div>
                  </div>

                  {/* Deadline Token */}
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="h-14 w-14 rounded-2xl bg-[#EEB38C]/10 dark:bg-white/5 border-2 border-[#DF8142]/20 flex items-center justify-center text-[#DF8142] group/dl transition-all">
                        <Calendar className="h-6 w-6 group-hover/dl:scale-110 transition-transform" />
                      </div>
                      {isCreatorOrAdmin && (
                        <button
                          onClick={() => setEditingDeadline(!editingDeadline)}
                          title="Modify Deadline Protocol"
                          aria-label="Modify Deadline"
                          className="absolute -top-2 -right-2 h-7 w-7 rounded-lg bg-[#5A270F] text-[#EEB38C] border-2 border-white dark:border-[#1A0B04] flex items-center justify-center hover:bg-[#DF8142] shadow-lg transition-colors"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#92664A] dark:text-[#EEB38C]/40 mb-1">
                        Due Protocol
                      </p>
                      {editingDeadline ? (
                        <div className="space-y-2">
                          <input
                            type="datetime-local"
                            title="Set New Deadline Protocol"
                            aria-label="Deadline Date Time"
                            value={newDeadline}
                            onChange={(e) => setNewDeadline(e.target.value)}
                            className="w-full bg-white dark:bg-black/40 border border-[#92664A]/30 rounded-lg p-2 text-[10px] font-black text-[#5A270F] dark:text-white outline-none focus:border-[#DF8142]"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleUpdateDeadline}
                              title="Lock New Deadline"
                              className="flex-1 bg-[#5A270F] text-white text-[8px] font-black p-2 rounded-lg uppercase tracking-widest"
                            >
                              Lock
                            </button>
                            <button
                              onClick={() => setEditingDeadline(false)}
                              title="Cancel Modification"
                              className="flex-1 bg-[#EEB38C]/20 text-[#5A270F] text-[8px] font-black p-2 rounded-lg uppercase tracking-widest"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm font-black text-[#5A270F] dark:text-white uppercase tracking-widest italic">
                          {assignment.due_date
                            ? new Date(assignment.due_date).toLocaleDateString(
                                [],
                                { month: "short", day: "numeric" },
                              )
                            : "Indefinite"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4 pt-8 border-t border-[#92664A]/10">
                  {assignment.file_path && (
                    <div className="flex flex-col gap-3">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View Full Brief Protocol"
                        href={`${import.meta.env.VITE_API_URL}/assignments/${id}/view?token=${encodeURIComponent(localStorage.getItem("token") || "")}`}
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white dark:bg-white/5 border border-[#92664A]/30 text-[10px] font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C] hover:border-[#DF8142] transition-all"
                      >
                        <Eye className="h-4 w-4" /> View Protocol
                      </a>
                      <a
                        href={`${import.meta.env.VITE_API_URL}/assignments/${id}/download?token=${encodeURIComponent(localStorage.getItem("token") || "")}`}
                        title="Download Data Shard"
                        className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-[#5A270F] text-white text-[11px] font-black uppercase tracking-[0.4em] shadow-xl shadow-[#5A270F]/30 hover:scale-[1.03] active:scale-95 transition-all"
                      >
                        <Download className="h-5 w-5" /> Download Shard
                      </a>
                    </div>
                  )}

                  {isCreatorOrAdmin && (
                    <button
                      onClick={handleDelete}
                      title="Permanent Purge"
                      className="w-full py-4 rounded-xl border border-rose-500/20 text-rose-500 text-[9px] font-black uppercase tracking-[0.4em] hover:bg-rose-500 hover:text-white transition-all"
                    >
                      Delete Brief
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── STUDENT SUBMISSION ZONE ────────────────────── */}
        {isStudent && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* History Panel */}
            <div className="bg-white dark:bg-[#1A0B04] rounded-[2.5rem] border-2 border-[#92664A]/10 p-8 space-y-6">
              <h2 className="text-xl font-black text-[#5A270F] dark:text-white uppercase italic tracking-tighter flex items-center gap-4">
                <Shield className="h-6 w-6 text-[#DF8142]" /> Transmission_Log
              </h2>
              <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {assignment.submissions?.length ? (
                  assignment.submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-5 rounded-2xl bg-[#EEB38C]/5 dark:bg-white/5 border border-[#92664A]/10 space-y-3"
                    >
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-[#DF8142]">
                          {sub.submission_type === "final"
                            ? "Final_Transmission"
                            : "Progress_Update"}
                        </span>
                        <span className="text-[#92664A]">
                          {new Date(sub.submitted_at).toLocaleDateString()}
                        </span>
                      </div>
                      {sub.feedback && (
                        <div className="p-4 rounded-xl bg-[#5A270F] text-[#EEB38C] text-xs font-medium italic border-l-4 border-[#DF8142]">
                          <p className="text-[8px] font-black uppercase tracking-widest text-[#DF8142] mb-1">
                            System_Critique:
                          </p>
                          {sub.feedback}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center opacity-30 italic text-xs uppercase tracking-widest">
                    No signals transmitted.
                  </div>
                )}
              </div>
            </div>

            {/* Upload Panel */}
            <div
              className={`bg-[#5A270F] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl ${isPastDeadline ? "opacity-50 grayscale" : ""}`}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#DF8142]/10 blur-[100px] rounded-full" />
              <div className="relative z-10 space-y-10">
                <div className="space-y-4">
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic">
                    Signal_Uplink
                  </h2>
                  {!isPastDeadline && (
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#EEB38C]/60">
                      Transmit architectural artifacts to lead node
                    </p>
                  )}
                </div>

                {isPastDeadline ? (
                  <div className="py-10 text-center space-y-4">
                    <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
                    <p className="text-sm font-black uppercase tracking-widest">
                      Nexus_Barrier_Active // Deadline_Passed
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                      <input
                        type="file"
                        title="Select Data Shard Artifact"
                        aria-label="Upload Submission"
                        onChange={(e) =>
                          setSubmissionFile(e.target.files?.[0] || null)
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      />
                      <div className="p-10 border-2 border-dashed border-[#EEB38C]/30 rounded-3xl text-center group-hover:border-[#DF8142] transition-colors">
                        <Layers className="h-10 w-10 text-[#EEB38C] mx-auto mb-4" />
                        <p className="text-[11px] font-black uppercase tracking-widest">
                          {submissionFile
                            ? submissionFile.name
                            : "Select_Data_Shard"}
                        </p>
                      </div>
                    </div>

                    {assignment.allow_progress_updates && (
                      <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
                        <Select
                          label="Transmission Protocol"
                          value={submissionType}
                          options={[
                            { id: "progress", name: "Progress_Sync" },
                            { id: "final", name: "Final_Signal" },
                          ]}
                          onChange={setSubmissionType}
                          className="dark-select"
                        />
                      </div>
                    )}

                    <button
                      disabled={!submissionFile || submitting}
                      title="Initiate Project Uplink"
                      className="w-full py-5 bg-[#DF8142] rounded-2xl font-black uppercase tracking-[0.5em] text-[12px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
                    >
                      {submitting ? "Transmitting..." : "Initiate_Uplink"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── FACULTY REVIEW MATRIX ──────────────────────── */}
        {isCreatorOrAdmin &&
          assignment.submissions &&
          assignment.submissions.length > 0 && (
            <div className="bg-white dark:bg-[#1A0B04] rounded-[3rem] border-2 border-[#92664A]/10 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10">
              <div className="p-10 border-b border-[#92664A]/10 bg-[#EEB38C]/5">
                <h2 className="text-2xl font-black text-[#5A270F] dark:text-white uppercase tracking-tighter italic flex items-center gap-4">
                  <Layers className="h-7 w-7 text-[#DF8142]" />{" "}
                  Submission_Matrix
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#5A270F] text-white text-[9px] font-black uppercase tracking-[0.4em]">
                      <th className="px-10 py-6">Signal_Origin</th>
                      <th className="px-10 py-6">Timestamp</th>
                      <th className="px-10 py-6">Protocol_Type</th>
                      <th className="px-10 py-6 text-right">Synchronization</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#92664A]/10">
                    {assignment.submissions.map((sub) => (
                      <tr
                        key={sub.id}
                        className="hover:bg-[#EEB38C]/5 transition-colors"
                      >
                        <td className="px-10 py-6 font-black text-sm text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-widest italic">
                          {sub.student?.first_name} {sub.student?.last_name}
                        </td>
                        <td className="px-10 py-6 text-[11px] font-bold text-[#92664A]">
                          {new Date(sub.submitted_at).toLocaleString()}
                        </td>
                        <td className="px-10 py-6">
                          <span
                            className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${sub.submission_type === "final" ? "bg-[#DF8142] text-white" : "bg-[#EEB38C]/20 text-[#5A270F] dark:text-[#EEB38C]"}`}
                          >
                            {sub.submission_type}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right space-x-3 whitespace-nowrap">
                          <a
                            href={`${import.meta.env.VITE_API_URL}/assignments/submissions/${sub.id}/view?token=${encodeURIComponent(localStorage.getItem("token") || "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View Student Artifact"
                            className="p-3 bg-white dark:bg-white/5 border border-[#92664A]/30 rounded-xl inline-flex text-[#5A270F] dark:text-[#EEB38C] hover:text-[#DF8142] hover:scale-110 transition-all"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() => {
                              setActiveFeedbackId(sub.id);
                              setFeedbackText(sub.feedback || "");
                            }}
                            title="Provide Project Critique"
                            className="px-5 py-2.5 bg-[#5A270F] text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-[#6C3B1C] transition-all"
                          >
                            Critique
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {/* Critique Modal Overlay */}
        {activeFeedbackId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-[#5A270F]/80 backdrop-blur-sm"
              onClick={() => setActiveFeedbackId(null)}
            />
            <div className="relative w-full max-w-lg bg-white dark:bg-[#1A0B04] rounded-[2.5rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#5A270F] dark:text-white uppercase tracking-tighter italic">
                  Constructive_Critique
                </h3>
                <p className="text-[10px] font-black text-[#92664A] uppercase tracking-[0.4em]">
                  Synchronizing instructional feedback for data shard
                </p>
              </div>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full h-40 bg-[#EEB38C]/5 dark:bg-black/40 border-2 border-[#92664A]/20 rounded-2xl p-5 text-sm font-medium text-[#5A270F] dark:text-white outline-none focus:border-[#DF8142] transition-colors"
                placeholder="Synchronize critique..."
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveFeedbackId(null)}
                  title="Abort Critique Protocol"
                  className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-[#92664A] hover:bg-[#EEB38C]/10 rounded-xl transition-all"
                >
                  Abort
                </button>
                <button
                  onClick={() => handleSubmitFeedback(activeFeedbackId)}
                  title="Synchronize Feedback Shard"
                  className="flex-1 py-4 bg-[#DF8142] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-[#DF8142]/20 hover:scale-105 transition-all"
                >
                  Synchronize
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Metadata */}
        <div className="bg-white dark:bg-[#1A0B04] rounded-[2.5rem] p-10 border-2 border-[#92664A]/10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="h-14 w-14 rounded-2xl bg-[#EEB38C]/10 flex items-center justify-center text-[#DF8142]">
              <Info className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#5A270F] dark:text-white uppercase tracking-widest">
                Nexus_Protocols
              </h4>
              <p className="text-[10px] font-medium text-[#92664A] dark:text-[#EEB38C]/40">
                Internal academic synchronization module // Restricted access
              </p>
            </div>
          </div>
          <div className="text-[40px] font-black text-[#5A270F]/5 dark:text-white/5 select-none font-space-grotesk tracking-tighter">
            ARCH_NEXUS_V2.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetails;
