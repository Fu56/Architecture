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
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">
          Decrypting Authority Matrix...
        </p>
      </div>
    );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Super Header */}
      <div className="bg-gradient-to-r from-[#2A1205] to-[#5A270F] rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 text-white relative overflow-hidden group shadow-2xl shadow-[#2A1205]/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DF8142]/20 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#DF8142]/30 transition-all duration-1000" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EEB38C]/20 border border-[#EEB38C]/30 rounded-full text-[10px] font-black uppercase tracking-widest text-[#EEB38C] mb-6 shadow-sm">
              <ShieldAlert className="h-3 w-3" /> System Developer Interface
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Authority{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] to-[#EEB38C]">
                Architect
              </span>
            </h1>
            <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px] max-w-md">
              Managing top-tier administrative nodes and departmental authority
              matrix synchronization.
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="px-10 py-5 bg-white text-[#2A1205] text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#EEB38C] hover:text-[#2A1205] transition-all shadow-2xl shadow-black/20 active:scale-95 flex items-center gap-4 group"
          >
            <UserPlus className="h-5 w-5 group-hover:rotate-12 transition-transform text-[#DF8142] group-hover:text-[#2A1205]" />
            Appoint Dept Head
          </button>
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-[#D9D9C2] shadow-xl shadow-slate-200/50">
            <div className="relative group mb-8">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-primary/90 transition-colors" />
              <input
                type="text"
                placeholder="Search Authority Nodes..."
                className="w-full h-16 pl-16 pr-8 bg-[#EFEDED] border border-[#D9D9C2] rounded-3xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary/90 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              {filteredHeads.map((head) => (
                <div
                  key={head.id}
                  className="group relative bg-[#faf9f6] border border-[#D9D9C2] rounded-3xl p-6 hover:border-[#DF8142]/40 hover:shadow-2xl hover:shadow-[#DF8142]/5 transition-all duration-500"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 shrink-0 bg-[#2A1205] rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-2xl group-hover:bg-primary transition-all duration-500">
                        {(head.first_name || head.firstName)?.[0]}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-black text-[#2A1205] mb-1 truncate">
                          {head.first_name || head.firstName}{" "}
                          {head.last_name || head.lastName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#5A270F] bg-[#EEB38C]/20 px-3 py-1 rounded-full border border-[#EEB38C]/30 shrink-0">
                            Department Head
                          </span>
                          <span className="text-[10px] font-bold text-gray-500 truncate">
                            {head.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:justify-end">
                      <button
                        onClick={() => handleEdit(head)}
                        title="Recalibrate Credentials"
                        className="flex-1 sm:flex-none p-4 bg-primary/10 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm active:scale-90"
                      >
                        <Edit2 className="h-5 w-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleDelete(head.id)}
                        title="Revoke Authority"
                        className="flex-1 sm:flex-none p-4 bg-red-50 text-red-700 rounded-2xl hover:bg-red-700 hover:text-white transition-all shadow-sm active:scale-90"
                      >
                        <Trash2 className="h-5 w-5 mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredHeads.length === 0 && (
                <div className="py-20 text-center bg-[#EFEDED] rounded-[2rem] border border-dashed border-[#D9D9C2]">
                  <Globe className="h-12 w-12 text-[#EEB38C] mx-auto mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    No Authority Nodes Found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-b from-[#5A270F] to-[#2A1205] p-6 sm:p-8 rounded-[2.5rem] border border-[#92664A]/30 shadow-xl shadow-[#2A1205]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#DF8142]/10 blur-[80px]" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#EEB38C] mb-6 flex items-center gap-3 relative z-10">
              <Zap className="h-4 w-4 text-[#DF8142]" /> System Stats
            </h3>
            <div className="grid grid-cols-1 gap-4 relative z-10">
              {[
                {
                  label: "Active Dept Heads",
                  val: deptHeads.length,
                  icon: Shield,
                },
                { label: "Matrix Integrity", val: "99.9%", icon: Cpu },
                { label: "System Uptime", val: "2,400h", icon: Globe },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-5 bg-[#6C3B1C]/40 hover:bg-[#6C3B1C]/60 transition-colors rounded-2xl border border-[#92664A]/20 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#2A1205]/50 rounded-xl shadow-sm border border-[#92664A]/30 group-hover:border-[#DF8142] transition-colors">
                      <stat.icon className="h-4 w-4 text-[#DF8142]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#EEB38C]/70">
                      {stat.label}
                    </span>
                  </div>
                  <span className="text-sm font-black text-white group-hover:text-[#EEB38C] transition-colors">
                    {stat.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#92664A] to-[#6C3B1C] rounded-[2.5rem] p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-[#6C3B1C]/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#EEB38C]/10 blur-3xl" />
            <Settings className="h-10 w-10 mb-6 relative z-10 text-[#EEB38C]/80" />
            <h3 className="text-xl font-black mb-2 relative z-10">
              Matrix Maintenance
            </h3>
            <p className="text-[#EEB38C]/60 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-6 relative z-10">
              Automated subsystem integrity checks are active. All authority
              revocations are logged in the secure vault.
            </p>
            <Link
              to="/super-admin/logs"
              className="block w-full text-center py-4 bg-[#EEB38C]/10 hover:bg-[#EEB38C] text-[#EEB38C] hover:text-[#2A1205] border border-[#EEB38C]/20 hover:border-[#EEB38C] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-transparent hover:shadow-[#6C3B1C]/20"
            >
              System Logs
            </Link>
          </div>
        </div>
      </div>

      {/* Creation/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#2A1205]/60 backdrop-blur-2xl animate-in fade-in duration-500"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white rounded-[3.5rem] shadow-2xl border border-white overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="bg-gradient-to-br from-[#5A270F] to-[#2A1205] p-12 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#DF8142]/20 blur-[80px]" />
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#EEB38C] mb-4">
                  {modalMode === "create"
                    ? "Grant Elevated Access"
                    : "Recalibrate Matrix Node"}
                </p>
                <h2 className="text-3xl font-black tracking-tight">
                  {modalMode === "create"
                    ? "Appoint Department Head"
                    : "Update Credentials"}
                </h2>
              </div>
            </div>

            <form onSubmit={handleCreateOrUpdate} className="p-12 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">
                    First Name
                  </label>
                  <input
                    required
                    id="firstName"
                    title="First Name"
                    placeholder="Enter first name"
                    className="w-full h-14 px-6 bg-[#EFEDED] border border-[#D9D9C2] rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[#DF8142]/10 focus:border-[#DF8142] outline-none transition-all placeholder:text-gray-400 text-[#2A1205]"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">
                    Last Name
                  </label>
                  <input
                    required
                    id="lastName"
                    title="Last Name"
                    placeholder="Enter last name"
                    className="w-full h-14 px-6 bg-[#EFEDED] border border-[#D9D9C2] rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[#DF8142]/10 focus:border-[#DF8142] outline-none transition-all placeholder:text-gray-400 text-[#2A1205]"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">
                  Official Email
                </label>
                <input
                  required
                  type="email"
                  id="email"
                  title="Official Email"
                  placeholder="e.g. head@department.edu"
                  className="w-full h-14 px-6 bg-[#EFEDED] border border-[#D9D9C2] rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[#DF8142]/10 focus:border-[#DF8142] outline-none transition-all placeholder:text-gray-400 text-[#2A1205]"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">
                  Access Key{" "}
                  {modalMode === "edit"
                    ? "(Leave blank to keep current)"
                    : "(Password)"}
                </label>
                <div className="relative">
                  <input
                    required={modalMode === "create"}
                    type="text"
                    id="password"
                    title="Access Key"
                    placeholder="••••••••"
                    className="w-full h-14 pl-6 pr-14 bg-[#EFEDED] border border-[#D9D9C2] rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[#DF8142]/10 focus:border-[#DF8142] outline-none transition-all placeholder:text-gray-400 text-[#2A1205]"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={generatePassword}
                    title="Auto-Generate Secure Key"
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[#DF8142] hover:bg-[#EEB38C]/20 rounded-xl transition-all active:rotate-180"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
                {modalMode === "create" && (
                  <p className="flex items-center gap-2 pl-2 text-[10px] font-bold text-[#DF8142]">
                    <Shield className="h-3 w-3" />
                    Secure credentials will be automatically dispatched to this
                    email.
                  </p>
                )}
              </div>

              <div className="pt-6 flex justify-end gap-6 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#2A1205] transition-colors"
                >
                  Terminate Operation
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-10 py-4 bg-[#2A1205] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#5A270F] transition-all shadow-xl disabled:opacity-50 flex items-center gap-3 shadow-[#2A1205]/20"
                >
                  {processing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : modalMode === "create" ? (
                    "Authorize & Send Access"
                  ) : (
                    "Recalibrate Node"
                  )}
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
