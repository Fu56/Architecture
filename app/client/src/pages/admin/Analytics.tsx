import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  Users,
  ArrowUpRight,
  Loader2,
  Activity,
  Zap,
  ShieldCheck,
  Box,
  Layers,
} from "lucide-react";
import { api } from "../../lib/api";

interface StatCardProps {
  title: string;
  value: string | number;
  label: string;
  icon: React.ElementType;
  trend?: string;
  color: string;
}

const StatCard = ({
  title,
  value,
  label,
  icon: Icon,
  trend,
  color,
}: StatCardProps) => (
  <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-[#5A270F]/5 border border-[#D9D9C2] group hover:border-[#DF8142]/30 transition-all duration-500 overflow-hidden relative">
    <div
      className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-[0.08] rounded-bl-[4rem] group-hover:opacity-15 transition-opacity`}
    />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-8">
        <div
          className={`p-4 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg group-hover:scale-110 transition-transform`}
        >
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#EEB38C]/20 text-[#5A270F] rounded-full text-[10px] font-black uppercase tracking-wider border border-[#EEB38C]/40">
            <ArrowUpRight className="h-3 w-3" /> {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">
          {title}
        </p>
        <div className="flex items-baseline gap-3">
          <h2 className="text-4xl font-black text-[#2A1205] tracking-tighter">
            {value}
          </h2>
          <span className="text-[10px] font-bold text-[#92664A] uppercase tracking-widest">
            {label}
          </span>
        </div>
      </div>
    </div>
  </div>
);

interface AnalyticsStats {
  totalUsers: number;
  totalResources: number;
  pendingResources: number;
  totalDownloads: number;
  newResourcesLast30Days: number;
}

const Analytics = () => {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-[#D9D9C2] border-t-[#5A270F] rounded-full animate-spin" />
          <Loader2 className="h-8 w-8 text-[#5A270F] animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
          Synchronizing Matrix...
        </p>
      </div>
    );
  }

  const statItems = [
    {
      title: "Network Expansion",
      value: stats?.totalUsers?.toLocaleString() || "0",
      label: "Active Nodes",
      trend: "Dynamic",
      icon: Users,
      color: "from-[#5A270F] to-[#2A1205]",
    },
    {
      title: "Asset Repository",
      value: stats?.totalResources?.toLocaleString() || "0",
      label: "Artifacts",
      trend: "Verified",
      icon: Box,
      color: "from-[#92664A] to-[#6C3B1C]",
    },
    {
      title: "Transmission Volume",
      value: stats?.totalDownloads?.toLocaleString() || "0",
      label: "Data Bursts",
      trend: "Lifetime",
      icon: Download,
      color: "from-[#DF8142] to-[#B85C24]",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Global Intel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {statItems.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Matrix Detail Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-gradient-to-br from-[#5A270F] to-[#2A1205] p-10 sm:p-14 rounded-[4rem] shadow-2xl relative overflow-hidden ring-1 ring-white/10 group shadow-[#5A270F]/20">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-10 w-10 bg-[#DF8142] rounded-xl flex items-center justify-center shadow-lg shadow-[#DF8142]/20">
                <Activity className="h-5 w-5 text-[#2A1205]" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#EEB38C]">
                Matrix Internal Overview
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="bg-[#6C3B1C]/30 border border-[#EEB38C]/10 p-8 rounded-[2.5rem] group/item hover:bg-[#6C3B1C]/50 transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-[10px] font-black text-[#EEB38C]/60 uppercase tracking-[0.2em]">
                    Pending Intelligence
                  </p>
                  <ShieldCheck className="h-4 w-4 text-[#EEB38C]" />
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black text-white tracking-tighter">
                    {stats?.pendingResources}
                  </span>
                  <span className="text-[10px] font-bold text-[#EEB38C] uppercase tracking-widest">
                    Awaiting Verification
                  </span>
                </div>
              </div>

              <div className="bg-[#6C3B1C]/30 border border-[#EEB38C]/10 p-8 rounded-[2.5rem] group/item hover:bg-[#6C3B1C]/50 transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-[10px] font-black text-[#EEB38C]/60 uppercase tracking-[0.2em]">
                    Transmission Velocity
                  </p>
                  <Layers className="h-4 w-4 text-[#DF8142]" />
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black text-white tracking-tighter">
                    {stats?.newResourcesLast30Days}
                  </span>
                  <span className="text-[10px] font-bold text-[#DF8142] uppercase tracking-widest">
                    30-Day Deployment
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-10 rounded-[4rem] shadow-2xl shadow-slate-200 border border-[#D9D9C2] flex flex-col justify-center">
          <div className="mb-10 text-center">
            <div className="h-16 w-16 bg-[#2A1205] rounded-[2rem] flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-[#2A1205]/30">
              <Zap className="h-7 w-7 text-[#DF8142]" />
            </div>
            <h3 className="text-lg font-black text-[#2A1205] tracking-tight">
              Direct Command
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Matrix Override Protocols
            </p>
          </div>

          <div className="space-y-4">
            <Link
              to="/admin/users"
              className="w-full h-16 flex justify-center items-center gap-4 bg-[#2A1205] text-[10px] font-black uppercase tracking-[0.3em] rounded-3xl text-[#EEB38C] hover:bg-[#5A270F] transition-all hover:-translate-y-1 shadow-xl shadow-[#2A1205]/20 active:scale-95"
            >
              Nexus User Log
            </Link>
            <Link
              to="/admin/approvals"
              className="w-full h-16 flex justify-center items-center gap-4 bg-white border-2 border-[#D9D9C2] text-[10px] font-black uppercase tracking-[0.3em] rounded-3xl text-[#5A270F] hover:border-[#5A270F] hover:text-[#2A1205] transition-all active:scale-95"
            >
              Review Artifacts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
