import { getUser } from "../../lib/auth";
import { Upload, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Overview = () => {
  const user = getUser();
  console.log("Rendering Overview for user:", user);
  const name = user?.first_name || "User";

  return (
    <div className="space-y-8 bg-white/50 p-4 rounded-xl">
      <h2 className="text-xl font-bold bg-primary/90 text-white p-2">
        DASHBOARD CONTENT IS HERE
      </h2>
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/90 to-[#5A270F] rounded-2xl p-8 text-white shadow-xl">
        <h2 className="text-3xl font-bold mb-2">Welcome back, {name}!</h2>
        <p className="text-primary/20 max-w-xl">
          Track your resource contributions, manage your profile, and stay
          updated with the latest notifications.
        </p>
      </div>

      {/* Quick Stats / Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Contribute</p>
              <h3 className="text-lg font-bold text-gray-900">Upload New</h3>
            </div>
          </div>
          <Link
            to="/dashboard/upload"
            className="text-primary font-semibold text-sm hover:underline"
          >
            Share a resource &rarr;
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Status</p>
              <h3 className="text-lg font-bold text-gray-900">My Uploads</h3>
            </div>
          </div>
          <Link
            to="/dashboard/uploads"
            className="text-green-600 font-semibold text-sm hover:underline"
          >
            View history &rarr;
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#92664A]/5 text-[#5A270F] rounded-lg">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Updates</p>
              <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
            </div>
          </div>
          <Link
            to="/dashboard/notifications"
            className="text-[#5A270F] font-semibold text-sm hover:underline"
          >
            Check updates &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Overview;
