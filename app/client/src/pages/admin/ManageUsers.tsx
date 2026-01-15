import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import type { User } from "../../models";
import {
  Loader2,
  UserPlus,
  Edit2,
  Trash2,
  Shield,
  User as UserIcon,
  Search,
  MessageSquare,
  Zap,
} from "lucide-react";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    roleName: "Student",
    universityId: "",
    batch: "",
    year: "",
    semester: "",
    status: "active",
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/users");
      if (Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch users:", err);
      toast.error("Protocol Error: Failed to synchronize user registry");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      roleName: "Student",
      universityId: "",
      batch: "",
      year: "",
      semester: "",
      status: "active",
    });
    setSelectedUser(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName || user.first_name || "",
      lastName: user.lastName || user.last_name || "",
      email: user.email,
      password: "",
      roleName:
        typeof user.role === "string"
          ? user.role
          : user.role?.name || "Student",
      universityId:
        (user as { university_id?: string }).university_id ||
        (user as { universityId?: string }).universityId ||
        "",
      batch: user.batch?.toString() || "",
      year: user.year?.toString() || "",
      semester: "",
      status: user.status,
    });
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to terminate this user node? This operation is irreversible."
      )
    )
      return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User node terminated successfully");
      setUsers(users.filter((u) => u.id !== id));
    } catch (err: unknown) {
      console.error("Delete error", err);
      toast.error("Protocol Breach: Failed to terminate user node");
    }
  };

  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [notifyData, setNotifyData] = useState({ title: "", message: "" });

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !notifyData.title || !notifyData.message) return;

    setProcessing(true);
    try {
      await api.post("/admin/notifications/send", {
        userId: selectedUser.id,
        ...notifyData,
      });
      toast.success("Intelligence transmitted to target node.");
      setIsNotifyModalOpen(false);
      setNotifyData({ title: "", message: "" });
    } catch (err: unknown) {
      console.error("Direct transmission error:", err);
      toast.error("Transmission failed: Protocol error.");
    } finally {
      setProcessing(false);
    }
  };

  const handleBroadcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyData.title || !notifyData.message) return;

    setProcessing(true);
    try {
      await api.post("/admin/notifications/broadcast", notifyData);
      toast.success("Global broadcast transmitted to all nodes.");
      setIsBroadcastModalOpen(false);
      setNotifyData({ title: "", message: "" });
    } catch (err: unknown) {
      console.error("Broadcast transmission error:", err);
      toast.error("Global transmission failed: Protocol error.");
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Registry Validation Protocol
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.warn("Registry Denial: Legal Identity identifiers required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.warn("Protocol Breach: Invalid email syntax detected.");
      return;
    }

    if (modalMode === "create" && formData.password.length < 6) {
      toast.warn("Security Warning: Initial authorization key is too short.");
      return;
    }

    setProcessing(true);
    try {
      if (modalMode === "create") {
        await api.post("/admin/users/create", formData);
        fetchUsers();
        toast.success("User node initialized successfully");
      } else {
        if (selectedUser) {
          await api.patch(`/admin/users/${selectedUser.id}`, formData);
          fetchUsers();
          toast.success("User configuration updated");
        }
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      console.error("Submit error", err);
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Operation failed";
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName || user.first_name || ""} ${
      user.lastName || user.last_name || ""
    }`.toLowerCase();
    const email = user.email.toLowerCase();
    const search = searchQuery.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
          <Loader2 className="h-8 w-8 text-indigo-600 animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
          Synchronizing Registry...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Controller */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="text"
            placeholder="Search specific user node..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-6 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="flex-1 md:flex-none px-6 py-3 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center gap-3"
          >
            <Zap className="h-4 w-4" />
            Global Broadcast
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex-1 md:flex-none px-8 py-3 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-800 transition-all hover:-translate-y-1 shadow-2xl shadow-slate-950/20 active:scale-95 flex items-center justify-center gap-3"
          >
            <UserPlus className="h-4 w-4" />
            Initialize Node
          </button>
        </div>
      </div>

      {/* User Registry Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-950">
                <th className="px-10 py-6 text-left text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                  User Specimen
                </th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                  Identity ID
                </th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                  Role Cluster
                </th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                  Status
                </th>
                <th className="px-10 py-6 text-right text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                  Directives
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => {
                const roleName =
                  typeof user.role === "string"
                    ? user.role
                    : user.role?.name || "N/A";
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-10 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-5">
                        <div className="h-12 w-12 flex-shrink-0 bg-slate-950 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-lg group-hover:bg-indigo-600 transition-colors">
                          {(user.firstName || user.first_name)?.[0]}
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-950">
                            {user.firstName || user.first_name}{" "}
                            {user.lastName || user.last_name}
                          </div>
                          <div className="text-xs text-slate-400 font-medium">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className="text-xs font-mono font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                        {user.university_id ||
                          (user as { universityId?: string }).universityId ||
                          "EXT-NODE"}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          roleName === "Admin"
                            ? "bg-purple-50 text-purple-600 border-purple-100"
                            : roleName === "Faculty"
                            ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                            : "bg-slate-50 text-slate-600 border-slate-100"
                        }`}
                      >
                        <Shield className="h-3 w-3" />
                        {roleName}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${
                            user.status === "active"
                              ? "bg-emerald-500 animate-pulse"
                              : "bg-rose-500"
                          }`}
                        />
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${
                            user.status === "active"
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }`}
                        >
                          {user.status === "active" ? "Active" : "Suspended"}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsNotifyModalOpen(true);
                          }}
                          className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          title="Direct Transmission"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          title="Configure"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Terminate"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="py-24 text-center">
              <UserIcon className="h-16 w-16 text-slate-100 mx-auto mb-6" />
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                No Specimen Detected
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-2">
                The registry contains no matching user nodes.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* User Management Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl animate-in fade-in duration-500"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-white overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="bg-slate-950 px-10 py-10 relative overflow-hidden group/modal">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[80px] transition-all group-hover/modal:bg-indigo-600/30" />
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2">
                  Registry Update
                </p>
                <h3 className="text-3xl font-black text-white leading-tight">
                  {modalMode === "create"
                    ? "Initialize User Node"
                    : "Configure Specimen"}
                </h3>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    First Identifier
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    title="First Identifier"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Last Identifier
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    title="Last Identifier"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Communication Frequency (Email)
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  title="Communication Frequency (Email)"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                  required
                />
              </div>

              {modalMode === "create" && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Initial Authorization Key
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    title="Initial Authorization Key"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                    required={modalMode === "create"}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Role Priority
                  </label>
                  <select
                    id="roleName"
                    name="roleName"
                    title="Role Priority"
                    value={formData.roleName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none"
                  >
                    <option value="Student">Student Node</option>
                    <option value="Faculty">Faculty Node</option>
                    <option value="Admin">Admin Node</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Active Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    title="Active Status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none"
                  >
                    <option value="active">Protocol: Active</option>
                    <option value="inactive">Protocol: Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-8 flex justify-end gap-4 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-950 transition-colors"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-10 py-3 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-50"
                >
                  {processing ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  ) : modalMode === "create" ? (
                    "Initialize"
                  ) : (
                    "Deploy Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Dispatch Modal */}
      {isNotifyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl animate-in fade-in duration-500"
            onClick={() => setIsNotifyModalOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-white overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="bg-slate-950 px-10 py-8 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2">
                  Communication Protocol
                </p>
                <h3 className="text-2xl font-black text-white leading-tight">
                  Direct Briefing: {selectedUser?.firstName}
                </h3>
              </div>
            </div>

            <form onSubmit={handleNotifySubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Briefing Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="Intel objective..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={notifyData.title}
                  onChange={(e) =>
                    setNotifyData({ ...notifyData, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Narrative Payload
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Critical intelligence summary..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                  value={notifyData.message}
                  onChange={(e) =>
                    setNotifyData({ ...notifyData, message: e.target.value })
                  }
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNotifyModalOpen(false)}
                  className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-950"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-8 py-2.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                >
                  {processing ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <>
                      <Zap className="h-3 w-3" />
                      Authorize Transmission
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Broadcast Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl animate-in fade-in duration-500"
            onClick={() => setIsBroadcastModalOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-white overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="bg-indigo-600 px-10 py-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px]" />
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-2">
                  Emergency Broadcast
                </p>
                <h3 className="text-2xl font-black text-white leading-tight">
                  Global Intelligence Relay
                </h3>
              </div>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Relay Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="Universal objective..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={notifyData.title}
                  onChange={(e) =>
                    setNotifyData({ ...notifyData, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Broadcast Payload
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Distribute intelligence to all active nodes..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                  value={notifyData.message}
                  onChange={(e) =>
                    setNotifyData({ ...notifyData, message: e.target.value })
                  }
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-950"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-8 py-2.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                >
                  {processing ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <>
                      <Zap className="h-3 w-3" />
                      Engage Wide-Spectrum Broadcast
                    </>
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

export default ManageUsers;
