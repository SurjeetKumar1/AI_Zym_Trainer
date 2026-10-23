"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { loginStart, loginSuccess, loginFailure } from "@/redux/slices/authSlice";
import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({ email: "", password: "", remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    dispatch(loginStart());

    try {
      const res = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      if (typeof window !== "undefined" && res.token) {
        localStorage.setItem("aizym_token", res.token);
      }

      dispatch(loginSuccess({ user: res.user, token: res.token }));
      setSuccess(true);

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err) {
      const msg = err.message || "Invalid email or password.";
      setError(msg);
      dispatch(loginFailure(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080c] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#00e5ff]/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Brand logo */}
      <Link href="/" className="mb-8 flex items-center gap-2 group">
        <span className="text-2xl font-black text-white tracking-tight">
          AI<span className="text-[#00e5ff]">Zym</span>
        </span>
      </Link>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#121218]/90 border border-white/[0.08] backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h1>
          <p className="text-xs text-white/50 mt-1">Enter your credentials to access your workout dashboard</p>
        </div>

        {success && (
          <div className="mb-5 px-3 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <span>✅</span>
            <span>Logged in successfully! Redirecting...</span>
          </div>
        )}

        {error && (
          <div className="mb-5 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="athlete@example.com"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider" htmlFor="password">
                Password
              </label>
              <Link href="#" className="text-xs text-[#00e5ff] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Remember me checkbox */}
          <div className="flex items-center gap-2 mt-1">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={formData.remember}
              onChange={handleChange}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#00e5ff] focus:ring-[#00e5ff] accent-[#00e5ff] cursor-pointer"
            />
            <label htmlFor="remember" className="text-xs text-white/60 cursor-pointer select-none">
              Remember me for 30 days
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-[#00e5ff] hover:brightness-110 text-black font-bold text-sm tracking-wide transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[11px] uppercase tracking-wider text-white/30">Or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Footer switch to Signup */}
        <p className="text-center text-xs text-white/50">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#00e5ff] font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </div>

      {/* Back to Home */}
      <Link href="/" className="mt-8 text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1.5">
        ← Back to AIZym Home
      </Link>
    </div>
  );
}
