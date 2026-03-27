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
  User,
  Hash,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { api } from "../../lib/api";
import { toast } from "../../lib/toast";
import type { Resource } from "../../models";
import { isAuthenticated, currentRole } from "../../lib/auth";
import { useTheme } from "../../context/useTheme";

interface ResourceCardProps {
  resource: Resource;
}

const fileTypeStyles: {
  [key: string]: {
    accent: string;
    lightBg: string;
    darkBg: string;
    text: string;
    icon: LucideIcon;
  };
} = {
  pdf: {
    accent: "#DF8142",
    lightBg: "bg-[#DF8142]/5",
    darkBg: "bg-[#DF8142]/20",
    text: "text-[#DF8142]",
    icon: FileText,
  },
  docx: {
    accent: "#EEB38C",
    lightBg: "bg-[#EEB38C]/10",
    darkBg: "bg-[#EEB38C]/10",
    text: "text-[#EEB38C]",
    icon: FileText,
  },
  jpeg: {
    accent: "#5A270F",
    lightBg: "bg-[#5A270F]/5",
    darkBg: "bg-[#5A270F]/50",
    text: "text-[#EEB38C]",
    icon: Package,
  },
  png: {
    accent: "#5A270F",
    lightBg: "bg-[#5A270F]/5",
    darkBg: "bg-[#5A270F]/50",
    text: "text-[#EEB38C]",
    icon: Package,
  },
  mp4: {
    accent: "#6C3B1C",
    lightBg: "bg-[#6C3B1C]/5",
    darkBg: "bg-[#6C3B1C]/20",
    text: "text-[#EEB38C]",
    icon: Layout,
  },
  rfa: {
    accent: "#92664A",
    lightBg: "bg-[#92664A]/5",
    darkBg: "bg-[#92664A]/20",
    text: "text-white",
    icon: Package,
  },
  skp: {
    accent: "#DF8142",
    lightBg: "bg-[#DF8142]/5",
    darkBg: "bg-[#DF8142]/30",
    text: "text-white",
    icon: Package,
  },
  default: {
    accent: "#92664A",
    lightBg: "bg-[#92664A]/5",
    darkBg: "bg-[#92664A]/20",
    text: "text-white",
    icon: Layers,
  },
};

