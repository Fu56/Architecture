import { getUser, clearToken } from "../../lib/auth";
import { useNavigate } from "react-router-dom";
import { User, Shield, Key, LogOut } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
        <User className="h-16 w-16 text-gray-300 mb-4" />
        <p className="text-gray-500 mb-6 font-medium">
          No active session found.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          Log in
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative flex items-center gap-6">
          <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/30">
            <span className="text-3xl font-black text-indigo-600 uppercase">
              {user.first_name?.[0]}
              {user.last_name?.[0]}
            </span>
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight">
              {user.first_name} {user.last_name}
            </h2>
            <div className="flex items-center gap-2 mt-2 opacity-90">
              <Shield className="h-4 w-4" />
              <span className="capitalize font-medium">
                {user.role?.name || user.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Info Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-500" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Full Name
                </label>
                <p className="font-medium text-gray-900 border-b border-gray-100 pb-2">
                  {user.first_name} {user.last_name}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Email Address
                </label>
                <p className="font-medium text-gray-900 border-b border-gray-100 pb-2">
                  {user.email}
                </p>
              </div>
              {user.collegeId && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    College ID
                  </label>
                  <p className="font-medium text-gray-900 border-b border-gray-100 pb-2">
                    {user.collegeId}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Key className="h-5 w-5 text-indigo-500" />
              Account Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-bold text-gray-700 transition-colors group">
                Change Password
                <span className="text-gray-400 group-hover:text-gray-600">
                  →
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between px-4 py-3 bg-red-50 hover:bg-red-100 rounded-xl text-sm font-bold text-red-600 transition-colors group"
              >
                Sign Out
                <LogOut className="h-4 w-4 opacity-70 group-hover:opacity-100" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
