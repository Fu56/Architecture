import { Link } from "react-router-dom";
import {
  Download,
  Eye,
  FileText,
  Package,
  Layout,
  Layers,
  Star,
  Heart,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import type { Resource } from "../../models";
import { isAuthenticated, currentRole } from "../../lib/auth";

interface ResourceCardProps {
  resource: Resource;
}

const fileTypeStyles: {
  [key: string]: { bg: string; text: string; icon: LucideIcon; light: string };
} = {
  pdf: {
    bg: "bg-[#DF8142]", // Caramel
    text: "text-white", 
    icon: FileText,
    light: "bg-[#EEB38C]/10", // Buff
  },
  docx: {
    bg: "bg-[#EEB38C]", // Buff
    text: "text-[#5A270F]", // Seal Brown
    icon: FileText,
    light: "bg-[#EEB38C]/10",
  },
  jpeg: {
    bg: "bg-[#5A270F]", // Seal Brown
    text: "text-[#EEB38C]", // Buff
    icon: Package,
    light: "bg-[#5A270F]/5",
  },
  png: {
    bg: "bg-[#5A270F]", // Seal Brown
    text: "text-[#EEB38C]", // Buff
    icon: Package,
    light: "bg-[#5A270F]/5",
  },
  mp4: {
    bg: "bg-[#6C3B1C]", // Kobicha
    text: "text-[#EEB38C]", // Buff
    icon: Layout,
    light: "bg-[#6C3B1C]/10",
  },
  rfa: {
    bg: "bg-[#92664A]", // Raw Umber
    text: "text-white", 
    icon: Package,
    light: "bg-[#92664A]/10",
  },
  skp: {
    bg: "bg-[#DF8142]", // Caramel
    text: "text-white",
    icon: Package,
    light: "bg-[#DF8142]/10",
  },
  default: {
    bg: "bg-[#92664A]", // Raw Umber
    text: "text-white",
    icon: Layers,
    light: "bg-[#92664A]/10",
  },
};

const ResourceCard = ({ resource }: ResourceCardProps) => {
  const role = currentRole();
  const isAuth = isAuthenticated();

  const getDetailPath = () => {
    if (!isAuth) return `/resources/${resource.id}`;
    if (role === "Admin" || role === "SuperAdmin" || role === "admin") {
      return `/admin/resources/${resource.id}`;
    }
    return `/dashboard/resources/${resource.id}`;
  };

  const detailPath = getDetailPath();

  const {
    id,
    title,
    author,
    fileType,
    keywords,
    downloadCount,
    uploader,
    uploadedAt,
    isFavorite: initialIsFavorite,
  } = resource;

  const [isFavorite, setIsFavorite] = useState(initialIsFavorite || false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic update
    const newValue = !isFavorite;
    setIsFavorite(newValue);

    try {
      await api.post(`/resources/${id}/favorite`);
      toast.success(newValue ? "Added to favorites" : "Removed from favorites");
    } catch (error) {
      console.error("Favorite toggle error:", error);
      setIsFavorite(!newValue); // Revert
      toast.error("Failed to update favorite status");
    }
  };

  const style =
    (fileType && fileTypeStyles[fileType.toLowerCase()]) ||
    fileTypeStyles.default;


  const uploaderName = uploader
    ? uploader.firstName && uploader.lastName
      ? `${uploader.firstName} ${uploader.lastName}`
      : uploader.first_name && uploader.last_name
        ? `${uploader.first_name} ${uploader.last_name}`
        : "Anonymous Architect"
    : "Anonymous Architect";

  return (
    <div className="group relative bg-white dark:bg-[#1A0B02] rounded-2xl border border-[#D9D9C2] dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 hover:-translate-y-1 overflow-hidden">
      {/* ── Visual Node Header ── */}
      <div className="relative h-20 bg-[#5A270F] overflow-hidden">
        {/* Architectural Background Layers */}
        <div className="absolute inset-0 blueprint-grid opacity-20" />
        <div className={`absolute inset-0 opacity-40 ${style.bg} blur-[60px] translate-y-1/2 scale-150`} />
        <div className="absolute inset-0 architectural-dot-grid opacity-10 text-[#EEB38C]" />
        
        {/* Protocol Label */}
        <div className="absolute top-0 right-0 p-2 text-[24px] font-black text-white/5 uppercase select-none tracking-tighter italic">
          NODE
        </div>

        {/* Status indicator (Top Left) */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
          <div className="px-1.5 py-0.5 bg-white/10 backdrop-blur-md rounded border border-white/20 flex items-center gap-1.5">
             <div className={`h-1 w-1 rounded-full ${resource.status === 'archived' ? 'bg-rose-500' : 'bg-[#DF8142]'} animate-pulse`} />
             <span className="text-[6.5px] font-black uppercase tracking-widest text-[#EEB38C]">
               {fileType?.toUpperCase() || "GEN"}
             </span>
          </div>
          {resource.averageRating !== undefined && resource.averageRating > 0 && (
            <div className="flex items-center gap-0.5 px-1 py-0.5 bg-[#DF8142] rounded border border-white/10 shadow-lg">
              <Star className="h-2 w-2 text-white fill-white" />
              <span className="text-[7.5px] font-black text-white">{resource.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Favorite Trigger (Top Right) */}
        {(resource.status === "approved" || resource.status === "student") && (
          <button
            onClick={toggleFavorite}
            title={isFavorite ? "De-sync heart" : "Synchronize heart"}
            aria-label={isFavorite ? "De-sync heart" : "Synchronize heart"}
            className="absolute top-2.5 right-2.5 z-20 p-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 hover:bg-[#rose-500]/20 hover:border-rose-500/30 transition-all group/fav active:scale-90"
          >
            <Heart
              className={`h-3 w-3 ${isFavorite ? "fill-[#DF8142] text-[#DF8142]" : "text-white group-hover/fav:text-rose-400"}`}
            />
          </button>
        )}
      </div>

      {/* ── Content Intelligence Body ── */}
      <div className="p-4 pb-2 flex-grow flex flex-col">
        <div className="mb-3">
          <p className="text-[7.5px] font-black text-[#DF8142] uppercase tracking-[0.2em] mb-1 italic">
            Identification
          </p>
          <h3 className="text-[12px] font-black text-[#5A270F] dark:text-white tracking-tighter hover:text-[#DF8142] transition-colors line-clamp-2 uppercase italic leading-[1.1]">
            <Link to={detailPath}>{title}</Link>
          </h3>
        </div>
 
        <div className="grid grid-cols-2 gap-4 mt-auto">
          <div className="space-y-0.5">
             <p className="text-[7.5px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-widest">Architect</p>
             <div className="flex items-center gap-1.5 opacity-80">
                <p className="text-[9px] font-black text-[#5A270F] dark:text-[#EEB38C] truncate uppercase">
                  {author || uploaderName}
                </p>
             </div>
          </div>
          <div className="space-y-0.5 text-right">
             <p className="text-[7.5px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-widest">Phase</p>
             <p className="text-[9px] font-black text-[#DF8142] uppercase italic">
               {new Date(uploadedAt).toLocaleDateString(undefined, { month: "short", year: "2-digit" })}
             </p>
          </div>
        </div>

        {resource.status &&
          resource.status !== "student" &&
          resource.status !== "approved" && (
            <div className={`mt-4 p-2 rounded-lg flex items-center justify-between text-[8px] font-black uppercase tracking-widest border border-current opacity-70 ${resource.status === 'rejected' ? 'text-rose-500 bg-rose-500/5' : 'text-[#DF8142] bg-[#DF8142]/5'}`}>
              <span className="flex items-center gap-2">
                <div className={`h-1 w-1 rounded-full ${resource.status === 'rejected' ? 'bg-rose-500' : 'bg-[#DF8142]'}`} />
                NODE_STATE_{resource.status}
              </span>
            </div>
          )}
      </div>
 
      {/* ── Operational Terminals ── */}
      <div className="p-4 pt-1">
        <div className="h-px bg-gradient-to-r from-[#D9D9C2]/0 via-[#D9D9C2]/50 to-[#D9D9C2]/0 dark:via-white/5 mb-3" />
        
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5 group/dl">
            <Download className="h-2.5 w-2.5 text-[#DF8142]" />
            <span className="text-[8px] font-black text-[#5A270F] dark:text-white/60 tracking-widest">
              {downloadCount.toString().padStart(3, '0')}
            </span>
          </div>
          <div className="flex gap-1">
             {Array.isArray(keywords) && keywords.slice(0, 1).map((keyword) => (
                <span key={keyword} className="text-[7px] font-black uppercase tracking-widest text-[#92664A] dark:text-white/20">
                  {keyword}
                </span>
             ))}
          </div>
        </div>
 
         <div className="grid grid-cols-2 gap-2">
          <Link
            to={detailPath}
            className="flex items-center justify-center gap-2 py-2 bg-white dark:bg-white/5 text-[#5A270F] dark:text-[#EEB38C] rounded-xl text-[8.5px] font-black uppercase tracking-widest hover:bg-[#FAF8F4] dark:hover:bg-white/10 transition-all border border-[#D9D9C2] dark:border-white/10 shadow-sm active:scale-95"
          >
            <Eye className="h-3 w-3" /> Inspect
          </Link>
          <a
            href={`${import.meta.env.VITE_API_URL}/resources/${id}/download?token=${encodeURIComponent(localStorage.getItem("token") || "")}`}
            download
            className="flex items-center justify-center gap-2 py-2 bg-[#5A270F] text-white rounded-xl text-[8.5px] font-black uppercase tracking-widest hover:bg-[#6C3B1C] transition-all shadow-lg shadow-[#5A270F]/10 active:scale-95"
          >
            <Download className="h-3 w-3 text-[#EEB38C]" /> PULL
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
