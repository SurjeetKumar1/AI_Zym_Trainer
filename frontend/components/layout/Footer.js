import Link from "next/link";

/**
 * Footer — multi-column layout with logo, nav links, and credit.
 */
export default function Footer() {
  const columns = [
    {
      heading: "Product",
      links: [
        { label: "How It Works",  href: "#how-it-works" },
        { label: "Features",      href: "#features" },
        { label: "Changelog",     href: "#" },
      ],
    },
    {
      heading: "Exercises",
      links: [
        { label: "Squat Tracker",    href: "#" },
        { label: "Deadlift Tracker", href: "#" },
        { label: "Push-up Tracker",  href: "#" },
        { label: "Pull-up Tracker",  href: "#" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About",    href: "#" },
        { label: "Blog",     href: "#" },
        { label: "Contact",  href: "#" },
        { label: "Privacy",  href: "#" },
      ],
    },
  ];

  return (
    <footer
      className="border-t border-white/[0.07]"
      style={{ background: "#08080c" }}
    >
      {/* ── Main grid ── */}
      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">

        {/* Brand column */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-black text-white tracking-tight">
            AI<span className="text-[#00e5ff]">Zym</span>
          </Link>

          {/* Tagline */}
          <p className="text-sm text-white/40 leading-relaxed max-w-[200px]">
            Your AI-powered personal trainer. Train smarter, not harder.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3 mt-1">
            {/* Twitter / X */}
            <a
              href="#"
              aria-label="Twitter"
              className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors"
            >
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="#"
              aria-label="Instagram"
              className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors"
            >
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="#"
              aria-label="GitHub"
              className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors"
            >
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </div>
        </div>

        {/* Nav columns */}
        {columns.map(({ heading, links }) => (
          <div key={heading} className="flex flex-col gap-4">
            <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">
              {heading}
            </p>
            <ul className="flex flex-col gap-3">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/25">
            © 2026 AIZym. All rights reserved.
          </p>
          <p className="text-xs text-white/25">
            Crafted with ❤️ by{" "}
            <span className="text-[#00e5ff] font-bold tracking-wide">SURJEET</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
