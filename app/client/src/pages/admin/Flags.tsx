import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import type { Flag as FlagModel } from "../../models";
import { Loader2, Eye, Archive, ShieldCheck, Flag, User } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Flags = () => {
  const [flags, setFlags] = useState<FlagModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlags = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/admin/flags");
        if (data && Array.isArray(data.flags)) {
          setFlags(data.flags);
        }
      } catch (err) {
        console.error("Failed to fetch flags:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlags();
  }, []);

  const handleResolveFlag = async (flagId: number) => {
    // Optimistic update
    setFlags((prev) => prev.filter((f) => f.id !== flagId));
    try {
      await api.patch(`/admin/flags/${flagId}/resolve`, { status: "resolved" });
      toast.success("Flag dismissed successfully");
    } catch (err) {
      console.error("Failed to resolve flag:", err);
      toast.error("Failed to dismiss flag");
      // Refresh to be safe
      const { data } = await api.get("/admin/flags");
      if (data && Array.isArray(data.flags)) setFlags(data.flags);
    }
  };

  const handleArchiveResource = async (resourceId: number, flagId: number) => {
    // Optimistic update
    setFlags((prev) => prev.filter((f) => f.id !== flagId));
    try {
      await api.patch(`/admin/resources/${resourceId}/archive`);
      await api.patch(`/admin/flags/${flagId}/resolve`, { status: "resolved" });
      toast.success("Resource archived and flag resolved");
    } catch (err) {
      console.error("Failed to archive resource:", err);
      toast.error("Failed to archive resource");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Flagged Content
        </h2>
        <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider">
          {flags.length} Issues Pending
        </span>
      </div>

      {flags.length > 0 ? (
        <div className="grid gap-6">
          {flags.map((flag) => (
            <div
              key={flag.id}
              className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-black uppercase rounded-md border border-red-100">
                        Urgent Review
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        Reported on{" "}
                        {new Date(flag.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Link
                      to={`/resources/${flag.resourceId}`}
                      className="block text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors"
                    >
                      {flag.resource.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>
                          Uploader:{" "}
                          <span className="font-bold text-gray-700">
                            {flag.resource.uploader?.firstName}{" "}
                            {flag.resource.uploader?.lastName}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Flag className="h-4 w-4 text-gray-400" />
                        <span>
                          Reporter:{" "}
                          <span className="font-bold text-gray-700">
                            {flag.reporter.firstName} {flag.reporter.lastName}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/resources/${flag.resourceId}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-bold rounded-xl hover:bg-indigo-100 transition-colors"
                    >
                      <Eye className="h-4 w-4" /> View
                    </Link>
                    <button
                      onClick={() =>
                        handleArchiveResource(flag.resourceId, flag.id)
                      }
                      className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 text-sm font-bold rounded-xl hover:bg-amber-100 transition-colors"
                    >
                      <Archive className="h-4 w-4" /> Archive
                    </button>
                    <button
                      onClick={() => handleResolveFlag(flag.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 text-sm font-bold rounded-xl hover:bg-green-100 transition-colors"
                    >
                      <ShieldCheck className="h-4 w-4" /> Dismiss
                    </button>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">
                    Report Reason
                  </p>
                  <p className="text-gray-700 font-medium">
                    {flag.reason || "No reason provided."}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white border border-dashed rounded-3xl">
          <div className="p-4 bg-gray-50 rounded-full w-fit mx-auto mb-4">
            <ShieldCheck className="h-12 w-12 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 tracking-tight">
            Clear Horizon
          </h3>
          <p className="text-gray-500 mt-2 max-w-xs mx-auto">
            All reports have been processed. Your library is in good shape.
          </p>
        </div>
      )}
    </div>
  );
};

export default Flags;
