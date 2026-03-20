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
  Clock,
  ShieldAlert,
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
    <div className="group relative bg-[#FDFCFB] dark:bg-[#0F0602] rounded-3xl border border-[#BCAF9C]/20 dark:border-white/5 shadow-sm hover:shadow-[0_32px_64px_-16px_rgba(90,39,15,0.15)] transition-all duration-700 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 hover:-translate-y-2 overflow-hidden">
      {/* ── Visual Node Infrastructure ── */}
      <div className="relative h-24 bg-[#5A270F] overflow-hidden">
        {/* Living Blueprint Background */}
        <div className="absolute inset-0 blueprint-grid opacity-[0.15] group-hover:scale-110 group-hover:rotate-1 transition-transform duration-1000" />
        <div
          className={`absolute -inset-4 opacity-50 ${style.bg} blur-[40px] translate-y-1/2 scale-110 group-hover:opacity-70 transition-opacity duration-700`}
        />

        {/* Atmospheric Glow Nodes */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#DF8142]/20 blur-[60px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#EEB38C]/10 blur-[60px] translate-x-1/2 translate-y-1/2" />

        {/* Identification Layer */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md backdrop-blur-xl border border-white/20 shadow-lg ${style.bg} ${style.text} group-hover:scale-105 transition-transform duration-500`}
          >
            <style.icon className="h-3 w-3" />
            <span className="text-[7.5px] font-black uppercase tracking-[0.2em]">
              {fileType?.toUpperCase() || "GEN"}
            </span>
          </div>
          {resource.averageRating !== undefined &&
            resource.averageRating > 0 && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white/10 backdrop-blur-md rounded border border-white/10 w-fit">
                <Star className="h-2 w-2 text-[#DF8142] fill-[#DF8142]" />
                <span className="text-[7.5px] font-black text-white">
                  {resource.averageRating.toFixed(1)}
                </span>
              </div>
            )}
        </div>

        {/* Sync Node Trigger - Heart */}
        {(resource.status === "approved" || resource.status === "student") && (
          <button
            onClick={toggleFavorite}
            title={isFavorite ? "De-sync heart" : "Synchronize heart"}
            aria-label={isFavorite ? "De-sync heart" : "Synchronize heart"}
            className="absolute top-3 right-3 z-20 h-8 w-8 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-rose-500/20 hover:border-rose-500/30 transition-all group/fav active:scale-90 shadow-xl"
          >
            <Heart
              className={`h-3.5 w-3.5 transition-all duration-500 ${isFavorite ? "fill-[#DF8142] text-[#DF8142] scale-110 drop-shadow-[0_0_8px_rgba(223,129,66,0.5)]" : "text-white/60 group-hover/fav:text-rose-400"}`}
            />
          </button>
        )}

        {/* Structural Identifier */}
        <div className="absolute bottom-0 right-0 p-3 opacity-10 pointer-events-none">
          <Layout className="h-8 w-8 text-white group-hover:rotate-12 transition-transform duration-1000" />
        </div>
      </div>

      {/* ── Intelligence Body ── */}
      <div className="p-6 pb-2 flex-grow flex flex-col gap-4 relative">
        <div className="absolute top-0 right-6 -translate-y-1/2 flex gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-[#DF8142]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#BCAF9C]/20" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#BCAF9C]/20" />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="h-px w-4 bg-[#DF8142]/40" />
            <p className="text-[7px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] italic">
              ID_IDENTIFICATION
            </p>
          </div>
          <h3 className="text-[14px] font-black text-[#5A270F] dark:text-white tracking-tighter hover:text-[#DF8142] transition-colors line-clamp-2 uppercase italic leading-[1.15] font-space-grotesk">
            <Link to={detailPath}>{title}</Link>
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#BCAF9C]/10 dark:border-white/5 mt-auto">
          <div className="space-y-1">
            <p className="text-[6.5px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.3em]">
              Architect
            </p>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-[#5A270F] text-[#EEB38C] flex items-center justify-center text-[6px] font-black">
                {(author || uploaderName)[0].toUpperCase()}
              </div>
              <p className="text-[9.5px] font-black text-[#5A270F] dark:text-[#EEB38C] truncate uppercase tracking-tight">
                {author || uploaderName}
              </p>
            </div>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[6.5px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.3em]">
              Temporal Stamp
            </p>
            <div className="flex items-center justify-end gap-1.5">
              <Clock className="h-2.5 w-2.5 text-[#DF8142]" />
              <p className="text-[9.5px] font-black text-[#5A270F] dark:text-white/40 uppercase tracking-tight">
                {new Date(uploadedAt).toLocaleDateString(undefined, {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {resource.status &&
          resource.status !== "student" &&
          resource.status !== "approved" && (
            <div
              className={`p-2.5 rounded-xl flex items-center justify-between text-[7px] font-black uppercase tracking-[0.2em] border shadow-sm ${resource.status === "rejected" ? "text-rose-500 bg-rose-500/5 border-rose-500/20" : "text-[#DF8142] bg-[#DF8142]/5 border-[#DF8142]/20"}`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${resource.status === "rejected" ? "bg-rose-500 animate-pulse" : "bg-[#DF8142]"}`}
                />
                NODE_PROTOCOL: {resource.status}
              </div>
              <ShieldAlert className="h-2.5 w-2.5" />
            </div>
          )}
      </div>

      {/* ── Operational Operational Terminals ── */}
      <div className="p-6 pt-0 mt-2">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2 px-2 py-1 bg-[#6C3B1C]/5 dark:bg-white/5 rounded-lg border border-[#6C3B1C]/10 dark:border-white/10 group/stat">
            <Download className="h-3 w-3 text-[#DF8142] group-hover:translate-y-0.5 transition-transform" />
            <span className="text-[9px] font-black text-[#5A270F] dark:text-white font-mono leading-none">
              {downloadCount.toString().padStart(3, "0")}{" "}
              <span className="text-[6px] text-zinc-400 group-hover:text-[#DF8142] transition-colors ml-0.5">
                PULLS
              </span>
            </span>
          </div>
          <div className="flex gap-1">
            {Array.isArray(keywords) &&
              keywords.slice(0, 1).map((keyword) => (
                <span
                  key={keyword}
                  className="px-2 py-0.5 bg-white dark:bg-white/5 border border-[#D9D9C2] dark:border-white/10 rounded-full text-[7px] font-black uppercase tracking-widest text-[#92664A] dark:text-white/40 hover:text-[#DF8142] transition-all cursor-default"
                >
                  # {keyword}
                </span>
              ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <Link
            to={detailPath}
            className="flex items-center justify-center gap-2.5 h-10 bg-white dark:bg-white/5 text-[#5A270F] dark:text-[#EEB38C] rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#5A270F] hover:text-white transition-all border border-[#D9D9C2] dark:border-white/10 shadow-sm active:scale-95 group/inspect"
          >
            <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />{" "}
            INSPECT
          </Link>
          <a
            href={`${import.meta.env.VITE_API_URL}/resources/${id}/download?token=${encodeURIComponent(localStorage.getItem("token") || "")}`}
            download
            className="flex items-center justify-center gap-2.5 h-10 bg-[#5A270F] text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#DF8142] transition-all shadow-xl shadow-[#5A270F]/20 active:scale-95 group/pull"
          >
            <Download className="h-4 w-4 text-[#EEB38C] group-hover:translate-y-0.5 transition-transform duration-500" />{" "}
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
