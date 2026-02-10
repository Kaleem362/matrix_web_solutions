import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  console.log("ENV TEST:", import.meta.env);
  console.log("API URL:", import.meta.env.VITE_API_URL);

  /* =============================
     FORM STATES
     ============================= */

  // Admin ka naam
  const [name, setName] = useState("");

  // Admin ka email
  const [email, setEmail] = useState("");

  // Admin ka password
  const [password, setPassword] = useState("");

  /* =============================
     UI STATES
     ============================= */

  // API call ke waqt loading
  const [loading, setLoading] = useState(false);

  // Error message
  const [error, setError] = useState("");

  // Success message
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  /* =============================
     SIGNUP HANDLER
     ============================= */

  const handleSignup = async (e) => {
    console.log("API URL:", import.meta.env.VITE_API_URL);

    e.preventDefault();

    // 🔴 Frontend validation
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // 🔐 ADMIN REGISTER API CALL
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          name,
          email,
          password,
        },
        { withCredentials: true },
      );

      // ✅ Agar admin successfully create ho gaya
      if (res.data?.success) {
        setSuccess("Admin created successfully. Please login.");

        // Form clear
        setName("");
        setEmail("");
        setPassword("");

        // Thora delay ke baad login page
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Admin registration failed");
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
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Admin Account
        </h2>

        {/* Error message */}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {/* Success message */}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Admin Name"
          />
        </div>

        {/* Email */}
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

        {/* Password */}
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

        {/* Signup button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {loading ? "Creating admin..." : "Create Admin"}
        </button>

        {/* Login link */}
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
