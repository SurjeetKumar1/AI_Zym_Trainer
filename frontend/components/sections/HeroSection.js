"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

function CountUp({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let n = 0;
      const step = Math.ceil(to / 60);
      const t = setInterval(() => {
        n = Math.min(n + step, to);
        setVal(n);
        if (n >= to) clearInterval(t);
      }, 16);
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use fallback values during SSR to prevent hydration mismatch
  const isAuth = mounted && isAuthenticated;
  const ctaHref = isAuth ? "/main" : "/signup";
  const ctaText = isAuth ? "Go to Dashboard" : "Start for Free";

  return (
    <>
      {/* ══════════════════════════════════════════
          SECTION 1 — HERO (centered, big headline)
      ══════════════════════════════════════════ */}
      <section className="relative bg-[#0a0a0a] min-h-screen flex flex-col items-center justify-center text-center pt-28 pb-20 px-6 overflow-hidden">

        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
        />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl">

          {/* Big mixed-color headline */}
          <h1 className="font-black leading-[0.95] tracking-[-0.03em]">
            <span className="block text-[clamp(3rem,9vw,6rem)] text-white/30 uppercase">Real-Time</span>
            <span className="block text-[clamp(4rem,13vw,9rem)] text-white uppercase">AI ZYM</span>
            <span className="block text-[clamp(4rem,13vw,9rem)] text-[#00e5ff] uppercase">TRAINER</span>
          </h1>

          {/* Sub */}
          <p className="text-sm md:text-base text-white/45 max-w-md leading-relaxed">
            Point your camera. AIZym detects your pose, counts every rep,
            and corrects your form — completely hands-free.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 mt-2">
            <Link
              href={ctaHref}
              className="px-7 py-3 rounded-lg bg-[#00e5ff] text-black text-sm font-bold hover:brightness-110 transition-all hover:scale-[1.02]"
            >
              {ctaText}
            </Link>
            <Link
              href={ctaHref}
              className="px-7 py-3 rounded-lg border border-white/15 text-white/55 text-sm font-semibold hover:border-white/30 hover:text-white transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-10 mt-6 pt-6 border-t border-white/[0.07] w-full justify-center">
            {[
              { to: 2400, suffix: "+", label: "Active Users" },
              { to: 5, suffix: "", label: "Avg. Sessions / Day" },
              { to: 95, suffix: "%", label: "Form Accuracy" },
            ].map(({ to, suffix, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="text-2xl md:text-3xl font-black text-white tabular-nums">
                  <CountUp to={to} suffix={suffix} />
                </span>
                <span className="text-[10px] text-white/30 uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 1.5 — FEATURES SUMMARY
      ══════════════════════════════════════════ */}
      <section className="bg-[#0a0a0a] py-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Key Features</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left text-white/80">
            <li className="flex flex-col items-center gap-2 p-4 bg-[#111] rounded-lg hover:bg-[#222] transition-colors">
              <span className="text-2xl">📹</span>
              <span className="font-semibold text-[#00e5ff] text-center">Live Camera Workout</span>
            </li>
            <li className="flex flex-col items-center gap-2 p-4 bg-[#111] rounded-lg hover:bg-[#222] transition-colors">
              <span className="text-2xl">🏋️‍♂️</span>
              <span className="font-semibold text-[#00e5ff] text-center">Exercise Recognition</span>
            </li>
            <li className="flex flex-col items-center gap-2 p-4 bg-[#111] rounded-lg hover:bg-[#222] transition-colors">
              <span className="text-2xl">🔁</span>
              <span className="font-semibold text-[#00e5ff] text-center">Automatic Rep Counting</span>
            </li>
            <li className="flex flex-col items-center gap-2 p-4 bg-[#111] rounded-lg hover:bg-[#222] transition-colors">
              <span className="text-2xl">🧍‍♀️</span>
              <span className="font-semibold text-[#00e5ff] text-center">Form Correction</span>
            </li>
            <li className="flex flex-col items-center gap-2 p-4 bg-[#111] rounded-lg hover:bg-[#222] transition-colors">
              <span className="text-2xl">🔊</span>
              <span className="font-semibold text-[#00e5ff] text-center">AI Voice Coach</span>
            </li>
            <li className="flex flex-col items-center gap-2 p-4 bg-[#111] rounded-lg hover:bg-[#222] transition-colors">
              <span className="text-2xl">🔐</span>
              <span className="font-semibold text-[#00e5ff] text-center">User Authentication</span>
            </li>
            <li className="flex flex-col items-center gap-2 p-4 bg-[#111] rounded-lg hover:bg-[#222] transition-colors">
              <span className="text-2xl">📊</span>
              <span className="font-semibold text-[#00e5ff] text-center">Progress Dashboard</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — "Built for real athletes"
          3 × 2 image grid
      ══════════════════════════════════════════ */}
      <section className="bg-[#0a0a0a] py-24 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00e5ff] mb-3">Athletes</p>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Built for<br />
              <span className="text-[#00e5ff]">real athletes</span>
            </h2>
          </div>

          {/* 3×2 grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { src: "/hero-squat.jpg", label: "Squat", tag: "Legs", priority: true },
              { src: "/ai-monitor.jpg", label: "Deadlift", tag: "Back", priority: false },
              { src: "/ex-pushup.jpg", label: "Push-up", tag: "Chest", priority: true },
              { src: "/ex-pullup.jpg", label: "Pull-up", tag: "Back", priority: false },
              { src: "/ex-bicep.jpg", label: "Bicep Curl", tag: "Arms", priority: false },
              { src: "/ex-deadlift.jpg", label: "Deadlift", tag: "Back", priority: false },
            ].map(({ src, label, tag, priority }) => (
              <div key={src + label} className="relative rounded-2xl overflow-hidden group" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                <Image
                  src={src}
                  alt={`${label} AI detection`}
                  width={400}
                  height={300}
                  loading={priority ? "eager" : "lazy"}
                  priority={priority}
                  className="w-full h-48 object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                {/* Tag pill top-right */}
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold text-black bg-[#00e5ff]">
                  {tag}
                </div>

                {/* Label bottom-left */}
                <p className="absolute bottom-3 left-3 text-sm font-bold text-white">{label}</p>

                {/* Hover glow border */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-[#00e5ff]/30 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — "See it in action"
          Large demo image + 4 feature pills
      ══════════════════════════════════════════ */}
      <section id="demo" className="bg-[#0a0a0a] py-24 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00e5ff] mb-3">Live Demo</p>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              See it in<br />
              <span className="text-[#00e5ff]">action</span>
            </h2>
            <p className="text-sm text-white/40 mt-4 max-w-md mx-auto">
              Watch the AI detect and analyze form in real-time. No setup — just open the app and move.
            </p>
          </div>

          {/* Large demo image with chrome frame */}
          <div
            className="rounded-2xl overflow-hidden shadow-2xl shadow-black/70"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {/* Fake browser top bar */}
            <div className="flex items-center gap-2 px-4 py-3" style={{ background: "#141414", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              <div className="flex-1 mx-4 px-3 py-1 rounded text-[10px] text-white/20 font-mono" style={{ background: "rgba(255,255,255,0.04)" }}>
                aizym.app/live-session
              </div>
              <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse" />
              <span className="text-[10px] text-[#00e5ff] font-bold">LIVE</span>
            </div>

            {/* Main image */}
            <div className="relative">
              <Image
                src="/hero-squat.jpg"
                alt="AIZym live session showing AI pose tracking and rep counting"
                width={1200}
                height={600}
                className="w-full object-cover object-top"
                style={{ maxHeight: "480px" }}
              />
              {/* Scanline overlay for screen effect */}
              <div
                className="absolute inset-0 pointer-events-none opacity-5"
                style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.15) 2px, rgba(255,255,255,0.15) 4px)" }}
              />
            </div>

            {/* Bottom progress bar */}
            <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#141414", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="text-[10px] text-white/30 font-mono">0:32</span>
              <div className="flex-1 h-1 rounded-full bg-white/10">
                <div className="h-full w-2/5 rounded-full bg-[#00e5ff]" />
              </div>
              <span className="text-[10px] text-white/30 font-mono">1:18</span>
            </div>
          </div>

          {/* 4 feature pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { icon: "🦴", title: "Pose Detection", desc: "17 keypoints tracked" },
              { icon: "🔊", title: "Audio Feedback", desc: "Voice cues on bad form" },
              { icon: "🔢", title: "Rep Counter", desc: "Auto-counts every rep" },
              { icon: "⚡", title: "Works in Real-time", desc: "Zero latency, 30 FPS" },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col gap-2 px-4 py-4 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span className="text-xl">{icon}</span>
                <p className="text-sm font-bold text-white">{title}</p>
                <p className="text-xs text-white/40">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4 — "Built by a human. Backed by data."
      ══════════════════════════════════════════ */}
      <section className="bg-[#0a0a0a] py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-8">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00e5ff]">Our Promise</p>

          <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1]">
            Built by a human.<br />
            <span className="text-[#00e5ff]">Backed by data.</span>
          </h2>

          <p className="text-sm text-white/40 max-w-md leading-relaxed">
            Every algorithm is tested on real workout data. AIZym doesn't guess — it learns from
            millions of rep cycles to give you precise, reliable coaching.
          </p>

          {/* Trust logos row */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-2">
            {[
              { icon: "🛡️", label: "Privacy First" },
              { icon: "⚡", label: "Open Source" },
              { icon: "🔬", label: "Research Backed" },
              { icon: "🌍", label: "Works Offline" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-white/35">
                <span>{icon}</span>
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>

          <Link
            href={ctaHref}
            className="px-8 py-3.5 rounded-lg bg-[#00e5ff] text-black text-sm font-bold hover:brightness-110 transition-all hover:scale-[1.02] mt-2"
          >
            {isAuth ? "Go to Dashboard →" : "Start Training Free →"}
          </Link>
        </div>
      </section>
    </>
  );
}
