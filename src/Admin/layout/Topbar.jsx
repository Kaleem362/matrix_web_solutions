const Topbar = () => {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-800">
        Admin Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Hello, Admin
        </span>

        <button className="px-4 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
