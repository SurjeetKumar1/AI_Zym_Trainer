"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function MainLayoutClient({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar — passes collapsed state + toggle handler */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      {/* Content area — smoothly shifts as sidebar resizes */}
      <main
        className="flex-1 min-h-screen overflow-y-auto transition-all duration-300"
        style={{ marginLeft: collapsed ? "68px" : "256px" }}
      >
        {children}
      </main>
    </div>
  );
}
