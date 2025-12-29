import { useEffect, useState } from "react";
import { BarChart2, Download, Users, ArrowUp, Loader2 } from "lucide-react";
import { api } from "../../lib/api";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
}

const StatCard = ({ title, value, change, icon: Icon }: StatCardProps) => (
  <div className="bg-gray-50 p-6 rounded-lg border">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <Icon className="h-6 w-6 text-gray-400" />
    </div>
    <div className="mt-2 flex items-baseline">
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {change && (
        <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
          <ArrowUp className="h-5 w-5 flex-shrink-0 self-center text-green-500" />
          <span>{change}</span>
        </p>
      )}
    </div>
  </div>
);

interface AnalyticsStats {
  totalUsers: number;
  totalResources: number;
  pendingResources: number;
  totalDownloads: number;
  newResourcesLast30Days: number;
}

const Analytics = () => {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const statItems = [
    {
      title: "Total Users",
      value: stats?.totalUsers?.toLocaleString() || "0",
      change: "+Today",
      icon: Users,
    },
    {
      title: "Total Resources",
      value: stats?.totalResources?.toLocaleString() || "0",
      change: "Active",
      icon: BarChart2,
    },
    {
      title: "Total Downloads",
      value: stats?.totalDownloads?.toLocaleString() || "0",
      change: "Lifetime",
      icon: Download,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statItems.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900">
            Resource Overview
          </h3>
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Pending Approvals</span>
              <span className="font-bold text-orange-600">
                {stats?.pendingResources}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">
                New Resources (Last 30 days)
              </span>
              <span className="font-bold text-indigo-600">
                {stats?.newResourcesLast30Days}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="p-4 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
              Manage Users
            </button>
            <button className="p-4 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
              Approve Resources
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
