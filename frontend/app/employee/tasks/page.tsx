"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import api from "@/lib/api";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardCard from "@/components/DashboardCard";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  is_late: boolean;
}

export default function EmployeeTasksPage() {

  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res =
        await api.get(
          "/tasks/my/tasks",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setTasks(res.data);

    } catch (error) {

      console.error(error);

    }
  };

  const filteredTasks =
    [...tasks]
        .reverse()
        .filter((task) => {

      const matchesSearch =
        task.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesStatus =
        statusFilter === "all"
          ? true
          : task.status ===
            statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  const totalTasks =
    tasks.length;

  const pendingTasks =
    tasks.filter(
      (t) =>
        t.status === "pending"
    ).length;

  const completedTasks =
    tasks.filter(
      (t) =>
        t.status === "completed"
    ).length;

  const lateTasks =
    tasks.filter(
      (t) =>
        t.is_late
    ).length;

  return (
    <ProtectedRoute allowedRole="employee">

      <DashboardLayout>

        <div>

          <h1
            className="
            text-3xl
            font-bold
            text-white
            "
          >
            My Tasks
          </h1>

          <p
            className="
            text-lg
            text-[#8696A0]
            mt-1
            "
          >
            View assigned work.
          </p>

          <div
            className="
            mt-10
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
            "
          >

            <DashboardCard
              title="Total Tasks"
              value={totalTasks}
            />

            <DashboardCard
              title="Pending"
              value={pendingTasks}
            />

            <DashboardCard
              title="Completed"
              value={completedTasks}
            />

            <DashboardCard
              title="Late"
              value={lateTasks}
            />

          </div>

          {/* Filters */}

          <div className="mt-8 space-y-4">

            <input
              type="text"
              placeholder="Search task..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="
              w-full
              bg-[#1B2730]
              border
              border-[#2A3942]
              rounded-xl
              px-4
              py-4
              text-white
              "
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="
              w-full
              bg-[#1B2730]
              border
              border-[#2A3942]
              rounded-xl
              px-4
              py-4
              text-white
              "
            >
              <option value="all">
                All Status
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="completed">
                Completed
              </option>
            </select>

            <button
              onClick={() => {
                setSearch("");
                setStatusFilter(
                  "all"
                );
              }}
              className="
              w-full
              bg-[#22313B]
              text-white
              rounded-xl
              py-4
              "
            >
              Reset Filters
            </button>

          </div>

          {/* Table */}

          <div
            className="
            mt-8
            overflow-x-auto
            bg-[#1B2730]
            border
            border-[#2A3942]
            rounded-2xl
            "
          >

            <table className="w-full">

              <thead
                className="
                bg-[#22313B]
                "
                >

                <tr
                  className="
                  border-b
                  border-[#2A3942]
                  "
                >

                  <th className="text-left p-5 text-[#8696A0]">
                    Task
                  </th>

                  <th className="text-left p-5 text-[#8696A0]">
                    Status
                  </th>

                  <th className="text-left p-5 text-[#8696A0]">
                    Late
                  </th>

                  <th className="text-left p-5 text-[#8696A0]">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredTasks.map(
                  (task) => (
                    <tr
                    key={task.id}
                    className="
                    border-b
                    border-[#2A3942]
                    hover:bg-[#22313B]
                    transition-all
                    duration-200
                    "
                    >

                      <td className="p-5 text-white">
                        {task.title}
                      </td>

                      <td className="p-5">
                        <span
                            className={`
                            px-4
                            py-1
                            rounded-full
                            text-sm
                            font-medium

                            ${
                                task.status ===
                                "completed"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }
                            `}
                        >
                            {task.status}
                        </span>

                        </td>
                      <td className="p-5 text-white">
                        {task.is_late
                          ? "Yes"
                          : "No"}
                      </td>

                      <td className="p-5">

                        <Link
                        href={`/employee/tasks/${task.id}`}
                        className="
                        px-5
                        py-2
                        rounded-xl

                        bg-[#22313B]
                        text-white

                        hover:bg-[#00A884]
                        hover:text-white

                        transition-all
                        duration-200
                        "
                        >
                        View
                        </Link>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </DashboardLayout>

    </ProtectedRoute>
  );
}