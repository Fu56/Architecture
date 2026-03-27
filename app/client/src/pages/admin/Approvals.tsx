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
  ArrowRight,
  Database,
  FileScan,
  MessageSquare,
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
      toast.error("Protocol Error: Status Synchronization Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (
    resourceId: number,
    status: "approved" | "rejected",
  ) => {
    const feedback = comments[resourceId] || "";
    setResources(resources.filter((r) => r.id !== resourceId));
    try {
      if (status === "approved") {
        await api.patch(`/admin/resources/${resourceId}/approve`, {
          comment: feedback,
          is_public: isDeptHead
            ? isPublic[resourceId] !== undefined
              ? !!isPublic[resourceId]
              : true
            : undefined,
        });
      } else {
        await api.patch(`/admin/resources/${resourceId}/reject`, {
          reason: feedback,
        });
      }
      toast.success(
        `Asset ${status === "approved" ? "Verified" : "Sequestered"} Successfully`,
      );
    } catch (err) {
      console.error(`Failed to set status to ${status}:`, err);
      toast.error(`Verification Breach: Failed to ${status} asset`);
      fetchPendingResources();
    }
  };

  const handleCommentChange = (resourceId: number, value: string) => {
    setComments((prev) => ({ ...prev, [resourceId]: value }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6 animate-in fade-in duration-1000">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-2 border-[#DF8142]/10 border-t-[#DF8142] animate-spin" />
          <Loader2 className="absolute inset-0 m-auto h-6 w-6 text-[#DF8142] animate-pulse" />
        </div>
        <p className="text-[9px] font-black text-[#5A270F] dark:text-[#EEB38C]/40 uppercase tracking-[1em]">
          Initializing Matrix...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 animate-in slide-in-from-bottom-4 duration-1000">
      {/* ── Compact Verification Header ── */}
      <div className="relative h-32 md:h-36 flex items-center px-8 lg:px-10 overflow-hidden bg-[#5A270F] rounded-[2rem] group border border-white/5 shadow-2xl shadow-[#5A270F]/20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5A270F] to-[#6C3B1C] transition-all duration-1000 group-hover:scale-105" />
        <div className="absolute right-0 top-0 w-2/3 h-full bg-gradient-to-l from-[#DF8142]/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute inset-0 opacity-[0.03] architectural-grid" />

        <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between items-start gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="h-[1.5px] w-6 bg-[#DF8142] shadow-[0_0_10px_#DF8142]" />
              <p className="text-[8px] font-black text-[#EEB38C] uppercase tracking-[0.5em]">
                ADMINISTRATIVE NEXUS
              </p>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight uppercase font-space-grotesk leading-none italic">
              VERIFICATION <span className="text-[#DF8142]">MATRIX</span>
            </h1>
            <p className="text-[9px] lg:text-[10px] text-[#EEB38C]/60 font-medium max-w-lg leading-relaxed uppercase tracking-wider">
              Diagnostic overview of pending architectural intelligence nodes.
              authorize global deployment protocols.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-black/40 backdrop-blur-2xl px-6 py-3 rounded-[1.5rem] border border-white/10 shadow-xl">
            <div className="relative">
              <Zap className="h-5 w-5 text-[#DF8142] relative z-10" />
            </div>
            <div>
              <span className="text-xl font-black text-white leading-none font-mono block">
                {resources.length.toString().padStart(2, "0")}
              </span>
              <p className="text-[6px] font-black text-[#EEB38C]/40 uppercase tracking-[0.4em] mt-0.5">
                PENDING UNITS
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Unified Workspace ── */}
      {resources.length > 0 ? (
        <div className="space-y-8">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="group relative bg-[#FDFCFB] dark:bg-[#0F0602] rounded-[2rem] border border-[#BCAF9C]/20 dark:border-white/5 shadow-lg overflow-hidden hover:border-[#DF8142]/40 transition-all duration-700"
            >
              <div className="absolute top-0 right-0 w-[200px] h-full bg-[#DF8142]/5 blur-3xl -z-10 transition-all duration-1000 group-hover:bg-[#DF8142]/10" />

              <div className="p-6 lg:p-8 lg:grid lg:grid-cols-12 gap-8">
                {/* ── Resource Metadata ── */}
                <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-1 bg-[#5A270F] text-[#EEB38C] rounded-lg shadow-md border border-white/5 group/proto hover:-translate-y-0.5 transition-all">
                        <FileScan className="h-3 w-3 animate-pulse text-[#DF8142]" />
                        <span className="text-[8px] font-black uppercase tracking-[0.1em]">
                          {(
                            (resource as any).fileType || "Asset"
                          ).toUpperCase()}{" "}
                          <span className="text-white/40 italic ml-2">
                            PR-0{(resource.id % 9) + 1}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[7px] text-[#5A270F]/50 dark:text-[#EEB38C]/40 font-black uppercase tracking-[0.2em]">
                        <Clock className="h-3 w-3 text-[#DF8142]" />
                        {new Date(resource.uploadedAt).toLocaleDateString(
                          undefined,
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </div>

                      {resource.status.includes("approved") && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded-md text-[7px] font-black uppercase tracking-widest border border-emerald-500/10">
                          <ShieldCheck className="h-2.5 w-2.5" /> ANALYZED
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/admin/resources/${resource.id}`}
                      className="block text-xl lg:text-2xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tight leading-tight hover:text-[#DF8142] transition-colors font-space-grotesk uppercase italic"
                    >
                      {resource.title}
                    </Link>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-3 p-2.5 bg-[#6C3B1C]/5 dark:bg-white/5 rounded-xl border border-[#6C3B1C]/10 dark:border-white/10 group/item hover:bg-white dark:hover:bg-[#1A0B04] transition-all duration-500 shadow-sm">
                        <div className="h-7 w-7 bg-[#5A270F] text-[#EEB38C] rounded-md flex items-center justify-center shadow-lg group-hover/item:scale-105 transition-transform">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="text-[6px] font-black text-[#6C3B1C]/60 dark:text-[#EEB38C]/40 uppercase tracking-[0.3em] mb-0.5">
                            AUTHORITY
                          </p>
                          <p className="text-[9px] font-black text-[#5A270F] dark:text-white uppercase tracking-tight">
                            {(resource.uploader as any)?.firstName}{" "}
                            {(resource.uploader as any)?.lastName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-2.5 bg-[#6C3B1C]/5 dark:bg-white/5 rounded-xl border border-[#6C3B1C]/10 dark:border-white/10 group/item hover:bg-white dark:hover:bg-[#1A0B04] transition-all duration-500 shadow-sm">
                        <div className="h-7 w-7 bg-[#6C3B1C] text-[#EEB38C] rounded-md flex items-center justify-center shadow-lg group-hover/item:scale-105 transition-transform">
                          <Database className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="text-[6px] font-black text-[#6C3B1C]/60 dark:text-[#EEB38C]/40 uppercase tracking-[0.3em] mb-0.5">
                            STATION
                          </p>
                          <p className="text-[9px] font-black text-[#5A270F] dark:text-white uppercase tracking-tight">
                            {resource.designStage?.name || "CORE"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verification Directive */}
                  <div className="pt-4 border-t border-[#BCAF9C]/20 dark:border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[8px] font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-[0.5em] flex items-center gap-2">
                        <MessageSquare className="h-3 w-3 text-[#DF8142]" />{" "}
                        DIRECTIVE
                      </label>
                      {isDeptHead && (
                        <div
                          onClick={() =>
                            setIsPublic((prev) => ({
                              ...prev,
                              [resource.id]:
                                prev[resource.id] === undefined
                                  ? false
                                  : !prev[resource.id],
                            }))
                          }
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all border ${isPublic[resource.id] !== false ? "bg-[#DF8142]/10 border-[#DF8142] text-[#DF8142]" : "bg-[#FDFCFB] border-[#BCAF9C]/20 text-[#5A270F]/40"}`}
                        >
                          <div
                            className={`h-3 w-3 rounded border flex items-center justify-center ${isPublic[resource.id] !== false ? "border-[#DF8142] bg-[#DF8142] shadow-[0_0_8px_#DF8142]" : "border-[#BCAF9C]/40"}`}
                          >
                            {isPublic[resource.id] !== false && (
                              <Check className="h-2 w-2 text-white" />
                            )}
                          </div>
                          <span className="text-[8px] font-black uppercase tracking-tight">
                            Public Access
                          </span>
                        </div>
                      )}
                    </div>
                    <textarea
                      placeholder="ADMINISTRATIVE NOTES..."
                      className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-[#BCAF9C]/10 dark:border-white/5 rounded-xl text-[10px] font-bold text-[#5A270F] dark:text-white placeholder-[#5A270F]/20 focus:border-[#DF8142] transition-all outline-none resize-none min-h-[80px] shadow-inner uppercase tracking-wider italic"
                      value={comments[resource.id] || ""}
                      onChange={(e) =>
                        handleCommentChange(resource.id, e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* ── Compact Controls ── */}
                <div className="lg:col-span-4 mt-6 lg:mt-0 flex flex-col gap-4 lg:sticky lg:top-10">
                  <div className="bg-[#5A270F] dark:bg-black p-6 rounded-[2rem] border border-white/5 shadow-2xl shadow-[#5A270F]/30 space-y-4 relative overflow-hidden group/card">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#DF8142]/10 blur-3xl rounded-full" />
                    <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
                      <ShieldCheck className="h-4 w-4 text-[#DF8142] animate-pulse" />
                      <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">
                        DATA TELEMETRY
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center group/log">
                        <span className="text-[7px] font-black text-[#EEB38C]/50 uppercase tracking-widest">
                          STRUCTURE
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md text-[7px] font-black tracking-[0.1em] border border-emerald-500/10 hover:scale-105 transition-transform">
                          VERIFIED
                        </span>
                      </div>
                      <div className="flex justify-between items-center group/log">
                        <span className="text-[7px] font-black text-[#EEB38C]/50 uppercase tracking-widest">
                          CLEARANCE
                        </span>
                        <span className="text-[8px] font-black text-white block uppercase italic tracking-widest">
                          ARCH-LEVEL
                        </span>
                      </div>
                      <div className="flex justify-between items-center group/log">
                        <span className="text-[7px] font-black text-[#EEB38C]/50 uppercase tracking-widest">
                          BIM MATCH
                        </span>
                        <span className="text-emerald-400 font-mono text-[9px]">
                          98.4%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <a
                      href={`${import.meta.env.VITE_API_URL}/resources/${resource.id}/view?token=${encodeURIComponent(localStorage.getItem("token") || "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="h-10 flex items-center justify-center gap-2.5 bg-white dark:bg-white/5 border border-[#BCAF9C]/20 dark:border-white/10 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-[#5A270F] dark:text-[#EEB38C] hover:bg-[#5A270F] hover:text-white transition-all shadow-md group/view"
                    >
                      <Eye className="h-4 w-4" /> View Resources
                    </a>

                    <div className="grid grid-cols-2 gap-2 h-10">
                      <button
                        onClick={() => handleDecision(resource.id, "rejected")}
                        className="bg-[#92664A] text-white text-[8px] font-black uppercase tracking-[0.1em] rounded-xl hover:bg-rose-700 transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                      >
                        <X className="h-3.5 w-3.5" />{" "}
                        {isDeptHead ? "REJECT" : "PROPOSE"}
                      </button>
                      <button
                        onClick={() => handleDecision(resource.id, "approved")}
                        className="bg-[#5A270F] text-white text-[8px] font-black uppercase tracking-[0.1em] rounded-xl hover:bg-[#DF8142] transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#5A270F]/20 active:scale-95"
                      >
                        <Check className="h-3.5 w-3.5" />{" "}
                        {isDeptHead ? "APPROVE" : "APPROVE"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center bg-[#FDFCFB] dark:bg-[#1A0B04] rounded-[3rem] border-2 border-dashed border-[#BCAF9C]/20 relative overflow-hidden group">
          <div className="absolute inset-0 architectural-dot-grid opacity-5" />
          <div className="relative mb-12">
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#DF8142] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="h-20 w-20 bg-[#5A270F] rounded-[2rem] flex items-center justify-center text-[#EEB38C] shadow-2xl shadow-[#5A270F]/40 rotate-12 group-hover:rotate-0 transition-all duration-1000 border-2 border-white/5">
              <CheckSquare className="h-8 w-8" />
            </div>
          </div>
          <h3 className="text-2xl lg:text-4xl font-black text-[#5A270F] dark:text-white uppercase tracking-tighter italic font-space-grotesk text-center">
            REGISTRY <br /> <span className="text-[#DF8142]">SYNCHRONIZED</span>
          </h3>
          <p className="text-[#92664A] dark:text-[#EEB38C]/40 text-[8px] font-black uppercase tracking-[0.6em] mt-8 text-center text-opacity-60">
            NO PENDING TELEMETRY DETECTED
          </p>
          <Link
            to="/admin/resources"
            className="mt-10 flex items-center gap-4 px-8 py-4 bg-[#5A270F] text-white rounded-xl text-[9px] font-black uppercase tracking-[0.1em] hover:bg-[#6C3B1C] hover:scale-105 transition-all shadow-xl shadow-[#5A270F]/30"
          >
            RETURN TO DATABASE
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Approvals;
