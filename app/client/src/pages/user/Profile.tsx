import { getUser, clearToken } from "../../lib/auth";
import { useNavigate } from "react-router-dom";

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
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">No active session found.</p>
        <button
          onClick={() => navigate("/login")}
          className="text-indigo-600 font-medium hover:underline"
        >
          Log in
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Personal Information
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            This information is private and will not be shared publicly.
          </p>
        </div>
        <div className="md:col-span-2">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <p className="mt-1 text-lg text-gray-900">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <p className="mt-1 text-lg text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                College ID
              </label>
              <p className="mt-1 text-lg text-gray-900">{user.collegeId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <p className="mt-1 text-lg text-gray-900 capitalize">
                {user.role.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Password
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Update your password here.
          </p>
        </div>
        <div className="md:col-span-2">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-3"
          >
            Change Password
          </button>
          <button
            onClick={handleLogout}
            type="button"
            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
