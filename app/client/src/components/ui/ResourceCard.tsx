import { Link } from "react-router-dom";
import { Download, Star, User, Calendar, Eye } from "lucide-react";
import type { Resource } from "../../models";
import { isAuthenticated, currentRole } from "../../lib/auth";

interface ResourceCardProps {
  resource: Resource;
}

const fileTypeStyles: { [key: string]: string } = {
  pdf: "bg-red-100 text-red-800",
  docx: "bg-blue-100 text-blue-800",
  jpeg: "bg-green-100 text-green-800",
  png: "bg-green-100 text-green-800",
  mp4: "bg-purple-100 text-purple-800",
  rfa: "bg-yellow-100 text-yellow-800",
  skp: "bg-orange-100 text-orange-800",
  default: "bg-gray-100 text-gray-800",
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

  const typeStyle =
    (fileType && fileTypeStyles[fileType.toLowerCase()]) ||
    fileTypeStyles.default;

  // Safeguard against missing or raw uploader data
  const uploaderName = uploader
    ? uploader.firstName && uploader.lastName
      ? `${uploader.firstName} ${uploader.lastName}`
      : uploader.first_name && uploader.last_name
      ? `${uploader.first_name} ${uploader.last_name}`
      : "Anonymous"
    : "Anonymous";

  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex items-start justify-between mb-3">
          <span
            className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full ${typeStyle}`}
          >
            {fileType}
          </span>
          {priority && (
            <div className="flex items-center gap-1 text-sm font-semibold text-yellow-600">
              <Star className="h-4 w-4" />
              <span>Priority</span>
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
          <Link
            to={detailPath}
            className="hover:text-indigo-600 transition-colors"
          >
            {title}
          </Link>
        </h3>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <User className="h-4 w-4 mr-1.5" />
          <span>{author || uploaderName}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {Array.isArray(keywords) &&
            keywords.slice(0, 3).map((keyword) => (
              <span
                key={keyword}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
              >
                {keyword}
              </span>
            ))}
        </div>
        {resource.status && resource.status !== "student" && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                resource.status === "rejected"
                  ? "bg-red-50 text-red-600 border border-red-100"
                  : "bg-amber-50 text-amber-600 border border-amber-100"
              }`}
            >
              Status: {resource.status}
            </span>
            {resource.adminComment && (
              <p className="text-xs text-gray-500 mt-1 italic line-clamp-2">
                "{resource.adminComment}"
              </p>
            )}
          </div>
        )}
      </div>
      <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Download className="h-4 w-4 text-gray-400" />
              <span>{downloadCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{new Date(uploadedAt).toLocaleDateString()}</span>
            </div>
            <Link
              to={detailPath}
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Details
            </Link>
          </div>

          <div className="flex gap-2">
            <a
              href={`${
                import.meta.env.VITE_API_URL
              }/resources/${id}/view?token=${encodeURIComponent(
                localStorage.getItem("token") || ""
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </a>
            <a
              href={`${
                import.meta.env.VITE_API_URL
              }/resources/${id}/download?token=${encodeURIComponent(
                localStorage.getItem("token") || ""
              )}`}
              download
              className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
