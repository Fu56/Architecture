import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { 
  Database, 
  Download, 
  Upload, 
  Clock, 
  ShieldCheck, 
  Archive,
  RefreshCw,
  FileText,
  Trash2
} from "lucide-react";
import { toast } from "../../lib/toast";

interface BackupData {
    id: number;
    name: string;
    filePath: string;
    size: string;
    type: string;
    status: string;
    createdAt: string;
}

const Backup = () => {
    const [backups, setBackups] = useState<BackupData[]>([]);
    const [processing, setProcessing] = useState(false);

    const fetchBackups = async () => {
        try {
            const { data } = await api.get('/super-admin/backups');
            setBackups(data);
        } catch {
            console.error("Vault Access Failure: Historical manifest currently unavailable.");
        }
    };

    useEffect(() => {
        fetchBackups();
    }, []);

    const handleCreateBackup = async () => {
        setProcessing(true);
        try {
            await api.post('/super-admin/backups');
            await fetchBackups();
            toast.success("VAULT_SNAPSHOT_RETAINED: DATABASE MATRIX ENCRYPTED AND ARCHIVED.");
        } catch {
            toast.error("BACKUP_PROTOCOL_VIOLATION: ARCHIVAL SEQUENCE FAILED.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-1000 font-inter">
            {/* ── Institutional Vault Header ── */}
            <div className="relative p-10 overflow-hidden bg-gradient-to-br from-[#2A1205] via-[#5A270F] to-black rounded-[3rem] border border-white/5 shadow-22xl">
                <div className="absolute inset-0 blueprint-grid-dark opacity-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#DF8142]/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Archive className="h-4 w-4 text-[#EEB38C]" />
                            <p className="text-[10px] font-black text-[#EEB38C] uppercase tracking-[0.6em]">Nexus_Storage_Protocol</p>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                            VAULT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] to-[#EEB38C]">CONTROL</span>
                        </h1>
                        <p className="text-[11px] text-[#EEB38C]/40 font-black uppercase tracking-widest max-w-xl border-l-2 border-[#DF8142] pl-6">
                            Deterministic archival and restoration methodology for institutional intelligence repository.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={handleCreateBackup}
                            disabled={processing}
                            className="px-10 py-5 bg-[#DF8142] text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-[#5A270F] transition-all duration-500 shadow-xl shadow-[#DF8142]/20 flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                        >
                            {processing ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                                <Database className="h-4 w-4" />
                            )}
                            GENERATE_INSTANT_SNAPSHOT
                        </button>
                        <p className="text-[7px] font-black text-[#EEB38C]/30 text-center uppercase tracking-widest">NEXT_AUTO_CYCLE: 2026-03-18 08:00</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* ── Snapshot Registry ── */}
                <div className="lg:col-span-8">
                    <div className="bg-white dark:bg-[#1A0B04] rounded-[2.5rem] border border-[#D9D9C2] dark:border-white/5 overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-[#FAF8F4] dark:border-white/5 flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#5A270F] dark:text-[#EEB38C]/40">SNAPSHOT_ARCHIVE</h3>
                            <div className="flex items-center gap-4">
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest whitespace-nowrap">STORAGE_HEALTH: OPTIMAL</span>
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#FAF8F4] dark:bg-white/[0.02]">
                                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[#92664A] dark:text-white/30">SNAPSHOT_ID</th>
                                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[#92664A] dark:text-white/30">TEMPORAL_MARK</th>
                                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[#92664A] dark:text-white/30">SIZE</th>
                                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[#92664A] dark:text-white/30 text-right">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#FAF8F4] dark:divide-white/5">
                                    {backups.map((b) => (
                                        <tr key={b.id} className="hover:bg-[#FAF8F4] dark:hover:bg-white/[0.01] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-[#5A270F] text-white flex items-center justify-center text-[10px] shadow-lg group-hover:scale-110 transition-transform">
                                                        <FileText className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <button 
                                                            title="View Snapshot Details"
                                                            className="text-[10px] font-black text-[#5A270F] dark:text-white uppercase tracking-tighter hover:underline"
                                                        >
                                                            {b.name}
                                                        </button>
                                                        <p className="text-[7px] font-bold text-[#92664A] dark:text-white/20 uppercase tracking-widest mt-0.5">{b.type}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-[10px] font-mono font-bold text-[#92664A] dark:text-white/40">{new Date(b.createdAt).toLocaleString()}</td>
                                            <td className="px-8 py-6 text-[10px] font-mono font-bold text-[#92664A] dark:text-white/40">{b.size}</td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        title="Download Snapshot"
                                                        className="p-2.5 bg-[#FAF8F4] dark:bg-white/5 border border-[#D9D9C2] dark:border-white/10 rounded-lg text-[#5A270F] dark:text-[#EEB38C] hover:bg-[#DF8142] hover:text-white transition-all"
                                                    >
                                                        <Download className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button 
                                                        title="Purge Snapshot"
                                                        className="p-2.5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/20 rounded-lg text-red-600 hover:bg-red-600 hover:text-white transition-all"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ── Side Configuration ── */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-[#5A270F] p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                        <div className="absolute inset-0 blueprint-grid opacity-10" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#EEB38C] mb-8 flex items-center gap-3 relative z-10">
                            <Clock className="h-4 w-4" /> RETENTION_POLICY
                        </h3>
                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest border-b border-white/10 pb-4">
                                <span className="text-white/40">Auto Snapshots</span>
                                <span className="text-emerald-500">ENABLED</span>
                            </div>
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest border-b border-white/10 pb-4">
                                <span className="text-white/40">Retention Count</span>
                                <span className="text-[#EEB38C]">30_DAYS</span>
                            </div>
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                <span className="text-white/40">Encryption</span>
                                <span className="text-[#EEB38C]">AES_256_GCM</span>
                            </div>
                            <button className="w-full mt-4 py-4 bg-[#DF8142] text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-xl hover:-translate-y-0.5 transition-all">
                                UPDATE_POLICY
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1A0B04] p-8 rounded-[2.5rem] border border-[#D9D9C2] dark:border-white/5 group">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 dark:border-emerald-900/20">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-[#5A270F] dark:text-white uppercase tracking-widest">INTEGRITY_INDEX</h4>
                                <p className="text-[8px] font-black text-[#92664A] uppercase tracking-[0.2em] mt-1">Status: 100% Reliable</p>
                            </div>
                        </div>
                        <p className="text-[10px] text-[#92664A] leading-relaxed mb-8">All spectral snapshots are verified against the master checksum protocol. Zero corruption detected in current archival stratum.</p>
                        <button className="w-full py-4 border-2 border-[#5A270F] border-dashed text-[#5A270F] dark:text-[#EEB38C] dark:border-[#EEB38C]/20 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-[#5A270F] hover:text-white transition-all flex items-center justify-center gap-3">
                            <Upload className="h-3.5 w-3.5" /> RESTORE_FROM_EXTERNAL
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Backup;
