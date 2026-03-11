import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import type { Resource } from "../../models";
import ResourceCard from "../../components/ui/ResourceCard";
import { 
  Loader2, 
  ServerCrash, 
  Heart, 
  ChevronRight,
  Bookmark
} from "lucide-react";
import { Link } from "react-router-dom";

const Favorites = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/user/favorites");
        if (Array.isArray(data)) {
          setResources(data);
        } else {
          setResources([]);
        }
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
        setError("Network Protocol Failure: Synchronization with favorites matrix interrupted.");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* ── Favorites Hero Module ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#5A270F] to-[#2A1205] dark:from-[#1A0B04] dark:to-black rounded-[3rem] p-12 sm:p-16 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#DF8142]/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute inset-0 architectural-dot-grid opacity-10" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-10 bg-[#EEB38C]" />
              <p className="text-[11px] font-black uppercase tracking-[0.6em] text-[#EEB38C] drop-shadow-sm">
                Personal Repository
              </p>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9] font-space-grotesk italic">
              SAVED <span className="text-[#DF8142]">ARTIFACTS</span>
            </h1>
            <p className="text-base text-[#EEB38C]/60 font-medium leading-relaxed max-w-lg">
              Your curated high-fidelity library of essential architectural assets and verified intelligence nodes.
            </p>
          </div>

          <div className="flex items-center gap-6 px-10 py-6 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="h-16 w-16 rounded-2xl bg-[#DF8142] flex items-center justify-center text-white shadow-2xl shadow-[#DF8142]/20">
              <Bookmark className="h-8 w-8" />
            </div>
            <div>
              <span className="text-4xl font-black text-white leading-none font-mono">
                {resources.length.toString().padStart(2, '0')}
              </span>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#EEB38C]/60 mt-1">
                Active Nodes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content Matrix ── */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <Loader2 className="h-16 w-16 animate-spin text-[#DF8142]" />
            <p className="text-[#5A270F] dark:text-[#EEB38C]/80 font-black uppercase tracking-[0.6em] text-[10px] animate-pulse">
              Re-Establishing Secure Uplink...
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {resources.map((resource) => (
              <div key={resource.id} className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                <ResourceCard resource={resource} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-40 flex flex-col items-center justify-center bg-[#FAF8F4] dark:bg-[#1A0B04] rounded-[4rem] border border-dashed border-[#D9D9C2] dark:border-white/10 transition-all duration-500 group/empty shadow-inner text-center">
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-[#5A270F] blur-3xl opacity-5 group-hover/empty:opacity-10 transition-opacity" />
              <Heart className="h-24 w-24 text-[#5A270F]/5 dark:text-[#EEB38C]/5 relative z-10 scale-110 group-hover/empty:scale-125 transition-transform duration-700" />
            </div>
            <h3 className="text-3xl font-black text-[#5A270F] dark:text-white uppercase tracking-tighter italic">
              Repository <span className="text-[#DF8142]">Empty</span>
            </h3>
            <p className="text-[#92664A] dark:text-[#EEB38C]/40 text-[11px] font-black uppercase tracking-[0.5em] mt-4 opacity-50">
              Your saved artifacts matrix currently contains no active nodes.
            </p>
            <Link 
              to="/dashboard/resources"
              className="mt-10 flex items-center gap-4 px-10 py-5 bg-[#5A270F] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-110 transition-all active:scale-95 shadow-2xl"
            >
              Explore Library Matrix
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#5A270F]/20 dark:via-[#EEB38C]/10 to-transparent" />
    </div>
  );
};

export default Favorites;
