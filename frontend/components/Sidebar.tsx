"use client";

import Link from "next/link";

import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  CheckSquare,
  BarChart3,
} from "lucide-react";

export default function Sidebar() {
  return (
    <div
  className="
  w-64
  h-screen
  bg-[#1B2730]
  border-r
  border-[#31414A]
  shadow-2xl
  flex
  flex-col
  "
>
      {/* Header */}
      <div className="p-6">
        <h1
          className="
          text-white
          text-2xl
          font-bold
          "
        >
          Services
        </h1>

        <p
          className="
          text-[#8696A0]
          text-sm
          mt-1
          "
        >
          Workforce Management
        </p>
      </div>

      {/* Menu */}
      <nav className="px-4 flex-1">

        {/* MAIN */}
        <p
          className="
          text-xs
          text-[#8696A0]
          uppercase
          tracking-wider
          mb-3
          "
        >
          Main
        </p>

        <Link
          href="/admin/dashboard"
          className="
          flex
          items-center
          gap-3
          px-4
          py-3
          rounded-xl
          bg-[#00A884]/10
          text-[#00A884]
          mb-6
          "
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        {/* WORKFORCE */}
        <p
          className="
          text-xs
          text-[#8696A0]
          uppercase
          tracking-wider
          mb-3
          "
        >
          Workforce
        </p>

        <div className="space-y-2 mb-6">

          <Link
            href="#"
            className="
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-xl
            text-[#E9EDEF]
            hover:bg-[#22313B]
            transition
            "
          >
            <Users size={18} />
            Employees
          </Link>

          <Link
            href="#"
            className="
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-xl
            text-[#E9EDEF]
            hover:bg-[#22313B]
            transition
            "
          >
            <ClipboardCheck size={18} />
            Attendance
          </Link>

        </div>

        {/* OPERATIONS */}
        <p
          className="
          text-xs
          text-[#8696A0]
          uppercase
          tracking-wider
          mb-3
          "
        >
          Operations
        </p>

        <div className="space-y-2">

          <Link
            href="#"
            className="
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-xl
            text-[#E9EDEF]
            hover:bg-[#22313B]
            transition
            "
          >
            <CheckSquare size={18} />
            Tasks
          </Link>

          <Link
            href="#"
            className="
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-xl
            text-[#E9EDEF]
            hover:bg-[#22313B]
            transition
            "
          >
            <BarChart3 size={18} />
            Reports
          </Link>

        </div>

      </nav>

      {/* Footer */}
      <div
        className="
        border-t
        border-[#2A3942]
        p-4
        "
      >
        <p
          className="
          text-[#8696A0]
          text-sm
          "
        >
          Admin Portal
        </p>

        <p
          className="
          text-[#00A884]
          text-xs
          mt-1
          "
        >
          Version 1.0
        </p>
      </div>
    </div>
  );
}