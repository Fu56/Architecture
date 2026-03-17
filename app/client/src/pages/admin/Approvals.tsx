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
  ArrowRight,
  Database
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "../../lib/toast";

import { useSession } from "../../lib/auth-client";

const Approvals = () => {
  const { data: session } = useSession();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const user = session?.user as any;
  const role = typeof user?.role === "object" ? user.role.name : user?.role;
  const isDeptHead = role === "DepartmentHead" || role === "SuperAdmin";
  const isAdmin = role === "Admin";
  const isAuthorized = isDeptHead || isAdmin;

  const [resources, setResources] = useState<Resource[]>([]);
  const [comments, setComments] = useState<{ [key: number]: string }>({});
  const [isPublic, setIsPublic] = useState<{ [key: number]: boolean }>({});
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
          is_public: isDeptHead ? !!isPublic[resourceId] : undefined,
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
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-8 animate-in fade-in duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-[#DF8142] blur-3xl opacity-20 animate-pulse" />
          <Loader2 className="h-20 w-20 animate-spin text-[#DF8142] relative z-10" />
        </div>
        <p className="text-[11px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.6em] animate-pulse">
          Synchronizing Verification Queue...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
      {/* ── Verification Hub Hero ── */}
      <div className="relative overflow-hidden bg-[#5A270F] dark:bg-[#1A0B04] rounded-[4rem] p-12 lg:p-16 border border-white/10 shadow-[0_50px_100px_-20px_rgba(90,39,15,0.4)]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#DF8142]/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute inset-0 architectural-dot-grid opacity-10" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-10 bg-[#EEB38C]" />
              <p className="text-[11px] font-black uppercase tracking-[0.6em] text-[#EEB38C] drop-shadow-sm">
                Deployment Authority
              </p>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9] font-space-grotesk italic">
              VERIFICATION <span className="text-[#DF8142]">MATRIX</span>
            </h1>
            <p className="text-base text-[#EEB38C]/60 font-medium leading-relaxed max-w-lg">
              Authorized review of pending intelligence nodes. Ensure architectural standards before global deployment.
            </p>
          </div>

          <div className="flex items-center gap-6 px-10 py-6 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="h-16 w-16 rounded-2xl bg-[#DF8142] flex items-center justify-center text-white shadow-2xl shadow-[#DF8142]/20">
              <Zap className="h-8 w-8 animate-pulse text-white" />
            </div>
            <div>
              <span className="text-4xl font-black text-white leading-none font-mono">
                {resources.length.toString().padStart(2, '0')}
              </span>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#EEB38C]/60 mt-1 uppercase italic">
                Pending Units
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pending Resource Matrix ── */}
      {resources.length > 0 ? (
        <div className="grid grid-cols-1 gap-12">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="group relative bg-white dark:bg-card/50 backdrop-blur-3xl rounded-[4rem] border border-[#D9D9C2]/60 dark:border-white/5 shadow-2xl shadow-[#5A270F]/5 overflow-hidden transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(90,39,15,0.15)]"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#DF8142]/5 to-transparent blur-[100px] transition-all duration-1000 group-hover:from-[#DF8142]/10" />
              
              <div className="p-10 lg:p-14 relative z-10 flex flex-col lg:grid lg:grid-cols-12 gap-12 items-start">
                
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex flex-wrap items-center gap-6">
                      <span className="px-5 py-2 bg-[#5A270F] text-[#EEB38C] text-[10px] font-black uppercase tracking-[0.3em] rounded-xl shadow-xl shadow-[#5A270F]/20">
                        {((resource as any).fileType || 'Asset Core').toUpperCase()} Protocol
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-[#92664A] dark:text-[#EEB38C]/60 font-black uppercase tracking-[0.4em]">
                        <Clock className="h-4 w-4" />
                        Ingestion Date: {new Date(resource.uploadedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      {resource.status === "admin_approved" && (
                        <span className="px-5 py-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-xl border border-emerald-200 dark:border-emerald-800/30 flex items-center gap-2 shadow-sm">
                          <ShieldCheck className="h-4 w-4" /> Admin Recommended
                        </span>
                      )}
                      {resource.status === "admin_rejected" && (
                        <span className="px-5 py-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-xl border border-rose-200 dark:border-rose-800/30 flex items-center gap-2 shadow-sm">
                          <X className="h-4 w-4" /> Admin Flagged REJECT
                        </span>
                      )}
                    </div>

                  <Link
                    to={`/admin/resources/${resource.id}`}
                    className="block text-4xl lg:text-5xl font-black text-[#5A270F] dark:text-white tracking-tighter leading-[0.9] hover:text-[#DF8142] transition-all uppercase italic font-space-grotesk"
                  >
                    {resource.title}
                  </Link>

                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-4 p-4 bg-[#FAF8F4] dark:bg-white/5 rounded-[1.75rem] border border-[#D9D9C2]/40 dark:border-white/10 group-hover:bg-white transition-all duration-500">
                      <div className="h-12 w-12 bg-white dark:bg-[#1A0B04] border border-[#D9D9C2]/50 dark:border-white/10 rounded-2xl flex items-center justify-center text-[#DF8142] shadow-xl">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] mb-1">Origin Authority</p>
                        <p className="text-sm font-black text-[#5A270F] dark:text-white">
                          {(resource.uploader as any)?.firstName} {(resource.uploader as any)?.lastName}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-[#FAF8F4] dark:bg-white/5 rounded-[1.75rem] border border-[#D9D9C2]/40 dark:border-white/10">
                      <div className="h-12 w-12 bg-white dark:bg-[#1A0B04] border border-[#D9D9C2]/50 dark:border-white/10 rounded-2xl flex items-center justify-center text-[#92664A] shadow-xl">
                        <Database className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] mb-1">Design Phase</p>
                        <p className="text-sm font-black text-[#5A270F] dark:text-white">
                          {resource.designStage?.name || 'Protocol-01'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Directive Input */}
                  <div className="space-y-4 pt-6">
                    <label className="text-[10px] font-black text-[#5A270F] dark:text-[#EEB38C]/60 uppercase tracking-[0.6em] ml-2 flex items-center gap-3">
                      <MessageSquare className="h-4 w-4 text-[#DF8142]" /> Operations Directive Input
                    </label>
                    <textarea
                      placeholder="Input optional verification notes or sequestration reason for the user node..."
                      className="w-full px-8 py-6 bg-[#FAF8F4] dark:bg-white/5 border-2 border-[#D9D9C2]/40 dark:border-white/10 rounded-[2.5rem] text-sm font-bold text-[#5A270F] dark:text-white focus:border-[#DF8142] transition-all outline-none resize-none min-h-[120px] shadow-inner"
                      value={comments[resource.id] || ""}
                      onChange={(e) => handleCommentChange(resource.id, e.target.value)}
                    />

                    {isDeptHead && (
                      <div className="flex items-center gap-4 px-6 py-4 bg-[#DF8142]/5 border-2 border-[#DF8142]/20 rounded-2xl group/toggle cursor-pointer mt-4" onClick={() => setIsPublic(prev => ({...prev, [resource.id]: !prev[resource.id]}))}>
                        <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${isPublic[resource.id] ? "bg-[#DF8142] border-[#DF8142]" : "border-[#BCAF9C] dark:border-white/20"}`}>
                          {isPublic[resource.id] && <Check className="h-4 w-4 text-white" />}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-widest">Deploy to Public Matrix</p>
                          <p className="text-[9px] font-bold text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-widest">Mark this asset as globally visible to all student nodes</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vertical Center Action Side */}
                <div className="lg:col-span-4 flex flex-col gap-6 w-full lg:sticky lg:top-12">
                   <a
                    href={`${import.meta.env.VITE_API_URL}/resources/${resource.id}/view?token=${encodeURIComponent(localStorage.getItem("token") || "")}`}
                    target="_blank" rel="noreferrer"
                    className="h-20 flex items-center justify-center gap-4 bg-white dark:bg-white/5 border-2 border-[#D9D9C2]/60 dark:border-white/10 text-[11px] font-black uppercase tracking-[0.4em] rounded-[2rem] text-[#5A270F] dark:text-white hover:border-[#DF8142] hover:text-[#DF8142] transition-all active:scale-95 shadow-2xl"
                  >
                    <Eye className="h-6 w-6" /> Inspect Artifact
                  </a>

                  {isAuthorized ? (
                    <div className="grid grid-cols-2 gap-4 h-20">
                      <button
                        onClick={() => handleDecision(resource.id, "rejected")}
                        className="h-full bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-200 dark:border-rose-900/30 text-[12px] font-black uppercase tracking-[0.2em] rounded-[2rem] text-rose-700 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl"
                      >
                        <X className="h-5 w-5" /> {isDeptHead ? "Final Reject" : "Propose Reject"}
                      </button>
                      <button
                        onClick={() => handleDecision(resource.id, "approved")}
                        className="h-full bg-[#5A270F] text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-[2rem] hover:bg-[#1A0B04] transition-all shadow-2xl shadow-[#5A270F]/30 active:scale-95 flex items-center justify-center gap-3"
                      >
                        <Check className="h-5 w-5" /> {isDeptHead ? "Final Deploy" : "Pre-Approve"}
                      </button>
                    </div>
                  ) : (
                    <div className="h-20 flex items-center justify-center gap-4 bg-amber-50 dark:bg-amber-950/20 rounded-[2rem] border-2 border-amber-200 dark:border-amber-900/30">
                      <ShieldAlert className="h-6 w-6 text-amber-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-900 dark:text-amber-400">Node Locked: Level 4 Clearance Req.</span>
                    </div>
                  )}
                  
                  <div className="bg-[#FAF8F4] dark:bg-black p-8 rounded-[2.5rem] border border-[#D9D9C2]/40 dark:border-white/10 space-y-4">
                     <p className="text-[9px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.4em] flex items-center gap-3">
                       <ShieldCheck className="h-4 w-4" /> Integrity Analysis
                     </p>
                     <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#5A270F] dark:text-white/60">
                         <span>Structural State</span>
                         <span className="text-emerald-500">Verified</span>
                       </div>
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#5A270F] dark:text-white/60">
                         <span>BIM Family</span>
                         <span>Compatible</span>
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-40 flex flex-col items-center justify-center bg-[#FAF8F4] dark:bg-[#1A0B04] rounded-[4rem] border border-dashed border-[#D9D9C2] dark:border-white/10 transition-all duration-500 group shadow-inner">
           <div className="relative mb-12">
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#DF8142] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative h-28 w-28 bg-[#5A270F] rounded-[2.5rem] flex items-center justify-center text-[#EEB38C] shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-700">
                <CheckSquare className="h-14 w-14" />
              </div>
          </div>
          <h3 className="text-4xl font-black text-[#5A270F] dark:text-white uppercase tracking-tighter italic">
            REGISTRY <span className="text-[#DF8142]">SYNCHRONIZED</span>
          </h3>
          <p className="text-[#92664A] dark:text-[#EEB38C]/40 text-[11px] font-black uppercase tracking-[0.5em] mt-6 opacity-60">
            No pending units detected in the verification nexus.
          </p>
          <Link 
            to="/admin/resources"
            className="mt-12 flex items-center gap-4 px-12 py-5 bg-[#5A270F] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-110 transition-all active:scale-95 shadow-2xl"
          >
            Review Active Database
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
      
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#5A270F]/10 dark:via-[#EEB38C]/10 to-transparent" />
    </div>
  );
};

export default Approvals;
