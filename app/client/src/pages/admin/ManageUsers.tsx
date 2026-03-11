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
  CheckCircle,
  RefreshCw,
  Download,
  ChevronDown,
  AlertCircle,
  X,
} from "lucide-react";
import { toast } from "../../lib/toast";
import { useSession } from "../../lib/auth-client";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface UserWithRole {
  id: string | number;
  email: string;
  name?: string;
  role?: { name: string } | string;
}

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { data: session } = useSession();
  const currentUser = session?.user as UserWithRole | undefined;
  const currentRoleName =
    typeof currentUser?.role === "string"
      ? currentUser.role
      : currentUser?.role?.name || "";
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
    roleNames: ["Student"],
    universityId: "",
    batch: "",
    year: "",
    semester: "",
    status: "active",
    specialization: "",
    department: "",
    workerId: "",
    suspendReason: "",
  });
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Download Format Dropdown State
  const [isDownloadFormatOpen, setIsDownloadFormatOpen] = useState(false);

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
      roleNames: ["Student"],
      universityId: "",
      batch: "",
      year: "",
      semester: "",
      status: "active",
      specialization: "",
      department: "",
      workerId: "",
      suspendReason: "",
    });
    setSelectedUser(null);
    setErrors({});
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    const existingRole =
      typeof user.role === "string" ? user.role : user.role?.name || "Student";

    setFormData({
      firstName: user.firstName || user.first_name || "",
      lastName: user.lastName || user.last_name || "",
      email: user.email,
      password: "",
      roleNames: [existingRole],
      universityId:
        (user as { university_id?: string }).university_id ||
        (user as { universityId?: string }).universityId ||
        "",
      batch: user.batch?.toString() || "",
      year: user.year?.toString() || "",
      semester: "",
      status: user.status,
      specialization: user.specialization || "",
      department: user.department || "",
      workerId: user.workerId || user.worker_id || "",
      suspendReason: "",
    });
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleApprove = async (id: string | number) => {
    try {
      await api.patch(`/admin/users/${id}/approve`);
      toast.success("User node authorized and activated.");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to authorize user node.");
    }
  };

  const handleDelete = async (id: string | number) => {
    if (
      !window.confirm(
        "Are you sure you want to terminate this user node? This operation is irreversible.",
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

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password: pass }));
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name required.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email identifier required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid protocol: Improper email syntax.";
    }

    if (modalMode === "create") {
      if (!formData.password) {
        newErrors.password = "Authorization key required.";
      } else if (formData.password.length < 6) {
        newErrors.password = "Security breach: Key too short (min 6 chars).";
      }
    }

    if (formData.roleNames.length === 0) {
      newErrors.roles = "Designate at least one authorization role.";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Departmental sector required.";
    }

    if (
      formData.roleNames.some((r) =>
        ["Faculty", "Admin", "DepartmentHead"].includes(r),
      )
    ) {
      if (!formData.workerId.trim())
        newErrors.workerId = "Personnel identification required.";
    }

    if (
      formData.roleNames.includes("Faculty") &&
      !formData.specialization.trim()
    ) {
      newErrors.specialization = "Academic specialization required.";
    }

    if (formData.roleNames.includes("Student")) {
      if (!formData.batch) newErrors.batch = "Batch required.";
      if (!formData.year) newErrors.year = "Year required.";
      if (!formData.semester) newErrors.semester = "Semester required.";
    }

    if (formData.status === "suspended" && !formData.suspendReason.trim()) {
      newErrors.suspendReason = "Suspension reason required for this operation.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBroadcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!notifyData.title.trim())
      newErrors.broadcastTitle = "Relay headline required.";
    if (!notifyData.message.trim())
      newErrors.broadcastMessage = "Broadcast payload required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      toast.warn("Broadcast Rejection: Incomplete payload parameters.");
      return;
    }

    setProcessing(true);
    try {
      await api.post("/admin/notifications/broadcast", notifyData);
      toast.success("Global broadcast transmitted to all nodes.");
      setIsBroadcastModalOpen(false);
      setNotifyData({ title: "", message: "" });
      setErrors((prev) => ({
        ...prev,
        broadcastTitle: "",
        broadcastMessage: "",
      }));
    } catch (err: unknown) {
      console.error("Broadcast transmission error:", err);
      toast.error("Global transmission failed: Protocol error.");
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.warn("Registry Denial: Invalid field synchronization.");
      return;
    }

    setProcessing(true);
    try {
      if (modalMode === "create") {
        await api.post("/admin/users/create", {
          ...formData,
          roleName: formData.roleNames[0],
        });
        fetchUsers();
        toast.success(
          currentRoleName === "Admin"
            ? "User node initialized: Authorization required for activation."
            : "User node initialized successfully",
        );
      } else {
        if (selectedUser) {
          await api.patch(`/admin/users/${selectedUser.id}`, {
            ...formData,
            roleName: formData.roleNames[0],
          });
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const filteredUsers = users.filter((user) => {
    const userRoleName =
      typeof user.role === "string" ? user.role : user.role?.name || "";

    // Security filter: Department Heads cannot see/manage SuperAdmins
    if (currentRoleName === "DepartmentHead" && userRoleName === "SuperAdmin") {
      return false;
    }

    // Security filter: Admins cannot see/manage DepartmentHeads or SuperAdmins
    if (
      currentRoleName === "Admin" &&
      (userRoleName === "DepartmentHead" || userRoleName === "SuperAdmin")
    ) {
      return false;
    }

    const search = searchQuery.toLowerCase();
    const firstName = (user.firstName || user.first_name || "").toLowerCase();
    const lastName = (user.lastName || user.last_name || "").toLowerCase();
    const fullName = `${firstName} ${lastName}`;
    const email = user.email.toLowerCase();
    const universityId = (user.university_id || user.universityId || "")
      .toString()
      .toLowerCase();
    const userId = user.id.toString().toLowerCase();
    const status = (user.status || "").toLowerCase();
    const role = userRoleName.toLowerCase();
    const batch = (user.batch || "").toString();
    const year = (user.year || "").toString();

    return (
      fullName.includes(search) ||
      email.includes(search) ||
      universityId.includes(search) ||
      userId.includes(search) ||
      status.includes(search) ||
      role.includes(search) ||
      batch.includes(search) ||
      year.includes(search)
    );
  });

  const handleDownload = (format: "csv" | "excel" | "pdf") => {
    setIsDownloadFormatOpen(false);

    const dataToDownload = filteredUsers.map((user) => {
      const roleName =
        typeof user.role === "string" ? user.role : user.role?.name || "N/A";
      return {
        "First Name": user.firstName || user.first_name || "",
        "Last Name": user.lastName || user.last_name || "",
        Email: user.email,
        "University ID":
          user.university_id ||
          (user as { universityId?: string }).universityId ||
          "",
        Role: roleName,
        Status: user.status,
        Department: user.department || "Architecture",
        Specialization:
          roleName === "Faculty" ? user.specialization || "" : "N/A",
      };
    });

    if (format === "pdf") {
      const doc = new jsPDF({ orientation: "landscape" });
      doc.text("User Directory", 14, 15);

      const tableColumn = [
        "First Name",
        "Last Name",
        "Email",
        "University ID",
        "Role",
        "Status",
        "Department",
        "Specialization",
      ];
      const tableRows = dataToDownload.map((row) => [
        row["First Name"],
        row["Last Name"],
        row["Email"],
        row["University ID"],
        row["Role"],
        row["Status"],
        row["Department"],
        row["Specialization"],
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
      });

      doc.save("users_export.pdf");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(dataToDownload);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    if (format === "csv") {
      XLSX.writeFile(workbook, "users_export.csv");
    } else if (format === "excel") {
      XLSX.writeFile(workbook, "users_export.xlsx");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-[#D9D9C2] dark:border-white/10 border-t-[#DF8142] rounded-full animate-spin" />
          <Loader2 className="h-8 w-8 text-[#DF8142] animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em]">
          Synchronizing Registry...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <div className="flex items-center gap-6 mb-2">
        <div className="h-14 w-14 bg-[#5A270F] rounded-[1.25rem] flex items-center justify-center text-[#EEB38C] shadow-2xl">
          <Shield className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter uppercase italic">
            Nexus Registry <span className="not-italic text-[#DF8142]">Authority</span>
          </h1>
          <p className="text-[10px] font-black text-[#92664A] dark:text-white/70 uppercase tracking-[0.5em]">
            Central Identity Management Matrix
          </p>
        </div>
      </div>
      {/* Top Controller */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white dark:bg-[#1A0B04] p-8 rounded-[3rem] border border-[#D9D9C2] dark:border-[#DF8142]/20 shadow-2xl shadow-[#5A270F]/5 transition-all duration-700">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-[#92664A] dark:text-[#EEB38C]/70 group-focus-within:text-[#DF8142] transition-colors" />
          <input
            type="text"
            placeholder="Search specific user node..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-14 pr-6 bg-[#EFEDED] dark:bg-white/5 border border-transparent focus:border-[#DF8142] rounded-[1.5rem] text-[13px] font-black text-[#5A270F] dark:text-white placeholder:text-[#92664A] dark:placeholder-white/50 transition-all outline-none uppercase tracking-tight"
          />
        </div>
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative">
            <button
              onClick={() => setIsDownloadFormatOpen(!isDownloadFormatOpen)}
              className="h-14 px-8 bg-[#EFEDED] dark:bg-white/5 text-[#5A270F] dark:text-[#EEB38C] text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-[#5A270F] hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center gap-3 border border-[#BCAF9C] dark:border-white/10"
            >
              <Download className="h-4 w-4" />
              Download Registry
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${isDownloadFormatOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isDownloadFormatOpen && (
              <div className="absolute top-16 right-0 w-48 bg-white dark:bg-[#1A0B04] border border-[#BCAF9C] dark:border-[#DF8142]/20 rounded-2xl shadow-2xl overflow-hidden z-20 p-1">
                <button
                  onClick={() => handleDownload("csv")}
                  className="w-full px-5 py-3.5 text-left text-[9px] font-black uppercase tracking-widest text-[#5A270F] dark:text-[#EEB38C] hover:bg-[#EFEDED] dark:hover:bg-[#DF8142] dark:hover:text-white rounded-xl transition-all"
                >
                  Export CSV Node
                </button>
                <button
                  onClick={() => handleDownload("excel")}
                  className="w-full px-5 py-3.5 text-left text-[9px] font-black uppercase tracking-widest text-[#5A270F] dark:text-[#EEB38C] hover:bg-[#EFEDED] dark:hover:bg-[#DF8142] dark:hover:text-white rounded-xl transition-all"
                >
                  Export Excel Grid
                </button>
                <button
                  onClick={() => handleDownload("pdf")}
                  className="w-full px-5 py-3.5 text-left text-[9px] font-black uppercase tracking-widest text-[#5A270F] dark:text-[#EEB38C] hover:bg-[#EFEDED] dark:hover:bg-[#DF8142] dark:hover:text-white rounded-xl transition-all"
                >
                  Export PDF Document
                </button>
              </div>
            )}
          </div>
          {(currentRoleName === "DepartmentHead" ||
            currentRoleName === "SuperAdmin") && (
            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="h-14 px-8 bg-gradient-to-r from-[#DF8142] to-[#EEB38C] text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-[#DF8142]/20 active:scale-95 flex items-center justify-center gap-3"
            >
              <Zap className="h-4 w-4" />
              Broadcaster
            </button>
          )}
          <button
            onClick={handleOpenCreate}
            className="h-14 px-10 bg-[#5A270F] text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-[#1A0B04] hover:scale-[1.02] transition-all shadow-2xl shadow-[#5A270F]/30 active:scale-95 flex items-center justify-center gap-3"
          >
            <UserPlus className="h-4 w-4" />
            Initialize Node
          </button>
        </div>
      </div>

      {/* User Registry Table */}
      <div className="bg-white dark:bg-[#1A0B04] rounded-[3.5rem] border border-[#D9D9C2] dark:border-[#DF8142]/20 shadow-2xl shadow-[#5A270F]/5 overflow-hidden transition-all duration-700">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#5A270F]">
                <th className="px-10 py-7 text-left text-[10px] font-black text-[#EEB38C] uppercase tracking-[0.4em]">
                  User Specimen
                </th>
                <th className="px-8 py-7 text-left text-[10px] font-black text-white/70 uppercase tracking-[0.4em]">
                  Identity ID
                </th>
                <th className="px-8 py-7 text-left text-[10px] font-black text-white/70 uppercase tracking-[0.4em]">
                  Role Cluster
                </th>
                <th className="px-8 py-7 text-left text-[10px] font-black text-white/70 uppercase tracking-[0.4em]">
                  Status
                </th>
                <th className="px-10 py-7 text-right text-[10px] font-black text-white/70 uppercase tracking-[0.4em]">
                  Operations
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {filteredUsers.map((user) => {
                const roleName =
                  typeof user.role === "string"
                    ? user.role
                    : user.role?.name || "N/A";
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-[#EFEDED] dark:hover:bg-white/5 transition-all duration-300 group"
                  >
                    <td className="px-10 py-8 whitespace-nowrap">
                      <div className="flex items-center gap-6">
                        <div className="h-14 w-14 bg-gradient-to-br from-[#5A270F] to-[#6C3B1C] rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          {(user.firstName || user.first_name)?.[0]}
                        </div>
                        <div>
                          <div className="text-[15px] font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tight mb-1">
                            {user.firstName || user.first_name}{" "}
                            {user.lastName || user.last_name}
                          </div>
                          <div className="text-[10px] text-[#92664A] dark:text-white/70 font-black uppercase tracking-widest leading-none mb-1.5">
                            {user.email}
                          </div>
                          <div className="text-[9px] text-[#DF8142] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                             <span className="h-1 w-1 rounded-full bg-[#DF8142]" /> {user.department || "Architecture"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className="text-xs font-mono font-black text-gray-700 dark:text-white/80 uppercase tracking-widest bg-[#EFEDED] dark:bg-white/5 px-3 py-1 rounded-lg border border-[#D9D9C2] dark:border-white/10">
                        {user.university_id ||
                          (user as { universityId?: string }).universityId ||
                          "EXT-NODE"}
                      </span>
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap">
                      <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] bg-[#5A270F] dark:bg-[#EEB38C] text-white dark:text-[#5A270F] shadow-lg shadow-[#5A270F]/10">
                        <Shield className="h-3 w-3" />
                        {roleName}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${
                            user.status === "active"
                              ? "bg-[#5A270F] animate-pulse"
                              : user.status === "pending_approval"
                                ? "bg-[#DF8142] animate-bounce"
                                : "bg-red-700"
                          }`}
                        />
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${
                            user.status === "active"
                              ? "text-[#5A270F] dark:text-white/90"
                              : user.status === "pending_approval"
                                ? "text-[#DF8142] dark:text-[#EEB38C]"
                                : "text-rose-600 dark:text-rose-500"
                          }`}
                        >
                          {user.status === "active"
                            ? "Active"
                            : user.status === "pending_approval"
                              ? "Pending Approval"
                              : "Suspended"}
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
                          className="p-3 text-[#92664A] dark:text-[#EEB38C]/40 hover:text-[#DF8142] hover:bg-[#DF8142]/10 rounded-xl transition-all"
                          title="Direct Transmission"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>

                        {user.status === "pending_approval" &&
                          currentRoleName === "DepartmentHead" && (
                            <button
                              onClick={() => handleApprove(user.id)}
                              className="p-3 text-[#DF8142] hover:text-[#2A1205] hover:bg-[#5A270F]/5 rounded-xl transition-all"
                              title="Authorize Node"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}

                        {!(
                          roleName === "SuperAdmin" &&
                          currentRoleName !== "SuperAdmin" &&
                          currentRoleName !== "DepartmentHead"
                        ) &&
                          currentRoleName !== "Admin" && (
                            <>
                              <button
                                onClick={() => handleOpenEdit(user)}
                                className="p-3 text-[#92664A] dark:text-[#EEB38C]/40 hover:text-[#DF8142] hover:bg-[#DF8142]/10 rounded-xl transition-all"
                                title="Configure"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>

                              {!(
                                roleName === "DepartmentHead" &&
                                currentRoleName === "Admin"
                              ) && (
                                <button
                                  onClick={() => handleDelete(user.id)}
                                  className="p-3 text-[#92664A] dark:text-[#EEB38C]/40 hover:text-rose-600 hover:bg-red-50 rounded-xl transition-all"
                                  title="Terminate"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </>
                          )}
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
              <h3 className="text-xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tight">
                No Specimen Detected
              </h3>
              <p className="text-xs text-[#92664A] dark:text-[#EEB38C]/40 font-medium mt-2">
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
            className="absolute inset-0 bg-[#2A1205]/40 backdrop-blur-xl animate-in fade-in duration-500"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-card rounded-[2rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-white dark:border-white/10 overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="bg-[#5A270F] px-8 py-7 relative overflow-hidden group/modal">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#DF8142]/20 blur-[80px] group-hover/modal:bg-[#DF8142]/30 transition-all duration-700" />
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#EEB38C] mb-2 opacity-60">
                    Authority Directive
                  </p>
                  <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none italic">
                    {modalMode === "create" ? (
                      <>Init <span className="not-italic text-[#EEB38C]">Node</span></>
                    ) : (
                      <>Configure <span className="not-italic text-[#EEB38C]">Specimen</span></>
                    )}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  title="Close Modal"
                  className="p-3 bg-white/10 hover:bg-[#DF8142] rounded-2xl text-white transition-all shadow-xl active:scale-90"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#92664A] dark:text-white/70 uppercase tracking-widest ml-1">
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      id="firstName"
                      name="firstName"
                      title="First Name"
                      value={formData.firstName}
                      onChange={(e) => {
                        handleInputChange(e);
                        if (errors.firstName)
                          setErrors((prev) => ({ ...prev, firstName: "" }));
                      }}
                      className={`w-full bg-[#EFEDED] dark:bg-white/5 border rounded-xl px-4 py-2.5 text-xs font-bold text-[#5A270F] dark:text-white focus:border-[#DF8142] transition-all outline-none ${errors.firstName ? "border-[#DF8142] ring-1 ring-[#DF8142]/20" : "border-[#D9D9C2] dark:border-white/10"}`}
                      placeholder="e.g. John"
                    />
                    {errors.firstName && (
                      <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#DF8142]" />
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-[#92664A] dark:text-white/70 uppercase tracking-widest ml-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      id="lastName"
                      name="lastName"
                      title="Last Name"
                      value={formData.lastName}
                      onChange={(e) => {
                        handleInputChange(e);
                        if (errors.lastName)
                          setErrors((prev) => ({ ...prev, lastName: "" }));
                      }}
                      className={`w-full bg-[#EFEDED] dark:bg-white/5 border rounded-xl px-4 py-2.5 text-xs font-bold text-[#5A270F] dark:text-white focus:border-[#DF8142] transition-all outline-none ${errors.lastName ? "border-[#DF8142] ring-1 ring-[#DF8142]/20" : "border-[#D9D9C2] dark:border-white/10"}`}
                      placeholder="e.g. Doe"
                    />
                    {errors.lastName && (
                      <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#DF8142]" />
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#92664A] dark:text-white/70 uppercase tracking-widest ml-1">
                    University ID
                  </label>
                  <input
                    id="universityId"
                    name="universityId"
                    title="University Identifier"
                    value={formData.universityId}
                    onChange={handleInputChange}
                    placeholder="U-ARCH-XXXX"
                    className="w-full bg-[#EFEDED] dark:bg-background border border-[#D9D9C2] dark:border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-[#5A270F] dark:text-[#EEB38C] focus:border-[#DF8142] transition-all outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#92664A] dark:text-white/70 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      title="Email Communications"
                      value={formData.email}
                      onChange={(e) => {
                        handleInputChange(e);
                        if (errors.email)
                          setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      className={`w-full bg-[#EFEDED] dark:bg-background border rounded-xl px-4 py-2.5 text-xs font-bold text-[#5A270F] dark:text-[#EEB38C] focus:border-[#DF8142] transition-all outline-none ${errors.email ? "border-[#DF8142] ring-1 ring-[#DF8142]/20" : "border-[#D9D9C2] dark:border-white/10"}`}
                      placeholder="node@nexus.edu"
                    />
                    {errors.email && (
                      <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#DF8142]" />
                    )}
                  </div>
                </div>
              </div>

              {modalMode === "create" && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#92664A] dark:text-white/70 uppercase tracking-widest ml-1">
                    Initial Authorization Key
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="password"
                      type="text"
                      name="password"
                      title="Initial Authorization Key"
                      placeholder="Enter security key"
                      value={formData.password}
                      onChange={(e) => {
                        handleInputChange(e);
                        if (errors.password)
                          setErrors((prev) => ({ ...prev, password: "" }));
                      }}
                      className={`w-full bg-[#EFEDED] dark:bg-background border rounded-xl pl-4 pr-12 py-2.5 text-xs font-bold text-[#5A270F] dark:text-[#EEB38C] focus:border-[#DF8142] transition-all outline-none ${errors.password ? "border-[#DF8142] ring-1 ring-[#DF8142]/20" : "border-[#D9D9C2] dark:border-white/10"}`}
                    />
                    <button
                      type="button"
                      title="Auto-Generate Secret Key"
                      onClick={generatePassword}
                      className="absolute right-2 p-1.5 hover:bg-[#DF8142]/10 rounded-lg text-[#92664A] dark:text-[#EEB38C]/40 hover:text-[#DF8142] transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    {errors.password && (
                      <AlertCircle className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 text-[#DF8142]" />
                    )}
                  </div>
                  {errors.password && (
                    <p className="text-[8px] text-[#DF8142] font-black uppercase ml-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#92664A] dark:text-white/70 uppercase tracking-widest ml-1">
                  Role Authorization
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["Student", "Faculty", "Admin", "DepartmentHead"]
                    .filter(
                      (role) =>
                        role !== "DepartmentHead" ||
                        currentRoleName === "SuperAdmin",
                    )
                    .map((role) => {
                      const isSelected = formData.roleNames.includes(role);
                      return (
                        <button
                          key={role}
                          type="button"
                          title={`Assign ${role} Role`}
                          onClick={() => {
                            const newRoles = isSelected
                              ? formData.roleNames.filter((r) => r !== role)
                              : [...formData.roleNames, role];
                            setFormData({ ...formData, roleNames: newRoles });
                            if (errors.roles)
                              setErrors((prev) => ({ ...prev, roles: "" }));
                          }}
                          className={`flex-1 px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                            isSelected
                              ? "bg-[#5A270F] border-[#5A270F] text-white shadow-lg scale-105"
                              : "bg-white dark:bg-card border-[#D9D9C2] dark:border-white/10 text-[#92664A] dark:text-[#EEB38C]/40 hover:border-[#DF8142]"
                          }`}
                        >
                          {role}
                        </button>
                      );
                    })}
                </div>
                {errors.roles && (
                  <p className="text-[8px] text-[#DF8142] font-black uppercase ml-1">
                    {errors.roles}
                  </p>
                )}
                {modalMode === "create" && currentRoleName === "Admin" && (
                  <p className="text-[8px] text-[#DF8142] font-black uppercase ml-1 italic opacity-80">
                    * Admin initialization requires Department Head approval.
                  </p>
                )}
              </div>

              {/* Advanced Signal Matrix (Dynamic Fields) */}
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#92664A] dark:text-white/70 uppercase tracking-widest ml-1">
                      Department
                    </label>
                    <div className="relative">
                      <input
                        id="department"
                        name="department"
                        title="Department/Sector"
                        value={formData.department}
                        onChange={handleInputChange}
                        placeholder="e.g. Design Studio"
                        className={`w-full bg-[#EFEDED] dark:bg-background border rounded-xl px-4 py-2.5 text-xs font-bold text-[#5A270F] dark:text-[#EEB38C] focus:border-[#DF8142] transition-all outline-none ${errors.department ? "border-[#DF8142] ring-1 ring-[#DF8142]/20" : "border-[#D9D9C2] dark:border-white/10"}`}
                      />
                      {errors.department && (
                        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#DF8142]" />
                      )}
                    </div>
                  </div>
                  {formData.roleNames.some((r) =>
                    ["Faculty", "Admin", "DepartmentHead"].includes(r),
                  ) && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[#92664A] dark:text-white/70 uppercase tracking-widest ml-1">
                        Worker ID
                      </label>
                      <div className="relative">
                        <input
                          id="workerId"
                          name="workerId"
                          title="Institutional Personnel ID"
                          value={formData.workerId}
                          onChange={handleInputChange}
                          placeholder="e.g. F-001X"
                          className={`w-full bg-[#EFEDED] dark:bg-background border rounded-xl px-4 py-2.5 text-xs font-bold text-[#5A270F] dark:text-[#EEB38C] focus:border-[#DF8142] transition-all outline-none ${errors.workerId ? "border-[#DF8142] ring-1 ring-[#DF8142]/20" : "border-[#D9D9C2] dark:border-white/10"}`}
                        />
                        {errors.workerId && (
                          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#DF8142]" />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {formData.roleNames.includes("Faculty") && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#92664A] dark:text-white/70 uppercase tracking-widest ml-1">
                      Academic Specialization
                    </label>
                    <div className="relative">
                      <input
                        id="specialization"
                        name="specialization"
                        title="Faculty Specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        placeholder="e.g. Parametric Architecture"
                        className={`w-full bg-[#EFEDED] dark:bg-background border rounded-xl px-4 py-2.5 text-xs font-bold text-[#5A270F] dark:text-[#EEB38C] focus:border-[#DF8142] transition-all outline-none ${errors.specialization ? "border-[#DF8142] ring-1 ring-[#DF8142]/20" : "border-[#D9D9C2] dark:border-white/10"}`}
                      />
                      {errors.specialization && (
                        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#DF8142]" />
                      )}
                    </div>
                  </div>
                )}

                {formData.roleNames.includes("Student") && (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[#92664A] dark:text-white/70 uppercase tracking-widest ml-1">
                        Batch
                      </label>
                      <div className="relative">
                        <input
                          id="batch"
                          name="batch"
                          type="number"
                          title="Admission Batch"
                          value={formData.batch}
                          onChange={handleInputChange}
                          placeholder="2024"
                          className={`w-full bg-[#EFEDED] dark:bg-background border rounded-xl px-4 py-2.5 text-xs font-bold text-[#5A270F] dark:text-[#EEB38C] focus:border-[#DF8142] transition-all outline-none ${errors.batch ? "border-[#DF8142] ring-1 ring-[#DF8142]/20" : "border-[#D9D9C2] dark:border-white/10"}`}
                        />
                        {errors.batch && (
                          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#DF8142]" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[#92664A] dark:text-white/70 uppercase tracking-widest ml-1">
                        Year
                      </label>
                      <div className="relative">
                        <input
                          id="year"
                          name="year"
                          type="number"
                          title="Academic Year"
                          value={formData.year}
                          onChange={handleInputChange}
                          placeholder="1"
                          className={`w-full bg-[#EFEDED] dark:bg-background border rounded-xl px-4 py-2.5 text-xs font-bold text-[#5A270F] dark:text-[#EEB38C] focus:border-[#DF8142] transition-all outline-none ${errors.year ? "border-[#DF8142] ring-1 ring-[#DF8142]/20" : "border-[#D9D9C2] dark:border-white/10"}`}
                        />
                        {errors.year && (
                          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#DF8142]" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[#92664A] dark:text-white/70 uppercase tracking-widest ml-1">
                        Semester
                      </label>
                      <div className="relative">
                        <input
                          id="semester"
                          name="semester"
                          type="number"
                          title="Current Semester"
                          value={formData.semester}
                          onChange={handleInputChange}
                          placeholder="1"
                          className={`w-full bg-[#EFEDED] dark:bg-background border rounded-xl px-4 py-2.5 text-xs font-bold text-[#5A270F] dark:text-[#EEB38C] focus:border-[#DF8142] transition-all outline-none ${errors.semester ? "border-[#DF8142] ring-1 ring-[#DF8142]/20" : "border-[#D9D9C2] dark:border-white/10"}`}
                        />
                        {errors.semester && (
                          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#DF8142]" />
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Status and Suspension Controls */}
                {(currentRoleName === "DepartmentHead" || currentRoleName === "SuperAdmin") && modalMode === "edit" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[#92664A] dark:text-white/70 uppercase tracking-widest ml-1">
                        Node Status
                      </label>
                      <select
                        name="status"
                        title="Node Status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full bg-[#EFEDED] dark:bg-background border border-[#D9D9C2] dark:border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-[#5A270F] dark:text-[#EEB38C] focus:border-[#DF8142] transition-all outline-none"
                      >
                        <option value="active">Active (Authorized)</option>
                        <option value="pending_approval">Pending Approval</option>
                        <option value="suspended">Suspended (Terminated)</option>
                      </select>
                    </div>

                    {formData.status === "suspended" && (
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-black text-[#92664A] dark:text-white/70 uppercase tracking-widest ml-1">
                          Suspension Directive Reason *
                        </label>
                        <div className="relative">
                          <textarea
                            name="suspendReason"
                            value={formData.suspendReason}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                               handleInputChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
                               if (errors.suspendReason) setErrors(prev => ({ ...prev, suspendReason: "" }));
                            }}
                            rows={2}
                            placeholder="Enter the reason for account suspension. This will be transmitted to the user."
                            className={`w-full bg-[#EFEDED] dark:bg-background border rounded-xl px-4 py-2.5 text-xs font-bold text-[#5A270F] dark:text-[#EEB38C] focus:border-[#DF8142] transition-all outline-none resize-none ${errors.suspendReason ? "border-[#DF8142] ring-1 ring-[#DF8142]/20" : "border-[#D9D9C2] dark:border-white/10"}`}
                          />
                          {errors.suspendReason && (
                            <AlertCircle className="absolute right-3 top-4 h-4 w-4 text-[#DF8142]" />
                          )}
                        </div>
                        {errors.suspendReason && (
                          <p className="text-[8px] text-[#DF8142] font-black uppercase ml-1">
                            {errors.suspendReason}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-[#EFEDED] dark:bg-background text-[#92664A] dark:text-[#EEB38C]/40 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#D9D9C2] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  title={
                    modalMode === "create"
                      ? "Finalize Node Initialization"
                      : "Deploy Registry Updates"
                  }
                  className="flex-1 px-4 py-2 bg-[#5A270F] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#6C3B1C] transition-all shadow-xl shadow-[#5A270F]/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {modalMode === "create"
                    ? "Initialize Node"
                    : "Confirm Update"}
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
            className="absolute inset-0 bg-[#2A1205]/40 backdrop-blur-xl animate-in fade-in duration-500"
            onClick={() => setIsNotifyModalOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white dark:bg-card rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-white overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="bg-[#5A270F] px-10 py-8 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#EEB38C] mb-2">
                  Communication Protocol
                </p>
                <h3 className="text-2xl font-black text-white leading-tight">
                  Direct Briefing: {selectedUser?.firstName}
                </h3>
              </div>
            </div>

            <form onSubmit={handleNotifySubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 dark:text-white/40 uppercase tracking-widest ml-1">
                  Briefing Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="Intel objective..."
                  className="w-full bg-[#EFEDED] dark:bg-background border border-[#D9D9C2] dark:border-white/10 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                  value={notifyData.title}
                  onChange={(e) =>
                    setNotifyData({ ...notifyData, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 dark:text-white/40 uppercase tracking-widest ml-1">
                  Narrative Payload
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Critical intelligence summary..."
                  className="w-full bg-[#EFEDED] dark:bg-background border border-[#D9D9C2] dark:border-white/10 rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
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
                  className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#92664A] dark:text-[#EEB38C]/40 hover:text-[#5A270F] dark:text-[#EEB38C]"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-8 py-2.5 bg-[#DF8142] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#DF8142]/90 transition-all shadow-lg shadow-[#DF8142]/20 flex items-center gap-2"
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
            className="absolute inset-0 bg-[#2A1205]/40 backdrop-blur-xl animate-in fade-in duration-500"
            onClick={() => setIsBroadcastModalOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white dark:bg-card rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-white overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="bg-[#5A270F] px-10 py-8 relative overflow-hidden group/broadcast">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#DF8142]/20 blur-[50px] transition-all group-hover/broadcast:bg-[#DF8142]/30" />
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#EEB38C] mb-2">
                    Emergency Broadcast
                  </p>
                  <h3 className="text-2xl font-black text-white leading-tight">
                    Global Intelligence Relay
                  </h3>
                </div>
                <button
                  type="button"
                  title="Abort Broadcast"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="p-2 hover:bg-white/10 dark:bg-card/10 rounded-xl text-[#EEB38C] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-widest ml-1">
                  Relay Headline
                </label>
                <div className="relative">
                  <input
                    type="text"
                    title="Broadcast Headline"
                    placeholder="Enter universal objective..."
                    className={`w-full bg-[#EFEDED] dark:bg-background border rounded-2xl px-5 py-3 text-sm font-bold text-[#5A270F] dark:text-[#EEB38C] outline-none focus:border-[#DF8142] transition-all ${errors.broadcastTitle ? "border-[#DF8142] ring-1 ring-[#DF8142]/20" : "border-[#D9D9C2] dark:border-white/10"}`}
                    value={notifyData.title}
                    onChange={(e) => {
                      setNotifyData({ ...notifyData, title: e.target.value });
                      if (errors.broadcastTitle)
                        setErrors((prev) => ({ ...prev, broadcastTitle: "" }));
                    }}
                  />
                  {errors.broadcastTitle && (
                    <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#DF8142]" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-widest ml-1">
                  Broadcast Payload
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    title="Broadcast Content"
                    placeholder="Distribute intelligence to all active nodes..."
                    className={`w-full bg-[#EFEDED] dark:bg-background border rounded-2xl px-5 py-3 text-sm text-[#5A270F] dark:text-[#EEB38C] outline-none focus:border-[#DF8142] transition-all resize-none ${errors.broadcastMessage ? "border-[#DF8142] ring-1 ring-[#DF8142]/20" : "border-[#D9D9C2] dark:border-white/10"}`}
                    value={notifyData.message}
                    onChange={(e) => {
                      setNotifyData({ ...notifyData, message: e.target.value });
                      if (errors.broadcastMessage)
                        setErrors((prev) => ({
                          ...prev,
                          broadcastMessage: "",
                        }));
                    }}
                  />
                  {errors.broadcastMessage && (
                    <AlertCircle className="absolute right-4 top-3 h-4 w-4 text-[#DF8142]" />
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-[#92664A] dark:text-[#EEB38C]/40 hover:text-[#5A270F] dark:text-[#EEB38C] transition-colors"
                >
                  Abort Relay
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  title="Initiate Global Transmission"
                  className="px-8 py-3 bg-[#5A270F] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#6C3B1C] transition-all shadow-xl shadow-[#5A270F]/20 active:scale-95 flex items-center gap-3 disabled:opacity-50"
                >
                  {processing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
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
