import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import type { User } from "../../models";
import {
  Loader2,
  UserPlus,
  ShieldAlert,
  Trash2,
  Edit2,
  Shield,
  Search,
  Cpu,
  Zap,
  Globe,
  Settings,
  RefreshCw,
} from "lucide-react";
import { toast } from "../../lib/toast";

const ManageDeptHeads = () => {
  const [deptHeads, setDeptHeads] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedHeadId, setSelectedHeadId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    universityId: "",
  });

  useEffect(() => {
    fetchDeptHeads();
  }, []);

  const fetchDeptHeads = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/superadmin/dept-heads");
      setDeptHeads(data);
    } catch (err) {
      console.error(err);
      toast.error(
        "Security Interface Error: Failed to synchronize authority matrix",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    try {
      if (modalMode === "create") {
        await api.post("/superadmin/dept-heads", formData);
        toast.success("Department Head Authorization Granted");
      } else {
        await api.put(`/superadmin/dept-heads/${selectedHeadId}`, formData);
        toast.success("Authority Credentials Recalibrated");
      }
      setIsModalOpen(false);
      fetchDeptHeads();
      resetForm();
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      toast.error(errorMsg || "Authorization Protocol Failed");
    } finally {
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      universityId: "",
    });
    setModalMode("create");
    setSelectedHeadId(null);
  };

  const generatePassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0, n = charset.length; i < 12; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    setFormData((prev) => ({ ...prev, password }));
    toast.info("Secure Key Generated");
  };

  const handleEdit = (head: User) => {
    setModalMode("edit");
    setSelectedHeadId(head.id);
    setFormData({
      firstName: head.first_name || head.firstName || "",
      lastName: head.last_name || head.lastName || "",
      email: head.email,
      password: "",
      universityId: head.university_id || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "CRITICAL: This will revoke all elevated authority from this node. Purge specimen?",
      )
    )
      return;
    try {
      await api.delete(`/superadmin/dept-heads/${id}`);
      toast.success("Authority Purged from Matrix");
      setDeptHeads(deptHeads.filter((h) => h.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Protocol Breach: Failed to revoke authority");
    }
  };

  const filteredHeads = deptHeads.filter(
    (h) =>
      `${h.first_name || h.firstName} ${h.last_name || h.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      h.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-pulse">
        <Cpu className="h-12 w-12 text-primary/90 mb-4 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 dark:text-white/40">
          Decrypting Authority Matrix...
        </p>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Super Header Matrix - Compactized */}
      <div className="bg-gradient-to-br from-[#5A270F] via-[#6C3B1C] to-[#2A1205] rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-10 text-white relative overflow-hidden group shadow-[0_20px_50px_-10px_rgba(42,18,5,0.3)] border border-[#92664A]/20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#DF8142]/10 blur-[110px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#DF8142]/20 transition-all duration-1000 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-full blueprint-grid-dark opacity-5 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-[#EEB38C]/10 border border-[#EEB38C]/20 rounded-full text-[8px] font-black uppercase tracking-[0.4em] text-[#EEB38C] mb-6 backdrop-blur-md">
              <ShieldAlert className="h-3 w-3" /> AUTHORITY_TERMINAL_v1.0
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter mb-4 leading-[0.9] uppercase italic">
              AUTHORITY{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] to-[#EEB38C]">
                ARCHITECT
              </span>
            </h1>
            <p className="text-[#EEB38C]/60 font-bold uppercase tracking-[0.12em] text-[9px] leading-relaxed border-l-2 border-[#DF8142] pl-6">
              Managing high-level administrative nodes and executive administrative synchronization.
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="px-8 py-4 bg-[#DF8142] text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-white hover:text-[#5A270F] transition-all duration-500 shadow-xl active:scale-95 flex items-center gap-4 group/btn"
          >
            <UserPlus className="h-4 w-4 group-hover/btn:rotate-[15deg] transition-transform text-white group-hover/btn:text-[#DF8142]" />
            APPOINT_HEAD_NODE
          </button>
        </div>
      </div>

      {/* Authority Control Matrix - High Density */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white dark:bg-[#0C0603] p-6 lg:p-8 rounded-[2.5rem] border border-[#D9D9C2]/50 dark:border-white/5 shadow-lg dark:shadow-none">
            <div className="relative group mb-8">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A270F] dark:text-white/20 group-focus-within:text-[#DF8142] transition-colors" />
              <input
                type="text"
                placeholder="SEARCH_AUTHORITY_ID..."
                className="w-full h-14 pl-14 pr-8 bg-[#FAF8F4] dark:bg-white/5 border border-[#D9D9C2]/40 dark:border-white/10 rounded-2xl text-[12px] font-black uppercase tracking-widest focus:ring-4 focus:ring-[#DF8142]/5 focus:border-[#DF8142] outline-none transition-all placeholder:text-[#6C3B1C]/40 text-[#5A270F] dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredHeads.map((head) => (
                <div
                  key={head.id}
                  className="group relative bg-[#FAF8F4]/50 dark:bg-white/[0.02] border border-[#D9D9C2]/30 dark:border-white/5 rounded-2xl p-5 hover:border-[#DF8142]/40 hover:bg-white dark:hover:bg-white/5 transition-all duration-500"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 shrink-0 bg-[#5A270F] rounded-xl flex items-center justify-center text-white text-lg font-black shadow-lg group-hover:bg-[#DF8142] transition-all duration-500">
                        {(head.first_name || head.firstName)?.[0]}
                      </div>
                      <div className="min-w-0 space-y-1">
                        <h3 className="text-base font-black text-[#6C3B1C] dark:text-white uppercase italic leading-none truncate">
                          {head.first_name || head.firstName}{" "}
                          {head.last_name || head.lastName}
                        </h3>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#DF8142] bg-[#DF8142]/10 px-2.5 py-1 rounded border border-[#DF8142]/20 w-fit">
                            ID: {head.id.slice(0, 8)}
                          </span>
                          <span className="text-[9px] font-black text-[#6C3B1C] dark:text-white/40 uppercase tracking-[0.2em] truncate">
                            {head.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(head)}
                        title="Recalibrate Credentials"
                        className="p-3 bg-[#6C3B1C]/5 dark:bg-white/5 text-[#6C3B1C] dark:text-white rounded-xl hover:bg-[#DF8142] hover:text-white transition-all shadow-sm active:scale-90"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(head.id)}
                        title="Revoke Authority"
                        className="p-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-700 hover:text-white transition-all shadow-sm active:scale-90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredHeads.length === 0 && (
                <div className="py-16 text-center bg-[#FAF8F4] dark:bg-white/[0.02] rounded-[2rem] border border-[#D9D9C2] dark:border-white/5">
                  <Globe className="h-12 w-12 text-[#DF8142]/60 mx-auto mb-4" />
                  <p className="text-[9px] font-black uppercase tracking-[0.5em] text-[#6C3B1C] dark:text-white/30">
                    EMPTY_AUTHORITY_MATRIX
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Intel - Compact */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-[#5A270F] p-6 lg:p-7 rounded-[2.5rem] border border-[#92664A]/40 shadow-xl relative overflow-hidden group">
            <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-[#EEB38C] mb-8 flex items-center gap-3 relative z-10">
              <Zap className="h-3.5 w-3.5 text-[#DF8142]" /> ACTIVE_INDICES
            </h3>
            <div className="space-y-4 relative z-10">
              {[
                { label: "AUTH_NODES", val: deptHeads.length, icon: Shield },
                { label: "STABILITY", val: "99.9_%", icon: Cpu },
                { label: "UPTIME", val: "02:40", icon: Globe },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-4 bg-[#6C3B1C]/50 hover:bg-[#6C3B1C]/80 transition-all rounded-xl border border-[#92664A]/30 flex items-center justify-between group/stat"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-[#5A270F] rounded-lg border border-[#92664A]/30 group-hover/stat:border-[#DF8142] transition-colors">
                      <stat.icon className="h-3.5 w-3.5 text-[#DF8142]" />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#EEB38C]/70">
                      {stat.label}
                    </span>
                  </div>
                  <span className="text-xs font-black text-white tracking-widest uppercase">
                    {stat.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#EEB38C] to-[#DF8142] rounded-[2.5rem] p-8 text-[#5A270F] relative overflow-hidden shadow-xl group">
            <Settings className="h-10 w-10 mb-6 relative z-10 group-hover:rotate-90 transition-transform duration-1000 opacity-60" />
            <h3 className="text-xl font-black mb-3 relative z-10 italic uppercase tracking-tighter">
              MATRIX_PROTOCOL
            </h3>
            <p className="text-[#5A270F]/80 text-[9px] font-black uppercase tracking-[0.15em] leading-relaxed mb-8 relative z-10">
              Authority nodes are monitored via encrypted institutional relays. All re-authorizations are logged.
            </p>
            <Link
              to="/super-admin/logs"
              className="block w-full py-4 bg-[#5A270F] text-white rounded-xl text-[9px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all text-center"
            >
              AUDIT_SYSTEM_LOGS
            </Link>
          </div>
        </div>
      </div>

      {/* Creation/Edit Matrix Modal - Shrunken */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#0C0603]/80 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white dark:bg-[#0C0603] rounded-[2.5rem] shadow-2xl border border-[#D9D9C2]/20 overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="bg-gradient-to-br from-[#5A270F] via-[#6C3B1C] to-[#2A1205] p-10 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#DF8142]/10 blur-[80px]" />
              <div className="relative z-10 text-center md:text-left">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-[#EEB38C] mb-4">
                   {modalMode === "create" ? "NODE_INITIALIZATION" : "RECALIBRAT_v12"}
                </p>
                <h2 className="text-2xl lg:text-3xl font-black tracking-tight uppercase italic leading-none">
                  {modalMode === "create" ? "APPOINT HEAD" : "UPDATE NODE"}
                </h2>
              </div>
            </div>

            <form onSubmit={handleCreateOrUpdate} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-[#92664A] uppercase tracking-[0.4em] ml-1">IDENTIFIER_FIRST</label>
                  <input required placeholder="INPUT_KEY" className="w-full h-13 px-6 bg-[#FAF8F4] dark:bg-white/5 border border-[#D9D9C2]/40 rounded-xl text-[11px] font-black uppercase tracking-widest focus:border-[#DF8142] outline-none transition-all dark:text-white" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-[#92664A] uppercase tracking-[0.4em] ml-1">IDENTIFIER_LAST</label>
                  <input required placeholder="INPUT_VAL" className="w-full h-13 px-6 bg-[#FAF8F4] dark:bg-white/5 border border-[#D9D9C2]/40 rounded-xl text-[11px] font-black uppercase tracking-widest focus:border-[#DF8142] outline-none transition-all dark:text-white" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[8px] font-black text-[#92664A] uppercase tracking-[0.4em] ml-1">SECURE_EMAIL_RELAY</label>
                <input required type="email" placeholder="HEAD@INSTITUTE.EDU" className="w-full h-13 px-6 bg-[#FAF8F4] dark:bg-white/5 border border-[#D9D9C2]/40 rounded-xl text-[11px] font-black uppercase tracking-widest focus:border-[#DF8142] outline-none transition-all dark:text-white" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>

              <div className="space-y-2">
                <label className="text-[8px] font-black text-[#92664A] uppercase tracking-[0.4em] ml-1">ACCESS_KEY {modalMode === "edit" && "(OPTIONAL)"}</label>
                <div className="relative">
                  <input required={modalMode === "create"} type="text" placeholder="••••••••" className="w-full h-13 pl-6 pr-16 bg-[#FAF8F4] dark:bg-white/5 border border-[#D9D9C2]/40 rounded-xl text-[11px] font-black tracking-widest focus:border-[#DF8142] outline-none transition-all dark:text-white" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                  <button type="button" onClick={generatePassword} title="Generate Secure Access Key" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#DF8142] hover:bg-[#EEB38C]/10 rounded-lg transition-all"><RefreshCw className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="pt-8 flex flex-col md:flex-row justify-end gap-5 border-t border-[#D9D9C2]/10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.3em] text-[#92664A] hover:text-[#5A270F] transition-colors">TERMINATE</button>
                <button type="submit" disabled={processing} className="px-10 py-4 bg-[#5A270F] text-white text-[9px] font-black uppercase tracking-[0.4em] rounded-xl hover:bg-[#DF8142] transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3">
                  {processing ? <Loader2 className="h-3 w-3 animate-spin" /> : "EXECUTE_SYNC"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDeptHeads;
