import AdminLayout from "../layout/AdminLayout";
import Testimonials from "./../Components/Testimonials/Testimonials"
const stats = [
  {
    title: "Total Testimonials",
    value: 24,
    subtitle: "Approved + Pending",
  },
  {
    title: "Pending Testimonials",
    value: 7,
    subtitle: "Need approval",
  },
  {
    title: "Total Quotes",
    value: 18,
    subtitle: "Client requests",
  },
  {
    title: "Active Services",
    value: 6,
    subtitle: "Currently visible",
  },
];

const Dashboard = () => {
  return (
    <AdminLayout>
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
          >
            <p className="text-sm text-gray-500">{item.title}</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-1">
              {item.value}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {item.subtitle}
            </p>
          </div>
        ))}
      </div>

      {/* Placeholder Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-5 col-span-2">
          <h3 className="font-semibold text-gray-800 mb-4">
            Recent Activity
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• New testimonial submitted</li>
            <li>• Quote request received</li>
            <li>• Testimonial approved</li>
            <li>• Service updated</li>
          </ul>
        </div>

        {/* Quick Info */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">
            Quick Info
          </h3>
          <p className="text-sm text-gray-600">
            This dashboard gives you a quick overview of what’s
            happening on your website. You can manage content,
            approve testimonials and respond to client quotes.
          </p>
        </div>
      </div>
      
    </AdminLayout>
  );
};

export default Dashboard;
