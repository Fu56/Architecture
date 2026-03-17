import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import type { Resource } from "../../models";
import { useSession } from "../../lib/auth-client";

const ApproveResources = () => {
  const { data: session } = useSession();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const user = session?.user as any;
  const role = typeof user?.role === "object" ? user.role.name : user?.role;
  const isAuthorized = role === "DepartmentHead";

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
    <div className="space-y-6">
      <h2 className="text-xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter uppercase italic">
        Approve <span className="not-italic text-[#DF8142]">Resources</span>
      </h2>
      <div className="space-y-3">
        {resources.map((resource) => (
          <ResourceApprovalCard
            key={resource.id}
            resource={resource}
            onApprove={handleApprove}
            onReject={handleReject}
            isAuthorized={isAuthorized}
          />
        ))}
        {resources.length === 0 && !loading && (
          <p className="text-[10px] text-gray-500 dark:text-[#EEB38C]/40 text-center py-12 font-black uppercase tracking-[0.2em]">
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
  isAuthorized,
}: {
  resource: Resource;
  onApprove: (id: number, comment?: string) => void;
  onReject: (id: number, reason?: string) => void;
  isAuthorized: boolean;
}) => {
  const [comment, setComment] = useState("");

  return (
    <div className="p-5 border border-[#D9D9C2] dark:border-[#DF8142]/20 rounded-xl bg-white dark:bg-[#1A0B04] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-black text-sm text-[#5A270F] dark:text-[#EEB38C] tracking-tight italic uppercase">
            {resource.title}
          </h3>
          <div className="text-[9px] text-[#92664A] dark:text-white/50 mt-1.5 space-y-1 font-black uppercase tracking-widest leading-none">
            <p className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-[#DF8142]" />
              Uploaded by:{" "}
              <span className="text-[#5A270F] dark:text-[#EEB38C]">
                {resource.uploader.firstName} {resource.uploader.lastName}
              </span>
            </p>
            <p className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-[#BCAF9C]" />
              Design Stage:{" "}
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[8px] font-black bg-[#EEB38C]/20 text-[#5A270F] dark:text-[#EEB38C] border border-[#EEB38C]/40">
                {resource.designStage?.name || "Unspecified"}
              </span>
            </p>
            <p className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-[#BCAF9C]" />
              For Year:{" "}
              <span className="text-[#5A270F] dark:text-[#EEB38C]">
                {resource.batchYear ? `Batch ${resource.batchYear}` : "N/A"}
              </span>
            </p>
          </div>
        </div>
        <div className="text-[8px] font-black text-gray-400 dark:text-white/30 uppercase tracking-[0.2em] bg-[#EFEDED] dark:bg-white/5 px-2 py-1 rounded-md">
          {new Date(resource.uploadedAt).toLocaleDateString()}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-50 dark:border-white/5">
        <textarea
          placeholder="Add a comment or rejection reason (optional)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full text-[10px] font-medium p-3 bg-[#EFEDED]/50 dark:bg-white/5 border border-[#D9D9C2] dark:border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#DF8142] resize-none"
          rows={2}
        />
        <div className="flex justify-end gap-2 mt-3">
          <a
            href={`${import.meta.env.VITE_API_URL}/resources/${
              resource.id
            }/view?token=${encodeURIComponent(
              localStorage.getItem("token") || ""
            )}`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-[#5A270F] dark:text-[#EEB38C] bg-[#EEB38C]/10 rounded-lg hover:bg-[#EEB38C]/20 border border-transparent flex items-center gap-1 transition-all"
          >
            Review Resource
          </a>
          {isAuthorized && (
            <>
              <button
                onClick={() => onReject(resource.id, comment)}
                className="px-3.5 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-rose-700 bg-red-50 dark:bg-rose-900/10 rounded-lg hover:bg-red-100 dark:hover:bg-rose-900/20 border border-transparent transition-all"
              >
                Reject
              </button>
              <button
                onClick={() => onApprove(resource.id, comment)}
                className="px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-white bg-[#5A270F] rounded-lg hover:bg-[#2A1205] shadow-md transition-all active:scale-95"
              >
                Approve
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApproveResources;
