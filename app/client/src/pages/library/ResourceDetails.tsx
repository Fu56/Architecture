import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/api";
import type { Resource, Comment } from "../../models";
import { Loader2, ServerCrash, Download, User, Flag } from "lucide-react";

const ResourceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/resources/${id}`);
        setResource(data);
        setComments(data.comments || []);
      } catch (err) {
        console.error("Failed to fetch resource details:", err);
        setError(
          "Could not load the resource. It may have been removed or the link is incorrect."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto text-center py-20 bg-red-50 rounded-lg my-8">
        <ServerCrash className="h-12 w-12 text-red-500 mx-auto" />
        <p className="mt-4 text-lg font-medium text-red-700">{error}</p>
      </div>
    );
  }

  if (!resource) return null;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-bold uppercase px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                {resource.fileType}
              </span>
              {resource.status !== "approved" && (
                <span
                  className={`text-sm font-bold uppercase px-3 py-1 rounded-full ${
                    resource.status === "pending"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {resource.status}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4">
              {resource.title}
            </h1>
            <div className="flex items-center text-md text-gray-600 mt-2">
              <User className="h-5 w-5 mr-2 text-gray-400" />
              <span>Authored by {resource.author}</span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            {/* Placeholder for a resource description if available */}
            <p>
              This section can contain a brief description or abstract of the
              resource, providing users with more context before they download.
            </p>
          </div>

          {/* Comments Section */}
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Community Discussion
            </h2>
            {/* New Comment Form */}
            <div className="mb-8">{/* Add form here */}</div>
            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {comment.user.firstName} {comment.user.lastName}
                      </p>
                      <p className="text-gray-600">{comment.text}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No comments yet. Be the first to share your thoughts!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <a
              href={`${import.meta.env.VITE_API_URL}/resources/${
                resource.id
              }/download`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Download className="h-5 w-5" />
              Download File
            </a>
            <div className="mt-6 space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Downloads</span>{" "}
                <span>{resource.downloadCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">File Size</span>{" "}
                <span>{resource.fileSize.toFixed(2)} MB</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Uploaded</span>{" "}
                <span>
                  {new Date(resource.uploadedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Uploader</span>{" "}
                <span>{resource.uploader.firstName}</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-bold text-lg mb-4">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {resource.keywords.map((k) => (
                <span
                  key={k}
                  className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1.5 rounded-full"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
          <div className="text-center">
            <button className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600">
              <Flag className="h-4 w-4" />
              Report this resource
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetails;
