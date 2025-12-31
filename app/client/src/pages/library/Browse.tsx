import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../lib/api";
import Filters, { type FilterState } from "../../components/ui/Filters";
import ResourceCard from "../../components/ui/ResourceCard";
import type { Resource } from "../../models";
import { ServerCrash, Library, SearchX, Sparkles } from "lucide-react";

const Browse = () => {
  const [searchParams] = useSearchParams();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchResources = useCallback(async (filters: FilterState) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.fileType) params.append("type", filters.fileType);
      if (filters.stage) params.append("stage", filters.stage);
      if (filters.year) params.append("year", filters.year);
      if (filters.semester) params.append("semester", filters.semester);
      if (filters.sort) params.append("sort", filters.sort);

      const { data } = await api.get(`/resources?${params.toString()}`);

      if (Array.isArray(data)) {
        setResources(data);
        setTotalCount(data.length);
      } else {
        setResources([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error("Failed to fetch resources:", err);
      setError(
        "Connectivity Error: Universal resource cluster is currently unreachable."
      );
      setResources([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const [initialFilters, setInitialFilters] = useState<FilterState | null>(
    null
  );

  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setInitialFilters({ search });
    } else {
      setInitialFilters({});
    }
  }, [searchParams]);

  useEffect(() => {
    if (initialFilters) {
      fetchResources(initialFilters);
    }
  }, [initialFilters, fetchResources]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="relative pt-32 pb-20 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(79,70,229,0.15),transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <Library className="h-3 w-3" /> Universal Asset Repository
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter mb-6 leading-none">
            EXPLORE THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              DESIGN MATRIX.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-lg sm:text-xl font-medium leading-relaxed">
            Access thousands of academic assets, BIM families, and technical
            specifications curated for the modern architect.
          </p>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-24">
        {/* Filter Unit */}
        <div className="mb-12">
          <Filters
            key={initialFilters ? JSON.stringify(initialFilters) : "default"}
            onFilterChange={fetchResources}
            initialFilters={initialFilters || {}}
          />
        </div>

        {/* Status Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 px-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">
              {loading
                ? "Searching Cluster..."
                : `${totalCount} Assets Isolated`}
            </p>
          </div>

          {!loading && resources.length > 0 && (
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              Optimized for Studio Integration
            </div>
          )}
        </div>

        {/* Results Cluster */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-50 h-[420px] rounded-[2.5rem] animate-pulse border border-slate-100"
                />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center py-32 bg-red-50/50 rounded-[3rem] border border-red-100 border-dashed">
              <ServerCrash className="h-16 w-16 text-red-500 mb-6" />
              <h3 className="text-2xl font-black text-red-900 mb-2 tracking-tight">
                System Disruption
              </h3>
              <p className="text-red-700 font-medium max-w-sm mx-auto">
                {error}
              </p>
              <button
                onClick={() => fetchResources({})}
                className="mt-8 px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all uppercase text-[10px] tracking-widest shadow-xl shadow-red-600/20"
              >
                Attempt Signal Restoration
              </button>
            </div>
          ) : resources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="animate-in fade-in slide-in-from-bottom-6 duration-500"
                >
                  <ResourceCard resource={resource} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-slate-50 rounded-[3rem] border border-slate-100 border-dashed">
              <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                <SearchX className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
                No Signals Detected
              </h3>
              <p className="text-slate-400 font-medium max-w-xs mx-auto">
                The Designer Matrix returned null for your current parameters.
                Try widening your search nexus.
              </p>
              <button
                onClick={() => fetchResources({})}
                className="mt-8 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] hover:text-slate-900 transition-colors"
              >
                Reset Search Protocols
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
