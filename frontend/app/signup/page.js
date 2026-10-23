"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { loginStart, loginSuccess, loginFailure } from "@/redux/slices/authSlice";
import { registerUser } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    goal: "muscle_gain",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    dispatch(loginStart());

    try {
      const res = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        fitnessGoal: formData.goal,
      });

      if (typeof window !== "undefined" && res.token) {
        localStorage.setItem("aizym_token", res.token);
      }

      dispatch(loginSuccess({ user: res.user, token: res.token }));
      setSuccess(true);

      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch (err) {
      const msg = err.message || "Registration failed. Please try again.";
      setError(msg);
      dispatch(loginFailure(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080c] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#00e5ff]/5 blur-[130px] pointer-events-none rounded-full" />

      {/* Brand logo */}
      <Link href="/" className="mb-6 flex items-center gap-2 group">
        <span className="text-2xl font-black text-white tracking-tight">
          AI<span className="text-[#00e5ff]">Zym</span>
        </span>
      </Link>

      {/* Signup Card */}
      <div className="w-full max-w-lg bg-[#121218]/90 border border-white/[0.08] backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Create Your Account</h1>
          <p className="text-xs text-white/50 mt-1">Join AIZym to track reps, correct form, and crush workout goals</p>
        </div>

        {success && (
          <div className="mb-5 px-3 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <span>✅</span>
            <span>Account created successfully! Redirecting...</span>
          </div>
        )}

        {error && (
          <div className="mb-5 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Alex Johnson"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all"
            />
          </div>

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
              placeholder="alex@example.com"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all"
            />
          </div>

          {/* Primary Fitness Goal */}
          <div>
            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5" htmlFor="goal">
              Primary Fitness Goal
            </label>
            <select
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[#16161f] border border-white/10 text-white text-sm focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all cursor-pointer"
            >
              <option value="muscle_gain">Build Muscle & Strength</option>
              <option value="fat_loss">Fat Loss & Conditioning</option>
              <option value="form_correction">Perfect Workout Posture & Form</option>
              <option value="daily_fitness">General Health & Mobility</option>
            </select>
          </div>

          {/* Passwords grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 chars"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5" htmlFor="confirmPassword">
                Confirm
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Show password checkbox */}
          <div className="flex items-center gap-2">
            <input
              id="showPass"
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#00e5ff] focus:ring-[#00e5ff] accent-[#00e5ff] cursor-pointer"
            />
            <label htmlFor="showPass" className="text-xs text-white/50 cursor-pointer select-none">
              Show passwords
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-[#00e5ff] hover:brightness-110 text-black font-bold text-sm tracking-wide transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Creating Account..." : "Create Free Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[11px] uppercase tracking-wider text-white/30">Or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Footer switch to Login */}
        <p className="text-center text-xs text-white/50">
          Already have an account?{" "}
          <Link href="/login" className="text-[#00e5ff] font-semibold hover:underline">
            Sign In
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
