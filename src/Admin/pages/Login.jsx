import { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { getApiBase } from "../../utils/api.js"; // ✅ shared utility

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ Built from shared util — no more duplication
  const API_BASE = getApiBase();
  const LOGIN_URL = `${API_BASE}/api/auth/login`;
  const AUTH_CHECK_URL = `${API_BASE}/api/auth/check`;

  console.log("🔍 API URLs:", { LOGIN_URL, AUTH_CHECK_URL });

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");

      if (!email.trim() || !password.trim()) {
        setError("Please enter email and password");
        return;
      }

      if (!email.includes("@")) {
        setError("Please enter a valid email");
        return;
      }

      try {
        setLoading(true);
        console.log("🔐 Logging in →", LOGIN_URL);

        const res = await axios.post(
          LOGIN_URL,
          { email: email.trim(), password: password.trim() },
          {
            withCredentials: true,
            timeout: 10000,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("✅ Login response:", res.data);

        if (res.data?.success === true) {
          localStorage.setItem("user", JSON.stringify(res.data.user));

          if (res.data.token) {
            localStorage.setItem("token", res.data.token);
          }

          console.log("🎉 Login SUCCESS → Redirecting...");
          navigate("/admin/dashboard", { replace: true });
        } else {
          setError(res.data?.message || "Login failed - invalid response");
        }
      } catch (err) {
        console.error("❌ Login error:", err.response?.data || err);

        let errorMsg = "Login failed";

        if (err.response?.status === 401) {
          errorMsg = err.response.data?.message || "Invalid email or password";
        } else if (err.response?.status === 403) {
          errorMsg = "Admin access required";
        } else if (err.code === "ECONNABORTED") {
          errorMsg = "Server timeout - please try again";
        } else if (!err.response) {
          errorMsg = "No connection to server";
        } else {
          errorMsg = err.response.data?.message || err.message || "Unknown error";
        }

        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [email, password, LOGIN_URL, navigate]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Admin Login
          </h1>
          <p className="text-gray-600">Sign in to manage your dashboard</p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/50"
        >
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl mb-6 shadow-sm">
              <div className="flex items-center">
                <span className="text-lg mr-2">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all duration-200 text-lg placeholder-gray-400"
              placeholder="admin@example.com"
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all duration-200 text-lg placeholder-gray-400"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing In...
              </>
            ) : (
              "🚀 Sign In"
            )}
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">First time?</span>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center">
            <Link
              to="/register-admin"
              className="inline-flex items-center gap-2 bg-linear-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Create Admin Account
            </Link>
          </p>

          {/* Debug Info — remove in production */}
          {import.meta.env.MODE === "development" && (
            <div className="mt-6 p-3 bg-gray-100 rounded-xl text-xs text-gray-600">
              <p>API: {LOGIN_URL}</p>
              <p>Mode: {import.meta.env.MODE}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;