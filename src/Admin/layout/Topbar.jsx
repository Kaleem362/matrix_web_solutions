import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/store";

``;
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
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Hello, Admin</span>

        <button
          className="px-4 py-1.5 text-sm bg-white text-indigo-900 border border-indigo- rounded-full hover:bg-indigo-700 transition"
          onClick={handleLogout}
        >
          {" "}
          <img
            src={logouticon}
            className="w-4 h-4 mr-2 inline-block text-white"
          ></img>
          Log out
        </button>
      </div>
    </header>
  );
};

export default Topbar;
