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
      <div className="bg-[#2A1205] rounded-[2.5rem] p-10 sm:p-14 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DF8142]/10 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#DF8142]/20 transition-all duration-1000" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#6C3B1C]/20 blur-[80px] translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 opacity-[0.03] architectural-grid pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EEB38C]/10 border border-[#EEB38C]/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#EEB38C] mb-6">
              <Cpu className="h-3.5 w-3.5" /> Core Interface Online
            </div>
            <h2 className="text-4xl sm:text-5xl font-black mb-4 tracking-tighter leading-none italic uppercase">
              Welcome back, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] to-[#EEB38C] not-italic uppercase">
                {name}.
              </span>
            </h2>
            <p className="text-white/40 text-sm font-bold uppercase tracking-widest leading-relaxed max-w-md">
              Synchronizing with the system matrix. You have full access to the
              digital archive and collaboration tools.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex flex-col items-center justify-center min-w-[120px]">
              <div className="text-2xl font-black text-[#DF8142]">04</div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">
                Assignments
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex flex-col items-center justify-center min-w-[120px]">
              <div className="text-2xl font-black text-[#EEB38C]">12</div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">
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
          className="group relative bg-white p-10 rounded-[2.5rem] border border-[#D9D9C2] shadow-sm hover:shadow-2xl hover:shadow-[#5A270F]/5 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 text-[#DF8142]/5 group-hover:text-[#DF8142]/10 transition-colors">
            <Box className="h-32 w-32" />
          </div>
          <div className="relative z-10">
            <div className="p-4 bg-[#DF8142] text-white rounded-2xl w-fit shadow-xl mb-8 group-hover:scale-110 transition-transform">
              <Upload className="h-6 w-6" />
            </div>
            <p className="text-[10px] font-black text-[#92664A] uppercase tracking-[0.3em] mb-3">
              Initialize Protocol
            </p>
            <h3 className="text-2xl font-black text-[#5A270F] uppercase tracking-tight mb-4">
              Upload Resource
            </h3>
            <p className="text-[#6C3B1C]/60 text-sm font-bold leading-relaxed mb-8">
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
          className="group relative bg-white p-10 rounded-[2.5rem] border border-[#D9D9C2] shadow-sm hover:shadow-2xl hover:shadow-[#5A270F]/5 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 text-[#5A270F]/5 group-hover:text-[#5A270F]/10 transition-colors">
            <Activity className="h-32 w-32" />
          </div>
          <div className="relative z-10">
            <div className="p-4 bg-[#5A270F] text-white rounded-2xl w-fit shadow-xl mb-8 group-hover:scale-110 transition-transform">
              <CheckCircle className="h-6 w-6" />
            </div>
            <p className="text-[10px] font-black text-[#92664A] uppercase tracking-[0.3em] mb-3">
              Review Index
            </p>
            <h3 className="text-2xl font-black text-[#5A270F] uppercase tracking-tight mb-4">
              My Archives
            </h3>
            <p className="text-[#6C3B1C]/60 text-sm font-bold leading-relaxed mb-8">
              Monitor verification status and manage your contributed assets.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#5A270F] uppercase tracking-widest">
              Access History{" "}
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Action Card: Signals */}
        <Link
          to="/dashboard/notifications"
          className="group relative bg-[#F5F5F5] p-10 rounded-[2.5rem] border border-[#D9D9C2] shadow-sm hover:shadow-2xl hover:shadow-[#5A270F]/5 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 text-[#6C3B1C]/5 group-hover:text-[#6C3B1C]/10 transition-colors">
            <Bell className="h-32 w-32" />
          </div>
          <div className="relative z-10">
            <div className="p-4 bg-[#6C3B1C] text-white rounded-2xl w-fit shadow-xl mb-8 group-hover:scale-110 transition-transform">
              <Bell className="h-6 w-6" />
            </div>
            <p className="text-[10px] font-black text-[#92664A] uppercase tracking-[0.3em] mb-3">
              Live Updates
            </p>
            <h3 className="text-2xl font-black text-[#5A270F] uppercase tracking-tight mb-4">
              Signals
            </h3>
            <p className="text-[#6C3B1C]/60 text-sm font-bold leading-relaxed mb-8">
              Stay synchronized with peer-reviews and system alerts.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#6C3B1C] uppercase tracking-widest">
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
