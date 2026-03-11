import { useState, useEffect, useCallback } from "react";
import { api } from "../../lib/api";
import { toast } from "../../lib/toast";
import type { Resource } from "../../models";
import ResourceCard from "../../components/ui/ResourceCard";
import Filters, { type FilterState } from "../../components/ui/Filters";
import { 
  Loader2, 
  ServerCrash, 
  Library, 
  Trash2, 
  RotateCcw, 
  Search,
  BookOpen
} from "lucide-react";
import { currentRole } from "../../lib/auth";

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const role = currentRole();
  const isAuthorizedManager =
    role === "DepartmentHead" || role === "SuperAdmin";
  const [showArchived, setShowArchived] = useState(false);

  const fetchResources = useCallback(
    async (filters: FilterState = {}) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (filters.search) params.append("search", filters.search);
        if (filters.fileType) params.append("fileType", filters.fileType);
        if (filters.stage) params.append("stage", filters.stage);
        if (filters.year) params.append("year", filters.year);
        if (filters.semester) params.append("semester", filters.semester);
        if (filters.sort) params.append("sort", filters.sort);

        // We specifically want 'student' or 'archived' status resources
        params.append(
          "status",
          isAuthorizedManager && showArchived ? "archived" : "student",
        );

        const { data } = await api.get(`/resources?${params.toString()}`);

        if (Array.isArray(data)) {
          setResources(data);
        } else {
          setResources([]);
        }
      } catch (err) {
        console.error("Failed to fetch resources:", err);
        setError("Network Protocol Failure: Archive Synchronization Interrupted.");
      } finally {
        setLoading(false);
      }
    },
    [isAuthorizedManager, showArchived],
  );

  useEffect(() => {
    fetchResources({});
  }, [fetchResources, showArchived]);

  const handleDelete = (id: number) => {
    toast(`Archive this node?`, {
      description:
        "This resource will be moved to the sequestered archive. Students will no longer have access permissions.",
      action: {
        label: "Archive Node",
        onClick: async () => {
          try {
            await api.patch(`/admin/resources/${id}/archive`);
            setResources((prev) => prev.filter((r) => r.id !== id));
            toast.success("Identity sequestered to archive matrix.");
          } catch (err) {
            console.error("Failed to archive resource:", err);
            toast.error("Protocol Breach: Failed to sequester node.");
          }
        },
      },
      cancel: { label: "Abort", onClick: () => {} },
    });
  };

  const handleRestore = (id: number) => {
    toast(`Restore archived node?`, {
      description: "Re-activating this resource will restores student access permissions.",
      action: {
        label: "Activate Node",
        onClick: async () => {
          try {
            await api.patch(`/admin/resources/${id}/restore`);
            setResources((prev) => prev.filter((r) => r.id !== id));
            toast.success("Node successfully re-integrated into library matrix.");
          } catch (err) {
            console.error("Failed to restore resource:", err);
            toast.error("Protocol Breach: Re-integration failed.");
          }
        },
      },
      cancel: { label: "Abort", onClick: () => {} },
    });
  };

  const handlePermanentDelete = (id: number) => {
    toast(`PERMANENT PURGE?`, {
      description:
        "FATAL ACTION. This record and its associated data will be permanently erased from the system disk.",
      action: {
        label: "PURGE NOW",
        onClick: async () => {
          try {
            await api.delete(`/admin/resources/${id}/permanent`);
            setResources((prev) => prev.filter((r) => r.id !== id));
            toast.success("Node purged with zero recovery potential.");
          } catch (err) {
            console.error("Failed to permanently delete resource:", err);
            toast.error("Unauthorized: Elevated clearance required.");
          }
        },
      },
      cancel: { label: "Abort", onClick: () => {} },
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* ── Library Hero Section ── */}
      <div className="relative overflow-hidden bg-[#5A270F] dark:bg-[#1A0B04] rounded-[3rem] p-12 sm:p-16 border border-white/10 shadow-[0_50px_100px_-20px_rgba(90,39,15,0.4)]">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#DF8142]/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse transition-all duration-1000" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 blur-[80px] rounded-full" />
        <div className="absolute inset-0 architectural-dot-grid opacity-10" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
              <div className="h-[2px] w-12 bg-gradient-to-r from-[#DF8142] to-transparent" />
              <p className="text-[11px] font-black uppercase tracking-[0.8em] text-[#EEB38C] drop-shadow-sm">
                System Registry Alpha
              </p>
            </div>
            
            <div className="flex items-start gap-8">
              <div className="hidden sm:flex h-20 w-20 rounded-3xl bg-[#DF8142] flex-shrink-0 items-center justify-center text-white shadow-2xl shadow-[#DF8142]/40 border-2 border-white/20 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <BookOpen className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9] font-space-grotesk italic">
                  {showArchived ? (
                    <>DORMANT <span className="text-[#EEB38C] italic">ARCHIVE</span></>
                  ) : (
                    <>ACADEMIC <span className="text-[#EEB38C] italic">KNOWLEDGE</span></>
                  )}
                </h1>
                <p className="mt-6 text-base text-[#EEB38C]/60 font-medium leading-relaxed max-w-lg">
                  {showArchived 
                    ? "Authorized access to sequestered nodes and decommissioned academic materials." 
                    : "Exploring the primary intelligence matrix of architectural excellence and research assets."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {isAuthorizedManager && (
              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`flex items-center gap-4 px-8 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all active:scale-95 group border shadow-2xl ${
                  showArchived 
                  ? "bg-white text-[#5A270F] border-white hover:bg-[#EEB38C]"
                  : "bg-white/5 text-[#EEB38C] border-white/10 hover:bg-white hover:text-[#5A270F]"
                }`}
              >
                {showArchived ? (
                  <>
                    <RotateCcw className="h-4 w-4 group-hover:-rotate-90 transition-transform" />
                    Back to Library
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Access Archive
                  </>
                )}
              </button>
            )}
            
            <div className="flex items-center gap-4 px-8 py-5 bg-[#EEB38C]/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
              <Library className="h-5 w-5 text-[#DF8142]" />
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white leading-none font-mono">
                  {resources.length.toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#EEB38C]/60">
                  Total Nodes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Logic ── */}
      <div className="px-4">
        <Filters onFilterChange={fetchResources} />
      </div>

      {/* ── Resource Matrix ── */}
      <div className="relative min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-[#DF8142] blur-2xl opacity-20 animate-pulse" />
              <Loader2 className="h-16 w-16 animate-spin text-[#DF8142] relative z-10" />
            </div>
            <p className="text-[#5A270F] dark:text-[#EEB38C]/80 font-black uppercase tracking-[0.6em] text-[10px] animate-pulse">
              Synchronizing Archive Nodes...
            </p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-[3rem] p-24 text-center max-w-4xl mx-auto shadow-2xl">
            <ServerCrash className="h-20 w-20 text-rose-500 mx-auto mb-8 animate-bounce" />
            <h3 className="text-2xl font-black text-rose-900 dark:text-rose-400 uppercase tracking-tight mb-4 italic">
              Registry Synchronization Failed
            </h3>
            <p className="text-rose-700/60 dark:text-rose-400/50 font-bold max-w-md mx-auto leading-relaxed">
              {error} Please re-establish secure connection with the central core module.
            </p>
          </div>
        ) : resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 content-start">
            {resources.map((resource) => (
              <div key={resource.id} className="relative group/card-wrapper animate-in fade-in slide-in-from-bottom-8 duration-500 hover:z-20">
                <ResourceCard resource={resource} />

                {isAuthorizedManager && (
                  <div className="absolute top-20 right-8 flex flex-col gap-3 opacity-0 group-hover/card-wrapper:opacity-100 transition-all duration-300 translate-x-4 group-hover/card-wrapper:translate-x-0 z-30">
                    {showArchived ? (
                      <>
                        <button
                          onClick={() => handleRestore(resource.id)}
                          className="p-4 bg-[#5A270F] text-[#EEB38C] rounded-2xl shadow-2xl hover:bg-[#6C3B1C] transition-all active:scale-95 border border-white/10"
                          title="Restore Resource"
                        >
                          <RotateCcw className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(resource.id)}
                          className="p-4 bg-rose-600 text-white rounded-2xl shadow-2xl hover:bg-rose-700 transition-all active:scale-95 border border-white/10"
                          title="Permanently Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleDelete(resource.id)}
                        className="p-4 bg-[#1A0B04] text-[#EEB38C] rounded-2xl shadow-2xl hover:bg-black transition-all active:scale-95 border border-white/5"
                        title="Archive Resource"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-40 flex flex-col items-center justify-center bg-[#FAF8F4] dark:bg-[#1A0B04] rounded-[4rem] border border-dashed border-[#D9D9C2] dark:border-white/10 transition-all duration-500 max-w-5xl mx-auto group/empty shadow-inner">
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-[#5A270F] blur-3xl opacity-5 group-hover/empty:opacity-10 transition-opacity" />
              <Search className="h-24 w-24 text-[#5A270F]/5 dark:text-[#EEB38C]/5 relative z-10 scale-110 group-hover/empty:scale-125 transition-transform duration-700" />
            </div>
            <h3 className="text-3xl font-black text-[#5A270F] dark:text-white uppercase tracking-tighter italic">
              Identity Matrix <span className="text-[#DF8142]">Empty</span>
            </h3>
            <p className="text-[#92664A] dark:text-[#EEB38C]/40 text-[11px] font-black uppercase tracking-[0.5em] mt-4 opacity-50">
              No matching records detected in library nexus.
            </p>
            <button 
              onClick={() => fetchResources({})}
              className="mt-10 px-8 py-4 bg-[#5A270F] dark:bg-[#DF8142] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-110 transition-all active:scale-95 shadow-2xl shadow-[#5A270F]/20"
            >
              Reset Search Protocol
            </button>
          </div>
        )}
      </div>

      {/* Progress Line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#5A270F]/20 dark:via-[#EEB38C]/10 to-transparent" />
    </div>
  );
};

export default Resources;
