"use client";

import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardCard from "@/components/DashboardCard";

import api from "@/lib/api";
import toast from "react-hot-toast";

export default function ReportsPage() {
  const [employees, setEmployees] =
    useState<any[]>([]);

  const [tasks, setTasks] =
    useState<any[]>([]);

  const [attendanceSummary, setAttendanceSummary] =
    useState({
      total_employees: 0,
      present: 0,
      late: 0,
      marked_absent: 0,
      not_marked: 0,
    });

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [
        employeesRes,
        tasksRes,
        attendanceRes,
        datesRes,
        ] = await Promise.all([
        api.get("/employees/", {
            headers,
        }),

        api.get("/tasks/", {
            headers,
        }),

        api.get(
            "/attendance/today",
            {
            headers,
            }
        ),

        api.get(
            "/reports/dates",
            {
            headers,
            }
        ),
        ]);

      setEmployees(
        employeesRes.data
      );

      setTasks(tasksRes.data);

      setAttendanceSummary(
        attendanceRes.data
      );
      setReportDates(
        datesRes.data
        );

        if (
        datesRes.data.length > 0
        ) {
        setSelectedDate(
            datesRes.data[0].date
        );
        }
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load reports"
      );
    } finally {
      setLoading(false);
    }
  };

  const activeEmployees =
    employees.filter(
      (employee) =>
        employee.status ===
        "active"
    ).length;

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

  const getEmployeeName = (
    employeeId: number
  ) => {
    const employee =
      employees.find(
        (e) => e.id === employeeId
      );

    return (
      employee?.name ||
      "Unknown Employee"
    );
  };

  const recentTasks = [...tasks]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);
  const downloadReport =
    async () => {

        if (!selectedDate) {
        toast.error(
            "Please select a date"
        );
        return;
        }

        try {

        setDownloading(true);

        const token =
            localStorage.getItem("token");

        let endpoint = "";

        if (
            reportType ===
            "attendance"
        ) {
            endpoint =
            `/reports/attendance/${selectedDate}`;
        }

        if (
            reportType ===
            "tasks"
        ) {
            endpoint =
            `/reports/tasks/${selectedDate}`;
        }

        if (
            reportType ===
            "summary"
        ) {
            endpoint =
            `/reports/summary/${selectedDate}`;
        }

        const response =
            await api.get(
            endpoint,
            {
                responseType:
                "blob",

                headers: {
                Authorization:
                    `Bearer ${token}`,
                },
            }
            );

        const url =
            window.URL.createObjectURL(
            new Blob([
                response.data,
            ])
            );

        const link =
            document.createElement(
            "a"
            );

        link.href = url;

        link.download =
            `${reportType}_${selectedDate}.xlsx`;

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();

        toast.success(
            "Report downloaded"
        );

        } catch (error) {

        console.error(error);

        toast.error(
            "Download failed"
        );

        } finally {

        setDownloading(false);

        }
    };
  const [reportDates, setReportDates] =
  useState<any[]>([]);

  const [selectedDate, setSelectedDate] =
  useState("");

  const [reportType, setReportType] =
  useState("attendance");

  const [downloading, setDownloading] =
  useState(false);

  return (
    <ProtectedRoute allowedRole="admin">
      <DashboardLayout>

        {/* Header */}
        <div className="mb-8">

          <h1
            className="
            text-3xl
            font-bold
            text-white
            "
          >
            Reports
          </h1>

          <p
            className="
            text-[#8696A0]
            mt-1
            "
          >
            Workforce analytics and summary.
          </p>

        </div>

        {/* Top Cards */}
        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
          mb-8
          "
        >

          <DashboardCard
            title="Active Employees"
            value={activeEmployees}
          />

          <DashboardCard
            title="Total Tasks"
            value={tasks.length}
          />

        </div>

        {/* Attendance + Tasks */}
        <div
          className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
          mb-8
          "
        >

          {/* Attendance */}
          <div
            className="
            bg-[#1B2730]
            border
            border-[#2A3942]
            rounded-2xl
            p-6
            "
          >

            <h2
              className="
              text-xl
              font-semibold
              text-white
              mb-6
              "
            >
              Today's Attendance
            </h2>

            <div
              className="
              grid
              grid-cols-2
              gap-6
              "
            >

              <div>
                <p className="text-[#8696A0]">
                  Present
                </p>

                <p className="text-green-400 text-3xl font-bold">
                  {
                    attendanceSummary.present
                  }
                </p>
              </div>

              <div>
                <p className="text-[#8696A0]">
                  Late
                </p>

                <p className="text-yellow-400 text-3xl font-bold">
                  {
                    attendanceSummary.late
                  }
                </p>
              </div>

              <div>
                <p className="text-[#8696A0]">
                  Absent
                </p>

                <p className="text-red-400 text-3xl font-bold">
                  {
                    attendanceSummary.marked_absent
                  }
                </p>
              </div>

              <div>
                <p className="text-[#8696A0]">
                  Not Marked
                </p>

                <p className="text-white text-3xl font-bold">
                  {
                    attendanceSummary.not_marked
                  }
                </p>
              </div>

            </div>

          </div>

          {/* Task Statistics */}
          <div
            className="
            bg-[#1B2730]
            border
            border-[#2A3942]
            rounded-2xl
            p-6
            "
          >

            <h2
              className="
              text-xl
              font-semibold
              text-white
              mb-6
              "
            >
              Task Statistics
            </h2>

            <div
              className="
              grid
              grid-cols-3
              gap-4
              "
            >

              <div>
                <p className="text-[#8696A0]">
                  Completed
                </p>

                <p className="text-green-400 text-3xl font-bold">
                  {completedTasks}
                </p>
              </div>

              <div>
                <p className="text-[#8696A0]">
                  Pending
                </p>

                <p className="text-yellow-400 text-3xl font-bold">
                  {pendingTasks}
                </p>
              </div>

              <div>
                <p className="text-[#8696A0]">
                  Late
                </p>

                <p className="text-red-400 text-3xl font-bold">
                  {lateTasks}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Recent Tasks Timeline */}
        <div
          className="
          bg-[#1B2730]
          border
          border-[#2A3942]
          rounded-2xl
          p-6
          "
        >

          <h2
            className="
            text-xl
            font-semibold
            text-white
            mb-6
            "
          >
            Recent Tasks
          </h2>

          {loading ? (

            <div className="text-[#8696A0]">
              Loading...
            </div>

          ) : recentTasks.length === 0 ? (

            <div className="text-[#8696A0]">
              No tasks found.
            </div>

          ) : (

            <div className="space-y-5">

              {recentTasks.map(
                (task) => (

                  <div
                    key={task.id}
                    className="
                    flex
                    items-start
                    gap-4
                    "
                  >

                    <div
                      className={`
                      w-3
                      h-3
                      rounded-full
                      mt-2
                      flex-shrink-0
                      ${
                        task.status ===
                        "completed"
                          ? "bg-green-400"
                          : "bg-yellow-400"
                      }
                      `}
                    />

                    <div className="flex-1">

                      <div
                        className="
                        flex
                        justify-between
                        items-start
                        "
                      >

                        <div>

                          <p
                            className="
                            text-white
                            font-medium
                            "
                          >
                            {task.title}
                          </p>

                          <p
                            className="
                            text-[#8696A0]
                            text-sm
                            mt-1
                            "
                          >
                            Assigned to{" "}
                            {
                              getEmployeeName(
                                task.employee_id
                              )
                            }
                          </p>

                        </div>

                        <span
                          className={`
                          px-3
                          py-1
                          rounded-full
                          text-xs
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

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>
          <div
        className="
        mt-8
        bg-[#1B2730]
        border
        border-[#2A3942]
        rounded-2xl
        p-6
        "
        >

        <h2
            className="
            text-xl
            font-semibold
            text-white
            mb-6
            "
        >
            Historical Reports
        </h2>

        <p
            className="
            text-[#8696A0]
            mb-6
            "
        >
            Download attendance,
            task or summary reports
            for any available date.
        </p>

        <div
            className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-4
            "
        >

            <select
            value={selectedDate}
            onChange={(e) =>
                setSelectedDate(
                e.target.value
                )
            }
            className="
            bg-[#07141A]
            border
            border-[#2A3942]
            rounded-xl
            p-4
            text-white
            "
            >
            {reportDates.map(
                (item) => (
                <option
                    key={item.date}
                    value={item.date}
                >
                    {item.date}
                </option>
                )
            )}
            </select>

            <select
            value={reportType}
            onChange={(e) =>
                setReportType(
                e.target.value
                )
            }
            className="
            bg-[#07141A]
            border
            border-[#2A3942]
            rounded-xl
            p-4
            text-white
            "
            >
            <option value="attendance">
                Attendance Report
            </option>

            <option value="tasks">
                Task Report
            </option>

            <option value="summary">
                Summary Report
            </option>
            </select>

        </div>

        <button
            onClick={
            downloadReport
            }
            disabled={
            downloading
            }
            className="
            mt-6
            bg-[#00A884]
            hover:bg-[#029977]
            disabled:opacity-50
            text-white
            px-6
            py-3
            rounded-xl
            font-semibold
            transition
            "
        >
            {downloading
            ? "Downloading..."
            : "Download Excel Report"}
        </button>

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}