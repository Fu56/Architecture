import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import type { Resource } from "../../models";
import { Loader2, Check, X, Eye, CheckSquare } from "lucide-react";
import { Link } from "react-router-dom";

const Approvals = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [comments, setComments] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingResources = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/admin/resources/pending");
        if (Array.isArray(data)) {
          setResources(data);
        }
      } catch (err) {
        console.error("Failed to fetch pending resources:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingResources();
  }, []);

  const handleDecision = async (
    resourceId: number,
    status: "approved" | "rejected"
  ) => {
    const feedback = comments[resourceId] || "";
    // Optimistic update
    setResources(resources.filter((r) => r.id !== resourceId));
    try {
      if (status === "approved") {
        await api.patch(`/admin/resources/${resourceId}/approve`, {
          comment: feedback,
        });
      } else {
        await api.patch(`/admin/resources/${resourceId}/reject`, {
          reason: feedback,
        });
      }
    } catch (err) {
      console.error(`Failed to set status to ${status}:`, err);
      // Optional: fetch resources again to revert state if failed
    }
  };

  const handleCommentChange = (resourceId: number, value: string) => {
    setComments((prev) => ({ ...prev, [resourceId]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div>
      {resources.length > 0 ? (
        <div className="space-y-6">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col gap-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-1">
                  <Link
                    to={`/resources/${resource.id}`}
                    className="font-black text-xl text-gray-900 hover:text-indigo-600 transition-colors"
                  >
                    {resource.title}
                  </Link>
                  <p className="text-sm text-gray-500 font-medium">
                    Uploaded by{" "}
                    <span className="text-indigo-600 font-bold">
                      {resource.uploader.firstName} {resource.uploader.lastName}
                    </span>{" "}
                    • {new Date(resource.uploadedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`${import.meta.env.VITE_API_URL}/resources/${
                      resource.id
                    }/view?token=${encodeURIComponent(
                      localStorage.getItem("token") || ""
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-blue-200 shadow-sm text-sm font-bold rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all hover:scale-105"
                  >
                    <Eye className="h-4 w-4" /> Review File
                  </a>
                </div>
              </div>

              {/* Comment Input */}
              <div className="relative">
                <textarea
                  placeholder="Reviewer comment or rejection reason... (optional)"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none resize-none"
                  rows={2}
                  value={comments[resource.id] || ""}
                  onChange={(e) =>
                    handleCommentChange(resource.id, e.target.value)
                  }
                />
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-gray-50">
                <button
                  onClick={() => handleDecision(resource.id, "rejected")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-transparent shadow-md text-sm font-black rounded-xl text-white bg-red-500 hover:bg-red-600 transition-all hover:scale-105 active:scale-95"
                >
                  <X className="h-4 w-4" /> Reject
                </button>
                <button
                  onClick={() => handleDecision(resource.id, "approved")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-transparent shadow-md text-sm font-black rounded-xl text-white bg-green-500 hover:bg-green-600 transition-all hover:scale-105 active:scale-95"
                >
                  <Check className="h-4 w-4" /> Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-800">
            Approval Queue is Empty
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No new resources are waiting for review.
          </p>
        </div>
      )}
    </div>
  );
};

export default Approvals;
