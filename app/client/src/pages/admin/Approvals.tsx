import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import type { Resource } from "../../models";
import {
  Loader2,
  Check,
  X,
  Eye,
  CheckSquare,
  ShieldCheck,
  Clock,
  User,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Approvals = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [comments, setComments] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingResources();
  }, []);

  const fetchPendingResources = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/resources/pending");
      if (Array.isArray(data)) {
        setResources(data);
      }
    } catch (err) {
      console.error("Failed to fetch pending resources:", err);
      toast.error("Protocol Error: Failed to synchronize verification queue");
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (
    resourceId: number,
    status: "approved" | "rejected"
  ) => {
    const feedback = comments[resourceId] || "";
    // Optimistic update
    setResources(resources.filter((r) => r.id !== resourceId));
    try {
      if (status === "approved") {
        await api.patch(`/admin/resources/${resourceId}/approve`, {
          comment: feedback,
        });
      } else {
        await api.patch(`/admin/resources/${resourceId}/reject`, {
          reason: feedback,
        });
      }
      toast.success(
        `Asset ${
          status === "approved" ? "verified" : "sequestered"
        } successfully`
      );
    } catch (err) {
      console.error(`Failed to set status to ${status}:`, err);
      toast.error(`Protocol Breach: Failed to ${status} asset`);
      fetchPendingResources(); // Re-sync on failure
    }
  };

  const handleCommentChange = (resourceId: number, value: string) => {
    setComments((prev) => ({ ...prev, [resourceId]: value }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-[#D9D9C2] border-t-primary rounded-full animate-spin" />
          <Loader2 className="h-8 w-8 text-primary animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
          Synchronizing Queue...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between bg-[#EFEDED] p-6 rounded-[2.5rem] border border-[#D9D9C2]">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-[#2A1205] rounded-xl flex items-center justify-center text-white shadow-lg">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#2A1205]">
              Verification Protocol
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Awaiting Nexus Deployment
            </p>
          </div>
        </div>
        <div className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
          {resources.length} Pending Units
        </div>
      </div>

      {resources.length > 0 ? (
        <div className="space-y-8">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white p-10 rounded-[3rem] border border-[#D9D9C2] shadow-2xl shadow-slate-200/50 group transition-all duration-500 hover:border-primary/20"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#2A1205] text-white text-[9px] font-black uppercase tracking-widest rounded-lg">
                      {(resource as { type?: string; fileType?: string })
                        .type ||
                        (resource as { type?: string; fileType?: string })
                          .fileType ||
                        "Unit"}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      <Clock className="h-3 w-3" />
                      {new Date(resource.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Link
                    to={`/resources/${resource.id}`}
                    className="block text-3xl font-black text-[#2A1205] tracking-tighter hover:text-primary transition-colors"
                  >
                    {resource.title}
                  </Link>
                  <div className="flex items-center gap-4 text-xs font-medium text-[#5A270F]">
                    <div className="flex items-center gap-2 px-3 py-1 bg-[#EFEDED] rounded-full border border-[#D9D9C2]">
                      <User className="h-3.5 w-3.5 text-gray-500" />
                      <span>
                        Source:{" "}
                        <span className="font-black text-[#2A1205]">
                          {
                            (resource.uploader as { firstName?: string })
                              .firstName
                          }{" "}
                          {
                            (resource.uploader as { lastName?: string })
                              .lastName
                          }
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a
                    href={`${import.meta.env.VITE_API_URL}/resources/${
                      resource.id
                    }/view?token=${encodeURIComponent(
                      localStorage.getItem("token") || ""
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="h-14 flex items-center gap-4 px-8 bg-white border-2 border-[#D9D9C2] text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl text-[#2A1205] hover:border-primary/90 hover:text-primary transition-all active:scale-95 shadow-lg shadow-slate-100"
                  >
                    <Eye className="h-4 w-4" /> Inspect Payload
                  </a>
                </div>
              </div>

              {/* Comment Input */}
              <div className="relative mb-10">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2 block">
                  Operations Directive / Feedback
                </label>
                <textarea
                  placeholder="Enter optional verification notes or sequestration reason..."
                  className="w-full px-6 py-4 bg-[#EFEDED] border border-[#D9D9C2] rounded-[2rem] text-sm focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all outline-none resize-none min-h-[100px]"
                  value={comments[resource.id] || ""}
                  onChange={(e) =>
                    handleCommentChange(resource.id, e.target.value)
                  }
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center pt-8 border-t border-slate-50">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex-1">
                  <Zap className="h-3 w-3 text-primary/90" />
                  Review Protocol active
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => handleDecision(resource.id, "rejected")}
                    className="flex-1 sm:flex-none h-14 px-10 bg-white border-2 border-rose-100 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl text-rose-600 hover:bg-red-50 transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    <X className="h-4 w-4" /> Sequester
                  </button>
                  <button
                    onClick={() => handleDecision(resource.id, "approved")}
                    className="flex-1 sm:flex-none h-14 px-12 bg-[#2A1205] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#5A270F] transition-all hover:-translate-y-1 shadow-2xl shadow-[#2A1205]/20 active:scale-95 flex items-center justify-center gap-3"
                  >
                    <Check className="h-4 w-4" /> Verify & Deploy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-[#EFEDED] rounded-[4rem] border border-dashed border-[#D9D9C2]">
          <div className="h-24 w-24 bg-white rounded-[2.5rem] flex items-center justify-center text-[#EEB38C] mx-auto mb-8 shadow-xl">
            <CheckSquare className="h-12 w-12" />
          </div>
          <h3 className="text-2xl font-black text-[#2A1205] tracking-tight">
            Registry Synchronized
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-2 max-w-xs mx-auto uppercase tracking-widest">
            No pending units detected in the verification queue.
          </p>
        </div>
      )}
    </div>
  );
};

export default Approvals;
