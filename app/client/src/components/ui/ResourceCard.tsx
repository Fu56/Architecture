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
  type LucideIcon,
} from "lucide-react";
import type { Resource } from "../../models";
import { isAuthenticated, currentRole } from "../../lib/auth";

interface ResourceCardProps {
  resource: Resource;
}

const fileTypeStyles: {
  [key: string]: { bg: string; text: string; icon: LucideIcon; light: string };
} = {
  pdf: {
    bg: "bg-rose-500",
    text: "text-rose-500",
    icon: FileText,
    light: "bg-rose-50",
  },
  docx: {
    bg: "bg-sky-500",
    text: "text-sky-500",
    icon: FileText,
    light: "bg-sky-50",
  },
  jpeg: {
    bg: "bg-emerald-500",
    text: "text-emerald-500",
    icon: Package,
    light: "bg-emerald-50",
  },
  png: {
    bg: "bg-emerald-500",
    text: "text-emerald-500",
    icon: Package,
    light: "bg-emerald-50",
  },
  mp4: {
    bg: "bg-violet-500",
    text: "text-violet-500",
    icon: Layout,
    light: "bg-violet-50",
  },
  rfa: {
    bg: "bg-amber-500",
    text: "text-amber-500",
    icon: Package,
    light: "bg-amber-50",
  },
  skp: {
    bg: "bg-orange-500",
    text: "text-orange-500",
    icon: Package,
    light: "bg-orange-50",
  },
  default: {
    bg: "bg-slate-500",
    text: "text-slate-500",
    icon: Layers,
    light: "bg-slate-50",
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
  } = resource;

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
    <div className="group relative bg-white rounded-3xl border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col overflow-hidden h-full animate-in fade-in slide-in-from-bottom-4">
      {/* Visual Header Node */}
      <div className="relative h-40 bg-slate-950 overflow-hidden">
        {/* Abstract Background pattern */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div
          className={`absolute inset-0 opacity-30 ${style.bg} blur-[40px] -translate-y-1/2`}
        />

        {/* File Type Badge Overlay */}
        <div className="absolute top-6 left-6 z-10">
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl`}
            >
              <TypeIcon className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
              {fileType || "Asset"}
            </span>
          </div>
        </div>

        {priority && (
          <div className="absolute top-6 right-6 z-10 flex items-center gap-2 px-3 py-1.5 bg-amber-400 text-slate-900 rounded-lg shadow-lg shadow-amber-500/20 transform group-hover:scale-105 transition-transform">
            <Sparkles className="h-3 w-3 fill-slate-900" />
            <span className="text-[9px] font-bold uppercase tracking-widest">
              High-Fidelity
            </span>
          </div>
        )}

        <div className="absolute bottom-4 left-6 z-10">
          <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">
            Node Registry: {String(id).padStart(5, "0")}
          </span>
        </div>
      </div>

      {/* Content Intelligence Body */}
      <div className="p-6 pb-2 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-[1.3] mb-4 group-hover:text-indigo-600 transition-colors">
          <Link to={detailPath} className="line-clamp-2">
            {title}
          </Link>
        </h3>

        <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100/80 group-hover:bg-indigo-50/50 group-hover:border-indigo-100 transition-all duration-300">
          <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
            <User className="h-4 w-4" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
              Authority Node
            </p>
            <p className="text-xs font-bold text-slate-800 truncate leading-none">
              {author || uploaderName}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 min-h-[48px]">
          {Array.isArray(keywords) && keywords.length > 0 ? (
            keywords.slice(0, 3).map((keyword) => (
              <span
                key={keyword}
                className="text-[9px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg border border-slate-200/50 hover:bg-slate-950 hover:text-white transition-all duration-300 cursor-default"
              >
                {keyword}
              </span>
            ))
          ) : (
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300 italic">
              No Metadata Tags
            </span>
          )}
        </div>

        {resource.status &&
          resource.status !== "student" &&
          resource.status !== "approved" && (
            <div className="mb-6 p-3 bg-slate-950 rounded-xl text-[9px] font-bold text-white relative overflow-hidden ring-1 ring-white/10 shadow-lg">
              <div
                className={`absolute top-0 right-0 w-12 h-12 ${
                  resource.status === "rejected"
                    ? "bg-rose-500"
                    : "bg-amber-500"
                } blur-2xl opacity-40`}
              />
              <div className="relative z-10 flex items-center justify-between">
                <span className="uppercase tracking-widest flex items-center gap-2">
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${
                      resource.status === "rejected"
                        ? "bg-rose-500"
                        : "bg-amber-500"
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
            <div className="h-6 w-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover/stat:bg-indigo-50 group-hover/stat:text-indigo-600 transition-colors">
              <Download className="h-3 w-3" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 tracking-wider">
              {downloadCount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2 group/stat">
            <div className="h-6 w-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover/stat:bg-indigo-50 group-hover/stat:text-indigo-600 transition-colors">
              <Calendar className="h-3 w-3" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 tracking-wider">
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
              localStorage.getItem("token") || ""
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <Eye className="h-3.5 w-3.5" />
            Scan
          </a>
          <a
            href={`${
              import.meta.env.VITE_API_URL
            }/resources/${id}/download?token=${encodeURIComponent(
              localStorage.getItem("token") || ""
            )}`}
            download
            className="flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md active:scale-95 hover:-translate-y-0.5"
          >
            <Download className="h-3.5 w-3.5" />
            Deploy
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
