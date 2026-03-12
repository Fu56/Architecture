import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  Users,
  Loader2,
  Activity,
  Zap,
  ShieldCheck,
  Box,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { api } from "../../lib/api";
import { useSession } from "../../lib/auth-client";

interface UserWithRole {
  id: string | number;
  email: string;
  name?: string;
  role?: { name: string } | string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  label: string;
  icon: React.ElementType;
  trend?: string;
  gradient: string;
  accent: string;
}

const StatCard = ({
  title,
  value,
  label,
  icon: Icon,
  trend,
  gradient,
  accent,
}: StatCardProps) => (
  <div className="bg-white dark:bg-[#1A0B04] p-8 rounded-[3rem] shadow-2xl shadow-[#5A270F]/5 border border-[#D9D9C2] dark:border-white/5 group hover:border-[#DF8142]/30 transition-all duration-700 overflow-hidden relative">
    <div
      className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${gradient} opacity-[0.03] group-hover:opacity-[0.08] rounded-bl-full transition-opacity duration-700`}
    />
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-10">
        <div
          className={`p-4 rounded-[1.5rem] bg-gradient-to-br ${gradient} text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}
        >
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1.5 px-4 py-1.5 bg-[#EEB38C]/10 rounded-full border border-[#EEB38C]/20 text-[9px] font-black uppercase tracking-[0.2em] transform group-hover:translate-x-1 transition-all duration-500 ${accent}`}>
            <Sparkles className="h-3 w-3" /> {trend}
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-3">
            <h2 className="text-5xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter transition-colors">
              {value}
            </h2>
            <div className="h-2 w-2 rounded-full bg-[#DF8142] animate-pulse" />
          </div>
        </div>
        
        <p className="text-[11px] font-black text-[#92664A]/60 dark:text-white/20 uppercase tracking-[0.2em]">
          {label}
        </p>
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
  const { data: session } = useSession();

  const user = session?.user as UserWithRole | undefined;
  const role = typeof user?.role === "object" ? user.role.name : user?.role;
  const isAuthorizedFull = role === "SuperAdmin" || role === "DepartmentHead";

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
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6">
        <div className="relative">
          <div className="h-24 w-24 border-2 border-[#DF8142]/10 dark:border-white/5 border-t-[#DF8142] rounded-full animate-spin" />
          <Loader2 className="h-10 w-10 text-[#5A270F] dark:text-[#EEB38C] animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-[10px] font-black text-[#5A270F]/40 dark:text-white/30 uppercase tracking-[0.6em] animate-pulse">
          Synchronizing Intel Matrix...
        </p>
      </div>
    );
  }

  const statItems = [
    {
      title: "Network Nodes",
      value: stats?.totalUsers?.toLocaleString() || "0",
      label: "Active Registry Authority",
      trend: "Dynamic",
      icon: Users,
      gradient: "from-[#5A270F] to-[#1A0B04]",
      accent: "text-[#EEB38C]",
    },
    {
      title: "Artifact Index",
      value: stats?.totalResources?.toLocaleString() || "0",
      label: "Verified Design Assets",
      trend: "Secure",
      icon: Box,
      gradient: "from-[#92664A] to-[#6C3B1C]",
      accent: "text-[#EEB38C]",
    },
    {
      title: "Data Pulse",
      value: stats?.totalDownloads?.toLocaleString() || "0",
      label: "Transmission Volume",
      trend: "Peak",
      icon: Activity,
      gradient: "from-[#DF8142] to-[#B85C24]",
      accent: "text-[#5A270F]",
    },
  ];

  const handleDownloadReport = () => {
    if (!stats) return;
    
    const reportContent = {
      registry_protocol: "INTEL-MATRIX-RECO-14A",
      timestamp: new Date().toISOString(),
      intel_metrics: {
        total_nodes: stats.totalUsers,
        artifact_index: stats.totalResources,
        data_pulse: stats.totalDownloads,
        pending_validation_nexus: stats.pendingResources,
        velocity_protocol_30d: stats.newResourcesLast30Days
      },
      status: "SECURE_PROTOCOL_VERIFIED"
    };

    const blob = new Blob([JSON.stringify(reportContent, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MATRIX_INTEL_REPORT_${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Global Intel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {statItems.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Primary Operation Core */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-8 bg-white dark:bg-[#1A0B04] p-1 border border-[#D9D9C2] dark:border-white/5 rounded-[4rem] shadow-2xl relative overflow-hidden group">
          <div className="h-full bg-gradient-to-br from-[#5A270F] to-[#1A0B04] rounded-[3.8rem] p-12 sm:p-16 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none architectural-dot-grid" />
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center justify-between mb-16">
                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                    <Layers className="h-6 w-6 text-[#5A270F]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tighter uppercase leading-none mb-1">
                      Matrix Core Stats
                    </h3>
                    <p className="text-[10px] font-black text-[#EEB38C]/50 uppercase tracking-[0.4em]">
                      Real-time Repository Analysis
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Live Monitoring</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8 flex-grow">
                {isAuthorizedFull && (
                  <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all duration-500 group/item relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full transition-all group-hover/item:scale-150" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-8">
                        <p className="text-[10px] font-black text-[#EEB38C] uppercase tracking-[0.3em]">
                          Awaiting Validation
                        </p>
                        <ShieldCheck className="h-5 w-5 text-[#EEB38C]" />
                      </div>
                      <div className="flex items-baseline gap-4">
                        <span className="text-6xl font-black text-white tracking-tighter leading-none">
                          {stats?.pendingResources}
                        </span>
                        <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] leading-tight">
                          Critical <br /> Prototypes
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-[#DF8142]/10 border border-[#DF8142]/20 p-10 rounded-[2.5rem] hover:bg-[#DF8142]/20 transition-all duration-500 group/item relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-[#DF8142]/10 rounded-bl-full transition-all group-hover/item:scale-150" />
                   <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <p className="text-[10px] font-black text-[#EEB38C] uppercase tracking-[0.3em]">
                        Deployment Velocity
                      </p>
                      <Zap className="h-5 w-5 text-[#DF8142]" />
                    </div>
                    <div className="flex items-baseline gap-4">
                      <span className="text-6xl font-black text-white tracking-tighter leading-none">
                        {stats?.newResourcesLast30Days}
                      </span>
                      <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] leading-tight">
                        Monthly <br /> Expansions
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="flex-grow bg-white dark:bg-[#1A0B04] p-10 rounded-[4rem] shadow-2xl border border-[#D9D9C2] dark:border-white/5 relative overflow-hidden group flex flex-col justify-center text-center">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none blueprint-grid" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-[#5A270F] to-[#1A0B04] rounded-[2rem] flex items-center justify-center text-[#EEB38C] mx-auto mb-8 shadow-2xl rotate-3 group-hover:rotate-12 transition-transform duration-500">
                <Download className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter uppercase mb-2">
                Export Intel
              </h3>
              <p className="text-[10px] font-black text-[#92664A] dark:text-white/30 uppercase tracking-[0.4em] mb-10 leading-relaxed">
                Snapshot Protocol 14-A
              </p>
              
              <button 
                onClick={handleDownloadReport}
                className="w-full h-14 bg-white dark:bg-transparent border-2 border-[#5A270F] dark:border-[#EEB38C]/20 border-dashed text-[10px] font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C] rounded-2xl hover:bg-[#5A270F] hover:text-white dark:hover:bg-[#EEB38C] dark:hover:text-[#1A0B04] transition-all active:scale-95 flex items-center justify-center gap-3">
                Download Report <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="bg-[#6C3B1C] p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#EEB38C]/5 blur-3xl" />
            <div className="flex flex-col gap-4 relative z-10">
              <Link
                to="/admin/users"
                className="w-full h-16 flex items-center justify-center gap-4 bg-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl text-[#5A270F] hover:bg-[#EEB38C] transition-all hover:scale-[1.03] active:scale-95 shadow-xl shadow-black/20"
              >
                Nexus Registry <ArrowRight className="h-4 w-4" />
              </Link>
              {isAuthorizedFull && (
                <Link
                  to="/admin/approvals"
                  className="w-full h-16 flex items-center justify-center gap-4 bg-transparent border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl text-white hover:bg-white/10 transition-all active:scale-95"
                >
                  Verify Artifacts <ShieldCheck className="h-4 w-4 text-[#EEB38C]" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
