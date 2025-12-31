import { useEffect, useState } from "react";
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
  <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-100 border border-slate-100 group hover:border-indigo-500/20 transition-all duration-500 overflow-hidden relative">
    <div
      className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-[0.03] rounded-bl-[4rem] group-hover:opacity-10 transition-opacity`}
    />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-8">
        <div
          className={`p-4 rounded-2xl bg-gradient-to-br ${color} text-white shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform`}
        >
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-100">
            <ArrowUpRight className="h-3 w-3" /> {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">
          {title}
        </p>
        <div className="flex items-baseline gap-3">
          <h2 className="text-4xl font-black text-slate-950 tracking-tighter">
            {value}
          </h2>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
          <div className="h-16 w-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
          <Loader2 className="h-8 w-8 text-indigo-600 animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
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
      color: "from-indigo-600 to-indigo-800",
    },
    {
      title: "Asset Repository",
      value: stats?.totalResources?.toLocaleString() || "0",
      label: "Artifacts",
      trend: "Verified",
      icon: Box,
      color: "from-purple-600 to-purple-800",
    },
    {
      title: "Transmission Volume",
      value: stats?.totalDownloads?.toLocaleString() || "0",
      label: "Data Bursts",
      trend: "Lifetime",
      icon: Download,
      color: "from-emerald-600 to-emerald-800",
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
        <div className="lg:col-span-8 bg-slate-950 p-10 sm:p-14 rounded-[4rem] shadow-3xl relative overflow-hidden ring-1 ring-white/10 group">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-10 w-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">
                Matrix Internal Overview
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] group/item hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                    Pending Intelligence
                  </p>
                  <ShieldCheck className="h-4 w-4 text-orange-500" />
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black text-white tracking-tighter">
                    {stats?.pendingResources}
                  </span>
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                    Awaiting Verification
                  </span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] group/item hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                    Transmission Velocity
                  </p>
                  <Layers className="h-4 w-4 text-indigo-400" />
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black text-white tracking-tighter">
                    {stats?.newResourcesLast30Days}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                    30-Day Deployment
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-10 rounded-[4rem] shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col justify-center">
          <div className="mb-10 text-center">
            <div className="h-16 w-16 bg-slate-950 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-6 shadow-2xl">
              <Zap className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-black text-slate-950 tracking-tight">
              Direct Command
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Matrix Override Protocols
            </p>
          </div>

          <div className="space-y-4">
            <button className="w-full h-16 flex justify-center items-center gap-4 bg-slate-950 text-[10px] font-black uppercase tracking-[0.3em] rounded-3xl text-white hover:bg-indigo-600 transition-all hover:-translate-y-1 shadow-2xl shadow-slate-950/20 active:scale-95">
              Nexus User Log
            </button>
            <button className="w-full h-16 flex justify-center items-center gap-4 bg-white border-2 border-slate-100 text-[10px] font-black uppercase tracking-[0.3em] rounded-3xl text-slate-950 hover:border-indigo-500 hover:text-indigo-600 transition-all active:scale-95">
              Review Artifacts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
