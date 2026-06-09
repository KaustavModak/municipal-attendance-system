"use client";

import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardCard from "@/components/DashboardCard";

import api from "@/lib/api";
import toast from "react-hot-toast";

export default function AttendancePage() {
  const [summary, setSummary] = useState({
    total_employees: 0,
    present: 0,
    late: 0,
    marked_absent: 0,
    not_marked: 0,
  });

  const [attendance, setAttendance] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [selectedStatus, setSelectedStatus] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [employees, setEmployees] =
    useState<any[]>([]);

  const [employeeId, setEmployeeId] =
    useState("");

  const [status, setStatus] =
    useState("present");

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const summaryRes =
        await api.get(
          "/attendance/today",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const detailsRes =
        await api.get(
          "/attendance/today/details",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setSummary(summaryRes.data);

      setAttendance(
        detailsRes.data
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load attendance"
      );
    } finally {
      setLoading(false);
    }
  };
  const formatStatus = (
    status: string
    ) => {
    return status
        .replaceAll("_", " ")
        .replace(
        /\b\w/g,
        (c) => c.toUpperCase()
        );
    };
  const filteredAttendance =
    attendance.filter((record) => {
      const matchesSearch =
        record.employee_name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesStatus =
        selectedStatus === "" ||
        record.status ===
          selectedStatus;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
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
    const handleManualAttendance =
        async () => {

            if (!employeeId) {
            toast.error(
                "Select employee"
            );
            return;
            }

            try {

            const token =
                localStorage.getItem("token");

            await api.post(
                "/attendance/manual",
                {
                employee_id:
                    Number(employeeId),
                status,
                },
                {
                headers: {
                    Authorization:
                    `Bearer ${token}`,
                },
                }
            );

            toast.success(
                "Attendance marked"
            );

            setShowModal(false);

            setEmployeeId("");

            setStatus("present");

            fetchAttendance();

            } catch (error) {

            console.error(error);

            toast.error(
                "Failed to mark attendance"
            );

            }
        };
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
              Attendance
            </h1>

            <p
            className="
            text-[#8696A0]
            mt-1
            "
            >
            {attendance.length} records today
            </p>

          </div>

          <button
            onClick={() =>
                setShowModal(true)
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
            + Manual Attendance
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
            title="Present"
            value={summary.present}
          />

          <DashboardCard
            title="Late"
            value={summary.late}
          />

          <DashboardCard
            title="Absent"
            value={summary.marked_absent}
          />

          <DashboardCard
            title="Not Marked"
            value={summary.not_marked}
          />

        </div>

        {/* Search + Filters */}
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
            placeholder="Search employee..."
            value={search}
            onChange={(e) =>
            setSearch(e.target.value)
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

            <option value="present">
            Present
            </option>

            <option value="late">
            Late
            </option>

            <option value="absent">
            Absent
            </option>

            <option value="not_marked">
            Not Marked
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

        {/* Attendance Table */}
        <div
          className="
          bg-[#1B2730]
          border
          border-[#2A3942]
          rounded-2xl
          overflow-hidden
          "
        >

          {/* Header */}
          <div
            className="
            grid
            grid-cols-2
            p-4
            border-b
            border-[#2A3942]
            text-[#8696A0]
            font-semibold
            "
          >
            <div>Employee Name</div>
            <div>Status</div>
          </div>

          {/* Loading */}
          {loading && (
            <div
              className="
              p-6
              text-center
              text-[#8696A0]
              "
            >
              Loading attendance...
            </div>
          )}

          {/* Empty */}
          {!loading &&
            filteredAttendance.length === 0 && (
              <div
                className="
                p-6
                text-center
                text-[#8696A0]
                "
              >
                No attendance records found.
              </div>
            )}

          {/* Rows */}
          {!loading &&
            filteredAttendance.map(
              (
                record,
                index
              ) => (
                <div
                  key={index}
                  className="
                  grid
                  grid-cols-2
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
                    {
                      record.employee_name
                    }
                  </div>

                  <div>
                    <span
                      className={`
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      ${
                        record.status ===
                        "present"
                          ? "bg-green-500/20 text-green-400"
                          : record.status ===
                            "late"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : record.status ===
                            "absent"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-gray-500/20 text-gray-300"
                      }
                      `}
                    >
                      {formatStatus(
                        record.status
                        )}
                    </span>
                  </div>

                </div>
              )
            )}

        </div>
      {showModal && (

    <div
        className="
        fixed
        inset-0
        bg-black/60
        flex
        items-center
        justify-center
        z-50
        "
    >

        <div
        className="
        bg-[#1B2730]
        border
        border-[#2A3942]
        rounded-2xl
        p-8
        w-full
        max-w-md
        "
        >

        <h2
            className="
            text-white
            text-2xl
            font-bold
            mb-6
            "
        >
            Manual Attendance
        </h2>

        <div className="space-y-4">

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
            "
            >
            <option value="">
                Select Employee
            </option>

            {employees
            .filter(
                (employee) =>
                employee.status === "active"
            )
            .map((employee) => (
                <option
                key={employee.id}
                value={employee.id}
                >
                {employee.name}
                </option>
            ))}
            </select>

            <select
            value={status}
            onChange={(e) =>
                setStatus(
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
            "
            >
            <option value="present">
                Present
            </option>

            <option value="late">
                Late
            </option>

            <option value="absent">
                Absent
            </option>

            </select>

        </div>

        <div
            className="
            flex
            gap-3
            mt-6
            "
        >

            <button
            onClick={() =>
                setShowModal(false)
            }
            className="
            flex-1
            bg-[#22313B]
            text-white
            py-3
            rounded-xl
            "
            >
            Cancel
            </button>

            <button
            onClick={
                handleManualAttendance
            }
            className="
            flex-1
            bg-[#00A884]
            hover:bg-[#029977]
            text-white
            py-3
            rounded-xl
            font-semibold
            "
            >
            Mark
            </button>

        </div>

        </div>

    </div>

    )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}