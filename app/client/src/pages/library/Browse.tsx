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
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#0C0603] font-inter selection:bg-[#DF8142]/20 selection:text-white transition-colors duration-700 overflow-x-hidden">
      {/* ── Immersive Architectural Header ── */}
      <div className="relative pt-16 pb-20 overflow-hidden bg-gradient-to-b from-[#5A270F] via-[#3D1A0A] to-[#2A1205] border-b-[3px] border-[#DF8142] shadow-2xl">
        <div className="absolute inset-0 blueprint-grid opacity-15 pointer-events-none mix-blend-overlay" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-[#DF8142]/5 to-transparent pointer-events-none" />
        
        {/* Animated Architectural Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#DF8142]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-[#EEB38C]/5 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex justify-between items-center mb-12">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2.5 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase tracking-[0.4em] text-[#EEB38C] hover:bg-white/10 hover:border-[#DF8142]/40 transition-all group backdrop-blur-md"
            >
              <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1.5 transition-transform" />
              BACK_TO_SOURCE
            </button>
            <div className="hidden sm:flex items-center gap-4">
              <div className="h-px w-24 bg-gradient-to-l from-[#DF8142]/60 to-transparent" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#EEB38C]/40">System_01</span>
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/15 rounded-lg text-[8px] font-black uppercase tracking-[0.5em] text-[#EEB38C] mb-8 backdrop-blur-xl shadow-2xl">
              <Library className="h-3.5 w-3.5 text-[#DF8142]" />{" "}
              Universal_Repository_Interface
            </div>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter mb-6 uppercase italic leading-none font-space-grotesk drop-shadow-2xl">
              ARCHIVE{" "}
              <span className="text-[#DF8142] not-italic uppercase underline decoration-[#DF8142]/30 decoration-[8px] underline-offset-[12px]">INDEX.</span>
            </h1>
            <p className="max-w-xl mx-auto text-[#EEB38C]/50 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.6em] leading-relaxed transition-colors duration-500">
              Validated Protocols for the Professional Network
            </p>
          </div>
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

        {/* Status Dashboard Cluster */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-16 px-8 py-6 border-l-[6px] border-[#DF8142] bg-white dark:bg-[#1A0B02] shadow-2xl shadow-[#5A270F]/5 dark:shadow-none rounded-r-3xl border border-y-[#92664A]/10 border-r-[#92664A]/10 transition-colors duration-700">
          <div className="flex items-center gap-5">
            <div className="relative h-4 w-4">
              <div className="absolute inset-0 rounded-full bg-[#DF8142] animate-ping opacity-20" />
              <div className="absolute inset-1 rounded-full bg-[#DF8142] shadow-[0_0_10px_#DF8142]" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C]/80 flex items-center gap-3">
                <Database className="h-4 w-4 opacity-40" />
                {loading
                  ? "Re-aligning Neural Archive..."
                  : `Active Registry: ${totalCount} Transmission Nodes`}
              </p>
              {!loading && (
                <span className="text-[8px] font-black text-[#92664A] dark:text-[#EEB38C]/30 uppercase tracking-[0.2em] ml-7">
                  Connectivity: Stable_Optimal
                </span>
              )}
            </div>
          </div>

          {!loading && resources.length > 0 && (
            <div className="flex items-center gap-3 px-5 py-2.5 bg-[#EEB38C]/10 dark:bg-[#5A270F]/20 rounded-xl border border-[#DF8142]/20 text-[10px] font-black uppercase tracking-[0.3em] text-[#DF8142] cursor-default group transition-all">
              <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              Archive Optimized
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
