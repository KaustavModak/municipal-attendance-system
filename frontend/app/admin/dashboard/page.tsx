"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardCard from "@/components/DashboardCard";

import { getGreeting } from "@/lib/greeting";

export default function AdminDashboard() {

  const [name, setName] =
    useState("");

  const [stats, setStats] = useState({
    total_employees: 0,
    present_today: 0,
    late_today: 0,
    absent_today: 0,
    not_marked_today: 0,
    pending_tasks: 0,
    completed_tasks: 0,
  });

  useEffect(() => {

    const storedName =
      localStorage.getItem("name");

    if (storedName) {
      setName(storedName);
    }

    fetchDashboard();

  }, []);

  const fetchDashboard = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await api.get(
        "/admin/dashboard/",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setStats(res.data);

    } catch (error) {

      console.error(error);

    }

  };

  return (
    <ProtectedRoute allowedRole="admin">

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
            Here's today's summary.
          </p>

          <div
            className="
            mt-10
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-6
            "
          >

            <DashboardCard
              title="Employees"
              value={stats.total_employees}
            />

            <DashboardCard
              title="Present Today"
              value={stats.present_today}
            />

            <DashboardCard
              title="Late Today"
              value={stats.late_today}
            />

            <DashboardCard
              title="Not Marked"
              value={stats.not_marked_today}
            />

            <DashboardCard
              title="Pending Tasks"
              value={stats.pending_tasks}
            />

            <DashboardCard
              title="Completed Tasks"
              value={stats.completed_tasks}
            />

          </div>

        </div>

      </DashboardLayout>

    </ProtectedRoute>
  );
}