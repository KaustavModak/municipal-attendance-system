"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div
      className="
      min-h-screen
      bg-[#07141A]
      "
    >
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Dark Overlay */}
      {sidebarOpen && (
        <div
          className="
          fixed
          inset-0
          bg-black/50
          z-40
          "
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed
          top-0
          left-0
          h-screen
          z-50
          transform
          transition-transform
          duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}