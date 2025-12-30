import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import type { User } from "../../models";
import { Loader2, UserPlus, Edit2, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to load users");
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
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "", // Leave blank usually
      roleName: user.role.name,
      universityId: user.universityId || "",
      batch: user.batch?.toString() || "",
      year: user.year?.toString() || "",
      semester: "", // Add if needed in model
      status: user.status,
    });
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This cannot be undone."
      )
    )
      return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted successfully");
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Delete error", err);
      toast.error("Failed to delete user");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    try {
      if (modalMode === "create") {
        const { data } = await api.post("/admin/users/create", formData);
        setUsers([data.user, ...users]); // Assuming data.user returns the new user formatted correctly
        // Actually API response might not match frontend format exactly, better refresh or manual map
        // Let's refresh to be safe or map manually if we knew the structure perfectly.
        // But fetch is fast enough usually.
        fetchUsers();
        toast.success("User created successfully");
      } else {
        if (selectedUser) {
          await api.patch(`/admin/users/${selectedUser.id}`, formData);
          fetchUsers();
          toast.success("User updated successfully");
        }
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      console.error("Submit error", err);
      const errorMessage =
        (err as any).response?.data?.message || "Operation failed";
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

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <UserPlus className="h-5 w-5" />
          Add User
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-6">
              {modalMode === "create" ? "Add User" : "Edit User"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              {modalMode === "create" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required={modalMode === "create"}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    name="roleName"
                    value={formData.roleName}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {formData.roleName === "Student" && (
                <div className="space-y-4 pt-2 border-t mt-2">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Student Details
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      University ID
                    </label>
                    <input
                      name="universityId"
                      value={formData.universityId}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Batch
                      </label>
                      <input
                        type="number"
                        name="batch"
                        value={formData.batch}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year
                      </label>
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Semester
                      </label>
                      <input
                        type="number"
                        name="semester"
                        value={formData.semester}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold"
                >
                  {processing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : modalMode === "create" ? (
                    "Create User"
                  ) : (
                    "Update User"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                University ID
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Batch
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Year
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                      {user.firstName[0]}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                  {user.universityId || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.batch || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.year ? `Year ${user.year}` : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      user.role.name === "Admin"
                        ? "bg-purple-100 text-purple-700"
                        : user.role.name === "Faculty"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.role.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(user)}
                      className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                      title="Edit User"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
