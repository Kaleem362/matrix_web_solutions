import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/store";

const Topbar = () => {
  const { logouticon } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call backend logout (for cookie/session clearing)
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    // Remove local storage data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6 shadow-sm">
      <h1 className="text-lg font-semibold tracking-tight text-gray-800">
        Admin Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <span className="hidden text-sm text-gray-500 sm:inline">
          Hello, Admin
        </span>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-1.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-600 hover:text-white"
        >
          {logouticon && (
            <img
              src={logouticon}
              alt=""
              className="h-4 w-4"
            />
          )}
          Log out
        </button>
      </div>
    </header>
  );
};

export default Topbar;
