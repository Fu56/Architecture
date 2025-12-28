import { BarChart2, Download, Users, ArrowUp } from "lucide-react";

const StatCard = ({ title, value, change, icon: Icon }: any) => (
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

const Analytics = () => {
  // Placeholder data
  const stats = [
    { title: "Total Users", value: "1,204", change: "+12%", icon: Users },
    { title: "Total Downloads", value: "4,590", change: "+8%", icon: Download },
    {
      title: "New Resources (30d)",
      value: "86",
      change: "+20%",
      icon: BarChart2,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900">
            Downloads Over Time
          </h3>
          <div className="h-64 mt-4 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">[Chart Placeholder]</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900">
            Most Active Users
          </h3>
          <div className="h-64 mt-4 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">[List Placeholder]</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
