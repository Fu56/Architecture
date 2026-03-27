import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../lib/api";
import Filters, { type FilterState } from "../../components/ui/Filters";
import ResourceCard from "../../components/ui/ResourceCard";
import type { Resource } from "../../models";
import {
  ServerCrash,
  Library,
  SearchX,
  Sparkles,
  ArrowLeft,
  Database,
} from "lucide-react";

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
        "Connectivity Error: Universal resource cluster is currently unreachable.",
      );
      setResources([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const [initialFilters, setInitialFilters] = useState<FilterState | null>(
    null,
  );

  useEffect(() => {
    const search = searchParams.get("search");
    const stage = searchParams.get("stage");
    const fileType = searchParams.get("type");
    const year = searchParams.get("year");
    const semester = searchParams.get("semester");
    const sort = searchParams.get("sort");

    const newFilters: FilterState = {};
    if (search) newFilters.search = search;
    if (stage) newFilters.stage = stage;
    if (fileType) newFilters.fileType = fileType;
    if (year) newFilters.year = year;
    if (semester) newFilters.semester = semester;
    if (sort) newFilters.sort = sort;

    setInitialFilters(newFilters);
  }, [searchParams]);

  useEffect(() => {
    if (initialFilters) {
      fetchResources(initialFilters);
    }
  }, [initialFilters, fetchResources]);

  return (
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#0C0603] font-inter selection:bg-[#DF8142]/20 selection:text-white transition-colors duration-500 overflow-x-hidden">
      {/* ── Repository Registry Header ── */}
      <div className="relative pt-12 pb-10 overflow-hidden bg-[#5A270F] border-b-2 border-[#DF8142]">
        <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[7px] font-black uppercase tracking-[0.4em] text-[#EEB38C] hover:bg-white/10 transition-all group"
            >
              <ArrowLeft className="h-2.5 w-2.5 group-hover:-translate-x-1 transition-transform" />
              BACK_TO_ORIGIN
            </button>
          </div>

          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[7px] font-black uppercase tracking-[0.4em] text-[#EEB38C] mb-4 backdrop-blur-md">
            <Library className="h-3 w-3 text-[#DF8142]" />{" "}
            MASTER_REPOSITORY_REGISTRY
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tighter mb-4 uppercase italic leading-none font-space-grotesk">
            REPOSITORY{" "}
            <span className="text-[#DF8142] not-italic uppercase">INDEX.</span>
          </h1>
          <div className="max-w-md mx-auto h-px bg-gradient-to-r from-transparent via-[#DF8142]/40 to-transparent mb-4" />
          <p className="max-w-md mx-auto text-[#EEB38C]/40 text-[7px] font-black uppercase tracking-[0.6em] leading-relaxed">
            Verified resources for students and professionals
          </p>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-16">
        {/* Filter Unit */}
        <div className="mb-6">
          <Filters
            key={initialFilters ? JSON.stringify(initialFilters) : "default"}
            onFilterChange={fetchResources}
            initialFilters={initialFilters || {}}
          />
        </div>

        {/* Dynamic Registry Status Matrix */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 px-6 py-4 border-l-4 border-[#DF8142] bg-white dark:bg-white/5 shadow-sm rounded-r-2xl">
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-[#DF8142] animate-ping" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#5A270F] dark:text-[#EEB38C]/40 flex items-center gap-4">
              <Database className="h-4 w-4 opacity-30" />
              {loading
                ? "Calibrating Archive..."
                : `Registry Assets: ${totalCount} Elements`}
            </p>
          </div>

          {!loading && resources.length > 0 && (
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[#DF8142] italic">
              <Sparkles className="h-4 w-4" />
              Repository Optimized
            </div>
          )}
        </div>

        {/* Results Cluster: Architectural Matrix */}
        <div className="min-h-[600px]">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-card h-[480px] rounded-[3rem] animate-pulse border border-[#92664A]/10"
                />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center py-40 bg-red-500/5 rounded-[4rem] border border-red-500/10">
              <ServerCrash className="h-16 w-16 text-red-500 mb-8 animate-bounce" />
              <h3 className="text-3xl font-black text-red-900 mb-4 tracking-tighter uppercase italic">
                Registry Unreachable
              </h3>
              <p className="text-sm text-red-700 font-medium max-w-sm mx-auto mb-10 leading-relaxed">
                {error}
              </p>
              <button
                onClick={() => fetchResources({})}
                className="px-12 py-5 bg-red-600 text-white rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl hover:bg-red-700 transition-all active:scale-95"
              >
                Attempt Secure Re-Uplink
              </button>
            </div>
          ) : resources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="animate-in fade-in slide-in-from-bottom-10 duration-[1000ms] transition-all"
                >
                  <ResourceCard resource={resource} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white dark:bg-[#1A0B02] rounded-2xl border border-[#D9D9C2] dark:border-white/5 border-dashed transition-all duration-500 shadow-xl shadow-[#5A270F]/5">
              <div className="h-16 w-16 bg-[#FAF8F4] dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#D9D9C2] dark:border-white/5">
                <SearchX className="h-8 w-8 text-[#EEB38C]/40" />
              </div>
              <h3 className="text-xl font-black text-[#5A270F] dark:text-[#EEB38C] mb-2 tracking-tighter uppercase italic">
                NULL DETECTED
              </h3>
              <p className="text-[#92664A] dark:text-[#EEB38C]/40 font-black uppercase tracking-widest max-w-xs mx-auto text-[10px] leading-relaxed">
                The Designer Matrix returned no protocols. Widening search nexus
                is recommended.
              </p>
              <button
                onClick={() => fetchResources({})}
                className="mt-8 px-8 py-3 bg-[#5A270F] text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-[#DF8142] transition-colors shadow-lg shadow-[#5A270F]/20"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
