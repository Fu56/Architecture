import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import type { Resource } from "../../models";

const ApproveResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/admin/resources/pending");
        setResources(data);
      } catch {
        setError("Failed to fetch resources for approval.");
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const handleApprove = async (id: number, comment?: string) => {
    try {
      await api.patch(`/admin/resources/${id}/approve`, { comment });
      setResources(resources.filter((r) => r.id !== id));
    } catch {
      console.error("Failed to approve resource");
    }
  };

  const handleReject = async (id: number, reason?: string) => {
    try {
      await api.patch(`/admin/resources/${id}/reject`, { reason });
      setResources(resources.filter((r) => r.id !== id));
    } catch {
      console.error("Failed to reject resource");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Approve Resources</h2>
      <div className="space-y-4">
        {resources.map((resource) => (
          <ResourceApprovalCard
            key={resource.id}
            resource={resource}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))}
        {resources.length === 0 && !loading && (
          <p className="text-gray-500 text-center py-8">
            No pending resources found.
          </p>
        )}
      </div>
    </div>
  );
};

const ResourceApprovalCard = ({
  resource,
  onApprove,
  onReject,
}: {
  resource: Resource;
  onApprove: (id: number, comment?: string) => void;
  onReject: (id: number, reason?: string) => void;
}) => {
  const [comment, setComment] = useState("");

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">{resource.title}</h3>
          <div className="text-sm text-gray-600 mt-1 space-y-1">
            <p>
              Uploaded by:{" "}
              <span className="font-medium text-gray-900">
                {resource.uploader.firstName} {resource.uploader.lastName}
              </span>
            </p>
            <p>
              Design Stage:{" "}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EEB38C]/20 text-[#5A270F]">
                {resource.designStage?.name || "Unspecified"}
              </span>
            </p>
            <p>
              For Year:{" "}
              {resource.batchYear ? `Batch ${resource.batchYear}` : "N/A"}
            </p>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          {new Date(resource.uploadedAt).toLocaleDateString()}
        </div>
      </div>

      <div className="mt-4">
        <textarea
          placeholder="Add a comment or rejection reason (optional)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full text-sm p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90"
          rows={2}
        />
        <div className="flex justify-end gap-3 mt-3">
          <a
            href={`${import.meta.env.VITE_API_URL}/resources/${
              resource.id
            }/view?token=${encodeURIComponent(
              localStorage.getItem("token") || ""
            )}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 text-sm font-medium text-primary/90 bg-primary/10 rounded-md hover:bg-primary/20 border border-transparent flex items-center gap-1"
          >
            Review Resource
          </a>
          <button
            onClick={() => onReject(resource.id, comment)}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 border border-transparent"
          >
            Reject
          </button>
          <button
            onClick={() => onApprove(resource.id, comment)}
            className="px-4 py-2 text-sm font-medium text-white bg-[#2A1205] rounded-md hover:bg-[#2A1205]/90 shadow-sm"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveResources;
