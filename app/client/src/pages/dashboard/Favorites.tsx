import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import type { Resource } from "../../models";
import ResourceCard from "../../components/ui/ResourceCard";
import { Loader2, ServerCrash, Heart } from "lucide-react";

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
        setError("Failed to load favorite resources.");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#5A270F] dark:text-white uppercase tracking-tight transition-colors italic">
            Saved Resources
          </h2>
          <p className="text-[10px] text-[#5A270F]/40 dark:text-[#EEB38C]/40 font-black uppercase tracking-widest mt-1 transition-colors">
            Your personal collection of valuable architectural materials.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#FAF8F4] dark:bg-primary/10 rounded-xl text-[#5A270F] dark:text-[#EEB38C] text-sm font-black border border-black/5 dark:border-white/10 shadow-sm transition-all duration-300">
          <Heart className="h-4 w-4 text-[#DF8142]" />
          {resources.length} {resources.length === 1 ? "Item" : "Items"}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-[#DF8142] mb-4" />
          <p className="text-[#6C3B1C] dark:text-foreground/60 font-medium transition-colors">
            Loading your collection...
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-100 dark:border-red-500/20 transition-all">
          <ServerCrash className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-700 dark:text-red-400 font-bold transition-colors">
            {error}
          </p>
        </div>
      ) : resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div key={resource.id} className="relative group">
              <ResourceCard resource={resource} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#FAF8F4] dark:bg-card rounded-2xl border border-dashed border-[#D9D9C2] dark:border-white/10 transition-all duration-500">
          <Heart className="h-12 w-12 text-[#5A270F]/20 dark:text-[#EEB38C]/20 mx-auto mb-4 transition-colors" />
          <h3 className="text-base font-black text-[#5A270F] dark:text-white transition-colors italic uppercase">
            No Favorites Yet
          </h3>
          <p className="text-[#5A270F]/40 dark:text-white/40 text-[10px] font-black uppercase tracking-widest max-w-xs mx-auto mt-1 transition-colors">
            Browse the library and click the heart icon to save resources here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Favorites;
