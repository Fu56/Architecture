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
} from "lucide-react";

/**
 * Resources Page for Dashboard
 * Provides high-fidelity access to the verified architectural intelligence registry.
 */
const Resources = () => {
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
    <div className="space-y-3 animate-in fade-in duration-700">

      {/* ── Compact Header Banner ── */}
      <div className="relative overflow-hidden rounded-2xl border border-[#BCAF9C]/20 dark:border-white/5 bg-gradient-to-r from-[#5A270F] to-[#3D1A0A] dark:from-[#1A0B04] dark:to-black px-6 py-4 shadow-lg shadow-[#5A270F]/10">
        <div className="absolute top-0 right-0 w-40 h-full bg-[#DF8142]/10 blur-[60px] pointer-events-none" />
        <div className="absolute inset-0 architectural-dot-grid opacity-[0.04] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center shadow-md">
              <Library className="h-4 w-4 text-[#DF8142]" />
            </div>
            <div>
              <p className="text-[8px] font-black text-[#EEB38C]/60 uppercase tracking-[0.4em] leading-none mb-0.5">
                Registry Protocol
              </p>
              <h1 className="text-lg font-black text-white tracking-tighter uppercase leading-none font-space-grotesk">
                Resource <span className="text-[#DF8142]">Index</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!loading && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/10 rounded-lg">
                <Sparkles className="h-3 w-3 text-[#DF8142]" />
                <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">
                  {totalCount.toString().padStart(3, "0")} Nodes
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <Filters
        key={initialFilters ? JSON.stringify(initialFilters) : "default"}
        onFilterChange={fetchResources}
        initialFilters={initialFilters || {}}
      />

      {/* ── Resource Grid ── */}
      <div className="relative min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="relative">
              <div className="h-14 w-14 border-2 border-[#DF8142]/20 border-t-[#DF8142] rounded-full animate-spin" />
              <Sparkles className="absolute inset-0 m-auto h-4 w-4 text-[#EEB38C] animate-pulse" />
            </div>
            <p className="text-[9px] font-black text-[#5A270F] dark:text-[#EEB38C]/40 uppercase tracking-[0.6em]">Synchronizing...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-red-50 dark:bg-red-950/10 rounded-2xl border border-red-200 dark:border-red-500/20">
            <ServerCrash className="h-10 w-10 text-red-400 mb-4" />
            <h3 className="text-lg font-black text-red-800 dark:text-red-400 uppercase tracking-tighter mb-1">Protocol Violation</h3>
            <p className="text-[9px] font-black text-red-600/70 dark:text-red-400/50 uppercase tracking-widest max-w-xs">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-8 py-3 bg-[#5A270F] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#2A1205] transition-all shadow-lg"
            >
              Retry
            </button>
          </div>
        ) : resources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-10">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-28 bg-[#FDFCFB] dark:bg-white/[0.02] rounded-2xl border border-dashed border-[#BCAF9C]/30 dark:border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 architectural-dot-grid opacity-[0.04]" />
            <SearchX className="h-12 w-12 text-[#DF8142]/30 mb-4 relative z-10" />
            <h3 className="text-xl font-black text-[#5A270F] dark:text-[#EEB38C]/50 uppercase tracking-tighter italic z-10">Zero Match Signals</h3>
            <p className="text-[9px] font-black text-[#92664A]/50 dark:text-white/20 uppercase tracking-[0.3em] mt-2 z-10 text-center max-w-xs">Adjust filter configurations to locate alternative nodes.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
