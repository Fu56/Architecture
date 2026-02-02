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
      <div className="relative pt-32 pb-20 overflow-hidden bg-[#2A1205]">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(79,70,229,0.1),transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.05),transparent_50%)]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary/80 mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <Library className="h-3 w-3" /> Universal Asset Repository
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
            EXPLORE THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary/80 to-purple-400">
              DESIGN MATRIX
            </span>
          </h1>
          <p className="max-w-xl mx-auto text-gray-500 text-base sm:text-lg font-medium leading-relaxed">
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
            <div className="h-2 w-2 rounded-full bg-primary/90 animate-pulse" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              {loading
                ? "Searching Cluster..."
                : `${totalCount} Assets Isolated`}
            </p>
          </div>

          {!loading && resources.length > 0 && (
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <Sparkles className="h-3 w-3 text-primary/80" />
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
                  className="bg-[#EFEDED] h-[400px] rounded-3xl animate-pulse border border-[#D9D9C2]"
                />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center py-24 bg-red-50/50 rounded-3xl border border-red-100 border-dashed">
              <ServerCrash className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-bold text-red-900 mb-2 tracking-tight">
                System Disruption
              </h3>
              <p className="text-sm text-red-700 font-medium max-w-sm mx-auto">
                {error}
              </p>
              <button
                onClick={() => fetchResources({})}
                className="mt-6 px-6 py-2.5 bg-red-600 text-white rounded-lg font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-red-600/10 hover:bg-red-700 transition-all"
              >
                Attempt Restoration
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
            <div className="text-center py-24 bg-[#EFEDED] rounded-3xl border border-[#D9D9C2] border-dashed">
              <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-[#D9D9C2]">
                <SearchX className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-[#5A270F] mb-2 tracking-tight">
                No Signals Detected
              </h3>
              <p className="text-gray-500 font-medium max-w-xs mx-auto text-sm">
                The Designer Matrix returned null for your current parameters.
                Try widening your search nexus.
              </p>
              <button
                onClick={() => fetchResources({})}
                className="mt-6 text-primary font-bold text-[10px] uppercase tracking-widest hover:text-[#5A270F] transition-colors"
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
