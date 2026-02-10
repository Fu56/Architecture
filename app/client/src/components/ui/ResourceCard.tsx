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
    text: "text-[#5A270F]", // Seal Brown
    icon: FileText,
    light: "bg-[#EEB38C]/20", // Buff
  },
  docx: {
    bg: "bg-[#EEB38C]", // Buff
    text: "text-[#6C3B1C]", // Kobicha
    icon: FileText,
    light: "bg-[#EEB38C]/10",
  },
  jpeg: {
    bg: "bg-[#5A270F]", // Seal Brown
    text: "text-white",
    icon: Package,
    light: "bg-[#5A270F]/5",
  },
  png: {
    bg: "bg-[#5A270F]", // Seal Brown
    text: "text-white",
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
    text: "text-[#F5F5DC]", // Beige/White-ish
    icon: Package,
    light: "bg-[#92664A]/10",
  },
  skp: {
    bg: "bg-[#DF8142]", // Caramel
    text: "text-[#5A270F]", // Seal Brown
    icon: Package,
    light: "bg-[#DF8142]/10",
  },
  default: {
    bg: "bg-[#92664A]", // Raw Umber
    text: "text-[#5A270F]",
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
    <div className="group relative bg-white rounded-3xl border border-[#EEB38C]/30 shadow-md hover:shadow-[0_20px_40px_-15px_rgba(90,39,15,0.15)] hover:-translate-y-1 transition-all duration-500 flex flex-col overflow-hidden h-full animate-in fade-in slide-in-from-bottom-4">
      {/* Visual Header Node */}
      <div className="relative h-40 bg-[#5A270F] overflow-hidden">
        {/* Abstract Background pattern */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div
          className={`absolute inset-0 opacity-40 ${style.bg} blur-[40px] -translate-y-1/2`}
        />

        {/* File Type & Rating Badge Overlay */}
        <div className="absolute top-6 left-6 z-10">
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl`}
            >
              <TypeIcon className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#EEB38C] bg-[#2A1205]/40 backdrop-blur-sm px-3 py-1 rounded-lg border border-[#EEB38C]/20">
                {fileType || "Asset"}
              </span>
              {resource.averageRating !== undefined &&
                resource.averageRating > 0 && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 w-fit">
                    <Star className="h-3 w-3 text-[#DF8142] fill-[#DF8142]" />
                    <span className="text-[10px] font-black text-white">
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
            className="absolute top-6 right-6 z-20 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-all active:scale-95 group/fav"
          >
            <Heart
              className={`h-4 w-4 transition-all duration-300 ${
                isFavorite
                  ? "fill-[#DF8142] text-[#DF8142]"
                  : "text-white group-hover/fav:text-[#DF8142]"
              }`}
            />
          </button>
        )}

        {priority && (
          <div
            className={`absolute top-6 ${resource.status === "approved" || resource.status === "student" ? "right-16" : "right-6"} z-10 flex items-center gap-2 px-3 py-1.5 bg-[#DF8142] text-white rounded-lg shadow-lg shadow-[#DF8142]/20 transform group-hover:scale-105 transition-transform`}
          >
            <Sparkles className="h-3 w-3 fill-white" />
            <span className="text-[9px] font-bold uppercase tracking-widest">
              High-Fidelity
            </span>
          </div>
        )}

        <div className="absolute bottom-4 left-6 z-10">
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#EEB38C]/40">
            Node Registry: {String(id).padStart(5, "0")}
          </span>
        </div>
      </div>

      {/* Content Intelligence Body */}
      <div className="p-6 pb-2 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-[#5A270F] tracking-tight leading-[1.3] mb-4 group-hover:text-[#DF8142] transition-colors">
          <Link to={detailPath} className="line-clamp-2">
            {title}
          </Link>
        </h3>

        <div className="flex items-center gap-3 mb-6 p-3 bg-[#EEB38C]/10 rounded-xl border border-[#EEB38C]/30 group-hover:bg-[#DF8142]/5 group-hover:border-[#DF8142]/20 transition-all duration-300">
          <div className="h-8 w-8 rounded-lg bg-white border border-[#EEB38C]/30 flex items-center justify-center text-[#92664A] shadow-sm">
            <User className="h-4 w-4" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[8px] font-bold text-[#92664A] uppercase tracking-widest leading-none mb-1">
              Authority Node
            </p>
            <p className="text-xs font-bold text-[#6C3B1C] truncate leading-none">
              {author || uploaderName}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 min-h-[48px]">
          {Array.isArray(keywords) && keywords.length > 0 ? (
            keywords.slice(0, 3).map((keyword) => (
              <span
                key={keyword}
                className="text-[9px] font-bold uppercase tracking-widest bg-[#F5F5DC] text-[#6C3B1C] px-3 py-1.5 rounded-lg border border-[#92664A]/20 hover:bg-[#5A270F] hover:text-white transition-all duration-300 cursor-default"
              >
                {keyword}
              </span>
            ))
          ) : (
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 italic">
              No Metadata Tags
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
                  <span className="text-white/40 font-medium italic truncate max-w-[90px]">
                    Directive logged
                  </span>
                )}
              </div>
            </div>
          )}
      </div>

      {/* Action Terminals */}
      <div className="mt-auto px-6 pb-6">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2 group/stat">
            <div className="h-6 w-6 rounded-lg bg-[#EEB38C]/10 flex items-center justify-center text-[#92664A] group-hover/stat:bg-[#DF8142]/10 group-hover/stat:text-[#DF8142] transition-colors">
              <Download className="h-3 w-3" />
            </div>
            <span className="text-[10px] font-bold text-[#5A270F] tracking-wider">
              {downloadCount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2 group/stat">
            <div className="h-6 w-6 rounded-lg bg-[#EEB38C]/10 flex items-center justify-center text-[#92664A] group-hover/stat:bg-[#DF8142]/10 group-hover/stat:text-[#DF8142] transition-colors">
              <Calendar className="h-3 w-3" />
            </div>
            <span className="text-[10px] font-bold text-[#5A270F] tracking-wider">
              {new Date(uploadedAt).toLocaleDateString(undefined, {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a
            href={`${
              import.meta.env.VITE_API_URL
            }/resources/${id}/view?token=${encodeURIComponent(
              localStorage.getItem("token") || "",
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 py-3 bg-[#EEB38C]/20 text-[#6C3B1C] rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#5A270F] hover:text-[#EEB38C] transition-all shadow-sm active:scale-95"
          >
            <Eye className="h-3.5 w-3.5" />
            Scan
          </a>
          <a
            href={`${
              import.meta.env.VITE_API_URL
            }/resources/${id}/download?token=${encodeURIComponent(
              localStorage.getItem("token") || "",
            )}`}
            download
            className="flex items-center justify-center gap-2 py-3 bg-[#DF8142] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#C97439] transition-all shadow-md active:scale-95 hover:-translate-y-0.5"
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
