import { Link } from "react-router-dom";
import {
  Download,
  Star,
  User,
  Calendar,
  Eye,
  FileText,
  Package,
  Layout,
  type LucideIcon,
} from "lucide-react";
import type { Resource } from "../../models";
import { isAuthenticated, currentRole } from "../../lib/auth";

interface ResourceCardProps {
  resource: Resource;
}

const fileTypeStyles: {
  [key: string]: { bg: string; text: string; icon: LucideIcon };
} = {
  pdf: { bg: "bg-red-500", text: "text-red-500", icon: FileText },
  docx: { bg: "bg-blue-500", text: "text-blue-500", icon: FileText },
  jpeg: { bg: "bg-emerald-500", text: "text-emerald-500", icon: Package },
  png: { bg: "bg-emerald-500", text: "text-emerald-500", icon: Package },
  mp4: { bg: "bg-purple-500", text: "text-purple-500", icon: Layout },
  rfa: { bg: "bg-amber-500", text: "text-amber-500", icon: Package },
  skp: { bg: "bg-orange-500", text: "text-orange-500", icon: Package },
  default: { bg: "bg-slate-500", text: "text-slate-500", icon: FileText },
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
      : "Anonymous"
    : "Anonymous";

  return (
    <div className="group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-200/50 hover:-translate-y-2 transition-all duration-500 flex flex-col overflow-hidden h-full">
      {/* Visual Header */}
      <div className="relative h-32 bg-slate-50 overflow-hidden">
        <div className={`absolute inset-0 opacity-10 ${style.bg} blur-3xl`} />
        <div className="absolute top-6 left-6 z-10">
          <div
            className={`h-12 w-12 rounded-2xl bg-white shadow-sm border border-white flex items-center justify-center ${style.text}`}
          >
            <TypeIcon className="h-6 w-6" />
          </div>
        </div>

        {priority && (
          <div className="absolute top-6 right-6 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white rounded-full shadow-lg shadow-amber-500/30">
            <Star className="h-3 w-3 fill-white" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Priority Asset
            </span>
          </div>
        )}

        <div className="absolute bottom-4 left-6 z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Unit {String(id).padStart(4, "0")}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-8 pb-4 flex-grow flex flex-col">
        <h3 className="text-xl font-black text-slate-900 tracking-tight leading-[1.2] mb-3 group-hover:text-indigo-600 transition-colors">
          <Link to={detailPath} className="line-clamp-2">
            {title}
          </Link>
        </h3>

        <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
          <div className="h-8 w-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400">
            <User className="h-4 w-4" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
              Architectural Node
            </p>
            <p className="text-xs font-bold text-slate-700 truncate leading-none">
              {author || uploaderName}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 min-h-[50px]">
          {Array.isArray(keywords) &&
            keywords.slice(0, 3).map((keyword) => (
              <span
                key={keyword}
                className="text-[10px] font-black uppercase tracking-widest bg-slate-100/50 text-slate-500 px-3 py-1.5 rounded-lg border border-slate-200/50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-default"
              >
                {keyword}
              </span>
            ))}
        </div>

        {resource.status && resource.status !== "student" && (
          <div className="mb-4 p-3 bg-slate-950 rounded-2xl text-[10px] font-bold text-white relative overflow-hidden">
            <div
              className={`absolute top-0 right-0 w-8 h-8 ${
                resource.status === "rejected" ? "bg-red-500" : "bg-amber-500"
              } blur-xl opacity-50`}
            />
            <div className="relative z-10 flex items-center justify-between">
              <span className="uppercase tracking-[0.2em]">
                State: {resource.status}
              </span>
              {resource.adminComment && (
                <span className="text-white/30 truncate max-w-[100px]">
                  Comment included
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-auto px-8 pb-8">
        <div className="flex items-center justify-between mb-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-2">
            <Download className="h-3 w-3" />
            <span>{downloadCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>{new Date(uploadedAt).toLocaleDateString()}</span>
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
            className="flex items-center justify-center gap-2 py-3.5 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all shadow-sm"
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
            className="flex items-center justify-center gap-2 py-3.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 active:scale-95"
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
