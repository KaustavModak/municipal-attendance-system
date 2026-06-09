"use client";

import { useEffect, useState } from "react";

import api from "@/lib/api";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardCard from "@/components/DashboardCard";

import { getGreeting } from "@/lib/greeting";

interface DashboardData {
  today_attendance: string;
  pending_tasks: number;
  completed_tasks: number;
  late_tasks: number;
}

export default function EmployeeDashboard() {
  const [name, setName] =
    useState("");

  const [stats, setStats] =
    useState<DashboardData>({
      today_attendance: "",
      pending_tasks: 0,
      completed_tasks: 0,
      late_tasks: 0,
    });

  useEffect(() => {
    const storedName =
      localStorage.getItem("name");

    if (storedName) {
      setName(storedName);
    }

    fetchDashboard();
  }, []);

  const fetchDashboard =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await api.get(
            "/dashboard/",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setStats(
          res.data
        );
      } catch (error) {
        console.error(
          error
        );
      }
    };

  const attendanceLabel =
    stats.today_attendance ===
    "not_marked"
      ? "Not Marked Yet"
      : stats.today_attendance
          ?.replaceAll("_", " ")
          ?.replace(
            /\b\w/g,
            (c) =>
              c.toUpperCase()
          );

  return (
    <ProtectedRoute allowedRole="employee">

      <DashboardLayout>

        <div className="mb-10">

          <h1
            className="
            text-3xl
            font-bold
            text-white
            "
          >
            {getGreeting()}, {name}
          </h1>

          <p
            className="
            mt-1
            text-lg
            text-[#8696A0]
            "
          >
            Here's your summary:
          </p>

          <div
            className="
            mt-10
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-2
            gap-6
            "
          >

            <DashboardCard
              title="Pending Tasks"
              value={
                stats.pending_tasks
              }
            />

            <DashboardCard
              title="Completed Tasks"
              value={
                stats.completed_tasks
              }
            />

            <DashboardCard
              title="Late Tasks"
              value={
                stats.late_tasks
              }
            />

            <div
              className="
              bg-[#1B2730]
              border
              border-[#2A3942]
              rounded-2xl
              p-5
              shadow-lg

              hover:border-[#00A884]
              hover:shadow-[0_0_20px_rgba(0,168,132,0.15)]
              hover:-translate-y-1

              transition-all
              duration-300
              cursor-pointer
              "
            >

              <p
                className="
                text-[#8696A0]
                text-lg
                "
              >
                Attendance Today
              </p>

              <h2
                className="
                text-white
                text-2xl
                font-bold
                mt-5
                break-words
                "
              >
                {attendanceLabel}
              </h2>

            </div>

          </div>

        </div>

      </DashboardLayout>

    </ProtectedRoute>
  );
}