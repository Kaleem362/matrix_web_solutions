import { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { getApiBase } from "../../utils/api.js";

// ─── Logo (embedded — no extra import needed) ────────────────────────────────
import MatrixLogo from "../../../Elements/MWW3dLogo.png"; // ✅ adjust path if needed

const Login = () => {
  // ─── State ────────────────────────────────────────────────────────────────
  const [panel, setPanel]           = useState("login");   // "login" | "forgot"
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg]     = useState("");
  const [resetErr, setResetErr]     = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const navigate   = useNavigate();
  const API_BASE   = getApiBase();
  const LOGIN_URL  = `${API_BASE}/api/auth/login`;
  const FORGOT_URL = `${API_BASE}/api/auth/forgot-password`;

  // ─── Login handler (original logic preserved exactly) ────────────────────
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
          { withCredentials: true, timeout: 10000, headers: { "Content-Type": "application/json" } }
        );

        console.log("✅ Login response:", res.data);

        if (res.data?.success === true) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          if (res.data.token) localStorage.setItem("token", res.data.token);
          console.log("🎉 Login SUCCESS → Redirecting...");
          navigate("/admin/dashboard", { replace: true });
        } else {
          setError(res.data?.message || "Login failed — invalid response");
        }
      } catch (err) {
        console.error("❌ Login error:", err.response?.data || err);
        let msg = "Login failed";
        if (err.response?.status === 401)     msg = err.response.data?.message || "Invalid email or password";
        else if (err.response?.status === 403) msg = "Admin access required";
        else if (err.code === "ECONNABORTED")  msg = "Server timeout — please try again";
        else if (!err.response)                msg = "No connection to server";
        else                                   msg = err.response.data?.message || err.message || "Unknown error";
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [email, password, LOGIN_URL, navigate]
  );

  // ─── Forgot password handler ──────────────────────────────────────────────
  const handleForgot = useCallback(
    async (e) => {
      e.preventDefault();
      setResetErr("");
      setResetMsg("");

      if (!resetEmail.trim()) { setResetErr("Please enter your email address"); return; }
      if (!resetEmail.includes("@")) { setResetErr("Please enter a valid email"); return; }

      try {
        setResetLoading(true);
        const res = await axios.post(
          FORGOT_URL,
          { email: resetEmail.trim() },
          { withCredentials: true, timeout: 10000, headers: { "Content-Type": "application/json" } }
        );
        if (res.data?.success) {
          setResetMsg(res.data?.message || "Reset link sent! Check your inbox.");
        } else {
          setResetErr(res.data?.message || "Could not send reset link.");
        }
      } catch (err) {
        setResetErr(err.response?.data?.message || "Failed to send reset link. Try again.");
      } finally {
        setResetLoading(false);
      }
    },
    [resetEmail, FORGOT_URL]
  );

  // ─── Shared input classes ─────────────────────────────────────────────────
  const inputCls =
    "w-full px-4 py-3 bg-white/60 border border-white/40 rounded-xl " +
    "focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent " +
    "text-slate-800 placeholder-slate-400 text-sm backdrop-blur-sm transition-all duration-200";

  const labelCls = "block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2";

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-stretch bg-slate-950 font-sans">

      {/* ── LEFT PANEL — Branding ── */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden p-14">

        {/* Background layers */}
        <div className="absolute inset-0 bg-linear-to-brrom-indigo-950 via-slate-900 to-violet-950" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,1) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,1) 1px,transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        {/* Glow orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600 rounded-full opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-700 rounded-full opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500 rounded-full opacity-10 blur-3xl pointer-events-none" />

        {/* Logo + Agency name */}
        <div className="relative z-10 flex items-center gap-4">
          <img
            src={MatrixLogo}
            alt="Matrix Web Solutions Logo"
            className="w-14 h-14 object-contain drop-shadow-xl"
          />
          <div>
            <p className="text-white font-black text-lg leading-tight tracking-tight">
              Matrix Web Solutions
            </p>
            <p className="text-indigo-300 text-xs font-medium tracking-widest uppercase">
              Admin Portal
            </p>
          </div>
        </div>

        {/* Center headline */}
        <div className="relative z-10">
          <h1 className="text-5xl font-black text-white leading-[1.1] mb-6 tracking-tight">
            Build.<br />
            <span className="bg-linear-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Grow.
            </span>
            <br />Dominate.
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            Your all-in-one digital agency command center. Manage services,
            clients, testimonials, and projects from one powerful dashboard.
          </p>

          {/* Stat pills */}
          <div className="flex gap-4 mt-10 flex-wrap">
            {[
              { num: "120+", label: "Projects Delivered" },
              { num: "98%",  label: "Client Satisfaction" },
              { num: "5★",   label: "Avg. Rating" },
            ].map(({ num, label }) => (
              <div
                key={label}
                className="flex flex-col bg-white/5 border border-white/10 rounded-2xl px-5 py-3 backdrop-blur-sm"
              >
                <span className="text-white font-black text-xl">{num}</span>
                <span className="text-slate-400 text-xs mt-0.5">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="relative z-10 text-slate-600 text-xs">
          © {new Date().getFullYear()} Matrix Web Solutions — All rights reserved.
        </p>
      </div>

      {/* ── RIGHT PANEL — Form ── */}
      <div className="flex-1 flex items-center justify-center bg-linear-to-br from-slate-50 to-indigo-50 px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile logo (only visible on small screens) */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <img
              src={MatrixLogo}
              alt="Matrix Web Solutions Logo"
              className="w-12 h-12 object-contain"
            />
            <div>
              <p className="text-slate-800 font-black text-base leading-tight">Matrix Web Solutions</p>
              <p className="text-indigo-500 text-xs font-medium tracking-widest uppercase">Admin Portal</p>
            </div>
          </div>

          {/* ── LOGIN PANEL ─────────────────────────────────────────────── */}
          {panel === "login" && (
            <div className="animate-fadeIn">
              <h2 className="text-3xl font-black text-slate-900 mb-1">Welcome back 👋</h2>
              <p className="text-slate-500 text-sm mb-8">Sign in to your admin dashboard</p>

              <form onSubmit={handleLogin} className="space-y-5">

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className={labelCls}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@matrixweb.com"
                    disabled={loading}
                    className={inputCls}
                    autoComplete="email"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className={labelCls}>Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      disabled={loading}
                      className={`${inputCls} pr-12`}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1"
                      tabIndex={-1}
                      aria-label={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? (
                        /* Eye-off icon */
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        /* Eye icon */
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot password */}
                <div className="flex justify-end -mt-1">
                  <button
                    type="button"
                    onClick={() => { setPanel("forgot"); setError(""); }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white
                    bg-linear-to-r from-indigo-600 to-violet-600
                    hover:from-indigo-700 hover:to-violet-700
                    focus:outline-none focus:ring-4 focus:ring-indigo-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200 shadow-lg shadow-indigo-200
                    flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing in…
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Sign In to Dashboard
                    </>
                  )}
                </button>

                {/* Divider + Register */}
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-linear-to-br from-slate-50 to-indigo-50 text-slate-400 text-xs">
                      First time here?
                    </span>
                  </div>
                </div>

                <Link
                  to="/register-admin"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold
                    border-2 border-emerald-200 text-emerald-700
                    hover:bg-emerald-50 hover:border-emerald-300
                    transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create Admin Account
                </Link>
              </form>

              {/* Dev debug strip */}
              {import.meta.env.MODE === "development" && (
                <div className="mt-6 p-3 bg-slate-100 rounded-xl text-xs text-slate-500 space-y-0.5">
                  <p>🔗 API: {LOGIN_URL}</p>
                  <p>⚙️ Mode: {import.meta.env.MODE}</p>
                </div>
              )}
            </div>
          )}

          {/* ── FORGOT PASSWORD PANEL ──────────────────────────────────── */}
          {panel === "forgot" && (
            <div className="animate-fadeIn">
              {/* Back button */}
              <button
                type="button"
                onClick={() => { setPanel("login"); setResetErr(""); setResetMsg(""); setResetEmail(""); }}
                className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 text-sm font-semibold mb-6 hover:underline transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Sign In
              </button>

              <h2 className="text-3xl font-black text-slate-900 mb-1">Reset Password 🔑</h2>
              <p className="text-slate-500 text-sm mb-8">
                Enter your admin email and we'll send you a secure reset link.
              </p>

              <form onSubmit={handleForgot} className="space-y-5">

                {/* Error */}
                {resetErr && (
                  <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{resetErr}</span>
                  </div>
                )}

                {/* Success */}
                {resetMsg && (
                  <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{resetMsg}</span>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className={labelCls}>Email Address</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="admin@matrixweb.com"
                    disabled={resetLoading || !!resetMsg}
                    className={inputCls}
                    autoComplete="email"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={resetLoading || !resetEmail || !!resetMsg}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white
                    bg-linear-to-r from-indigo-600 to-violet-600
                    hover:from-indigo-700 hover:to-violet-700
                    focus:outline-none focus:ring-4 focus:ring-indigo-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200 shadow-lg shadow-indigo-200
                    flex items-center justify-center gap-2"
                >
                  {resetLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending Link…
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;