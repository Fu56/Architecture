import { useState, useEffect, useCallback } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import type { Resource } from "../../models";
import ResourceCard from "../../components/ui/ResourceCard";
import Filters, { type FilterState } from "../../components/ui/Filters";
import { Loader2, ServerCrash, Library, Trash2, RotateCcw } from "lucide-react";
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
        if (filters.fileType) params.append("type", filters.fileType);
        if (filters.stage) params.append("stage", filters.stage);
        if (filters.year) params.append("year", filters.year);

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
        setError("Failed to load resources. Please try again.");
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
    toast("Archive this resource?", {
      description:
        "This will move the resource to the archive. It will no longer be visible to students.",
      action: {
        label: "Archive",
        onClick: async () => {
          try {
            await api.patch(`/admin/resources/${id}/archive`);
            setResources((prev) => prev.filter((r) => r.id !== id));
            toast.success("Resource archived");
          } catch (err) {
            console.error("Failed to archive resource:", err);
            toast.error("Failed to archive resource");
          }
        },
      },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

  const handleRestore = (id: number) => {
    toast("Restore this resource?", {
      description: "This will restore the resource to the active library.",
      action: {
        label: "Restore",
        onClick: async () => {
          try {
            await api.patch(`/admin/resources/${id}/restore`);
            setResources((prev) => prev.filter((r) => r.id !== id));
            toast.success("Resource restored");
          } catch (err) {
            console.error("Failed to restore resource:", err);
            toast.error("Failed to restore resource");
          }
        },
      },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

  const handlePermanentDelete = (id: number) => {
    toast("PERMANENTLY DELETE resource?", {
      description:
        "This action cannot be undone. The file and record will be erased forever.",
      action: {
        label: "DELETE",
        onClick: async () => {
          try {
            await api.delete(`/admin/resources/${id}/permanent`);
            setResources((prev) => prev.filter((r) => r.id !== id));
            toast.success("Resource deleted permanently");
          } catch (err) {
            console.error("Failed to permanently delete resource:", err);
            toast.error("Unauthorized action");
          }
        },
      },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#5A270F] dark:text-white uppercase tracking-tight transition-colors italic">
            {showArchived
              ? "System Archive Matrix"
              : "Academic Resource Library"}
          </h2>
          <p className="text-[10px] text-[#5A270F]/40 dark:text-[#EEB38C]/40 font-black uppercase tracking-widest mt-1 transition-colors">
            {showArchived
              ? "Managing decommissioned nodes and dormant records."
              : "Browse and manage the primary academic intelligence registry."}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {isAuthorizedManager &&
            (showArchived ? (
              <button
                onClick={() => setShowArchived(false)}
                className="flex items-center gap-2 px-6 py-3 bg-[#FAF8F4] dark:bg-card text-[#5A270F] dark:text-[#EEB38C] border border-[#5A270F] dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-[#5A270F] dark:hover:bg-primary hover:text-white dark:hover:text-white shadow-xl active:scale-95 group"
              >
                <RotateCcw className="h-4 w-4 group-hover:-rotate-90 transition-transform" />
                Back to Library
              </button>
            ) : (
              <button
                onClick={() => setShowArchived(true)}
                className="flex items-center gap-2 px-6 py-3 bg-[#FAF8F4] dark:bg-white/5 text-[#5A270F] dark:text-[#EEB38C]/60 border border-[#D9D9C2] dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-[#D9D9C2]/20 dark:hover:bg-white/10 hover:text-[#5A270F] dark:hover:text-white active:scale-95"
              >
                <Trash2 className="h-4 w-4" />
                Access Archive
              </button>
            ))}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#FAF8F4] dark:bg-primary/10 rounded-xl text-[#5A270F] dark:text-[#EEB38C] text-sm font-black border border-black/5 dark:border-white/10 shadow-sm transition-colors transition-all duration-300">
            <Library className="h-4 w-4 text-[#DF8142]" />
            {resources.length}{" "}
            {resources.length === 1 ? "Resource" : "Resources"}
          </div>
        </div>
      </div>

      <Filters onFilterChange={fetchResources} />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-[#DF8142] mb-4" />
          <p className="text-[#5A270F] dark:text-[#EEB38C]/80 font-black uppercase tracking-widest text-[10px]">
            Fetching library resources...
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-red-50 dark:bg-red-500/5 rounded-2xl border border-red-100 dark:border-red-500/10">
          <ServerCrash className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-700 dark:text-red-400 font-bold">{error}</p>
        </div>
      ) : resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div key={resource.id} className="relative group">
              <ResourceCard resource={resource} />

              {isAuthorizedManager && (
                <div className="absolute top-16 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  {showArchived ? (
                    <>
                      <button
                        onClick={() => handleRestore(resource.id)}
                        className="p-2 bg-[#5A270F] text-white rounded-lg shadow-lg hover:bg-[#6C3B1C] transition-colors shadow-[#5A270F]/20"
                        title="Restore Resource"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(resource.id)}
                        className="p-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-colors"
                        title="Permanently Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleDelete(resource.id)}
                      className="p-2 bg-slate-700 text-white rounded-lg shadow-lg hover:bg-slate-800 transition-colors"
                      title="Archive Resource"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#FAF8F4] dark:bg-card rounded-2xl border border-dashed border-[#D9D9C2] dark:border-white/10 transition-all duration-500">
          <Library className="h-12 w-12 text-[#5A270F]/20 dark:text-[#EEB38C]/20 mx-auto mb-4" />
          <h3 className="text-base font-black text-[#5A270F] dark:text-white transition-colors italic uppercase">
            No Resources Found
          </h3>
          <p className="text-[#5A270F]/40 dark:text-white/40 text-[10px] font-black uppercase tracking-widest max-w-xs mx-auto mt-1 transition-colors">
            We couldn't find any resources matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Resources;
