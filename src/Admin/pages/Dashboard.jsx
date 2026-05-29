import { MdDashboard } from "react-icons/md";
import { useDashboard } from "../../Context/DashboardContext";

const Dashboard = () => {
  const { stats, recentActivity, loading, error } = useDashboard();

  const statCards = [
    {
      title: "Total Testimonials",
      value: stats.totalTestimonials,
      subtitle: "Approved + Pending",
    },
    {
      title: "Pending Testimonials",
      value: stats.pendingTestimonials,
      subtitle: "Need approval",
    },
    {
      title: "Total Quotes",
      value: stats.totalQuotes,
      subtitle: "Client requests",
    },
    {
      title: "Active Services",
      value: stats.activeServices,
      subtitle: "Currently visible",
    },
  ];

  return (
    <section className="min-h-screen px-1 py-2 sm:px-2">
      {/* ── Page Header ── */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
          <MdDashboard className="text-xl text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h2>
          <p className="text-sm text-gray-500">
            Overview of your agency at a glance
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-sm text-gray-500">{item.title}</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              {loading ? (
                <span className="inline-block h-7 w-8 animate-pulse rounded bg-gray-200" />
              ) : (
                item.value
              )}
            </h2>
            <p className="mt-1 text-xs text-gray-400">{item.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="col-span-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-800">Recent Activity</h3>
          {loading ? (
            <ul className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <li
                  key={i}
                  className="h-4 w-3/4 animate-pulse rounded bg-gray-100"
                />
              ))}
            </ul>
          ) : recentActivity.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-600">
              {recentActivity.map((a, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 text-indigo-500">•</span>
                  <span>
                    {a.label}
                    {a.date && (
                      <span className="ml-2 text-xs text-gray-400">
                        {new Date(a.date).toLocaleDateString()}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No recent activity found.</p>
          )}
        </div>

        {/* Quick Info */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-800">Quick Info</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex justify-between">
              <span>Total Contacts</span>
              <span className="font-semibold text-gray-800">
                {loading ? "..." : stats.totalContacts}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Pending Approvals</span>
              <span className="font-semibold text-amber-600">
                {loading ? "..." : stats.pendingTestimonials}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Active Services</span>
              <span className="font-semibold text-emerald-600">
                {loading ? "..." : stats.activeServices}
              </span>
            </li>
          </ul>
          <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-400">
            Manage content, approve testimonials, and respond to client quotes
            from the sidebar.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
