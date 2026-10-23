"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";

/**
 * Navbar
 * Fixed top bar — glass dark bg, cyan accent to match hero.
 * Shows Logout when user is authenticated, Login/Get Started otherwise.
 * Mobile: hamburger toggle.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { href: "#how-it-works", label: "How It Works" },
    { href: "#features",     label: "Features" },
  ];

  function handleLogout() {
    dispatch(logout());
    setOpen(false);
    router.push("/");
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/[0.06]"
      style={{ background: "rgba(8,8,12,0.85)", backdropFilter: "blur(20px)" }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <span className="text-xl font-black text-white tracking-tight">
          AI<span className="text-[#00e5ff]">Zym</span>
        </span>
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-8">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Desktop CTAs */}
      <div className="hidden md:flex items-center gap-3">
        {mounted && isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-[#00e5ff] border border-[#00e5ff]/40 px-4 py-2 rounded-lg hover:bg-[#00e5ff]/10 transition-all"
          >
            Logout
          </button>
        ) : mounted ? (
          <>
            <Link href="/login" className="text-sm text-white/50 hover:text-white transition-colors px-3 py-2">
              Login
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold bg-[#00e5ff] text-black px-4 py-2 rounded-lg hover:brightness-110 transition-all"
            >
              Get Started
            </Link>
          </>
        ) : (
          <div className="w-28 h-9" />
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden text-white/70 hover:text-white p-1"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
      >
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? (
            <><line x1="4" y1="4" x2="18" y2="18" /><line x1="18" y1="4" x2="4" y2="18" /></>
          ) : (
            <><line x1="3" y1="7" x2="19" y2="7" /><line x1="3" y1="12" x2="19" y2="12" /><line x1="3" y1="17" x2="19" y2="17" /></>
          )}
        </svg>
      </button>

      {/* Mobile menu dropdown */}
      {open && (
        <div
          className="absolute top-full left-0 right-0 flex flex-col gap-1 px-6 py-4 border-b border-white/[0.06] md:hidden"
          style={{ background: "rgba(8,8,12,0.95)", backdropFilter: "blur(20px)" }}
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-white/60 hover:text-white py-2 transition-colors"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="flex gap-3 pt-3 border-t border-white/10 mt-2">
            {mounted && isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex-1 text-center text-sm font-semibold text-[#00e5ff] border border-[#00e5ff]/40 py-2 rounded-lg hover:bg-[#00e5ff]/10 transition-all"
              >
                Logout
              </button>
            ) : mounted ? (
              <>
                <Link href="/login" className="flex-1 text-center text-sm text-white/60 border border-white/10 py-2 rounded-lg" onClick={() => setOpen(false)}>Login</Link>
                <Link href="/signup" className="flex-1 text-center text-sm font-semibold bg-[#00e5ff] text-black py-2 rounded-lg" onClick={() => setOpen(false)}>Get Started</Link>
              </>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
}
