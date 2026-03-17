import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { 
  Settings, 
  ShieldCheck, 
  Radio, 
  Activity,
  Plus,
  RefreshCw,
  MoreVertical,
  Unlink
} from "lucide-react";
import { toast } from "../../lib/toast";

interface ExternalNode {
    id: number;
    name: string;
    url: string;
    type: string;
    status: string;
    latency: string;
    lastChecked?: string;
}

const External = () => {
    const [nodes, setNodes] = useState<ExternalNode[]>([]);
    const [isConnecting, setIsConnecting] = useState(false);

    const fetchNodes = async () => {
        try {
            const { data } = await api.get('/super-admin/external/nodes');
            setNodes(data);
        } catch {
            console.error("Topology Scan Failure: Universal node matrix currently unreachable.");
        }
    };

    useEffect(() => {
        fetchNodes();
    }, []);

    const handleReconnect = async (id: number) => {
        setIsConnecting(true);
        try {
            await api.post(`/super-admin/external/nodes/${id}/reconnect`);
            await fetchNodes();
            toast.success(`CONNECTION_RESTORED: NODE_${id} HANDSHAKE RECALIBRATED.`);
        } catch {
            toast.error("TERMINAL_LINK_FAILED: PROTOCOL BREACH DETECTED.");
        } finally {
            setIsConnecting(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-1000 font-inter">
            {/* ── Global Topology Header ── */}
            <div className="relative p-10 overflow-hidden bg-gradient-to-br from-[#1A0B04] via-[#5A270F] to-[#2A1205] rounded-[3rem] border border-white/5 shadow-22xl">
                <div className="absolute inset-0 blueprint-grid-dark opacity-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#DF8142]/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
                            <p className="text-[10px] font-black text-[#EEB38C] uppercase tracking-[0.6em]">Boundary_Synchronization</p>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                            OUTBOUND <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] to-[#EEB38C]">NODES</span>
                        </h1>
                        <p className="text-[11px] text-[#EEB38C]/40 font-black uppercase tracking-widest max-w-xl border-l-2 border-[#DF8142] pl-6">
                            Management of third-party architectural intelligence nodes and external data-transmission strata.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-[#EEB38C] hover:bg-white/10 transition-all flex items-center gap-3">
                            <Plus className="h-4 w-4" /> INTEGRATE_NODE
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* ── Active Topology Matrix ── */}
                <div className="lg:col-span-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {nodes.map((node) => (
                            <div key={node.id} className="bg-white dark:bg-[#1A0B04] p-8 rounded-[2.5rem] border border-[#D9D9C2] dark:border-white/5 shadow-xl hover:border-[#DF8142]/40 transition-all group overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#DF8142]/5 blur-3xl rounded-bl-full" />
                                
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 bg-[#5A270F] text-[#EEB38C] rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                                <Radio className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-[10px] font-black text-[#5A270F] dark:text-white uppercase tracking-tighter">{node.name}</h3>
                                                <p className="text-[7px] font-black text-[#92664A] dark:text-[#EEB38C]/30 uppercase tracking-[0.2em]">{node.type}</p>
                                            </div>
                                        </div>
                                        <button 
                                            title="Node Options"
                                            className="text-[#92664A] dark:text-white/20 hover:text-[#5A270F] dark:hover:text-white transition-colors"
                                        >
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="flex-grow space-y-4 mb-8">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[7px] font-black text-[#92664A] dark:text-[#EEB38C]/20 uppercase tracking-widest">ENDPOINT_URI</span>
                                            <span className="text-[10px] font-mono font-bold text-[#5A270F] dark:text-white/50 truncate border-b border-[#FAF8F4] dark:border-white/5 pb-2">{node.url}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest font-mono">
                                            <span className="text-[#92664A] dark:text-[#EEB38C]/30">Latency</span>
                                            <span className={node.latency?.includes('900') ? 'text-[#DF8142]' : 'text-emerald-500'} >{node.latency || "---"}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-6 border-t border-[#FAF8F4] dark:border-white/5">
                                        <button 
                                            onClick={() => handleReconnect(node.id)}
                                            disabled={isConnecting}
                                            className="flex-1 py-3 bg-[#FAF8F4] dark:bg-white/5 text-[#5A270F] dark:text-white border border-[#D9D9C2] dark:border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#5A270F] hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            <RefreshCw className={`h-3 w-3 ${isConnecting ? 'animate-spin' : ''}`} /> Handshake
                                        </button>
                                        <button 
                                            title="Sever Node Connection"
                                            className="px-4 py-3 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                                        >
                                            <Unlink className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Global Access Matrix ── */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-[#5A270F] p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
                        <div className="absolute inset-0 blueprint-grid opacity-10" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#EEB38C] mb-8 flex items-center gap-3 relative z-10">
                            <Activity className="h-4 w-4" /> CONNECTION_INTEGRITY
                        </h3>
                        <div className="space-y-6 relative z-10">
                            {[
                                { label: "Success Rate", val: "99.8%", color: "text-emerald-500" },
                                { label: "Total Egress", val: "4.2 TB", color: "text-[#EEB38C]" },
                                { label: "Active Nodes", val: `0${nodes.length}/0${nodes.length}`, color: "text-[#EEB38C]" }
                            ].map((stat, i) => (
                                <div key={i} className="flex justify-between items-baseline border-b border-white/10 pb-4 last:border-0 last:pb-0">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{stat.label}</span>
                                    <span className={`text-[11px] font-black font-mono tracking-widest ${stat.color}`}>{stat.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1A0B04] p-8 rounded-[2.5rem] border border-[#D9D9C2] dark:border-white/5 space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                <h4 className="text-[10px] font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-widest">TLS_PROTOCOL_STRICT</h4>
                            </div>
                            <p className="text-[9px] text-[#92664A] dark:text-white/40 leading-relaxed font-bold uppercase tracking-widest">ENFORCING UNIVERSAL RSA_4096_GCM_SHA_384 HANDSHAKING ENCRYPTION FOR ALL EXTERNAL NODES.</p>
                        </div>
                        <button className="w-full h-12 bg-white dark:bg-transparent border-2 border-[#5A270F] border-dashed text-[#5A270F] dark:text-white px-6 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-[#5A270F] hover:text-white transition-all flex items-center justify-center gap-3">
                            <Settings className="h-3.5 w-3.5" /> SECURITY_ENVIRONMENT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default External;
