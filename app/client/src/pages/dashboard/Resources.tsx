import { useState, useEffect, useCallback } from "react";
import { api } from "../../lib/api";
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
          isAdmin && showArchived ? "archived" : "student"
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
    [isAdmin, showArchived]
  );

  useEffect(() => {
    fetchResources({});
  }, [fetchResources, showArchived]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to archive this resource?"))
      return;
    try {
      await api.patch(`/admin/resources/${id}/archive`);
      setResources((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to archive resource:", err);
      alert("Failed to archive resource");
    }
  };

  const handleRestore = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to restore this resource to the active library?"
      )
    )
      return;
    try {
      await api.patch(`/admin/resources/${id}/restore`);
      setResources((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to restore resource:", err);
      alert("Failed to restore resource");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Resource Library</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Browse and manage all approved academic materials.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                showArchived
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {showArchived ? "Show Active" : "Show Archived"}
            </button>
          )}
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl text-indigo-700 text-sm font-bold border border-indigo-100">
            <Library className="h-4 w-4" />
            {resources.length}{" "}
            {resources.length === 1 ? "Resource" : "Resources"}
          </div>
        </div>
      </div>

      <Filters onFilterChange={fetchResources} />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
          <p className="text-gray-500 font-medium">
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
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {showArchived ? (
                    <button
                      onClick={() => handleRestore(resource.id)}
                      className="p-2 bg-emerald-500 text-white rounded-lg shadow-lg hover:bg-emerald-600 transition-colors"
                      title="Restore Resource"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDelete(resource.id)}
                      className="p-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors"
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
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <Library className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-base font-bold text-gray-800">
            No Resources Found
          </h3>
          <p className="text-gray-500 text-xs max-w-xs mx-auto mt-1">
            We couldn't find any resources matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Resources;
