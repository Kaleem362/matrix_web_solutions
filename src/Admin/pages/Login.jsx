import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // 🔹 Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // 🔐 LOGIN HANDLER
  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 🔥 IMPORTANT: withCredentials:true
      // ye cookie ko allow karta hai
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      // Agar login successful
      if (res.data.success) {
        // Admin dashboard par redirect
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Admin Login
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="admin@example.com"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
