import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../lib/api";
import { UserPlus, Sparkles } from "lucide-react";
import { toast } from "react-toastify";

const Register = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role_name: "Student",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      toast.success("Identity registered! Please sign in.");
      navigate("/login");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen-minus-header bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl">
        <div className="bg-white p-10 sm:p-14 rounded-[3rem] shadow-2xl border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 blur-[50px]" />
          <div className="text-center mb-12">
            <div className="mx-auto w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mb-6 text-white shadow-xl">
              <UserPlus className="h-8 w-8" />
            </div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
              Create Identity
            </h2>
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 flex items-center justify-center gap-2">
              <Sparkles className="h-3 w-3" /> Join the Architecture Network
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  Given Name
                </label>
                <input
                  name="first_name"
                  placeholder="e.g. John"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  Surname
                </label>
                <input
                  name="last_name"
                  placeholder="e.g. Doe"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                Studio Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="university@studio.edu"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                Security Key
              </label>
              <input
                name="password"
                type="password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                Network Role
              </label>
              <select
                name="role_name"
                value={form.role_name}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="Student">Student Node</option>
                <option value="Faculty">Faculty Node</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 px-4 bg-slate-950 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 disabled:opacity-50"
              >
                {loading ? "Registering Node..." : "Initiate Registration"}
              </button>
            </div>
          </form>
        </div>
        <p className="mt-8 text-center text-sm font-bold text-gray-400">
          Already verified?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:text-slate-900 transition-colors uppercase tracking-widest text-xs ml-2"
          >
            Access Terminal
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
