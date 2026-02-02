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
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#5A270F] via-[#6C3B1C] to-[#92664A] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-[#5A270F]/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DF8142]/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EEB38C]/20 border border-[#EEB38C]/30 rounded-full text-[10px] font-black uppercase tracking-widest text-[#EEB38C] mb-6">
            <Activity className="h-3 w-3" /> System Audit
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-4">
            Security{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] to-[#EEB38C]">
              Vault Logs
            </span>
          </h1>
          <p className="text-[#EEB38C]/60 font-bold uppercase tracking-[0.2em] text-[10px] max-w-md">
            Immutable record of all critical authority actions and matrix
            modifications.
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-[2rem] border border-[#D9D9C2] shadow-sm flex items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#DF8142]" />
          <input
            type="text"
            placeholder="Search Protocol ID, Action, or Actor..."
            className="w-full h-12 pl-14 bg-[#EFEDED] rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#DF8142]/20 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={handleExport}
          className="h-12 px-6 bg-[#2A1205] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#5A270F] transition-all flex items-center gap-2"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-[2.5rem] border border-[#D9D9C2] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#EFEDED] border-b border-[#D9D9C2]">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Timestamp
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Action
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Actor
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9D9C2]">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-12 text-center text-xs font-bold uppercase tracking-widest text-[#DF8142] animate-pulse"
                  >
                    Decrypting Logs...
                  </td>
                </tr>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-[#F5F5DC]/30 transition-colors group"
                  >
                    <td className="px-8 py-6 text-xs font-mono text-gray-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#EEB38C]/10 text-[#5A270F] rounded-lg text-[10px] font-black uppercase tracking-widest border border-[#EEB38C]/20">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#2A1205] text-white flex items-center justify-center text-xs font-bold">
                          {log.actor?.name?.[0] || "?"}
                        </div>
                        <span className="text-xs font-bold text-[#2A1205]">
                          {log.actor?.name || "System"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-600 font-medium">
                      {log.details}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <FileText className="h-10 w-10 text-gray-300" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        No audit records found
                      </p>
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
