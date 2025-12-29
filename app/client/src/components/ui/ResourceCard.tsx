import { Link } from "react-router-dom";
import { Download, Star, User, Calendar } from "lucide-react";
import type { Resource } from "../../models";

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
            to={`/resources/${id}`}
            className="hover:text-indigo-600 transition-colors"
          >
            {title}
          </Link>
        </h3>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <User className="h-4 w-4 mr-1.5" />
          <span>
            {author || uploader?.firstName + " " + uploader?.lastName}
          </span>
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
      </div>
      <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
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
            to={`/resources/${id}`}
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
