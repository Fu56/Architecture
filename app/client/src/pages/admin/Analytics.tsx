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
  ChevronDown,
} from "lucide-react";
import { api } from "../../lib/api";
import { useSession } from "../../lib/auth-client";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } from "docx";

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
  <div className="bg-white dark:bg-[#1A0B04] p-5 rounded-[1.5rem] shadow-xl shadow-[#5A270F]/5 border border-[#D9D9C2] dark:border-white/5 group hover:border-[#DF8142]/30 transition-all duration-700 overflow-hidden relative">
    <div
      className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-[0.03] group-hover:opacity-[0.08] rounded-bl-full transition-opacity duration-700`}
    />
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}
        >
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-3 py-1 bg-[#EEB38C]/10 rounded-full border border-[#EEB38C]/20 text-[8px] font-black uppercase tracking-[0.1em] transform group-hover:translate-x-1 transition-all duration-500 ${accent}`}>
            <Sparkles className="h-2.5 w-2.5" /> {trend}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div>
          <p className="text-[9px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.3em] mb-0.5">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter transition-colors">
              {value}
            </h2>
            <div className="h-1.5 w-1.5 rounded-full bg-[#DF8142] animate-pulse" />
          </div>
        </div>
        
        <p className="text-[9px] font-black text-[#92664A]/60 dark:text-white/20 uppercase tracking-[0.1em]">
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: session } = useSession();

  const user = session?.user as UserWithRole | undefined;
  const role = typeof user?.role === "object" ? user.role.name : user?.role;
  const isAuthorizedFull = role === "SuperAdmin" || role === "DepartmentHead";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/analytics/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 15000); // Pulse synchronization every 15s
    return () => clearInterval(interval);
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

  const handleDownloadReport = async (format: 'pdf' | 'excel' | 'word') => {
    if (!stats) return;
    setIsDropdownOpen(false);
    
    const metricsData = [
      { metric: "Registry Protocol", value: "INTEL-MATRIX-RECO-14A" },
      { metric: "Timestamp", value: new Date().toISOString() },
      { metric: "Status", value: "SECURE_PROTOCOL_VERIFIED" },
      { metric: "Total Nodes", value: stats.totalUsers },
      { metric: "Artifact Index", value: stats.totalResources },
      { metric: "Data Pulse (Downloads)", value: stats.totalDownloads },
      { metric: "Pending Validation Nexus", value: stats.pendingResources },
      { metric: "Velocity Protocol 30D", value: stats.newResourcesLast30Days }
    ];

    const filename = `MATRIX_INTEL_REPORT_${new Date().getTime()}`;

    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.text("System Analytics Report", 14, 20);
      autoTable(doc, {
        startY: 30,
        head: [['Metric', 'Value']],
        body: metricsData.map(row => [row.metric, row.value.toString()]),
      });
      doc.save(`${filename}.pdf`);
    } else if (format === 'excel') {
      const worksheet = XLSX.utils.json_to_sheet(metricsData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Metrics");
      XLSX.writeFile(workbook, `${filename}.xlsx`);
    } else if (format === 'word') {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "System Analytics Report",
                    bold: true,
                    size: 32,
                  }),
                ],
              }),
              new Paragraph({ text: "" }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("Metric")] }),
                      new TableCell({ children: [new Paragraph("Value")] }),
                    ],
                  }),
                  ...metricsData.map(row => 
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph(row.metric)] }),
                        new TableCell({ children: [new Paragraph(row.value.toString())] }),
                      ],
                    })
                  ),
                ],
              }),
            ],
          },
        ],
      });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 bg-white dark:bg-[#1A0B04] p-0.5 border border-[#D9D9C2] dark:border-white/5 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
          <div className="h-full bg-gradient-to-br from-[#5A270F] to-[#1A0B04] rounded-[2.4rem] p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none architectural-dot-grid" />
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                    <Layers className="h-5 w-5 text-[#5A270F]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tighter uppercase leading-none mb-0.5">
                      Matrix Core Stats
                    </h3>
                    <p className="text-[8px] font-black text-[#EEB38C]/50 uppercase tracking-[0.3em]">
                      Real-time Repository Analysis
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Live Monitoring</span>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-10 flex-grow mt-6">
                <div className="flex flex-col justify-between">
                   <div className="space-y-6">
                    {isAuthorizedFull && (
                      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl group/item relative overflow-hidden h-[140px] flex flex-col justify-center">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-[2rem]" />
                        <div className="relative z-10">
                          <p className="text-[10px] font-black text-[#EEB38C] uppercase tracking-[0.2em] mb-4">
                            Artifacts Awaiting Validation
                          </p>
                          <div className="flex items-baseline gap-4">
                            <span className="text-6xl font-black text-white tracking-tighter leading-none">
                              {stats?.pendingResources}
                            </span>
                            <ShieldCheck className="h-5 w-5 text-[#EEB38C] animate-pulse" />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-[#DF8142]/10 border border-[#DF8142]/20 p-6 rounded-2xl group/item relative overflow-hidden h-[140px] flex flex-col justify-center">
                       <div className="absolute top-0 right-0 w-16 h-16 bg-[#DF8142]/10 rounded-bl-[2rem]" />
                       <div className="relative z-10">
                         <p className="text-[10px] font-black text-[#EEB38C] uppercase tracking-[0.2em] mb-4">
                           30-Day Deployment Velocity
                         </p>
                         <div className="flex items-baseline gap-4">
                           <span className="text-6xl font-black text-white tracking-tighter leading-none">
                             {stats?.newResourcesLast30Days || "24"}
                           </span>
                           <Zap className="h-5 w-5 text-[#DF8142] animate-bounce" />
                         </div>
                       </div>
                    </div>
                   </div>
                </div>

                {/* SIGNAL VELOCITY CHART */}
                <div className="bg-black/20 border border-white/10 rounded-[2rem] p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px]">
                    <div className="absolute top-4 left-6 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Signal_Wave v4.1</span>
                    </div>
                    
                    <svg className="w-full h-full max-h-[220px]" viewBox="0 0 400 200" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#DF8142" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#DF8142" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line x1="0" y1="50" x2="400" y2="50" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
                        <line x1="0" y1="100" x2="400" y2="100" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
                        <line x1="0" y1="150" x2="400" y2="150" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
                        
                        {/* Area */}
                        <path 
                            d="M 0 160 Q 50 140 100 155 T 200 120 T 300 145 T 400 80 V 200 H 0 Z" 
                            fill="url(#chartGradient)" 
                        />
                        
                        {/* Main Signal Path */}
                        <path 
                            d="M 0 160 Q 50 140 100 155 T 200 120 T 300 145 T 400 80" 
                            fill="none" 
                            stroke="#DF8142" 
                            strokeWidth="3" 
                            strokeLinecap="round"
                            className="drop-shadow-[0_0_8px_rgba(223,129,66,0.6)]"
                        />
                        
                        {/* Pulse Points */}
                        <circle cx="100" cy="155" r="4" fill="#DF8142" className="animate-pulse" />
                        <circle cx="200" cy="120" r="4" fill="#DF8142" className="animate-pulse" />
                        <circle cx="300" cy="145" r="4" fill="#DF8142" className="animate-pulse" />
                        <circle cx="400" cy="80" r="5" fill="#EEB38C" className="animate-ping" />
                    </svg>
                    
                    <div className="w-full mt-6 grid grid-cols-4 gap-4 px-2">
                        {[0, 6, 12, 18, 24].map((h, i) => (
                            <span key={i} className="text-[8px] font-black text-white/20 tracking-tighter">{h}H_SYNC</span>
                        ))}
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex-grow bg-white dark:bg-[#1A0B04] p-8 rounded-[2.5rem] shadow-xl border border-[#D9D9C2] dark:border-white/5 relative overflow-hidden group flex flex-col justify-center text-center">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none blueprint-grid" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-[#5A270F] to-[#1A0B04] rounded-2xl flex items-center justify-center text-[#EEB38C] mx-auto mb-6 shadow-xl rotate-3 group-hover:rotate-12 transition-transform duration-500">
                <Download className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter uppercase mb-1.5">
                Export Intel
              </h3>
              <p className="text-[9px] font-black text-[#92664A] dark:text-white/30 uppercase tracking-[0.3em] mb-8 leading-relaxed">
                Snapshot Protocol 14-A
              </p>
              
              <div className="space-y-2 relative z-10 w-full text-left">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full h-11 bg-white dark:bg-transparent border-2 border-[#5A270F] dark:border-[#EEB38C]/20 border-dashed text-[9px] font-black uppercase tracking-[0.2em] text-[#5A270F] dark:text-[#EEB38C] rounded-xl hover:bg-[#5A270F] hover:text-white dark:hover:bg-[#EEB38C] dark:hover:text-[#1A0B04] transition-all active:scale-95 flex items-center justify-between px-5 gap-2.5"
                >
                  <span className="flex-1 text-center pr-2">Download Report</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isDropdownOpen && (
                  <div className="flex flex-col gap-1.5 p-1.5 bg-[#FAF8F4] dark:bg-[#2A1205] border border-[#D9D9C2] dark:border-white/10 rounded-xl shadow-lg animate-in slide-in-from-top-2 fade-in duration-300 border-t-0 rounded-t-none -mt-4 pt-5">
                    <button onClick={() => handleDownloadReport('pdf')} className="w-full text-left px-4 py-2 text-[8px] font-black tracking-widest uppercase text-[#5A270F] dark:text-[#EEB38C] hover:bg-[#D9D9C2] dark:hover:bg-white/5 rounded-lg transition-colors">
                      Extract to PDF
                    </button>
                    <button onClick={() => handleDownloadReport('word')} className="w-full text-left px-4 py-2 text-[8px] font-black tracking-widest uppercase text-[#5A270F] dark:text-[#EEB38C] hover:bg-[#D9D9C2] dark:hover:bg-white/5 rounded-lg transition-colors">
                      Extract to Word
                    </button>
                    <button onClick={() => handleDownloadReport('excel')} className="w-full text-left px-4 py-2 text-[8px] font-black tracking-widest uppercase text-[#5A270F] dark:text-[#EEB38C] hover:bg-[#D9D9C2] dark:hover:bg-white/5 rounded-lg transition-colors">
                      Extract to Excel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#6C3B1C] p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#EEB38C]/5 blur-3xl" />
            <div className="flex flex-col gap-3 relative z-10">
              <Link
                to="/admin/users"
                className="w-full h-12 flex items-center justify-center gap-3 bg-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl text-[#5A270F] hover:bg-[#EEB38C] transition-all hover:scale-[1.03] active:scale-95 shadow-lg shadow-black/20"
              >
                Nexus Registry <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              {isAuthorizedFull && (
                <Link
                  to="/admin/approvals"
                  className="w-full h-12 flex items-center justify-center gap-3 bg-transparent border border-white/20 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl text-white hover:bg-white/10 transition-all active:scale-95"
                >
                  Verify Artifacts <ShieldCheck className="h-3.5 w-3.5 text-[#EEB38C]" />
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
