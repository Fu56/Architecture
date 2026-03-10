import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import type { Resource } from "../../models";
import ResourceCard from "../../components/ui/ResourceCard";
import {
  Loader2,
  Upload,
  Archive,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const MyUploads = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyUploads = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/user/resources");
        if (Array.isArray(data)) {
          setResources(data);
        }
      } catch (err) {
        console.error("Failed to fetch user uploads:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyUploads();
  }, []);

  const stats = {
    total: resources.length,
    approved: resources.filter((r) => r.status === "approved" || r.status === "student").length,
    pending: resources.filter((r) => r.status === "pending").length,
    rejected: resources.filter((r) => r.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 space-y-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl border-4 border-[#EEB38C]/20 border-t-[#DF8142] animate-spin" />
          <Loader2 className="h-8 w-8 absolute top-4 left-4 animate-pulse text-[#DF8142]" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-[#92664A] dark:text-[#EEB38C]/40 animate-pulse">
          Synching Digital Archives...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="relative bg-[#FAF8F4] dark:bg-[#5A270F] rounded-[2.5rem] p-8 sm:p-12 text-[#5A270F] dark:text-white overflow-hidden shadow-xl dark:shadow-2xl border border-black/5 dark:border-white/5 transition-colors duration-500">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none architectural-grid" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#DF8142]/10 blur-[80px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#EEB38C]/10 blur-[60px] translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EEB38C]/10 border border-[#EEB38C]/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#EEB38C] mb-6">
            <Archive className="h-3.5 w-3.5" /> PERSONAL REPOSITORY
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Digital <br />
            <span className="text-[#DF8142]">Archives</span>
          </h1>
          <p className="max-w-md text-[#5A270F]/60 dark:text-[#EEB38C]/60 text-sm font-black tracking-tight leading-relaxed mb-8 transition-colors">
            Manage your architectural transmissions, monitor approval statuses, and track your contribution footprint within the system matrix.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Assets", value: stats.total, icon: Archive, color: "text-white" },
              { label: "Approved", value: stats.approved, icon: CheckCircle2, color: "text-emerald-400" },
              { label: "Pending", value: stats.pending, icon: Clock, color: "text-[#DF8142]" },
              { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-rose-400" },
            ].map((stat, i) => (
              <div key={i} className="bg-[#EFEDED] dark:bg-white/5 backdrop-blur-md border border-black/5 dark:border-white/10 rounded-2xl p-4 flex flex-col gap-1 hover:bg-[#D9D9C2] dark:hover:bg-white/10 transition-all duration-300 group">
                <stat.icon className={`h-4 w-4 ${stat.color} mb-1 opacity-60 group-hover:opacity-100 transition-opacity`} />
                <span className="text-2xl font-black leading-none text-[#5A270F] dark:text-white">{stat.value}</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-[#5A270F]/40 dark:text-white/40">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      {resources.length > 0 ? (
        <div className="space-y-8">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-[#DF8142] animate-pulse" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#92664A] dark:text-foreground/40 transition-colors">
                Isolated {resources.length} Transmission Nodes
              </p>
            </div>
            <Link
              to="/dashboard/upload"
              className="text-[10px] font-black uppercase tracking-widest text-[#5A270F] dark:text-[#EEB38C] hover:text-[#DF8142] flex items-center gap-2 group transition-colors"
            >
              Initialize New Node
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {resources.map((resource) => (
              <div key={resource.id} className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                <ResourceCard resource={resource} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative group overflow-hidden bg-white dark:bg-card border-2 border-dashed border-[#EEB38C]/40 dark:border-white/10 rounded-[3rem] py-24 text-center px-6 transition-all duration-500">
          <div className="absolute inset-0 bg-[#EEB38C]/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10 max-w-sm mx-auto">
            <div className="h-24 w-24 bg-[#EFEDED] dark:bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-[#D9D9C2] dark:border-white/10 group-hover:scale-110 transition-transform duration-500">
              <Upload className="h-10 w-10 text-[#EEB38C] dark:text-white/20" />
            </div>
            <h3 className="text-2xl font-black text-[#5A270F] dark:text-[#EEB38C] mb-3 tracking-tight transition-colors italic uppercase">
              Archives Empty
            </h3>
            <p className="text-[#5A270F]/40 dark:text-foreground/50 text-[10px] font-black uppercase tracking-widest leading-relaxed mb-10 transition-colors">
              You haven't initialized any digital transmissions yet. Share your architectural assets to build your professional registry.
            </p>
            <Link
              to="/dashboard/upload"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#5A270F] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#6C3B1C] transition-all shadow-xl shadow-[#5A270F]/20 hover:-translate-y-1 active:scale-95 group/btn"
            >
              Launch First Upload
              <Sparkles className="h-4 w-4 text-[#DF8142] group-hover/btn:animate-spin" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyUploads;

