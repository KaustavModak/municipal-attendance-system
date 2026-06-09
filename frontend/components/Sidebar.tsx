"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  CheckSquare,
  BarChart3,
  Building2,
  History,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const [role, setRole] =
    useState<string | null>(null);

    useEffect(() => {
    setRole(
        localStorage.getItem("role")
    );
    }, []);

  const isAdmin = role === "admin";
  if (!role) {
    return null;
    }
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
      <div className="px-6 pt-7 pb-6">
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
          mt-2
          "
        >
          Workforce Management
        </p>
      </div>

      <nav
        className="
        flex-1
        px-4
        overflow-y-auto
        "
      >
        {/* MAIN */}
        <div className="mb-6">
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
            href={
              isAdmin
                ? "/admin/dashboard"
                : "/employee/dashboard"
            }
            className={`
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              transition-all
              duration-200
              ${
                pathname.includes("/dashboard")
                  ? "bg-[#00A884]/15 text-[#00A884]"
                  : "text-[#E9EDEF] hover:bg-[#00A884]/10 hover:text-[#00A884]"
              }
            `}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
        </div>

        {isAdmin ? (
          <>
            {/* WORKFORCE */}
            <div className="mb-6">
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

              <div className="space-y-2">
                <Link
                  href="/admin/employees"
                  className={`
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-xl
                    transition-all
                    duration-200
                    ${
                      pathname.startsWith(
                        "/admin/employees"
                      )
                        ? "bg-[#00A884]/15 text-[#00A884]"
                        : "text-[#E9EDEF] hover:bg-[#00A884]/10 hover:text-[#00A884]"
                    }
                  `}
                >
                  <Users size={18} />
                  Employees
                </Link>

                <Link
                  href="/admin/attendance"
                  className={`
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-xl
                    transition-all
                    duration-200
                    ${
                      pathname.startsWith(
                        "/admin/attendance"
                      )
                        ? "bg-[#00A884]/15 text-[#00A884]"
                        : "text-[#E9EDEF] hover:bg-[#00A884]/10 hover:text-[#00A884]"
                    }
                  `}
                >
                  <ClipboardCheck size={18} />
                  Attendance
                </Link>

                <Link
                  href="/admin/offices"
                  className={`
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-xl
                    transition-all
                    duration-200
                    ${
                      pathname.startsWith(
                        "/admin/offices"
                      )
                        ? "bg-[#00A884]/15 text-[#00A884]"
                        : "text-[#E9EDEF] hover:bg-[#00A884]/10 hover:text-[#00A884]"
                    }
                  `}
                >
                  <Building2 size={18} />
                  Offices
                </Link>
              </div>
            </div>

            {/* OPERATIONS */}
            <div>
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
                  href="/admin/tasks"
                  className={`
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-xl
                    transition-all
                    duration-200
                    ${
                      pathname.startsWith(
                        "/admin/tasks"
                      )
                        ? "bg-[#00A884]/15 text-[#00A884]"
                        : "text-[#E9EDEF] hover:bg-[#00A884]/10 hover:text-[#00A884]"
                    }
                  `}
                >
                  <CheckSquare size={18} />
                  Tasks
                </Link>

                <Link
                  href="/admin/reports"
                  className={`
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-xl
                    transition-all
                    duration-200
                    ${
                      pathname.startsWith(
                        "/admin/reports"
                      )
                        ? "bg-[#00A884]/15 text-[#00A884]"
                        : "text-[#E9EDEF] hover:bg-[#00A884]/10 hover:text-[#00A884]"
                    }
                  `}
                >
                  <BarChart3 size={18} />
                  Reports
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* EMPLOYEE */}
            <div>
              <p
                className="
                text-xs
                text-[#8696A0]
                uppercase
                tracking-wider
                mb-3
                "
              >
                Employee
              </p>

              <div className="space-y-2">
                <Link
                  href="/employee/attendance"
                  className={`
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-xl
                    transition-all
                    duration-200
                    ${
                      pathname.startsWith(
                        "/employee/attendance"
                      )
                        ? "bg-[#00A884]/15 text-[#00A884]"
                        : "text-[#E9EDEF] hover:bg-[#00A884]/10 hover:text-[#00A884]"
                    }
                  `}
                >
                  <ClipboardCheck size={18} />
                  Attendance
                </Link>

                <Link
                  href="/employee/tasks"
                  className={`
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-xl
                    transition-all
                    duration-200
                    ${
                      pathname.startsWith(
                        "/employee/tasks"
                      )
                        ? "bg-[#00A884]/15 text-[#00A884]"
                        : "text-[#E9EDEF] hover:bg-[#00A884]/10 hover:text-[#00A884]"
                    }
                  `}
                >
                  <CheckSquare size={18} />
                  My Tasks
                </Link>

                <Link
                  href="/employee/history"
                  className={`
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-xl
                    transition-all
                    duration-200
                    ${
                      pathname.startsWith(
                        "/employee/history"
                      )
                        ? "bg-[#00A884]/15 text-[#00A884]"
                        : "text-[#E9EDEF] hover:bg-[#00A884]/10 hover:text-[#00A884]"
                    }
                  `}
                >
                  <History size={18} />
                  History
                </Link>
              </div>
            </div>
          </>
        )}
      </nav>

      <div
        className="
        border-t
        border-[#2A3942]
        px-5
        py-4
        "
      >
        <p
          className="
          text-[#8696A0]
          text-sm
          "
        >
          {isAdmin
            ? "Admin Portal"
            : "Employee Portal"}
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