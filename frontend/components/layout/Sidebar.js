"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";

const EXERCISES = [
  "Squats", "Push-ups", "Pull-ups", "Deadlift",
  "Bicep Curl", "Lunges", "Plank", "Shoulder Press",
  "Tricep Dips", "Jumping Jacks",
];

export default function Sidebar({ collapsed, onToggle }) {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [exercise, setExercise] = useState("Squats");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);

  function handleLogout() {
    dispatch(logout());
    router.push("/");
  }

  function handleStartWorkout() {
    router.push(
      `/main/workout?exercise=${encodeURIComponent(exercise)}&sets=${sets}&reps=${reps}`
    );
  }

  // Safely compute user info after client-side mount to prevent SSR hydration mismatch
  const avatarLetter = mounted && user
    ? (user?.name?.[0] || user?.email?.[0] || "U").toUpperCase()
    : "U";

  const displayName = mounted && user
    ? (user?.name || user?.email || "Athlete")
    : "Athlete";

  return (
    <aside
      className="fixed top-0 left-0 h-screen flex flex-col z-40 border-r border-white/[0.07] transition-all duration-300 overflow-hidden"
      style={{
        width: collapsed ? "68px" : "260px",
        background: "rgba(8,8,14,0.98)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* ── Logo + Toggle ── */}
      <div className="flex items-center px-4 py-5 border-b border-white/[0.07] gap-2 shrink-0">
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-black text-black text-sm"
            style={{ background: "linear-gradient(135deg,#00e5ff,#00b8cc)" }}
          >
            AZ
          </span>
          {!collapsed && (
            <span className="text-base font-black text-white tracking-tight truncate">
              AI<span className="text-[#00e5ff]">Zym</span>
              <span className="text-white/30 font-medium text-xs ml-1">Trainer</span>
            </span>
          )}
        </Link>
        <span className="flex-1" />
        <button
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-[#00e5ff] hover:bg-[#00e5ff]/10 transition-all"
        >
          {collapsed ? (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          ) : (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Scrollable content (Workout Plan) ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {!collapsed ? (
          <div className="px-4 py-6 flex flex-col gap-5">
            <p className="text-sm font-bold text-white">Workout Plan</p>

            {/* Exercise */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50 font-medium">Exercise</label>
              <div className="relative">
                <select
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                  className="w-full appearance-none rounded-xl px-4 py-2.5 text-sm text-white font-medium outline-none cursor-pointer transition-all border border-white/[0.08] hover:border-[#00e5ff]/40 focus:border-[#00e5ff]/60"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  {EXERCISES.map((ex) => (
                    <option key={ex} value={ex} style={{ background: "#0f0f14" }}>{ex}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Sets */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50 font-medium">Sets</label>
              <div className="flex items-center rounded-xl overflow-hidden border border-white/[0.08]" style={{ background: "rgba(255,255,255,0.05)" }}>
                <span className="flex-1 px-4 py-2.5 text-sm font-semibold text-white">{sets}</span>
                <button onClick={() => setSets((s) => Math.max(1, s - 1))}
                  className="w-10 h-10 flex items-center justify-center border-l border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.06] transition-all font-bold text-base">−</button>
                <button onClick={() => setSets((s) => Math.min(20, s + 1))}
                  className="w-10 h-10 flex items-center justify-center border-l border-white/[0.08] text-white/50 hover:text-[#00e5ff] hover:bg-[#00e5ff]/10 transition-all font-bold text-base">+</button>
              </div>
            </div>

            {/* Reps per Set */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50 font-medium">Reps per Set</label>
              <div className="flex items-center rounded-xl overflow-hidden border border-white/[0.08]" style={{ background: "rgba(255,255,255,0.05)" }}>
                <span className="flex-1 px-4 py-2.5 text-sm font-semibold text-white">{reps}</span>
                <button onClick={() => setReps((r) => Math.max(1, r - 1))}
                  className="w-10 h-10 flex items-center justify-center border-l border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.06] transition-all font-bold text-base">−</button>
                <button onClick={() => setReps((r) => Math.min(100, r + 1))}
                  className="w-10 h-10 flex items-center justify-center border-l border-white/[0.08] text-white/50 hover:text-[#00e5ff] hover:bg-[#00e5ff]/10 transition-all font-bold text-base">+</button>
              </div>
            </div>

            {/* Start Workout */}
            <button
              onClick={handleStartWorkout}
              className="w-full py-3 rounded-xl bg-[#00e5ff] text-black text-sm font-bold hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#00e5ff]/15"
            >
              Start Workout
            </button>
          </div>
        ) : (
          /* Collapsed: play button shortcut */
          <div className="flex flex-col items-center py-6">
            <button
              onClick={handleStartWorkout}
              title="Start Workout"
              className="w-10 h-10 rounded-xl bg-[#00e5ff]/10 border border-[#00e5ff]/20 text-[#00e5ff] flex items-center justify-center hover:bg-[#00e5ff]/20 transition-all"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* ── Bottom: User info + Logout ── */}
      <div className="px-3 py-4 border-t border-white/[0.07] shrink-0 flex flex-col gap-2">

        {/* User info */}
        <div className={`flex items-center gap-3 px-2 py-2 rounded-xl ${collapsed ? "justify-center" : ""}`}>
          <div
            suppressHydrationWarning
            className="w-8 h-8 rounded-full bg-[#00e5ff]/15 border border-[#00e5ff]/30 flex items-center justify-center text-[#00e5ff] font-bold text-sm shrink-0"
          >
            {avatarLetter}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-[10px] text-white/35 leading-none mb-0.5">Login as</p>
              <p suppressHydrationWarning className="text-sm font-semibold text-white truncate">
                {displayName}
              </p>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Logout"
          className={`w-full flex items-center gap-3 rounded-xl text-sm text-white/35 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20 py-2.5 ${collapsed ? "justify-center px-0" : "px-4"}`}
        >
          <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="shrink-0">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}