const ResourceCard = ({ resource }: ResourceCardProps) => {
  const role = currentRole();
  const isAuth = isAuthenticated();
  const { theme } = useTheme();
  const isLight = theme === "light";

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
    const newValue = !isFavorite;
    setIsFavorite(newValue);
    try {
      await api.post(`/resources/${id}/favorite`);
      toast.success(newValue ? "Saved to Archive" : "Removed from Archive");
    } catch {
      setIsFavorite(!newValue);
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
    <div
      className={`group relative rounded-[2.5rem] p-4 transition-all duration-700 flex flex-col h-full hover:shadow-[0_40px_80px_-20px_rgba(90,39,15,0.2)] dark:hover:shadow-[0_40px_80px_-20px_rgba(223,129,66,0.1)] hover:-translate-y-2 ${isLight ? "bg-white border border-[#92664A]/10 shadow-lg shadow-[#5A270F]/5" : "bg-[#0F0705] border border-white/5 shadow-none"}`}
    >
      {/* ── Top Visual Interactive Zone ── */}
      <div
        className={`relative h-64 rounded-[2rem] overflow-hidden ${isLight ? "bg-[#FAF8F4]" : "bg-black"}`}
      >
        {/* Soft Atmosphere Background */}
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[radial-gradient(circle_at_50%_120%,rgba(223,129,66,0.15),transparent_70%)]`}
        />
        <div className="absolute inset-0 blueprint-grid opacity-[0.04] pointer-events-none" />

        {/* Primary Icon Representation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative group/icon">
            <div
              className={`absolute -inset-8 rounded-full blur-[80px] opacity-0 group-hover/icon:opacity-20 transition-all duration-1000 bg-[#DF8142]`}
            />
            <div
              className={`relative w-32 h-32 rounded-[2.25rem] flex items-center justify-center transition-all duration-700 shadow-2xl group-hover:scale-105 group-hover:rotate-3 ${isLight ? "bg-white border border-[#BCAF9C]/20 shadow-neutral-200/50" : "bg-[#1A0B05] border border-[#DF8142]/20"}`}
            >
              <style.icon
                className={`w-14 h-14 stroke-[0.75px] transition-all duration-700 ${isLight ? "text-[#5A270F]" : "text-[#DF8142]"}`}
              />
            </div>
          </div>
        </div>

        {/* Floating Context Labels */}
        <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <div
              className={`px-4 py-1.5 rounded-full backdrop-blur-3xl border text-[9px] font-black uppercase tracking-[0.25em] ${isLight ? "bg-white/90 border-[#DF8142]/20 text-[#DF8142]" : "bg-black/80 border-[#DF8142]/30 text-[#DF8142]"}`}
            >
              {fileType?.split("/").pop()?.toUpperCase() || "ASSET"}
            </div>
            {resource.status === "rejected" && (
              <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[8px] font-black text-red-500 uppercase tracking-widest">
                REJECTED
              </div>
            )}
          </div>
          <button
            onClick={toggleFavorite}
            title={isFavorite ? "Archived" : "Archive Resource"}
            className={`h-11 w-11 rounded-full flex items-center justify-center backdrop-blur-3xl border transition-all duration-500 active:scale-90 ${isFavorite ? "bg-[#DF8142] border-[#DF8142] text-white shadow-lg shadow-[#DF8142]/40" : "bg-white/10 dark:bg-white/5 border-white/20 text-white hover:bg-[#DF8142] hover:border-[#DF8142]"}`}
          >
            <Heart
              className={`h-4.5 w-4.5 ${isFavorite ? "fill-white" : ""}`}
            />
          </button>
        </div>

        {/* Dynamic Rating Matrix */}
        {resource.averageRating !== undefined && resource.averageRating > 0 && (
          <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center pointer-events-none">
            <div className="flex items-center gap-2 bg-white/90 dark:bg-black/90 p-2 rounded-xl border border-white/10 shadow-2xl backdrop-blur-2xl">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-2.5 w-2.5 ${i < Math.round(resource.averageRating || 0) ? "text-[#DF8142] fill-[#DF8142]" : "text-neutral-300 dark:text-neutral-700"}`}
                />
              ))}
              <span
                className={`text-[10px] font-black ml-1 ${isLight ? "text-[#5A270F]" : "text-white"}`}
              >
                {resource.averageRating.toFixed(1)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Content Narrative Layer ── */}
      <div className="px-3 pt-8 pb-4 flex-grow flex flex-col">
        <div className="flex items-center gap-6 mb-6">
          <div
            className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2.5 ${isLight ? "text-[#92664A]/60" : "text-[#EEB38C]/30"}`}
          >
            <Clock className="w-4 h-4 text-[#DF8142]/60" />
            {new Date(uploadedAt).toLocaleDateString(undefined, {
              month: "short",
              year: "numeric",
            })}
          </div>
          <div
            className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2.5 ${isLight ? "text-[#92664A]/60" : "text-[#EEB38C]/30"}`}
          >
            <Hash className="w-4 h-4 text-[#DF8142]/60" />
            {keywords?.length || 0} SELECTIONS
          </div>
        </div>

        <Link to={detailPath} className="block group/title mb-10">
          <h3
            className={`text-2xl font-black leading-tight tracking-tighter uppercase font-space-grotesk transition-all duration-700 relative ${isLight ? "text-[#5A270F]" : "text-white"}`}
          >
            <span className="relative z-10">{title}</span>
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-0 bg-[#DF8142] group-hover/title:h-full transition-all duration-500" />
          </h3>
        </Link>

        {/* Professional Metrics Cluster */}
        <div
          className={`flex items-center justify-between mt-auto border-t pt-8 pb-6 ${isLight ? "border-neutral-100" : "border-white/5"}`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700 group-hover:bg-[#DF8142] group-hover:text-white ${isLight ? "bg-[#FAF8F4] text-[#5A270F] shadow-sm" : "bg-white/5 text-[#EEB38C]/80"}`}
            >
              <User className="h-6 w-6 stroke-[1.5px]" />
            </div>
            <div className="flex flex-col">
              <span
                className={`text-[8px] font-black uppercase tracking-[0.3em] mb-0.5 ${isLight ? "text-[#5A270F]/40" : "text-white/20"}`}
              >
                Author
              </span>
              <span
                className={`text-[14px] font-black uppercase italic tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] ${isLight ? "text-[#5A270F]" : "text-[#EEB38C]"}`}
              >
                {author || uploaderName}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span
              className={`text-[8px] font-black uppercase tracking-[0.3em] mb-0.5 ${isLight ? "text-[#5A270F]/40" : "text-white/20"}`}
            >
              Downloads
            </span>
            <div className="flex items-center gap-3">
              <span
                className={`text-xl font-black tabular-nums ${isLight ? "text-[#5A270F]" : "text-white"}`}
              >
                {(downloadCount || 0).toLocaleString()}
              </span>
              <div className="w-8 h-8 rounded-full bg-[#DF8142]/10 flex items-center justify-center">
                <Download className="h-4 w-4 text-[#DF8142]" />
              </div>
            </div>
          </div>
        </div>

        {/* Sophisticated Action Terminal */}
        <div className="flex gap-3 mt-4">
          <Link
            to={detailPath}
            className={`flex-1 flex items-center justify-center gap-3 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 border ${isLight ? "bg-white border-neutral-200 text-[#5A270F] hover:bg-[#FAF8F4] hover:shadow-xl" : "bg-white/5 border-white/10 text-white hover:bg-white hover:text-[#5A270F]"}`}
          >
            <Eye className="h-5 w-5" /> View Resources
          </Link>
          <a
            href={`${import.meta.env.VITE_API_URL}/resources/${id}/download?token=${encodeURIComponent(localStorage.getItem("token") || "")}`}
            download
            className={`flex-1 flex items-center justify-center gap-3 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-700 shadow-xl shadow-[#DF8142]/10 ${isLight ? "bg-[#5A270F] text-white hover:bg-[#DF8142]" : "bg-[#DF8142] text-white hover:bg-[#5A270F]"}`}
          >
            <Package className="h-5 w-5" /> Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
