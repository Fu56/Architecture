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
  const isAdmin = role === "Admin" || role === "SuperAdmin" || role === "admin";
  const isHighAdmin = role === "SuperAdmin";
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
          isAdmin && showArchived ? "archived" : "student",
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
    [isAdmin, showArchived],
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
          <h2 className="text-xl font-bold text-[#5A270F]">Resource Library</h2>
          <p className="text-sm text-[#6C3B1C] font-medium mt-1">
            Browse and manage all approved academic materials.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                showArchived
                  ? "bg-[#5A270F] text-white border-[#5A270F]"
                  : "bg-white text-[#5A270F]/80 border-[#92664A]/30 hover:border-[#DF8142] hover:text-[#DF8142]"
              }`}
            >
              {showArchived ? "Show Active" : "Show Archived"}
            </button>
          )}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#DF8142]/10 rounded-xl text-[#5A270F] text-sm font-bold border border-[#DF8142]/20 shadow-sm">
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
          <p className="text-[#6C3B1C] font-medium">
            Fetching library resources...
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-2xl border border-red-100">
          <ServerCrash className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-700 font-bold">{error}</p>
        </div>
      ) : resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div key={resource.id} className="relative group">
              <ResourceCard resource={resource} />

              {isAdmin && (
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
                      {isHighAdmin && (
                        <button
                          onClick={() => handlePermanentDelete(resource.id)}
                          className="p-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-colors"
                          title="Permanently Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
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
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-[#EEB38C]/30">
          <Library className="h-12 w-12 text-[#92664A]/30 mx-auto mb-4" />
          <h3 className="text-base font-bold text-[#5A270F]">
            No Resources Found
          </h3>
          <p className="text-[#92664A] text-xs max-w-xs mx-auto mt-1">
            We couldn't find any resources matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Resources;
