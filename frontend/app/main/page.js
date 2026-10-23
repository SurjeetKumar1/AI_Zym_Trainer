"use client";

export default function MainPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-8">
      {/* Glow */}
      <div
        className="absolute w-72 h-72 rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ background: "#00e5ff" }}
      />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00e5ff]">
          Dashboard
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white">
          Welcome to <span className="text-[#00e5ff]">AIZym</span>
        </h1>
        <p className="text-white/40 text-sm max-w-sm leading-relaxed">
          Your dashboard is ready. Content coming soon — stay tuned!
        </p>
      </div>
    </div>
  );
}
