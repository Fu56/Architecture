import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import type { User } from "../../models";
import {
  Shield,
  Search,
  Download,
  UserPlus,
  RefreshCw,
  AlertCircle,
  X,
  Zap,
  CheckCircle2,
  Trash2,
  ChevronDown,
  Loader2,
  Edit2,
  User as UserIcon,
  Bell,
  Terminal,
  Mail,
  ArrowUpCircle,
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

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <p className="text-[8px] text-[#DF8142] font-black uppercase ml-1 mt-1 transition-all animate-in fade-in slide-in-from-top-1">
      {message}
    </p>
  );
};

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
    academicStartDate: "",
    academicEndDate: "",
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
      department: currentRoleName === "DepartmentHead" ? "Architecture" : "",
      workerId: "",
      suspendReason: "",
      academicStartDate: "",
      academicEndDate: "",
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
      semester: user.semester?.toString() || "",
      status: user.status,
      specialization: user.specialization || "",
      department: currentRoleName === "DepartmentHead" ? "Architecture" : (user.department || ""),
      workerId: user.workerId || user.worker_id || "",
      suspendReason: "",
      academicStartDate: user.academicStartDateEth || "",
      academicEndDate: user.academicEndDateEth || "",
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

  const handleDelete = (user: User) => {
    toast(`Terminate ${user.firstName || user.first_name}?`, {
      description:
        "This action is irreversible. The user identity and all associated security segments will be purged from the registry.",
      action: {
        label: "Terminate",
        onClick: async () => {
          try {
            await api.delete(`/admin/users/${user.id}`);
            toast.success("User node terminated successfully.");
            setUsers((prev) => prev.filter((u) => u.id !== user.id));
          } catch (err: unknown) {
            console.error("Delete error", err);
            toast.error("Protocol Breach: Failed to terminate user node.");
          }
        },
      },
      cancel: { label: "Abort", onClick: () => {} },
    });
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

  const [isAdvancing, setIsAdvancing] = useState(false);
  const handleAdvanceAcademic = async () => {
    toast(`Initiate Academic Advancement?`, {
      description:
        "This will analyze all student nodes and advance their Year/Semester based on the Ethiopian calendar cycle (5-month semester gap, 1-year annual gap).",
      action: {
        label: "Execute Progression",
        onClick: async () => {
          setIsAdvancing(true);
          try {
            const { data } = await api.post("/admin/users/advance-academic");
            toast.success(`Advancement Complete: ${data.updatedCount} nodes promoted.`);
            fetchUsers();
          } catch (err: unknown) {
            console.error("Advancement error:", err);
            toast.error("Protocol Breach: Failed to synchronize academic advancement.");
          } finally {
            setIsAdvancing(false);
          }
        },
      },
      cancel: { label: "Abort", onClick: () => {} },
    });
  };

  const [isSuspending, setIsSuspending] = useState(false);
  const handleCheckSuspension = async () => {
    toast(`Initiate Automated Suspension?`, {
      description:
        "This will analyze student nodes and suspend those past their final academic deadline (including the 1-month grace period).",
      action: {
        label: "Execute Sequence",
        onClick: async () => {
          setIsSuspending(true);
          try {
            const { data } = await api.post("/admin/users/check-suspension");
            toast.success(`Protocol Executed: ${data.suspendedCount} nodes terminated.`);
            fetchUsers();
          } catch (err: unknown) {
            console.error("Suspension error:", err);
            toast.error("Protocol Breach: Failed to execute automated suspension sequence.");
          } finally {
            setIsSuspending(false);
          }
        },
      },
      cancel: { label: "Abort", onClick: () => {} },
    });
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

    // Comprehensive field presence check
    if (!formData.universityId.trim()) newErrors.universityId = "University identifier required.";
    if (formData.roleNames.includes("Student")) {
      if (!formData.batch) newErrors.batch = "Admission batch required.";
      if (!formData.year) newErrors.year = "Academic year required.";
      if (!formData.semester) newErrors.semester = "Current semester required.";
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
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
    const specialization = (user.specialization || "").toLowerCase();
    const startDate = (user.academicStartDateEth || "").toLowerCase();
    const endDate = (user.academicEndDateEth || "").toLowerCase();

    return (
      fullName.includes(search) ||
      email.includes(search) ||
      universityId.includes(search) ||
      userId.includes(search) ||
      status.includes(search) ||
      role.includes(search) ||
      batch.includes(search) ||
      year.includes(search) ||
      specialization.includes(search) ||
      startDate.includes(search) ||
      endDate.includes(search)
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
    <div className="space-y-6 animate-in fade-in duration-1000">
      <div className="flex items-center gap-2.5 mb-0">
        <div className="h-8 w-8 bg-[#5A270F] rounded-lg flex items-center justify-center text-[#EEB38C] shadow-md">
          <Shield className="h-4 w-4" />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter uppercase italic leading-none">
            Nexus Registry <span className="not-italic text-[#DF8142]">Authority</span>
          </h1>
          <p className="text-[7.5px] font-black text-[#92664A] dark:text-white/60 uppercase tracking-[0.25em] mt-1 leading-none">
            Central Identity Management Matrix
          </p>
        </div>
      </div>
      {/* Top Controller */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-3 bg-white dark:bg-[#1A0B04] p-2.5 rounded-xl border border-[#D9D9C2] dark:border-[#DF8142]/20 shadow-lg shadow-[#5A270F]/5 transition-all duration-700">
        <div className="relative w-full lg:w-64 group">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-[#92664A] dark:text-[#EEB38C]/70 group-focus-within:text-[#DF8142] transition-colors" />
          <input
            type="text"
            placeholder="Search identity node..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 bg-slate-50 dark:bg-white/5 border border-transparent focus:border-[#DF8142] rounded-md text-[8.5px] font-black text-[#5A270F] dark:text-white placeholder:text-[#92664A]/50 transition-all outline-none uppercase tracking-tight"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">
          <div className="relative">
            <button
              onClick={() => setIsDownloadFormatOpen(!isDownloadFormatOpen)}
              className="h-8 px-3 bg-[#EFEDED] dark:bg-white/5 text-[#5A270F] dark:text-[#EEB38C] text-[7.5px] font-black uppercase tracking-[0.1em] rounded-md hover:bg-[#5A270F] hover:text-white transition-all active:scale-95 flex items-center justify-center gap-1.5 border border-[#BCAF9C] dark:border-white/10"
            >
              <Download className="h-2.5 w-2.5" />
              Relay
              <ChevronDown
                className={`h-2 w-2 transition-transform ${isDownloadFormatOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isDownloadFormatOpen && (
              <div className="absolute top-10 right-0 w-40 bg-white dark:bg-[#1A0B04] border border-[#BCAF9C] dark:border-[#DF8142]/20 rounded-xl shadow-xl overflow-hidden z-20 p-1 animate-in slide-in-from-top-2 duration-300">
                <button
                  onClick={() => handleDownload("csv")}
                  className="w-full px-4 py-2.5 text-left text-[8px] font-black uppercase tracking-[0.15em] text-[#5A270F] dark:text-[#EEB38C] hover:bg-[#EFEDED] dark:hover:bg-[#DF8142] dark:hover:text-white rounded-lg transition-all"
                >
                  XLS Node
                </button>
                <button
                  onClick={() => handleDownload("excel")}
                  className="w-full px-4 py-2.5 text-left text-[8px] font-black uppercase tracking-[0.15em] text-[#5A270F] dark:text-[#EEB38C] hover:bg-[#EFEDED] dark:hover:bg-[#DF8142] dark:hover:text-white rounded-lg transition-all"
                >
                  Grid Map
                </button>
                <button
                  onClick={() => handleDownload("pdf")}
                  className="w-full px-4 py-2.5 text-left text-[8px] font-black uppercase tracking-[0.15em] text-[#5A270F] dark:text-[#EEB38C] hover:bg-[#EFEDED] dark:hover:bg-[#DF8142] dark:hover:text-white rounded-lg transition-all"
                >
                  PDF Document
                </button>
              </div>
            )}
          </div>
          {(currentRoleName === "DepartmentHead" ||
            currentRoleName === "SuperAdmin") && (
            <>
              <button
                onClick={handleAdvanceAcademic}
                disabled={isAdvancing}
                className="h-8 px-3 bg-[#EFEDED] dark:bg-white/5 text-[#5A270F] dark:text-[#EEB38C] text-[7.5px] font-black uppercase tracking-[0.1em] rounded-md hover:bg-[#5A270F] hover:text-white transition-all active:scale-95 flex items-center justify-center gap-1.5 border border-[#BCAF9C] dark:border-white/10"
              >
                {isAdvancing ? (
                  <Loader2 className="h-2.5 w-2.5 animate-spin" />
                ) : (
                  <ArrowUpCircle className="h-3 w-3" />
                )}
                Advance
              </button>
              <button
                onClick={handleCheckSuspension}
                disabled={isSuspending}
                className="h-8 px-3 bg-[#EFEDED] dark:bg-white/5 text-[#5A270F] dark:text-[#EEB38C] text-[7.5px] font-black uppercase tracking-[0.1em] rounded-md hover:bg-[#5A270F] hover:text-white transition-all active:scale-95 flex items-center justify-center gap-1.5 border border-[#BCAF9C] dark:border-white/10"
              >
                {isSuspending ? (
                  <Loader2 className="h-2.5 w-2.5 animate-spin text-rose-500" />
                ) : (
                  <Shield className="h-2.5 w-2.5 text-rose-500" />
                )}
                Check
              </button>
              <button
                onClick={() => setIsBroadcastModalOpen(true)}
                className="h-8 px-3 bg-gradient-to-r from-[#DF8142] to-[#EEB38C] text-white text-[7.5px] font-black uppercase tracking-[0.1em] rounded-md hover:scale-[1.02] transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Zap className="h-2.5 w-2.5" />
                Relay
              </button>
            </>
          )}
          <button
            onClick={handleOpenCreate}
            className="h-8 px-3 bg-[#5A270F] text-white text-[7.5px] font-black uppercase tracking-[0.1em] rounded-md hover:bg-[#1A0B04] transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
          >
            <UserPlus className="h-2.5 w-2.5" />
            Initialize
          </button>
        </div>
      </div>

      {/* User Registry Table */}
      <div className="bg-white dark:bg-[#1A0B04] rounded-xl border border-[#D9D9C2] dark:border-[#DF8142]/20 shadow-lg shadow-[#5A270F]/5 overflow-hidden transition-all duration-700">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#5A270F]">
                <th className="px-5 py-3 text-left text-[7.5px] font-black text-[#EEB38C] uppercase tracking-[0.2em]">
                  User Specimen
                </th>
                <th className="px-4 py-3 text-left text-[7.5px] font-black text-white/70 uppercase tracking-[0.2em]">
                  Identity
                </th>
                <th className="px-4 py-3 text-left text-[7.5px] font-black text-white/70 uppercase tracking-[0.2em]">
                  Clearance
                </th>
                <th className="px-4 py-3 text-left text-[7.5px] font-black text-white/70 uppercase tracking-[0.2em]">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-[7.5px] font-black text-white/70 uppercase tracking-[0.2em]">
                  Ops
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
                    <td className="px-5 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 bg-gradient-to-br from-[#5A270F] to-[#6C3B1C] rounded-md flex items-center justify-center text-white text-[10px] font-black shadow-sm group-hover:scale-110 transition-all duration-500">
                          {(user.firstName || user.first_name)?.[0]}
                        </div>
                        <div>
                          <div className="text-[10px] font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tight leading-none mb-1">
                            {user.firstName || user.first_name}{" "}
                            {user.lastName || user.last_name}
                          </div>
                          <div className="text-[7.5px] text-[#92664A] dark:text-white/60 font-black uppercase tracking-wider leading-none mb-1">
                            {user.email}
                          </div>
                          <div className="text-[7px] text-[#DF8142] font-black uppercase tracking-[0.1em] flex items-center gap-1 flex-wrap">
                             <span className="h-0.5 w-0.5 rounded-full bg-[#DF8142]" /> {user.department || "Architecture"}
                             {roleName === "Student" && (
                               <>
                                 <span className="h-0.5 w-0.5 rounded-full bg-[#BCAF9C] mx-0.5" />
                                 <span className="text-[#92664A]/70 dark:text-[#EEB38C]/30">{user.batch}</span>
                                 <span className="h-0.5 w-0.5 rounded-full bg-[#BCAF9C] mx-0.5" />
                                 <span className="text-[#5A270F] dark:text-[#EEB38C]">Y{user.year} S{user.semester}</span>
                               </>
                             )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="text-[8px] font-mono font-black text-gray-700 dark:text-white/80 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded border border-[#D9D9C2] dark:border-white/10">
                        {user.university_id ||
                          (user as { universityId?: string }).universityId ||
                          "NODE"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-wider bg-[#5A270F] dark:bg-[#EEB38C] text-white dark:text-[#5A270F]">
                        {roleName}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`h-1 w-1 rounded-full ${
                            user.status === "active"
                              ? "bg-[#5A270F]"
                              : (user.status === "pending_approval" || user.status === "admin_approved_node")
                                ? "bg-[#DF8142] animate-pulse"
                                : "bg-red-700"
                          }`}
                        />
                        <span
                          className={`text-[7.5px] font-black uppercase tracking-widest ${
                            user.status === "active"
                              ? "text-[#5A270F] dark:text-white/70"
                              : (user.status === "pending_approval" || user.status === "admin_approved_node")
                                ? "text-[#DF8142] dark:text-[#EEB38C]"
                                : "text-rose-600"
                          }`}
                        >
                          {user.status === "active"
                            ? "Live"
                            : user.status === "admin_approved_node"
                              ? "Verified"
                              : user.status === "pending_approval"
                                ? "Wait"
                                : "Void"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsNotifyModalOpen(true);
                          }}
                          className="p-2 text-[#92664A] dark:text-[#EEB38C]/40 hover:text-[#DF8142] hover:bg-[#DF8142]/10 rounded-lg transition-all"
                          title="Direct Transmission"
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </button>

                        {((user.status === "pending_approval" && (currentRoleName === "Admin" || currentRoleName === "DepartmentHead" || currentRoleName === "SuperAdmin")) || 
                          (user.status === "admin_approved_node" && (currentRoleName === "DepartmentHead" || currentRoleName === "SuperAdmin"))) && (
                             <button
                               onClick={() => handleApprove(user.id)}
                               className="p-2 text-[#DF8142] hover:text-[#2A1205] hover:bg-[#5A270F]/5 rounded-lg transition-all"
                               title={currentRoleName === "Admin" ? "Pre-Verify Node" : "Final Authorize"}
                             >
                               <CheckCircle2 className="h-3.5 w-3.5" />
                             </button>
                           )}

                        {!(
                          roleName === "SuperAdmin" || 
                          (roleName === "DepartmentHead" && currentRoleName === "Admin")
                        ) && (
                            <>
                              <button
                                onClick={() => handleOpenEdit(user)}
                                className="p-2 text-[#92664A] dark:text-[#EEB38C]/40 hover:text-[#DF8142] hover:bg-[#DF8142]/10 rounded-lg transition-all"
                                title="Configure"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>

                              {!(
                                roleName === "DepartmentHead" &&
                                currentRoleName === "Admin"
                              ) && (
                                <button
                                  onClick={() => handleDelete(user)}
                                  className="p-2 text-[#92664A] dark:text-[#EEB38C]/40 hover:text-rose-600 hover:bg-red-50 rounded-lg transition-all"
                                  title="Terminate"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
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
            className="absolute inset-0 bg-[#1A0B04]/60 backdrop-blur-2xl animate-in fade-in duration-700"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-4xl bg-[#FAF8F4] dark:bg-[#1A0B04] rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(26,11,4,0.5)] border border-[#D9D9C2]/20 dark:border-white/5 overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col max-h-[95vh]">
            {/* Modal Header */}
            <div className="bg-[#5A270F] px-12 py-10 relative overflow-hidden group/modal border-b border-[#DF8142]/30 flex-shrink-0">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#DF8142]/20 blur-[120px] rounded-full group-hover/modal:bg-[#DF8142]/30 transition-all duration-1000" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
              <div className="relative z-10 flex justify-between items-end">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="h-[2px] w-10 bg-gradient-to-r from-[#DF8142] to-transparent" />
                    <p className="text-[11px] font-black uppercase tracking-[0.8em] text-[#EEB38C] drop-shadow-sm">
                      Registry Management
                    </p>
                  </div>
                  <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none font-space-grotesk">
                    {modalMode === "create" ? (
                      <>NODE <span className="text-[#DF8142] italic">INITIALIZATION</span></>
                    ) : (
                      <>SPECIMEN <span className="text-[#DF8142] italic">RECONFIGURATION</span></>
                    )}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  title="Close Modal"
                  className="p-4 bg-white/5 hover:bg-[#DF8142] hover:rotate-90 rounded-[1.25rem] text-white transition-all duration-500 shadow-2xl active:scale-90 group border border-white/10"
                >
                  <X className="h-6 w-6 group-hover:scale-110" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-12 space-y-12 bg-transparent">
              {/* Section 01: Identity Core */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#5A270F] to-[#6C3B1C] text-[#EEB38C] text-xs font-black shadow-lg shadow-[#5A270F]/20">01</div>
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C] font-space-grotesk">Identity Core Protocol</h4>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-[#D9D9C2] to-transparent dark:from-white/10" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  <div className="space-y-3 group">
                    <label htmlFor="firstName" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1 group-focus-within:text-[#DF8142] transition-colors">Forename Signature</label>
                    <div className="relative">
                      <input
                        id="firstName"
                        name="firstName"
                        title="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full bg-white dark:bg-white/5 border-2 rounded-[1.25rem] px-6 py-5 text-sm font-bold text-[#5A270F] dark:text-white focus:border-[#DF8142] transition-all outline-none shadow-[0_4px_12px_-4px_rgba(26,11,4,0.08)] group-hover:shadow-[0_8px_20px_-6px_rgba(26,11,4,0.12)] ${errors.firstName ? 'border-[#DF8142] ring-4 ring-[#DF8142]/10' : 'border-[#D9D9C2]/60 dark:border-white/10 font-inter'}`}
                        placeholder="e.g. John"
                      />
                      {errors.firstName && <AlertCircle className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#DF8142] animate-bounce" />}
                    </div>
                    <FieldError message={errors.firstName} />
                  </div>

                  <div className="space-y-3 group">
                    <label htmlFor="lastName" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1 group-focus-within:text-[#DF8142] transition-colors">Surname Signature</label>
                    <div className="relative">
                      <input
                        id="lastName"
                        name="lastName"
                        title="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full bg-white dark:bg-white/5 border-2 rounded-[1.25rem] px-6 py-5 text-sm font-bold text-[#5A270F] dark:text-white focus:border-[#DF8142] transition-all outline-none shadow-[0_4px_12px_-4px_rgba(26,11,4,0.08)] group-hover:shadow-[0_8px_20px_-6px_rgba(26,11,4,0.12)] ${errors.lastName ? 'border-[#DF8142] ring-4 ring-[#DF8142]/10' : 'border-[#D9D9C2]/60 dark:border-white/10 font-inter'}`}
                        placeholder="e.g. Doe"
                      />
                      {errors.lastName && <AlertCircle className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#DF8142] animate-bounce" />}
                    </div>
                    <FieldError message={errors.lastName} />
                  </div>

                  <div className="space-y-3 group">
                    <label htmlFor="universityId" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1 group-focus-within:text-[#DF8142] transition-colors">Institutional UID</label>
                    <div className="relative">
                      <input
                        id="universityId"
                        name="universityId"
                        title="University Identifier"
                        value={formData.universityId}
                        onChange={handleInputChange}
                        className={`w-full bg-white dark:bg-white/5 border-2 rounded-[1.25rem] px-6 py-5 text-sm font-bold text-[#5A270F] dark:text-white focus:border-[#DF8142] transition-all outline-none shadow-[0_4px_12px_-4px_rgba(26,11,4,0.08)] group-hover:shadow-[0_8px_20px_-6px_rgba(26,11,4,0.12)] ${errors.universityId ? 'border-[#DF8142] ring-4 ring-[#DF8142]/10' : 'border-[#D9D9C2]/60 dark:border-white/10 font-mono'}`}
                        placeholder="U-ARCH-XXXX"
                      />
                    </div>
                    <FieldError message={errors.universityId} />
                  </div>

                  <div className="space-y-3 group">
                    <label htmlFor="email" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1 group-focus-within:text-[#DF8142] transition-colors">Network Communications</label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        title="Email Communications"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full bg-white dark:bg-white/5 border-2 rounded-[1.25rem] px-6 py-5 text-sm font-bold text-[#5A270F] dark:text-white focus:border-[#DF8142] transition-all outline-none shadow-[0_4px_12px_-4px_rgba(26,11,4,0.08)] group-hover:shadow-[0_8px_20px_-6px_rgba(26,11,4,0.12)] ${errors.email ? 'border-[#DF8142] ring-4 ring-[#DF8142]/10' : 'border-[#D9D9C2]/60 dark:border-white/10 font-inter'}`}
                        placeholder="node@nexus.edu"
                      />
                    </div>
                    <FieldError message={errors.email} />
                  </div>
                </div>

                {modalMode === "create" && (
                  <div className="space-y-3 group">
                    <label htmlFor="password" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1 group-focus-within:text-[#DF8142] transition-colors">Primary Access Directive</label>
                    <div className="relative flex items-center">
                      <input
                        id="password"
                        type="text"
                        name="password"
                        title="Initial Authorization Key"
                        placeholder="Generate secure cipher..."
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full bg-white dark:bg-white/5 border-2 rounded-[1.25rem] pl-6 pr-16 py-5 text-sm font-bold text-[#5A270F] dark:text-white focus:border-[#DF8142] transition-all outline-none shadow-[0_4px_12px_-4px_rgba(26,11,4,0.08)] group-hover:shadow-[0_8px_20px_-6px_rgba(26,11,4,0.12)] ${errors.password ? 'border-[#DF8142] ring-4 ring-[#DF8142]/10' : 'border-[#D9D9C2]/60 dark:border-white/10 font-mono'}`}
                      />
                      <button
                        type="button"
                        title="Auto-Generate Secret Key"
                        onClick={generatePassword}
                        className="absolute right-4 p-2.5 bg-[#5A270F] text-white rounded-[0.75rem] hover:bg-[#1A0B04] transition-all shadow-xl active:scale-90 border border-white/5"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                    <FieldError message={errors.password} />
                  </div>
                )}
              </div>

              {/* Section 02: Clearance Level Protocols */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#5A270F] to-[#6C3B1C] text-[#EEB38C] text-xs font-black shadow-lg shadow-[#5A270F]/20">02</div>
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C] font-space-grotesk">Authorization Clearance Matrix</h4>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-[#D9D9C2] to-transparent dark:from-white/10" />
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {["Student", "Faculty", "Admin", "DepartmentHead"]
                    .filter((role) => role !== "DepartmentHead" || currentRoleName === "SuperAdmin")
                    .map((role) => {
                      const isSelected = formData.roleNames.includes(role);
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => {
                            const newRoles = isSelected
                              ? formData.roleNames.filter((r) => r !== role)
                              : [...formData.roleNames, role];
                            setFormData({ ...formData, roleNames: newRoles });
                          }}
                          className={`group relative overflow-hidden px-5 py-6 rounded-[1.25rem] border-2 transition-all duration-500 active:scale-95 ${
                            isSelected
                              ? "bg-[#5A270F] border-[#5A270F] text-white shadow-[0_20px_40px_-10px_rgba(90,39,15,0.4)]"
                              : "bg-white dark:bg-white/5 border-[#D9D9C2]/60 dark:border-white/10 text-[#92664A] dark:text-[#EEB38C]/40 hover:border-[#DF8142] hover:bg-[#DF8142]/5"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 blur-xl rounded-full translate-x-1/2 -translate-y-1/2" />
                          )}
                          <div className={`text-[10px] font-black uppercase tracking-[0.2em] relative z-10 transition-colors duration-500 ${isSelected ? "text-[#EEB38C]" : "group-hover:text-[#DF8142]"}`}>
                            {role}
                          </div>
                          <div className={`mt-1.5 h-1 w-6 rounded-full transition-all duration-500 ${isSelected ? "bg-[#DF8142] w-12" : "bg-transparent"}`} />
                        </button>
                      );
                    })}
                </div>
                <FieldError message={errors.roles} />
              </div>

              {/* Section 03: Strategic Sector Assignment */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#5A270F] to-[#6C3B1C] text-[#EEB38C] text-xs font-black shadow-lg shadow-[#5A270F]/20">03</div>
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C] font-space-grotesk">Strategic Sector Assignment</h4>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-[#D9D9C2] to-transparent dark:from-white/10" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  <div className="space-y-3 group">
                    <label htmlFor="department" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1 group-focus-within:text-[#DF8142] transition-colors">Tactical Division</label>
                    <div className="relative">
                      <input
                        id="department"
                        name="department"
                        title="Department/Sector"
                        value={formData.department}
                        onChange={handleInputChange}
                        placeholder="e.g. Architectural Systems"
                        disabled={currentRoleName === "DepartmentHead" && modalMode === "edit"}
                        className={`w-full bg-white dark:bg-white/5 border-2 rounded-[1.25rem] px-6 py-5 text-sm font-bold text-[#5A270F] dark:text-[#EEB38C] focus:border-[#DF8142] transition-all outline-none shadow-[0_4px_12px_-4px_rgba(26,11,4,0.08)] ${errors.department ? "border-[#DF8142] ring-4 ring-[#DF8142]/10" : "border-[#D9D9C2]/60 dark:border-white/10 font-inter"} ${currentRoleName === "DepartmentHead" && modalMode === "edit" ? "opacity-60 cursor-not-allowed bg-[#EFEDED]/20" : ""}`}
                        required
                      />
                      {errors.department && (
                        <AlertCircle className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#DF8142] animate-bounce" />
                      )}
                    </div>
                  </div>

                  {formData.roleNames.some((r) => ["Faculty", "Admin", "DepartmentHead"].includes(r)) && (
                    <div className="space-y-3 group">
                      <label htmlFor="workerId" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1 group-focus-within:text-[#DF8142] transition-colors">Tactical ID Code</label>
                      <div className="relative">
                        <input
                          id="workerId"
                          name="workerId"
                          title="Staff ID"
                          value={formData.workerId}
                          onChange={handleInputChange}
                          placeholder="e.g. FAC-X01"
                          className={`w-full bg-white dark:bg-white/5 border-2 rounded-[1.25rem] px-6 py-5 text-sm font-bold text-[#5A270F] dark:text-[#EEB38C] focus:border-[#DF8142] transition-all outline-none shadow-[0_4px_12px_-4px_rgba(26,11,4,0.08)] ${errors.workerId ? "border-[#DF8142] ring-4 ring-[#DF8142]/10" : "border-[#D9D9C2]/60 dark:border-white/10 font-mono"}`}
                        />
                      </div>
                    </div>
                  )}

                  {formData.roleNames.includes("Faculty") && (
                    <div className="space-y-3 group md:col-span-2">
                      <label htmlFor="specialization" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1 group-focus-within:text-[#DF8142] transition-colors">Intellectual Domain</label>
                      <div className="relative">
                        <input
                          id="specialization"
                          name="specialization"
                          title="Professional Specialization"
                          value={formData.specialization}
                          onChange={handleInputChange}
                          placeholder="e.g. Parametric Design"
                          className={`w-full bg-white dark:bg-white/5 border-2 rounded-[1.25rem] px-6 py-5 text-sm font-bold text-[#5A270F] dark:text-[#EEB38C] focus:border-[#DF8142] transition-all outline-none shadow-[0_4px_12px_-4px_rgba(26,11,4,0.08)] ${errors.specialization ? "border-[#DF8142] ring-4 ring-[#DF8142]/10" : "border-[#D9D9C2]/60 dark:border-white/10 font-inter"}`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                  {formData.roleNames.includes("Student") && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 md:col-span-2 p-8 bg-[#EFEDED]/30 dark:bg-white/5 rounded-[2rem] border-2 border-dashed border-[#D9D9C2] dark:border-white/10">
                      <div className="md:col-span-2 flex items-center gap-3 mb-2">
                        <Terminal className="h-4 w-4 text-[#DF8142]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#5A270F] dark:text-[#EEB38C]">Academic Phase Registry (Ethiopian Calendar)</span>
                      </div>
                      <div className="space-y-3 group">
                        <label htmlFor="academicStartDate" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1 group-focus-within:text-[#DF8142] transition-colors">Start Node (YYYY-MM-DD)</label>
                        <input
                          id="academicStartDate"
                          name="academicStartDate"
                          title="Academic Start Date"
                          value={formData.academicStartDate}
                          onChange={handleInputChange}
                          placeholder="2016-01-01"
                          className="w-full bg-white dark:bg-white/5 border-2 border-[#D9D9C2]/60 dark:border-white/10 rounded-[1.25rem] px-6 py-5 text-sm font-bold text-[#5A270F] dark:text-[#EEB38C] focus:border-[#DF8142] transition-all outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-3 group">
                        <label htmlFor="academicEndDate" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1 group-focus-within:text-[#DF8142] transition-colors">Finish Node (YYYY-MM-DD)</label>
                        <input
                          id="academicEndDate"
                          name="academicEndDate"
                          title="Academic End Date"
                          value={formData.academicEndDate}
                          onChange={handleInputChange}
                          placeholder="2020-10-30"
                          className="w-full bg-white dark:bg-white/5 border-2 border-[#D9D9C2]/60 dark:border-white/10 rounded-[1.25rem] px-6 py-5 text-sm font-bold text-[#5A270F] dark:text-[#EEB38C] focus:border-[#DF8142] transition-all outline-none font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {(currentRoleName === "DepartmentHead" || currentRoleName === "SuperAdmin") && modalMode === "edit" && (
                  <div className="mt-6 p-8 bg-gradient-to-br from-[#5A270F]/5 to-transparent rounded-[2rem] border-2 border-[#5A270F]/10 space-y-8">
                    <div className="space-y-3 group">
                      <label htmlFor="status" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1 group-focus-within:text-[#DF8142] transition-colors">Operational Status Directive</label>
                      <div className="relative">
                        <select
                          id="status"
                          name="status"
                          title="Node Status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full bg-white dark:bg-white/10 border-2 border-[#D9D9C2]/60 dark:border-white/10 rounded-[1.25rem] px-6 py-5 text-sm font-bold text-[#5A270F] dark:text-[#EEB38C] focus:border-[#DF8142] transition-all outline-none shadow-sm cursor-pointer appearance-none font-inter"
                        >
                          <option value="active">Active (Fully Authorized)</option>
                          <option value="pending_approval">Pending Clearance</option>
                          <option value="suspended">Suspended (Access Revoked)</option>
                        </select>
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#92664A] pointer-events-none" />
                      </div>
                    </div>

                    {formData.status === "suspended" && (
                      <div className="space-y-3 group animate-in slide-in-from-top-4">
                        <label htmlFor="suspendReason" className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] ml-1 group-focus-within:text-[#DF8142] transition-colors">Revocation Justification Protocol *</label>
                        <textarea
                          id="suspendReason"
                          name="suspendReason"
                          title="Suspension Directive"
                          value={formData.suspendReason || ""}
                          onChange={handleInputChange}
                          placeholder="Provide detailed logs for node suspension..."
                          className={`w-full bg-white dark:bg-white/5 border-2 rounded-[1.25rem] px-6 py-5 text-sm font-bold text-[#5A270F] dark:text-[#EEB38C] focus:border-[#DF8142] transition-all outline-none h-32 shadow-sm resize-none ${errors.suspendReason ? "border-[#DF8142] ring-4 ring-[#DF8142]/10" : "border-[#D9D9C2]/60 dark:border-white/10"}`}
                        />
                        <FieldError message={errors.suspendReason} />
                      </div>
                    )}
                  </div>
                )}
 
              {/* Action Vector Footer */}
              <div className="flex gap-6 pt-12 border-t border-[#D9D9C2]/40 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-[#92664A] dark:text-[#EEB38C]/40 hover:text-[#5A270F] dark:hover:text-[#EEB38C] transition-all border border-transparent hover:border-[#D9D9C2] dark:hover:border-white/10"
                >
                  Abort Protocol
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-[2] py-5 bg-[#5A270F] text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-[#1A0B04] transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 shadow-[0_20px_40px_-12px_rgba(90,39,15,0.4)] group overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  {processing ? (
                    <Loader2 className="h-5 w-5 animate-spin text-[#EEB38C]" />
                  ) : (
                    <>
                      <Zap className="h-4 w-4 text-[#DF8142] group-hover:animate-pulse" />
                      {modalMode === "create" ? "COMMIT INITIALIZATION" : "AUTHORIZE MODIFICATIONS"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Dispatch Modal */}
      {isNotifyModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#2A1205]/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsNotifyModalOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white dark:bg-[#1A0B04] rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-[#D9D9C2] dark:border-[#DF8142]/20 overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="bg-[#5A270F] px-10 py-10 relative overflow-hidden group/notify">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#DF8142]/10 blur-[60px] group-hover/notify:bg-[#DF8142]/20 transition-all duration-1000" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <Terminal className="h-4 w-4 text-[#EEB38C] animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#EEB38C]/80">
                    Direct Intelligence Briefing
                  </p>
                </div>
                <h3 className="text-2xl font-black text-white leading-tight italic">
                  Briefing Target: <span className="not-italic text-[#DF8142]">{selectedUser?.first_name || selectedUser?.firstName}</span>
                </h3>
              </div>
            </div>

            <form onSubmit={handleNotifySubmit} className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.2em] ml-2">
                  Objective Headline
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter briefing objective..."
                    className="w-full bg-[#FAF8F4] dark:bg-white/5 border border-[#D9D9C2] dark:border-white/10 rounded-2xl px-6 py-4 text-xs font-black text-[#5A270F] dark:text-white outline-none focus:border-[#DF8142] transition-all shadow-inner"
                    value={notifyData.title}
                    onChange={(e) =>
                      setNotifyData({ ...notifyData, title: e.target.value })
                    }
                  />
                  <Bell className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#92664A]/30" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.2em] ml-2">
                  Intelligence Payload
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Inscribe critical mission parameters..."
                  className="w-full bg-[#FAF8F4] dark:bg-white/5 border border-[#D9D9C2] dark:border-white/10 rounded-2xl px-6 py-4 text-xs font-black text-[#5A270F] dark:text-white outline-none focus:border-[#DF8142] transition-all shadow-inner resize-none h-32"
                  value={notifyData.message}
                  onChange={(e) =>
                    setNotifyData({ ...notifyData, message: e.target.value })
                  }
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsNotifyModalOpen(false)}
                  className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-[#92664A] dark:text-[#EEB38C]/40 hover:text-[#5A270F] dark:hover:text-[#EEB38C] transition-colors"
                >
                  Abort Mission
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-[2] py-4 bg-[#DF8142] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#E99158] transition-all shadow-xl shadow-[#DF8142]/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {processing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Engage Transmission
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
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#2A1205]/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsBroadcastModalOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white dark:bg-[#1A0B04] rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-[#D9D9C2] dark:border-[#DF8142]/20 overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="bg-[#5A270F] px-10 py-10 relative overflow-hidden group/broadcast">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#DF8142]/10 blur-[80px] group-hover/broadcast:bg-[#DF8142]/20 transition-all duration-1000" />
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="h-4 w-4 text-[#DF8142] animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#EEB38C]/80">
                      Emergency Global Broadcast
                    </p>
                  </div>
                  <h3 className="text-3xl font-black text-white leading-tight italic">
                    Nexus <span className="not-italic text-[#DF8142]">Syndicate</span> Relay
                  </h3>
                </div>
                <button
                  type="button"
                  title="Abort Broadcast"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="p-3 bg-white/5 hover:bg-[#DF8142] rounded-xl text-white transition-all active:scale-95"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.2em] ml-2">
                  Universal Objective
                </label>
                <div className="relative">
                  <input
                    type="text"
                    title="Broadcast Headline"
                    placeholder="Enter universal directive headline..."
                    className={`w-full bg-[#FAF8F4] dark:bg-white/5 border rounded-2xl px-6 py-4 text-xs font-black text-[#5A270F] dark:text-white outline-none focus:border-[#DF8142] transition-all shadow-inner ${errors.broadcastTitle ? "border-[#DF8142] ring-2 ring-[#DF8142]/10" : "border-[#D9D9C2] dark:border-white/10"}`}
                    value={notifyData.title}
                    onChange={(e) => {
                      setNotifyData({ ...notifyData, title: e.target.value });
                      if (errors.broadcastTitle)
                        setErrors((prev) => ({ ...prev, broadcastTitle: "" }));
                    }}
                  />
                  {errors.broadcastTitle && (
                    <AlertCircle className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#DF8142]" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.2em] ml-2">
                  Wide-Spectrum Payload
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    title="Broadcast Content"
                    placeholder="Distribute critical intelligence to all active nodes within the Nexus..."
                    className={`w-full bg-[#FAF8F4] dark:bg-white/5 border rounded-2xl px-6 py-4 text-xs font-black text-[#5A270F] dark:text-white outline-none focus:border-[#DF8142] transition-all shadow-inner resize-none h-40 ${errors.broadcastMessage ? "border-[#DF8142] ring-2 ring-[#DF8142]/10" : "border-[#D9D9C2] dark:border-white/10"}`}
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
                    <AlertCircle className="absolute right-5 top-5 h-4 w-4 text-[#DF8142]" />
                  )}
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-[#92664A] dark:text-[#EEB38C]/40 hover:text-[#5A270F] dark:hover:text-[#EEB38C] transition-colors"
                >
                  Cancel Relay
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-[2] py-4 bg-[#5A270F] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#1A0B04] hover:shadow-[0_20px_40px_-10px_rgba(90,39,15,0.4)] transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                >
                  {processing ? (
                    <Loader2 className="h-5 w-5 animate-spin text-[#EEB38C]" />
                  ) : (
                    <>
                      <Zap className="h-4 w-4 text-[#DF8142]" />
                      Engage Global Broadcast
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
