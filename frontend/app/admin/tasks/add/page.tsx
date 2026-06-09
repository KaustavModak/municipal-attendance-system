"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";

import api from "@/lib/api";
import toast from "react-hot-toast";

export default function AddTaskPage() {
  const router = useRouter();

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [employeeId, setEmployeeId] =
    useState("");

  const [deadline, setDeadline] =
    useState("");

  const [employees, setEmployees] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

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

      const activeEmployees =
        res.data.filter(
          (employee: any) =>
            employee.status === "active"
        );

      setEmployees(activeEmployees);
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load employees"
      );
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !title ||
      !description ||
      !employeeId ||
      !deadline
    ) {
      toast.error(
        "Please fill all fields"
      );
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      await api.post(
        "/tasks/",
        {
          title,
          description,
          employee_id:
            Number(employeeId),
          deadline,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Task created successfully"
      );

      router.push(
        "/admin/tasks"
      );
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.detail ||
          "Failed to create task"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRole="admin">
      <DashboardLayout>

        <div className="max-w-3xl mx-auto">

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
                Create Task
              </h1>

              <p
                className="
                text-[#8696A0]
                mt-1
                "
              >
                Assign a new task to an employee.
              </p>
            </div>

            <button
              onClick={() =>
                router.push(
                  "/admin/tasks"
                )
              }
              className="
              px-4
              py-2
              rounded-xl
              border
              border-[#2A3942]
              text-white
              hover:border-[#00A884]
              transition
              "
            >
              ← Back
            </button>

          </div>

          {/* Form */}
          <form
        onSubmit={handleSubmit}
        className="
        bg-[#1B2730]
        border
        border-[#2A3942]
        hover:border-[#00A884]/40
        transition-all
        duration-300
        rounded-2xl
        p-8
        space-y-6
        "
        >

        {/* Title */}
        <div>

            <label
            className="
            block
            mb-2
            text-white
            "
            >
            Task Title
            <span className="text-red-400">
                {" "}*
            </span>
            </label>

            <input
            type="text"
            value={title}
            onChange={(e) =>
                setTitle(e.target.value)
            }
            placeholder="Enter task title"
            className="
            w-full
            bg-[#07141A]
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

        </div>

        {/* Description */}
        <div>

            <label
            className="
            block
            mb-2
            text-white
            "
            >
            Description
            <span className="text-red-400">
                {" "}*
            </span>
            </label>

            <textarea
            value={description}
            onChange={(e) =>
                setDescription(
                e.target.value
                )
            }
            rows={5}
            placeholder="Enter task description"
            className="
            w-full
            bg-[#07141A]
            border
            border-[#2A3942]
            rounded-xl
            p-4
            text-white
            placeholder:text-[#8696A0]
            resize-none
            focus:outline-none
            focus:border-[#00A884]
            "
            />

        </div>

        {/* Employee */}
        <div>

            <label
            className="
            block
            mb-2
            text-white
            "
            >
            Assign Employee
            <span className="text-red-400">
                {" "}*
            </span>
            </label>

            <select
            value={employeeId}
            onChange={(e) =>
                setEmployeeId(
                e.target.value
                )
            }
            className="
            w-full
            bg-[#07141A]
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
                Select Employee
            </option>

            {employees.map(
                (employee) => (
                <option
                    key={employee.id}
                    value={employee.id}
                >
                    {employee.name}
                </option>
                )
            )}
            </select>

        </div>

        {/* Deadline */}
        <div>

            <label
            className="
            block
            mb-2
            text-white
            "
            >
            Deadline
            <span className="text-red-400">
                {" "}*
            </span>
            </label>

            <input
            type="datetime-local"
            value={deadline}
            onChange={(e) =>
                setDeadline(
                e.target.value
                )
            }
            className="
            w-full
            bg-[#07141A]
            border
            border-[#2A3942]
            rounded-xl
            p-4
            text-white
            focus:outline-none
            focus:border-[#00A884]
            "
            />

        </div>

        {/* Submit */}
        <button
            type="submit"
            disabled={loading}
            className="
            w-full
            bg-[#00A884]
            hover:bg-[#029977]
            text-white
            font-semibold
            py-4
            rounded-xl
            transition
            disabled:opacity-50
            "
        >
            {loading
            ? "Creating Task..."
            : "Create Task"}
        </button>

        </form>

        </div>

      </DashboardLayout>
    </ProtectedRoute>
  );
}