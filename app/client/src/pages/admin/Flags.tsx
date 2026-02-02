import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import type { Flag as FlagModel } from "../../models";
import {
  Loader2,
  Eye,
  Archive,
  ShieldCheck,
  Flag,
  User,
  ShieldAlert,
  AlertTriangle,
  Zap,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Flags = () => {
  const [flags, setFlags] = useState<FlagModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlags();
  }, []);

  const fetchFlags = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/flags");
      if (data && Array.isArray(data.flags)) {
        setFlags(data.flags);
      }
    } catch (err) {
      console.error("Failed to fetch flags:", err);
      toast.error("Security Interface: Failed to synchronize breach reports");
    } finally {
      setLoading(false);
    }
  };

  const handleResolveFlag = async (flagId: number) => {
    // Optimistic update
    setFlags((prev) => prev.filter((f) => f.id !== flagId));
    try {
      await api.patch(`/admin/flags/${flagId}/resolve`, { status: "resolved" });
      toast.success("Security Alert dismissed successfully");
    } catch (err) {
      console.error("Failed to resolve flag:", err);
      toast.error("Protocol Error: Failed to dismiss alert");
      fetchFlags();
    }
  };

  const handleArchiveResource = async (resourceId: number, flagId: number) => {
    // Optimistic update
    setFlags((prev) => prev.filter((f) => f.id !== flagId));
    try {
      await api.patch(`/admin/resources/${resourceId}/archive`);
      await api.patch(`/admin/flags/${flagId}/resolve`, { status: "resolved" });
      toast.success("Asset quarantined and alert resolved");
    } catch (err) {
      console.error("Failed to archive resource:", err);
      toast.error("Security Breach: Failed to quarantine asset");
      fetchFlags();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-[#D9D9C2] border-t-rose-600 rounded-full animate-spin" />
          <Loader2 className="h-8 w-8 text-rose-600 animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
          Scanning for Breaches...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between bg-[#EFEDED] p-6 rounded-[2.5rem] border border-[#D9D9C2] shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="h-10 w-10 bg-[#2A1205] rounded-xl flex items-center justify-center text-white shadow-lg">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#2A1205]">
              Security Violation Detection
            </h3>
            <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">
              Protocol: Active Scan
            </p>
          </div>
        </div>
        <div className="px-4 py-1.5 bg-red-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100 relative z-10">
          {flags.length} Breach Reports
        </div>
      </div>

      {flags.length > 0 ? (
        <div className="grid gap-8">
          {flags.map((flag) => (
            <div
              key={flag.id}
              className="bg-white rounded-[3.5rem] border border-[#D9D9C2] shadow-2xl shadow-slate-200/60 overflow-hidden group hover:border-rose-500/10 transition-all duration-300"
            >
              <div className="p-8 sm:p-12">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-red-700 text-white text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3" /> Urgent Review
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        <Clock className="h-3 w-3" />
                        Detected:{" "}
                        {new Date(flag.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Link
                      to={`/resources/${flag.resourceId}`}
                      className="block text-3xl font-black text-[#2A1205] tracking-tighter hover:text-rose-600 transition-colors"
                    >
                      {flag.resource.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <div className="flex items-center gap-2 px-3 py-1 bg-[#EFEDED] rounded-full border border-[#D9D9C2]">
                        <User className="h-3.5 w-3.5 text-gray-500" />
                        <span className="text-[#5A270F]">
                          Source:{" "}
                          <span className="font-black text-[#2A1205]">
                            {
                              (flag.resource.uploader as { firstName?: string })
                                .firstName
                            }{" "}
                            {
                              (flag.resource.uploader as { lastName?: string })
                                .lastName
                            }
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-red-50 rounded-full border border-rose-100">
                        <Flag className="h-3.5 w-3.5 text-rose-400" />
                        <span className="text-rose-600">
                          Reporter:{" "}
                          <span className="font-black">
                            {
                              (flag.reporter as { firstName?: string })
                                .firstName
                            }{" "}
                            {(flag.reporter as { lastName?: string }).lastName}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      to={`/resources/${flag.resourceId}`}
                      className="h-14 flex items-center gap-4 px-8 bg-white border-2 border-[#D9D9C2] text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl text-[#2A1205] hover:border-primary/90 hover:text-primary transition-all active:scale-95 shadow-lg shadow-slate-100"
                    >
                      <Eye className="h-4 w-4" /> Inspect
                    </Link>
                    <button
                      onClick={() =>
                        handleArchiveResource(flag.resourceId, flag.id)
                      }
                      className="h-14 flex items-center gap-4 px-8 bg-white border-2 border-amber-100 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl text-amber-600 hover:bg-amber-50 transition-all active:scale-95 shadow-lg shadow-amber-50"
                    >
                      <Archive className="h-4 w-4" /> Quarantine
                    </button>
                    <button
                      onClick={() => handleResolveFlag(flag.id)}
                      className="h-14 flex items-center gap-4 px-8 bg-[#2A1205] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#5A270F] transition-all hover:-translate-y-1 shadow-2xl shadow-[#2A1205]/20 active:scale-95"
                    >
                      <ShieldCheck className="h-4 w-4" /> Dismiss Report
                    </button>
                  </div>
                </div>

                <div className="bg-[#EFEDED] rounded-[2.5rem] p-8 sm:p-10 border border-[#D9D9C2] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-5">
                    <ShieldAlert className="h-32 w-32" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4 flex items-center gap-2">
                      <Zap className="h-3 w-3 text-red-700" /> Evidence
                      Abstract
                    </p>
                    <p className="text-lg font-medium text-[#5A270F] leading-relaxed italic">
                      "
                      {flag.reason ||
                        "Automatic detection signal: No reason provided by reporter."}
                      "
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-[#EFEDED] rounded-[4rem] border border-dashed border-[#D9D9C2]">
          <div className="h-24 w-24 bg-white rounded-[2.5rem] flex items-center justify-center text-emerald-400 mx-auto mb-8 shadow-xl">
            <ShieldCheck className="h-12 w-12" />
          </div>
          <h3 className="text-2xl font-black text-[#2A1205] tracking-tight">
            Security Perimeter Clear
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-2 max-w-xs mx-auto uppercase tracking-widest leading-loose">
            No active security violations detected in the registry. Current
            status: OPTIMAL.
          </p>
        </div>
      )}
    </div>
  );
};

export default Flags;
