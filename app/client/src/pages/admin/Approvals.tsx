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
  MessageSquare,
  ShieldAlert,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "../../lib/toast";

import { useSession } from "../../lib/auth-client";

const Approvals = () => {
  const { data: session } = useSession();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const user = session?.user as any;
  const role = typeof user?.role === "object" ? user.role.name : user?.role;
  const isAuthorized = role === "DepartmentHead";

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
    status: "approved" | "rejected",
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
        } successfully`,
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
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-6">
        <div className="relative">
          <div className="h-20 w-20 border-4 border-[#D9D9C2] dark:border-white/10 border-t-[#DF8142] rounded-full animate-spin" />
          <Loader2 className="h-10 w-10 text-[#DF8142] animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-[11px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.5em] animate-pulse">
          Synchronizing Queue...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-4">
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 bg-[#5A270F] rounded-[1.5rem] flex items-center justify-center text-[#EEB38C] shadow-2xl rotate-3">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter uppercase italic">
              Verification <span className="not-italic text-[#DF8142]">Hub</span>
            </h1>
            <p className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/60 uppercase tracking-[0.5em]">
              Nexus Deployment Authority Queue
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 px-8 py-4 bg-white dark:bg-[#1A0B04] rounded-2xl border border-[#D9D9C2] dark:border-[#DF8142]/20 shadow-xl">
           <Zap className="h-5 w-5 text-[#DF8142] animate-pulse" />
           <span className="text-[11px] font-black uppercase tracking-widest text-[#5A270F] dark:text-[#EEB38C]">
            {resources.length} Pending Units
           </span>
        </div>
      </div>

      {resources.length > 0 ? (
        <div className="grid grid-cols-1 gap-10">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="group relative bg-white dark:bg-[#1A0B04] rounded-[3.5rem] border border-[#D9D9C2] dark:border-[#DF8142]/20 shadow-2xl shadow-[#5A270F]/5 overflow-hidden transition-all duration-700 hover:border-[#DF8142]/40"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#DF8142]/10 to-transparent blur-[80px] group-hover:from-[#DF8142]/20 transition-all duration-1000" />
              
              <div className="p-10 lg:p-14 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12 mb-12">
                  <div className="space-y-6 flex-grow">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="px-4 py-1.5 bg-[#5A270F] text-[#EEB38C] text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg">
                        {(resource as { type?: string; fileType?: string }).type || (resource as { type?: string; fileType?: string }).fileType || "Artifact"}
                      </span>
                      <div className="h-1.5 w-1.5 rounded-full bg-[#DF8142]" />
                      <span className="flex items-center gap-2 text-[10px] text-[#92664A] dark:text-[#EEB38C]/60 font-black uppercase tracking-widest">
                        <Clock className="h-3.5 w-3.5" />
                        Queued: {new Date(resource.uploadedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <Link
                      to={`/admin/resources/${resource.id}`}
                      className="block text-4xl lg:text-5xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter hover:text-[#DF8142] transition-colors leading-[0.85] uppercase italic"
                    >
                      {resource.title}
                    </Link>

                    <div className="flex items-center gap-4 p-4 bg-[#EFEDED] dark:bg-white/5 rounded-2xl border border-[#D9D9C2] dark:border-white/10 w-fit group-hover:bg-[#DF8142]/5 transition-colors duration-500">
                      <div className="h-10 w-10 bg-white dark:bg-card border border-[#D9D9C2] dark:border-white/10 rounded-xl flex items-center justify-center text-[#DF8142] shadow-sm">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-[#92664A] dark:text-[#EEB38C]/60 uppercase tracking-widest leading-none mb-1">Origin Node</p>
                        <p className="text-sm font-black text-[#5A270F] dark:text-[#EEB38C]">
                          {(resource.uploader as { firstName?: string }).firstName} {(resource.uploader as { lastName?: string }).lastName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 min-w-[200px]">
                    <a
                      href={`${import.meta.env.VITE_API_URL}/resources/${resource.id}/view?token=${encodeURIComponent(localStorage.getItem("token") || "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="h-16 flex items-center justify-center gap-4 px-8 bg-white dark:bg-card border-2 border-[#D9D9C2] dark:border-white/10 text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl text-[#5A270F] dark:text-[#EEB38C] hover:border-[#DF8142] hover:text-[#DF8142] transition-all active:scale-95 shadow-lg"
                    >
                      <Eye className="h-5 w-5" /> Inspect Matrix
                    </a>
                  </div>
                </div>

                {/* Directive Input */}
                <div className="space-y-3 mb-12">
                  <label className="text-[11px] font-black text-[#5A270F] dark:text-[#EEB38C]/70 uppercase tracking-[0.25em] ml-1 flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5 text-[#DF8142]" /> Operations Directive
                  </label>
                  <textarea
                    placeholder="Enter optional verification notes or sequestration reason for the user node..."
                    className="w-full px-8 py-6 bg-[#EFEDED] dark:bg-white/5 border border-[#D9D9C2] dark:border-white/10 rounded-[2.5rem] text-sm font-bold text-[#5A270F] dark:text-white focus:border-[#DF8142] focus:ring-4 focus:ring-[#DF8142]/5 transition-all outline-none resize-none min-h-[120px] placeholder:text-[#92664A] dark:placeholder:text-[#EEB38C]/30 shadow-inner"
                    value={comments[resource.id] || ""}
                    onChange={(e) => handleCommentChange(resource.id, e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-6 items-center pt-10 border-t border-[#D9D9C2] dark:border-white/10">
                  <div className="flex items-center gap-3 text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/60 uppercase tracking-[0.3em] flex-1">
                    <div className="h-2 w-2 rounded-full bg-[#DF8142] animate-pulse" />
                    Review Protocol: Node #ID-{resource.id}
                  </div>
                  <div className="flex gap-4 w-full sm:w-auto">
                    {isAuthorized ? (
                      <>
                        <button
                          onClick={() => handleDecision(resource.id, "rejected")}
                          className="flex-1 sm:flex-none h-16 px-10 bg-[#EFEDED] dark:bg-white/5 border-2 border-transparent hover:border-rose-500/30 text-[11px] font-black uppercase tracking-[0.3em] rounded-[1.5rem] text-[#5A270F] dark:text-[#EEB38C]/60 hover:text-rose-600 dark:hover:text-rose-400 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                          <X className="h-5 w-5" /> Sequester
                        </button>
                        <button
                          onClick={() => handleDecision(resource.id, "approved")}
                          className="flex-1 sm:flex-none h-16 px-12 bg-[#5A270F] text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-[1.5rem] hover:bg-[#1A0B04] hover:scale-[1.02] transition-all shadow-2xl shadow-[#5A270F]/30 active:scale-95 flex items-center justify-center gap-3"
                        >
                          <Check className="h-5 w-5" /> Verify & Deploy
                        </button>
                      </>
                    ) : (
                       <div className="flex items-center gap-2 px-6 py-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900/30">
                        <ShieldAlert className="h-4 w-4 text-amber-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">Limited Authorization</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white dark:bg-[#1A0B04] rounded-[4rem] border border-[#D9D9C2] dark:border-[#DF8142]/20 shadow-2xl transition-all duration-700 group hover:border-[#DF8142]/40">
           <div className="relative inline-block mb-10">
            <div className="absolute -inset-6 bg-[#DF8142]/10 rounded-full blur-2xl animate-pulse" />
            <div className="relative h-24 w-24 bg-[#5A270F] rounded-[2.5rem] flex items-center justify-center text-[#EEB38C] shadow-2xl rotate-3">
              <CheckSquare className="h-12 w-12" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tight uppercase leading-none mb-4 italic">
            Registry <span className="text-[#DF8142] not-italic">Synchronized</span>
          </h3>
          <p className="text-[11px] text-[#92664A] dark:text-[#EEB38C]/60 font-black uppercase tracking-[0.5em] max-w-sm mx-auto">
            No pending units detected in the verification queue.
          </p>
        </div>
      )}
    </div>
  );
};

export default Approvals;
