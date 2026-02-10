import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  /* =============================
     FORM STATES
     ============================= */

  const [email, setEmail] = useState(""); // user email
  const [password, setPassword] = useState(""); // user password

  /* =============================
     UI STATES
     ============================= */

  const [loading, setLoading] = useState(false); // loading indicator
  const [error, setError] = useState(""); // error message

  const navigate = useNavigate(); // route navigation

  /* =============================
     LOGIN HANDLER
     ============================= */

  const handleLogin = async (e) => {
    e.preventDefault();

    // 🔴 Basic frontend validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 🔐 Login API call
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true },
      );

      // ✅ Agar token mila, matlab login successful
      // ✅ Login successful agar success true hai
      if (res.data?.success) {
        // User info save (optional)
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // Redirect
        navigate("/admin/dashboard");
      } else {
        setError("Invalid login response");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     UI
     ============================= */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        {/* Error message */}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {/* Email input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="admin@example.com"
          />
        </div>

        {/* Password input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="••••••"
          />
        </div>

        {/* Login button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* 🔗 Signup link */}
        <p className="text-sm text-center mt-4">
          Not having an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 font-medium hover:underline"
          >
            Create Account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
