import { useState, useEffect } from "react";
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
} from "lucide-react";
import { toast } from "react-toastify";

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
        <Cpu className="h-12 w-12 text-indigo-500 mb-4 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
          Decrypting Authority Matrix...
        </p>
      </div>
    );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Super Header */}
      <div className="bg-slate-950 rounded-[3rem] p-10 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-600/30 transition-all duration-1000" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-6">
              <ShieldAlert className="h-3 w-3" /> System Developer Interface
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Authority <span className="text-indigo-400">Architect</span>
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
            className="px-10 py-5 bg-white text-slate-950 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-400 hover:text-white transition-all shadow-2xl shadow-indigo-500/20 active:scale-95 flex items-center gap-4 group"
          >
            <UserPlus className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            Appoint Dept Head
          </button>
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="relative group mb-8">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search Authority Nodes..."
                className="w-full h-16 pl-16 pr-8 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              {filteredHeads.map((head) => (
                <div
                  key={head.id}
                  className="group relative bg-white border border-slate-100 rounded-3xl p-6 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 bg-slate-950 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-2xl group-hover:bg-indigo-600 transition-all duration-500">
                        {(head.first_name || head.firstName)?.[0]}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-950 mb-1">
                          {head.first_name || head.firstName}{" "}
                          {head.last_name || head.lastName}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                            Department Head
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {head.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(head)}
                        title="Recalibrate Credentials"
                        className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-90"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(head.id)}
                        title="Revoke Authority"
                        className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-90"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredHeads.length === 0 && (
                <div className="py-20 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                  <Globe className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    No Authority Nodes Found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-950 mb-6 flex items-center gap-3">
              <Zap className="h-4 w-4 text-indigo-500" /> System Stats
            </h3>
            <div className="grid grid-cols-1 gap-4">
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
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <stat.icon className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {stat.label}
                    </span>
                  </div>
                  <span className="text-sm font-black text-slate-950">
                    {stat.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl" />
            <Settings className="h-10 w-10 mb-6 relative z-10 opacity-50" />
            <h3 className="text-xl font-black mb-2 relative z-10">
              Matrix Maintenance
            </h3>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-6 relative z-10">
              Automated subsystem integrity checks are active. All authority
              revocations are logged in the secure vault.
            </p>
            <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
              System Logs
            </button>
          </div>
        </div>
      </div>

      {/* Creation/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-2xl animate-in fade-in duration-500"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white rounded-[3.5rem] shadow-2xl border border-white overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="bg-slate-950 p-12 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/30 blur-[80px]" />
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-4">
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
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                    First Name
                  </label>
                  <input
                    required
                    id="firstName"
                    title="First Name"
                    placeholder="Enter first name"
                    className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                    Last Name
                  </label>
                  <input
                    required
                    id="lastName"
                    title="Last Name"
                    placeholder="Enter last name"
                    className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                  Official Email
                </label>
                <input
                  required
                  type="email"
                  id="email"
                  title="Official Email"
                  placeholder="e.g. head@department.edu"
                  className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                  Access Key{" "}
                  {modalMode === "edit"
                    ? "(Leave blank to keep current)"
                    : "(Password)"}
                </label>
                <input
                  required={modalMode === "create"}
                  type="password"
                  id="password"
                  title="Access Key"
                  placeholder="••••••••"
                  className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>

              <div className="pt-6 flex justify-end gap-6 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-950 transition-colors"
                >
                  Terminate Operation
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-10 py-4 bg-slate-950 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-50 flex items-center gap-3"
                >
                  {processing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : modalMode === "create" ? (
                    "Authorize Access"
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
