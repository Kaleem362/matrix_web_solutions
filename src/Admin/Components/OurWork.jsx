import { FaPhoenixFramework } from "react-icons/fa";

/* =====================================================
   OurWork - Admin portfolio manager (placeholder)
   TODO: Wire up CRUD for portfolio entries
===================================================== */
const OurWork = () => {
  return (
    <section className="min-h-screen px-1 py-2 sm:px-2">
      {/* ── Page Header ── */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
            <FaPhoenixFramework className="text-lg text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Our Work
            </h2>
            <p className="text-sm text-gray-500">
              Manage portfolio projects shown on the public site
            </p>
          </div>
        </div>
      </div>

      {/* ── Placeholder ── */}
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
        <FaPhoenixFramework className="mb-3 text-5xl text-gray-200" />
        <p className="text-base font-semibold text-gray-400">
          Portfolio manager coming soon
        </p>
        <p className="mt-1 text-sm text-gray-400">
          You'll be able to add, edit, and reorder projects from here.
        </p>
      </div>
    </section>
  );
};

export default OurWork;
