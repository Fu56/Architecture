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
      <div className="flex flex-col justify-center items-center py-24 space-y-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-xl border-2 border-[#EEB38C]/20 border-t-[#DF8142] animate-spin" />
          <Loader2 className="h-6 w-6 absolute top-3 left-3 animate-pulse text-[#DF8142]" />
        </div>
        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#92664A] dark:text-[#EEB38C]/40 animate-pulse">
          Synching Archives...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="relative bg-[#5A270F] dark:bg-[#1A0B02] rounded-3xl p-6 sm:p-8 text-white overflow-hidden shadow-xl border border-white/5 transition-colors duration-500">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none architectural-grid" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#DF8142]/20 blur-[80px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#EEB38C]/10 blur-[60px] translate-y-1/2 -translate-x-1/2" />
 
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/10 border border-white/10 rounded-full text-[8.5px] font-black uppercase tracking-[0.2em] text-[#EEB38C] mb-5">
            <Archive className="h-3 w-3" /> PERSONAL REPOSITORY
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tighter mb-3 uppercase italic">
            Digital <span className="text-[#DF8142] not-italic">Archives</span>
          </h1>
          <p className="max-w-md text-white/40 text-[9px] font-black uppercase tracking-widest leading-relaxed mb-6">
            Manage your architectural transmissions, monitor metrics, and track your contribution footprint within the nexus.
          </p>
 
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Nodes", value: stats.total, icon: Archive, color: "text-white" },
              { label: "Verified", value: stats.approved, icon: CheckCircle2, color: "text-emerald-400" },
              { label: "Processing", value: stats.pending, icon: Clock, color: "text-[#DF8142]" },
              { label: "Void", value: stats.rejected, icon: XCircle, color: "text-rose-400" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col gap-0.5 hover:bg-white/10 transition-all duration-300 group">
                <stat.icon className={`h-3 w-3 ${stat.color} mb-0.5 opacity-60 group-hover:opacity-100`} />
                <span className="text-xl font-black leading-none text-white">{stat.value}</span>
                <span className="text-[7.5px] font-black uppercase tracking-widest text-white/40">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      {resources.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-[#DF8142] animate-pulse" />
              <p className="text-[8.5px] font-black uppercase tracking-widest text-[#92664A] dark:text-[#EEB38C]/40 transition-colors">
                Registry: {resources.length} Node Nodes
              </p>
            </div>
            <Link
              to="/dashboard/upload"
              className="text-[8.5px] font-black uppercase tracking-widest text-[#5A270F] dark:text-[#EEB38C] hover:text-[#DF8142] flex items-center gap-1.5 group transition-colors"
            >
              Init Transmission
              <ArrowRight className="h-2.5 w-2.5 group-hover:translate-x-1 transition-transform" />
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
        <div className="relative group overflow-hidden bg-white dark:bg-[#1A0B02] border border-[#D9D9C2] dark:border-white/5 rounded-2xl py-20 text-center px-6 transition-all duration-500 shadow-xl shadow-[#5A270F]/5">
          <div className="absolute inset-0 bg-[#EEB38C]/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10 max-w-xs mx-auto">
            <div className="h-20 w-20 bg-[#FAF8F4] dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-[#D9D9C2] dark:border-white/5 group-hover:scale-110 transition-transform duration-500">
              <Upload className="h-8 w-8 text-[#EEB38C] dark:text-white/20" />
            </div>
            <h3 className="text-xl font-black text-[#5A270F] dark:text-[#EEB38C] mb-2 tracking-tight transition-colors italic uppercase">
              Registry Void
            </h3>
            <p className="text-[#92664A] dark:text-[#EEB38C]/40 text-[8.5px] font-black uppercase tracking-[0.2em] leading-relaxed mb-8 transition-colors">
              You haven't initialized any digital transmissions yet. Share your architectural assets to build your professional node.
            </p>
            <Link
              to="/dashboard/upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#5A270F] text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-[#6C3B1C] transition-all shadow-lg active:scale-95 group/btn"
            >
              Launch First Upload
              <Sparkles className="h-3.5 w-3.5 text-[#DF8142] group-hover/btn:animate-spin" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyUploads;

