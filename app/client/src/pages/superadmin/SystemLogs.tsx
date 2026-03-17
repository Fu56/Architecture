import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { Download, FileText, Search, Activity } from "lucide-react";

interface Log {
  id: number;
  action: string;
  details: string;
  entity?: string;
  createdAt: string;
  actor?: {
    name: string;
    email: string;
  };
}

const SystemLogs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await api.get("/superadmin/logs");
        setLogs(data);
      } catch {
        console.error("Failed to fetch logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details?.toLowerCase().includes(search.toLowerCase()) ||
      log.actor?.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleExport = () => {
    // Define headers
    const headers = [
      "ID",
      "Action",
      "Details",
      "Actor",
      "Actor Email",
      "Created At",
    ];

    // Map data to CSV rows
    const rows = filteredLogs.map((log) => [
      log.id,
      `"${log.action}"`, // Quote strings to handle commas
      `"${log.details?.replace(/"/g, '""') || ""}"`, // Text sanitizer
      `"${log.actor?.name || "System"}"`,
      `"${log.actor?.email || "N/A"}"`,
      new Date(log.createdAt).toLocaleString(),
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `system_logs_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      {/* Super Header Matrix - Compact */}
      <div className="bg-gradient-to-br from-[#5A270F] via-[#6C3B1C] to-[#2A1205] rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-10 text-white relative overflow-hidden group shadow-[0_20px_50px_-10px_rgba(42,18,5,0.3)] border border-[#92664A]/20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#DF8142]/10 blur-[110px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#DF8142]/20 transition-all duration-1000 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-full blueprint-grid-dark opacity-5 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-[#EEB38C]/10 border border-[#EEB38C]/20 rounded-full text-[8px] font-black uppercase tracking-[0.4em] text-[#EEB38C] mb-6 backdrop-blur-md">
            <Activity className="h-3 w-3" /> SECURITY_AUDIT_PROTOCOL
          </div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tighter mb-4 leading-[0.9] uppercase italic">
            SECURITY{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] to-[#EEB38C]">
              VAULT_LOGS
            </span>
          </h1>
          <p className="text-[#EEB38C]/60 font-bold uppercase tracking-[0.12em] text-[9px] leading-relaxed border-l-2 border-[#DF8142] pl-6 max-w-md">
            IMMUTABLE_RECORD_STRATUM: ALL CRITICAL AUTHORITY ACTIONS AND MATRIX MODIFICATIONS ARE SYNCHRONIZED HERE.
          </p>
        </div>
      </div>

      {/* Control Bar - Compact */}
      <div className="bg-white dark:bg-[#0C0603] p-4 rounded-3xl border border-[#D9D9C2]/50 dark:border-white/5 shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-[#92664A] dark:text-white/20 group-focus-within:text-[#DF8142] transition-colors" />
          <input
            type="text"
            placeholder="SEARCH_PROTOCOL_ID..."
            className="w-full h-11 pl-14 bg-[#FAF8F4] dark:bg-white/5 border border-[#D9D9C2]/40 dark:border-white/10 rounded-xl text-[11px] font-black uppercase tracking-widest focus:ring-4 focus:ring-[#DF8142]/5 focus:border-[#DF8142] outline-none transition-all placeholder:text-[#92664A]/30 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={handleExport}
          className="h-11 px-8 bg-[#5A270F] text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#DF8142] transition-all duration-500 flex items-center justify-center gap-3 shadow-xl active:scale-95"
        >
          <Download className="h-3.5 w-3.5" /> EXPORT_CSV
        </button>
      </div>

      {/* Logs Table Architecture */}
      <div className="bg-white dark:bg-[#0C0603] rounded-[2.5rem] border border-[#D9D9C2]/50 dark:border-white/5 overflow-hidden shadow-2xl dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#FAF8F4] dark:bg-white/[0.02] border-b border-[#D9D9C2]/40 dark:border-white/10">
              <tr>
                <th className="px-7 py-5 text-[9px] font-black uppercase tracking-[0.4em] text-[#92664A] dark:text-white/30">TIMESTAMP</th>
                <th className="px-7 py-5 text-[9px] font-black uppercase tracking-[0.4em] text-[#92664A] dark:text-white/30">PROTOCOL_ACTION</th>
                <th className="px-7 py-5 text-[9px] font-black uppercase tracking-[0.4em] text-[#92664A] dark:text-white/30">ACTOR_NODE</th>
                <th className="px-7 py-5 text-[9px] font-black uppercase tracking-[0.4em] text-[#92664A] dark:text-white/30">MANIFEST_DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9D9C2]/20 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-16 text-center text-[9px] font-black uppercase tracking-[0.6em] text-[#DF8142] animate-pulse">
                    DECRYPTING_VAULT_RECORDS...
                  </td>
                </tr>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAF8F4] dark:hover:bg-white/[0.01] transition-colors group">
                    <td className="px-7 py-5 text-[10px] font-mono font-bold text-[#92664A] dark:text-white/30 tabular-nums">
                      {new Date(log.createdAt).toLocaleString('en-GB', { hour12: false })}
                    </td>
                    <td className="px-7 py-5">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#DF8142]/5 text-[#DF8142] rounded-md text-[9px] font-black uppercase tracking-widest border border-[#DF8142]/20 shadow-sm">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-7 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#5A270F] text-white flex items-center justify-center text-[9px] font-black shadow-lg">
                          {(log.actor?.name?.[0] || "?").toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-[#5A270F] dark:text-white/60 uppercase tracking-tighter">
                            {log.actor?.name || "SYSTEM_00"}
                          </span>
                          <span className="text-[8px] font-bold text-[#92664A] dark:text-white/20 tracking-widest">
                            {log.actor?.email ? "VERIFIED_UID" : "ROOT_ACCESS"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-7 py-5 text-[11px] text-[#6C3B1C] dark:text-white/50 font-medium max-w-md truncate">
                      {log.details}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <FileText className="h-12 w-12 text-[#92664A]/20" />
                      <p className="text-[9px] font-black uppercase tracking-[0.5em] text-[#92664A]/40">NO_RECORDS_SYNCHRONIZED</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;
