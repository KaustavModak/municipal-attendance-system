"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardCard from "@/components/DashboardCard";

import api from "@/lib/api";
import toast from "react-hot-toast";

interface Task {
  id: number;
  title: string;
  description: string;
  employee_id: number;
  status: string;
  is_late: boolean;
}

interface Employee {
  id: number;
  name: string;
}

export default function TasksPage() {
  const router = useRouter();

  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [selectedStatus, setSelectedStatus] =
    useState("");

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const res = await api.get(
        "/tasks/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(res.data);
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load tasks"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await api.get(
        "/employees/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEmployees(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getEmployeeName = (
    employeeId: number
  ) => {
    const employee = employees.find(
      (e) => e.id === employeeId
    );

    return employee
      ? employee.name
      : `Employee #${employeeId}`;
  };

  const filteredTasks =
    tasks.filter((task) => {
      const matchesSearch =
        task.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesStatus =
        selectedStatus === "" ||
        task.status ===
          selectedStatus;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  const totalTasks =
    tasks.length;

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "completed"
    ).length;

  const pendingTasks =
    tasks.filter(
      (task) =>
        task.status !==
        "completed"
    ).length;

  const lateTasks =
    tasks.filter(
      (task) => task.is_late
    ).length;

  return (
    <ProtectedRoute allowedRole="admin">
      <DashboardLayout>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <div>

            <h1
              className="
              text-3xl
              font-bold
              text-white
              "
            >
              Tasks
            </h1>

            <p
              className="
              text-[#8696A0]
              mt-1
              "
            >
              Manage employee assignments.
            </p>

          </div>

          <button
            onClick={() =>
              router.push(
                "/admin/tasks/add"
              )
            }
            className="
            bg-[#00A884]
            hover:bg-[#029977]
            text-white
            px-5
            py-3
            rounded-xl
            font-semibold
            transition
            "
          >
            + Add Task
          </button>

        </div>

        {/* Summary Cards */}
        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
          mb-8
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
        <div
          className="
          flex
          flex-col
          lg:flex-row
          gap-4
          mb-8
          items-center
          "
        >

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
            flex-1
            w-full
            bg-[#1B2730]
            border
            border-[#2A3942]
            rounded-xl
            p-4
            text-white
            placeholder:text-[#8696A0]
            focus:outline-none
            focus:border-[#00A884]
            "
          />

          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(
                e.target.value
              )
            }
            className="
            w-full
            lg:w-56
            bg-[#1B2730]
            border
            border-[#2A3942]
            rounded-xl
            p-4
            text-white
            focus:outline-none
            focus:border-[#00A884]
            "
          >
            <option value="">
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
              setSelectedStatus("");
            }}
            className="
            w-full
            lg:w-auto
            px-6
            py-4
            bg-[#22313B]
            hover:bg-[#2A3942]
            text-white
            rounded-xl
            font-medium
            transition
            "
          >
            Reset Filters
          </button>

        </div>

        {/* Table */}
        <div
          className="
          bg-[#1B2730]
          border
          border-[#2A3942]
          rounded-2xl
          overflow-hidden
          "
        >

          <div
            className="
            grid
            grid-cols-5
            p-4
            border-b
            border-[#2A3942]
            text-[#8696A0]
            font-semibold
            "
          >
            <div>Task</div>
            <div>Employee</div>
            <div>Status</div>
            <div>Late</div>
            <div>Actions</div>
          </div>

          {loading && (
            <div
              className="
              p-6
              text-center
              text-[#8696A0]
              "
            >
              Loading tasks...
            </div>
          )}

          {!loading &&
            filteredTasks.length === 0 && (
              <div
                className="
                p-6
                text-center
                text-[#8696A0]
                "
              >
                No tasks found.
              </div>
            )}

          {!loading &&
            filteredTasks.map(
              (task) => (
                <div
                  key={task.id}
                  className="
                  grid
                  grid-cols-5
                  p-4
                  border-b
                  border-[#2A3942]
                  items-center
                  text-white
                  hover:bg-[#22313B]
                  transition
                  "
                >
                  <div>
                    {task.title}
                  </div>

                  <div>
                    {getEmployeeName(
                      task.employee_id
                    )}
                  </div>

                  <div>

                    <span
                      className={`
                      px-3
                      py-1
                      rounded-full
                      text-sm
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

                  </div>

                  <div>
                    {task.is_late
                      ? "Yes"
                      : "No"}
                  </div>

                  <div>

                    <button
                      onClick={() =>
                        router.push(
                          `/admin/tasks/${task.id}`
                        )
                      }
                      className="
                      px-3
                      py-1
                      rounded-lg
                      bg-[#22313B]
                      hover:bg-[#00A884]
                      transition
                      "
                    >
                      View
                    </button>

                  </div>

                </div>
              )
            )}

        </div>

      </DashboardLayout>
    </ProtectedRoute>
  );
}