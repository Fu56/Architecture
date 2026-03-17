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
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* ── Dashboard Index Header ── */}
      <div className="relative p-8 overflow-hidden bg-[#5A270F] dark:bg-black rounded-[2.5rem] border border-white/5 shadow-2xl shadow-[#5A270F]/20">
        <div className="absolute inset-0 blueprint-grid-dark opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#DF8142]/10 blur-[80px] -translate-y-12 translate-x-12" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-0.5 w-8 bg-[#DF8142] shadow-[0_0_10px_#DF8142]" />
              <p className="text-[9px] font-black text-[#EEB38C] uppercase tracking-[0.5em]">REGISTRY_PROTOCOL_14-A</p>
            </div>
            <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase font-space-grotesk italic">
                DATABASE <span className="text-[#DF8142] not-italic">INDEX</span>
            </h1>
            <p className="text-[10px] text-[#EEB38C]/50 font-black uppercase tracking-widest max-w-md leading-relaxed">
              Diagnostic synchronization with the universal architectural intelligence matrix.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-3xl font-black text-white leading-none font-mono tracking-tighter">
                {totalCount.toString().padStart(3, '0')}
              </span>
              <span className="text-[8px] font-black text-[#DF8142] uppercase tracking-[0.4em] mt-1">Verified_Nodes</span>
            </div>
            <div className="h-12 w-[1px] bg-white/10" />
            <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex items-center justify-center">
              <Library className="h-6 w-6 text-[#DF8142] animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Control Strategy Matrix ── */}
      <div className="bg-white dark:bg-[#0C0604] p-2 rounded-[2rem] border border-[#D9D9C2]/40 dark:border-white/5 shadow-xl transition-colors duration-500">
        <Filters 
          onFilterChange={fetchResources} 
          initialFilters={initialFilters || {}} 
        />
      </div>

      {/* ── Result Cluster Analysis ── */}
      <div className="relative min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="relative">
              <div className="h-20 w-20 border-2 border-[#DF8142]/20 border-t-[#DF8142] rounded-full animate-spin" />
              <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-[#EEB38C] animate-pulse" />
            </div>
            <p className="text-[10px] font-black text-[#5A270F] dark:text-[#EEB38C]/40 uppercase tracking-[0.8em]">Synchronizing...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-red-50/50 dark:bg-red-950/10 rounded-[3rem] border border-red-500/20">
            <ServerCrash className="h-16 w-16 text-red-500 mb-6 opacity-40" />
            <h3 className="text-2xl font-black text-[#5A270F] dark:text-red-500/80 uppercase tracking-tighter mb-2">Protocol Violation</h3>
            <p className="text-[#92664A] dark:text-red-400/60 text-[9px] font-black uppercase tracking-widest">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-8 px-10 py-4 bg-[#5A270F] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#2A1205] transition-all shadow-xl shadow-red-900/20"
            >
              Retry Connection
            </button>
          </div>
        ) : resources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 bg-[#FDFCFB] dark:bg-white/[0.02] rounded-[3rem] border-2 border-dashed border-[#BCAF9C]/20 relative overflow-hidden">
            <div className="absolute inset-0 architectural-dot-grid opacity-5" />
            <SearchX className="h-20 w-20 text-[#DF8142]/30 mb-8 relative z-10" />
            <h3 className="text-3xl font-black text-[#5A270F] dark:text-[#EEB38C]/60 uppercase tracking-tighter italic z-10">Zero Match Signals</h3>
            <p className="text-[9px] font-black text-[#92664A]/60 dark:text-white/20 uppercase tracking-[0.4em] mt-4 z-10">Adjust configurations to locate alternative repository nodes.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
