import { useState, useEffect } from "react";
import { 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Radio,
  Clock,
  Waves
} from "lucide-react";
import { toast } from "../../lib/toast";

const Maintenance = () => {
    const [health, setHealth] = useState({
        cpu: 18,
        memory: 42,
        dbLatency: 12,
        services: [
            { id: "API_CORE", status: "STABLE", load: "OPTIMAL" },
            { id: "S3_STORAGE", status: "STABLE", load: "LOW" },
            { id: "SMTP_GATEWAY", status: "DEGRADED", load: "WAITING" },
            { id: "AUTH_MATRIX", status: "STABLE", load: "PEAK" }
        ],
        uptime: "14D 08H 22M"
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setHealth(prev => ({
                ...prev,
                cpu: Math.floor(Math.random() * 20) + 10,
                dbLatency: Math.floor(Math.random() * 5) + 10
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const [isSimulating, setIsSimulating] = useState(false);

    const handleSimulation = () => {
        setIsSimulating(true);
        setTimeout(() => {
            setIsSimulating(false);
            toast.success("DIAGNOSTIC_CYCLE_COMPLETE: ALL CORE INDICES VERIFIED.");
        }, 2000);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-1000">
            {/* ── Neural Grid Overlay ── */}
            <div className="relative p-10 overflow-hidden bg-gradient-to-br from-[#1A0B04] via-[#5A270F] to-black rounded-[3rem] border border-white/5 shadow-2xl">
                <div className="absolute inset-0 blueprint-grid-dark opacity-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#DF8142]/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                                <span className="w-1 h-3 bg-[#EEB38C] rounded-full animate-pulse" />
                                <span className="w-1 h-3 bg-[#DF8142] rounded-full animate-pulse delay-75" />
                                <span className="w-1 h-3 bg-[#EEB38C] rounded-full animate-pulse delay-150" />
                            </div>
                            <p className="text-[10px] font-black text-[#EEB38C] uppercase tracking-[0.6em]">System_Pulse_Monitoring</p>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                            ENGINE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] to-[#EEB38C]">ROOM</span>
                        </h1>
                        <p className="text-[11px] text-[#EEB38C]/40 font-black uppercase tracking-widest max-w-xl border-l-2 border-[#DF8142] pl-6">
                            Real-time diagnostic stratification of the architectural repository architecture.
                        </p>
                    </div>

                    <div className="flex gap-8 px-8 py-6 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl">
                        <div className="flex flex-col items-center">
                            <span className="text-[8px] font-black text-[#DF8142] uppercase tracking-[0.4em] mb-2">DB_RESPONSE</span>
                            <span className="text-3xl font-black text-white font-mono tracking-tighter">{health.dbLatency}ms</span>
                        </div>
                        <div className="w-[1px] h-full bg-white/10" />
                        <div className="flex flex-col items-center">
                            <span className="text-[8px] font-black text-[#DF8142] uppercase tracking-[0.4em] mb-2">CORE_UPTIME</span>
                            <span className="text-xl font-black text-white tracking-widest uppercase mt-1">{health.uptime}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* ── Utilization Matrix ── */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* CPU Load */}
                        <div className="bg-white dark:bg-[#1A0B04] p-8 rounded-[2.5rem] border border-[#D9D9C2] dark:border-white/5 shadow-xl relative group">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#5A270F] dark:text-[#EEB38C]/40 flex items-center gap-3">
                                    <Cpu className="h-4 w-4 text-[#DF8142]" /> PROCES_LOAD
                                </h3>
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">ACTIVE</span>
                            </div>
                            <div className="flex items-end gap-6 h-32">
                                {[12, 18, 15, 22, health.cpu, 24, 19, 14].map((v, i) => (
                                    <div key={i} className="flex-1 bg-[#EEB38C]/10 rounded-t-lg relative group/bar overflow-hidden">
                                        <div 
                                            className={`absolute bottom-0 w-full bg-gradient-to-t from-[#5A270F] to-[#DF8142] transition-all duration-1000 ease-out`}
                                            style={{ height: `${v}%` }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 flex items-baseline justify-between">
                                <span className="text-5xl font-black text-[#5A270F] dark:text-white tracking-tighter tabular-nums">{health.cpu}%</span>
                                <span className="text-[7px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.5em]">THROUGHPUT_STABLE</span>
                            </div>
                        </div>

                        {/* Memory Allocation */}
                        <div className="bg-white dark:bg-[#1A0B04] p-8 rounded-[2.5rem] border border-[#D9D9C2] dark:border-white/5 shadow-xl relative group">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#5A270F] dark:text-[#EEB38C]/40 flex items-center gap-3">
                                    <Waves className="h-4 w-4 text-[#DF8142]" /> MEM_ALLOC_STRATUM
                                </h3>
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">OPTIMIZED</span>
                            </div>
                            <div className="relative h-32 flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full border-8 border-[#EEB38C]/10" />
                                <svg className="h-32 w-32 -rotate-90">
                                    <circle 
                                        cx="64" cy="64" r="56" 
                                        stroke="currentColor" strokeWidth="8" fill="transparent"
                                        className="text-[#DF8142] transition-all duration-1000"
                                        strokeDasharray={351}
                                        strokeDashoffset={351 - (351 * health.memory) / 100}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-2xl font-black text-[#5A270F] dark:text-white tabular-nums">{health.memory}%</span>
                                    <span className="text-[6px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.3em]">RESERVED</span>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-[#FAF8F4] dark:border-white/5 flex justify-between">
                                <span className="text-[8px] font-black text-[#92664A] uppercase tracking-widest">4.2 GB Used</span>
                                <span className="text-[8px] font-black text-[#92664A] uppercase tracking-widest">8 GB Cap</span>
                            </div>
                        </div>
                    </div>

                    {/* Operational Status */}
                    <div className="bg-[#FAF8F4] dark:bg-white/[0.02] p-2 rounded-[2.5rem] border border-[#D9D9C2]/50 dark:border-white/5">
                        <div className="bg-white dark:bg-[#1A0B04] p-10 rounded-[2.4rem] shadow-sm">
                            <div className="flex items-center justify-between mb-10 pb-6 border-b border-[#FAF8F4] dark:border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-[#5A270F] text-white rounded-xl flex items-center justify-center shadow-lg">
                                        <Radio className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter uppercase italic">
                                            PROTOCOL_MANIFEST
                                        </h3>
                                        <p className="text-[8px] font-black text-[#92664A] uppercase tracking-[0.3em]">Individual Core Authentication</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleSimulation}
                                    disabled={isSimulating}
                                    className="px-6 py-3 bg-[#5A270F] text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-[#DF8142] transition-all duration-500 shadow-xl disabled:opacity-50"
                                >
                                    {isSimulating ? "DIAGNOSING..." : "RESCAN_INDICES"}
                                </button>
                            </div>

                            <div className="space-y-4">
                                {health.services.map((s) => (
                                    <div key={s.id} className="flex items-center justify-between p-6 bg-[#FAF8F4] dark:bg-white/5 rounded-2xl group hover:border-[#DF8142] border border-transparent transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className={`h-2.5 w-2.5 rounded-full ${s.status === 'STABLE' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-[#DF8142] animate-pulse shadow-[0_0_8px_#df8142]'} `} />
                                            <div>
                                                <p className="text-[10px] font-black text-[#5A270F] dark:text-white uppercase tracking-widest">{s.id}</p>
                                                <p className="text-[8px] font-bold text-[#92664A] dark:text-white/20 uppercase tracking-[0.2em] mt-1">VERIFIED_NODE_ID</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-10">
                                            <div className="flex flex-col items-end">
                                                <span className="text-[8px] font-black text-[#DF8142] uppercase tracking-[0.4em] mb-1">LOAD_LEVEL</span>
                                                <span className="text-[9px] font-black text-[#5A270F] dark:text-white/60">{s.load}</span>
                                            </div>
                                            <div className="px-5 py-2 bg-gradient-to-r from-[#1A0B04] to-[#5A270F] text-white text-[8px] font-black rounded-lg shadow-lg">
                                                {s.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Side Console Intel ── */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="p-8 bg-gradient-to-br from-[#5A270F] to-[#1A0B04] rounded-[2.5rem] text-white relative overflow-hidden group">
                        <div className="absolute inset-0 blueprint-grid opacity-10" />
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#EEB38C] mb-8 flex items-center gap-3">
                                <Activity className="h-4 w-4" /> LATENCY_TRIAL
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { label: "Internal Loop", val: "2ms" },
                                    { label: "DB Handshake", val: "8ms" },
                                    { label: "S3 IO Packet", val: "45ms" },
                                    { label: "SMTP Handshake", val: "TIMED" }
                                ].map((test, i) => (
                                    <div key={i} className="flex justify-between items-center pb-4 border-b border-white/10 last:border-0 last:pb-0">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-white/50">{test.label}</span>
                                        <span className={`text-[9px] font-bold font-mono tracking-widest ${test.val === 'TIMED' ? 'text-red-400' : 'text-[#EEB38C]'} `}>{test.val}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] transition-all">
                                FLUSH_CACHE_CLUSTER
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1A0B04] p-8 rounded-[2.5rem] border border-[#D9D9C2] dark:border-white/5 text-center transition-all hover:border-[#DF8142]/30">
                        <div className="w-16 h-16 bg-[#EEB38C]/10 rounded-2xl flex items-center justify-center text-[#DF8142] mx-auto mb-6">
                            <Clock className="h-8 w-8" />
                        </div>
                        <h4 className="text-[10px] font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-[0.3em] mb-2">LAST_SYNCHRONIZED</h4>
                        <p className="text-[12px] font-black text-[#5A270F] dark:text-white tabular-nums">2026-03-17 12:30:47</p>
                        <div className="mt-6 pt-6 border-t border-[#FAF8F4] dark:border-white/5">
                            <div className="flex items-center justify-center gap-2 text-emerald-500 mb-4">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                <span className="text-[8px] font-black uppercase tracking-[0.2em]">HEALTH_CERTIFIED</span>
                            </div>
                            <button className="w-full py-4 bg-[#6C3B1C]/5 hover:bg-[#6C3B1C]/10 dark:bg-white/5 dark:hover:bg-white/10 text-[#5A270F] dark:text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all">
                                LOG_FULL_MANIFAST
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Maintenance;
