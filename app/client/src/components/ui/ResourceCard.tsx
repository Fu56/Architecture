import { Link } from "react-router-dom";
import {
  Download,
  User,
  Calendar,
  Eye,
  FileText,
  Package,
  Layout,
  Layers,
  Sparkles,
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
    priority,
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
  const TypeIcon = style.icon;

  const uploaderName = uploader
    ? uploader.firstName && uploader.lastName
      ? `${uploader.firstName} ${uploader.lastName}`
      : uploader.first_name && uploader.last_name
        ? `${uploader.first_name} ${uploader.last_name}`
        : "Anonymous Architect"
    : "Anonymous Architect";

  return (
    <div className="group relative bg-white dark:bg-[#1A0B02] rounded-2xl border border-[#D9D9C2] dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-[#5A270F]/5 dark:hover:shadow-none transition-all duration-500 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4">
      {/* Visual Header Node */}
      <div className="relative h-32 bg-[#5A270F] rounded-t-2xl overflow-hidden">
        {/* Abstract Background pattern */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div
          className={`absolute inset-0 opacity-40 ${style.bg} blur-[40px] -translate-y-1/2`}
        />

        {/* File Type & Rating Badge Overlay */}
        <div className="absolute top-4 left-4 z-10">
          <div className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-lg bg-white/10 dark:bg-[#1A0B02]/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white dark:text-[#EEB38C] shadow-lg`}
            >
              <TypeIcon className="h-4 w-4" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[8px] font-black uppercase tracking-[0.1em] text-[#EEB38C] bg-[#2A1205]/40 backdrop-blur-sm px-2 py-0.5 rounded border border-[#EEB38C]/20 leading-none">
                {fileType || "Asset"}
              </span>
              {resource.averageRating !== undefined &&
                resource.averageRating > 0 && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white/10 dark:bg-[#1A0B02]/40 backdrop-blur-md rounded border border-white/10 w-fit">
                    <Star className="h-2.5 w-2.5 text-[#DF8142] fill-[#DF8142]" />
                    <span className="text-[8px] font-black text-white dark:text-[#EEB38C]">
                      {resource.averageRating.toFixed(1)}
                    </span>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Favorite Button for Approved/Student Resources */}
        {(resource.status === "approved" || resource.status === "student") && (
          <button
            onClick={toggleFavorite}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-white/10 dark:bg-[#1A0B02]/40 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 dark:hover:bg-[#1A0B02]/60 transition-all active:scale-95 group/fav"
          >
            <Heart
              className={`h-3.5 w-3.5 transition-all duration-300 ${
                isFavorite
                  ? "fill-[#DF8142] text-[#DF8142]"
                  : "text-white dark:text-[#EEB38C] group-hover/fav:text-[#DF8142]"
              }`}
            />
          </button>
        )}

        {priority && (
          <div
            className={`absolute top-4 ${resource.status === "approved" || resource.status === "student" ? "right-14" : "right-4"} z-10 flex items-center gap-1.5 px-2 py-1 bg-[#DF8142] text-white rounded shadow-lg shadow-[#DF8142]/20 transform group-hover:scale-105 transition-transform`}
          >
            <Sparkles className="h-2.5 w-2.5 fill-white" />
            <span className="text-[7.5px] font-black uppercase tracking-widest">
              Premium
            </span>
          </div>
        )}

        {(role === "Admin" || role === "SuperAdmin" || role === "DepartmentHead") && resource.is_public && (
           <div className="absolute bottom-4 right-6 z-10 flex items-center gap-2 px-3 py-1 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-lg shadow-sm">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
             <span className="text-[8px] font-black uppercase tracking-widest text-emerald-100">Public Matrix</span>
           </div>
        )}

        <div className="absolute bottom-3 left-4 z-10">
          <span className="text-[7.5px] font-black uppercase tracking-[0.2em] text-[#EEB38C]/40">
            Node: {String(id).padStart(5, "0")}
          </span>
        </div>
      </div>

      {/* Content Intelligence Body */}
      <div className="p-4 pb-1 flex-grow flex flex-col transition-colors duration-500">
        <h3 className="text-base font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter hover:text-[#DF8142] dark:hover:text-[#DF8142] transition-colors line-clamp-2 leading-[1.1] font-space-grotesk uppercase italic mb-4">
          <Link to={detailPath} className="line-clamp-2">
            {title}
          </Link>
        </h3>
 
        <div className="flex items-center gap-2.5 mb-4 p-2 bg-[#EEB38C]/10 dark:bg-white/5 rounded-xl border border-[#D9D9C2] dark:border-white/5 group-hover:bg-[#DF8142]/5 transition-all duration-300">
          <div className="h-7 w-7 rounded-lg bg-[#5A270F] text-white flex items-center justify-center shadow-sm">
            <User className="h-3.5 w-3.5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[6.5px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.2em] leading-none mb-0.5">
              Authority Node
            </p>
            <p className="text-[10px] font-black text-[#5A270F] dark:text-white truncate leading-none">
              {author || uploaderName}
            </p>
          </div>
        </div>
 
        <div className="flex flex-wrap gap-1.5 mb-4 min-h-[40px]">
          {Array.isArray(keywords) && keywords.length > 0 ? (
            keywords.slice(0, 3).map((keyword) => (
              <span
                key={keyword}
                className="text-[7.5px] font-black uppercase tracking-widest bg-[#FAF8F4] dark:bg-white/5 text-[#92664A] dark:text-[#EEB38C]/60 px-2 py-1 rounded border border-[#D9D9C2] dark:border-white/5 hover:border-[#DF8142] transition-colors"
              >
                {keyword}
              </span>
            ))
          ) : (
            <span className="text-[7.5px] font-black uppercase tracking-widest text-[#5A270F]/20 dark:text-white/10 italic">
              Void Tags
            </span>
          )}
        </div>

        {resource.status &&
          resource.status !== "student" &&
          resource.status !== "approved" && (
            <div className="mb-6 p-3 bg-[#5A270F] rounded-xl text-[9px] font-bold text-white relative overflow-hidden ring-1 ring-white/10 shadow-lg">
              <div
                className={`absolute top-0 right-0 w-12 h-12 ${
                  resource.status === "rejected" ? "bg-red-700" : "bg-[#DF8142]"
                } blur-2xl opacity-40`}
              />
              <div className="relative z-10 flex items-center justify-between">
                <span className="uppercase tracking-widest flex items-center gap-2">
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${
                      resource.status === "rejected"
                        ? "bg-red-700"
                        : "bg-[#DF8142]"
                    } animate-pulse`}
                  />
                  Matrix State: {resource.status}
                </span>
                {resource.adminComment && (
                  <span className="text-white/70 font-medium italic truncate max-w-[90px]">
                    Directive logged
                  </span>
                )}
              </div>
            </div>
          )}
      </div>

      {/* Action Terminals */}
      <div className="mt-auto px-4 pb-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5 group/stat">
            <Download className="h-2.5 w-2.5 text-[#DF8142]" />
            <span className="text-[8.5px] font-black text-[#5A270F] dark:text-[#EEB38C]/60 tracking-widest">
              {downloadCount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5 group/stat">
            <Calendar className="h-2.5 w-2.5 text-[#92664A]" />
            <span className="text-[8.5px] font-black text-[#5A270F] dark:text-[#EEB38C]/60 tracking-widest uppercase">
              {new Date(uploadedAt).toLocaleDateString(undefined, {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

         <div className="grid grid-cols-2 gap-2">
          <a
            href={`${
              import.meta.env.VITE_API_URL
            }/resources/${id}/view?token=${encodeURIComponent(
              localStorage.getItem("token") || "",
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 bg-[#FAF8F4] dark:bg-white/5 text-[#5A270F] dark:text-[#EEB38C] rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-[#5A270F] dark:hover:bg-[#DF8142] hover:text-white transition-all border border-[#D9D9C2] dark:border-white/5 shadow-sm"
          >
            <Eye className="h-3.5 w-3.5" />
            View State
          </a>
          <a
            href={`${
              import.meta.env.VITE_API_URL
            }/resources/${id}/download?token=${encodeURIComponent(
              localStorage.getItem("token") || "",
            )}`}
            download
            className="flex items-center justify-center gap-1.5 py-2.5 bg-[#DF8142] text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-[#5A270F] transition-all shadow-md shadow-[#DF8142]/10"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
