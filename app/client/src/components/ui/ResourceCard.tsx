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

const fileIconMap: Record<string, LucideIcon> = {
  pdf: FileText,
  docx: FileText,
  mp4: Layout,
  jpeg: Layers,
  png: Layers,
  jpg: Layers,
  rfa: Package,
  skp: Package,
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

  const Icon = fileIconMap[fileType?.toLowerCase() || ''] || Layers;

  const uploaderName = uploader
    ? uploader.firstName && uploader.lastName
      ? `${uploader.firstName} ${uploader.lastName}`
      : uploader.first_name && uploader.last_name
        ? `${uploader.first_name} ${uploader.last_name}`
        : "Anonymous Architect"
    : "Anonymous Architect";

  return (
    <div
      className={`group relative rounded-[2rem] p-3 transition-all duration-700 flex flex-col h-full hover:-translate-y-2 border ${
        isLight
          ? "bg-[#FDFCFB] border-[#EEB38C] shadow-[0_20px_40px_-15px_rgba(90,39,15,0.15)] hover:shadow-[0_40px_80px_-20px_rgba(90,39,15,0.25)]"
          : "bg-[#5A270F] border-[#6C3B1C] shadow-2xl hover:border-[#DF8142]/50 hover:shadow-[0_40px_80px_-20px_rgba(223,129,66,0.15)]"
      }`}
    >
      {/* ── Top Visual Interactive Zone ── */}
      <div
        className={`relative h-56 rounded-[1.5rem] overflow-hidden ${
          isLight ? "bg-[#EEB38C]/20" : "bg-[#6C3B1C]"
        }`}
      >
        <div className={`absolute inset-0 blueprint-grid opacity-10 pointer-events-none mix-blend-overlay ${isLight ? "" : "blueprint-grid-dark"}`} />

        {/* Primary Icon Representation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative group/icon">
            <div
              className={`absolute -inset-8 rounded-full blur-[60px] opacity-0 group-hover/icon:opacity-30 transition-all duration-1000 ${
                isLight ? "bg-[#DF8142]" : "bg-[#DF8142]"
              }`}
            />
            <div
              className={`relative w-28 h-28 rounded-3xl flex items-center justify-center transition-all duration-700 shadow-xl group-hover:scale-105 group-hover:-rotate-3 border ${
                isLight
                  ? "bg-white border-[#DF8142]/40 shadow-[#5A270F]/10"
                  : "bg-[#5A270F] border-[#DF8142]/30 shadow-none"
              }`}
            >
              <Icon
                className={`w-12 h-12 stroke-[1px] transition-all duration-700 ${
                  isLight ? "text-[#DF8142]" : "text-[#EEB38C]"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Floating Context Labels */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <div
              className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-[0.2em] shadow-lg backdrop-blur-md ${
                isLight
                  ? "bg-[#DF8142] border-[#DF8142] text-white"
                  : "bg-[#6C3B1C]/90 border-[#DF8142]/40 text-[#EEB38C]"
              }`}
            >
              {fileType?.split("/").pop()?.toUpperCase() || "ASSET"}
            </div>
            {resource.status === "rejected" && (
              <div className="px-3 py-1 bg-[#5A270F]/90 border border-[#DF8142]/40 rounded-xl text-[8px] font-black text-[#EEB38C] shadow-lg uppercase tracking-widest">
                REJECTED
              </div>
            )}
          </div>
          <button
            onClick={toggleFavorite}
            title={isFavorite ? "Archived" : "Archive Resource"}
            className={`h-10 w-10 rounded-xl flex items-center justify-center backdrop-blur-md border transition-all duration-500 active:scale-90 shadow-lg ${
              !isFavorite ? "opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto" : "opacity-100"
            } ${
              isFavorite
                ? isLight
                  ? "bg-[#DF8142] border-[#DF8142] text-white"
                  : "bg-[#DF8142] border-[#DF8142] text-[#5A270F]"
                : isLight
                  ? "bg-white border-[#EEB38C] text-[#DF8142] hover:bg-[#EEB38C]/20"
                  : "bg-[#5A270F]/80 border-[#92664A]/50 text-[#EEB38C] hover:bg-[#6C3B1C]"
            }`}
          >
            <Heart
              className={`h-4.5 w-4.5 ${
                isFavorite
                  ? isLight ? "fill-white" : "fill-[#5A270F]"
                   : ""
              }`}
            />
          </button>
        </div>

        {/* Dynamic Rating Matrix */}
        {resource.averageRating !== undefined && resource.averageRating > 0 && (
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
            <div className={`flex items-center gap-1.5 p-2 rounded-xl border shadow-lg backdrop-blur-md ${isLight ? "bg-white/80 border-[#EEB38C]/50" : "bg-[#5A270F]/90 border-[#92664A]/50"}`}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-2.5 w-2.5 ${i < Math.round(resource.averageRating || 0) ? isLight ? "text-[#DF8142] fill-[#DF8142]" : "text-[#EEB38C] fill-[#EEB38C]" : isLight ? "text-[#EEB38C]/50" : "text-[#92664A]/50"}`}
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
      <div className="px-2 pt-6 pb-2 border-none flex-grow flex flex-col gap-2">
        <Link to={detailPath} className="block group/title mb-2">
          <h3
            className={`text-xl sm:text-2xl font-black leading-tight tracking-tighter uppercase font-space-grotesk transition-all duration-700 relative ${
              isLight ? "text-[#5A270F] group-hover/title:text-[#DF8142]" : "text-white group-hover/title:text-[#DF8142]"
            }`}
          >
            <span className="relative z-10">{title}</span>
          </h3>
        </Link>
        
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div
            className={`text-[9px] font-black uppercase tracking-[0.25em] flex items-center gap-2 ${
              isLight ? "text-[#92664A]" : "text-[#EEB38C]/70"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#DF8142]" />
            {new Date(uploadedAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div
            className={`text-[9px] font-black uppercase tracking-[0.25em] flex items-center gap-2 ${
              isLight ? "text-[#92664A]" : "text-[#EEB38C]/70"
            }`}
          >
            <Hash className="w-3.5 h-3.5 text-[#DF8142]" />
            {keywords?.slice(0, 1).join(", ") || "RESOURCE"}
            {keywords && keywords.length > 1 && ` +${keywords.length - 1}`}
          </div>
        </div>

        {/* Professional Metrics Cluster */}
        <div
          className={`flex items-center justify-between mt-auto border-t pt-5 pb-4 ${
            isLight ? "border-[#EEB38C]/40" : "border-[#6C3B1C]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-700 ${
                isLight
                  ? "bg-[#EEB38C]/20 text-[#5A270F]"
                  : "bg-[#6C3B1C] text-[#EEB38C]"
              }`}
            >
              <User className="h-4 w-4 stroke-[2px]" />
            </div>
            <div className="flex flex-col">
              <span
                className={`text-[7px] font-black uppercase tracking-[0.3em] mb-0.5 ${
                  isLight ? "text-[#92664A]" : "text-[#EEB38C]/50"
                }`}
              >
                Author
              </span>
              <span
                className={`text-[12px] font-black uppercase italic tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px] sm:max-w-[120px] ${
                  isLight ? "text-[#5A270F]" : "text-white"
                }`}
              >
                {author || uploaderName}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span
              className={`text-[7px] font-black uppercase tracking-[0.3em] mb-0.5 ${
                isLight ? "text-[#92664A]" : "text-[#EEB38C]/50"
              }`}
            >
              Downloads
            </span>
            <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border ${isLight ? "bg-[#DF8142]/10 border-[#DF8142]/20" : "bg-[#DF8142]/20 border-[#DF8142]/30"}`}>
              <Download className={`h-3 w-3 ${isLight ? "text-[#DF8142]" : "text-[#EEB38C]"}`} />
              <span
                className={`text-sm font-black tabular-nums ${
                  isLight ? "text-[#5A270F]" : "text-white"
                }`}
              >
                {(downloadCount || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Sophisticated Action Terminal */}
        <div className="flex gap-2.5 mt-2">
          <Link
            to={detailPath}
            className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-500 border ${
              isLight
                ? "bg-white border-[#EEB38C] text-[#5A270F] hover:bg-[#EEB38C]/30 shadow-sm"
                : "bg-[#6C3B1C] border-[#92664A] text-[#EEB38C] hover:bg-[#92664A] shadow-lg"
            }`}
          >
            <Eye className="h-4 w-4" /> View
          </Link>
          <a
            href={`${import.meta.env.VITE_API_URL}/resources/${id}/download?token=${encodeURIComponent(
              localStorage.getItem("token") || ""
            )}`}
            download
            className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-700 shadow-lg ${
              isLight
                ? "bg-[#5A270F] border border-[#5A270F] text-white hover:bg-[#6C3B1C]"
                : "bg-[#DF8142] border border-[#DF8142] text-[#5A270F] hover:bg-[#EEB38C]"
            }`}
          >
            <Download className="h-4 w-4" /> Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
