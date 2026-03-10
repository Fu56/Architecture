import { getUser } from "../../lib/auth";
import {
  Upload,
  CheckCircle,
  Bell,
  ArrowRight,
  Activity,
  Cpu,
  Box,
} from "lucide-react";
import { Link } from "react-router-dom";

const Overview = () => {
  const user = getUser();
  const name = user?.first_name || "Architect";

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Section - Executive Style */}
      <div className="bg-[#FAF8F4] dark:bg-[#2A1205] rounded-[2.5rem] p-10 sm:p-14 text-[#5A270F] dark:text-white shadow-xl dark:shadow-2xl relative overflow-hidden group transition-colors duration-500">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DF8142]/10 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#DF8142]/20 transition-all duration-1000" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#6C3B1C]/20 blur-[80px] translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] architectural-grid pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EEB38C]/10 border border-[#EEB38C]/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#EEB38C] mb-6">
              <Cpu className="h-3.5 w-3.5" /> Core Interface Online
            </div>
            <h2 className="text-4xl sm:text-5xl font-black mb-4 tracking-tighter leading-none italic uppercase text-[#5A270F] dark:text-white">
              Welcome back, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] to-[#EEB38C] not-italic uppercase">
                {name}.
              </span>
            </h2>
            <p className="text-[#5A270F]/40 dark:text-white/40 text-sm font-black uppercase tracking-widest leading-relaxed max-w-md">
              Synchronizing with the system matrix. You have full access to the
              digital archive and collaboration tools.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="bg-[#EFEDED] dark:bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-black/5 dark:border-white/10 flex flex-col items-center justify-center min-w-[120px] transition-colors">
              <div className="text-2xl font-black text-[#DF8142]">04</div>
              <div className="text-[10px] font-black text-[#5A270F]/40 dark:text-white/40 uppercase tracking-widest mt-1">
                Assignments
              </div>
            </div>
            <div className="bg-[#EFEDED] dark:bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-black/5 dark:border-white/10 flex flex-col items-center justify-center min-w-[120px] transition-colors">
              <div className="text-2xl font-black text-[#EEB38C]">12</div>
              <div className="text-[10px] font-black text-[#5A270F]/40 dark:text-white/40 uppercase tracking-widest mt-1">
                Resources
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Action Card: Upload */}
        <Link
          to="/dashboard/upload"
          className="group relative bg-white dark:bg-card p-10 rounded-[2.5rem] border border-[#D9D9C2] dark:border-white/10 shadow-sm hover:shadow-2xl hover:shadow-[#5A270F]/15 dark:hover:shadow-none transition-all duration-500 hover:-translate-y-2 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 text-[#DF8142]/5 group-hover:text-[#DF8142]/10 transition-colors">
            <Box className="h-32 w-32" />
          </div>
          <div className="relative z-10">
            <div className="p-4 bg-[#DF8142] text-white rounded-2xl w-fit shadow-xl mb-8 group-hover:scale-110 transition-transform">
              <Upload className="h-6 w-6" />
            </div>
            <p className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.3em] mb-3 transition-colors">
              Initialize Protocol
            </p>
            <h3 className="text-2xl font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-tight mb-4 transition-colors">
              Upload Resource
            </h3>
            <p className="text-[#6C3B1C] dark:text-[#EEB38C]/70 text-sm font-bold leading-relaxed mb-8 transition-colors">
              Integrate new architectural artifacts into the central library
              matrix.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#DF8142] uppercase tracking-widest">
              Begin Transmission{" "}
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Action Card: Archives */}
        <Link
          to="/dashboard/uploads"
          className="group relative bg-white dark:bg-card p-10 rounded-[2.5rem] border border-[#D9D9C2] dark:border-white/10 shadow-sm hover:shadow-2xl hover:shadow-[#5A270F]/15 dark:hover:shadow-none transition-all duration-500 hover:-translate-y-2 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 text-[#5A270F] dark:text-[#EEB38C]/5 group-hover:text-[#5A270F] dark:text-[#EEB38C]/10 transition-colors">
            <Activity className="h-32 w-32" />
          </div>
          <div className="relative z-10">
            <div className="p-4 bg-[#5A270F] text-white rounded-2xl w-fit shadow-xl mb-8 group-hover:scale-110 transition-transform">
              <CheckCircle className="h-6 w-6" />
            </div>
            <p className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.3em] mb-3 transition-colors">
              Review Index
            </p>
            <h3 className="text-2xl font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-tight mb-4 transition-colors">
              My Archives
            </h3>
            <p className="text-[#6C3B1C] dark:text-[#EEB38C]/70 text-sm font-bold leading-relaxed mb-8 transition-colors">
              Monitor verification status and manage your contributed assets.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-widest transition-colors">
              Access History{" "}
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Action Card: Signals */}
        <Link
          to="/dashboard/notifications"
          className="group relative bg-[#FAF8F4] dark:bg-card p-10 rounded-[2.5rem] border border-[#D9D9C2] dark:border-white/10 shadow-sm hover:shadow-2xl hover:shadow-[#5A270F]/15 dark:hover:shadow-none transition-all duration-500 hover:-translate-y-2 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 text-[#6C3B1C] dark:text-[#EEB38C]/80/5 group-hover:text-[#6C3B1C] dark:text-[#EEB38C]/80/10 transition-colors">
            <Bell className="h-32 w-32" />
          </div>
          <div className="relative z-10">
            <div className="p-4 bg-[#6C3B1C] text-white rounded-2xl w-fit shadow-xl mb-8 group-hover:scale-110 transition-transform">
              <Bell className="h-6 w-6" />
            </div>
            <p className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.3em] mb-3 transition-colors">
              Live Updates
            </p>
            <h3 className="text-2xl font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-tight mb-4 transition-colors">
              Signals
            </h3>
            <p className="text-[#6C3B1C] dark:text-[#EEB38C]/70 text-sm font-bold leading-relaxed mb-8 transition-colors">
              Stay synchronized with peer-reviews and system alerts.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#6C3B1C] dark:text-[#EEB38C] uppercase tracking-widest transition-colors">
              Monitor Stream{" "}
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Overview;
