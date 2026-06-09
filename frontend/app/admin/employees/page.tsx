"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";

import api from "@/lib/api";
import toast from "react-hot-toast";

interface Employee {
  id: number;
  name: string;
  phone: string;
  office_id: number;
  status: string;
}

export default function EmployeesPage() {
  const router = useRouter();

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [offices, setOffices] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const [selectedOffice, setSelectedOffice] =
    useState("");

  const [selectedStatus, setSelectedStatus] =
  useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchOffices();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);

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

      toast.error(
        "Failed to load employees"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchOffices = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await api.get(
        "/offices/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOffices(res.data);
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load offices"
      );
    }
  };

  const getOfficeName = (
    officeId: number
  ) => {
    const office = offices.find(
      (o) => o.id === officeId
    );

    return office
      ? office.office_name
      : "Unknown Office";
  };

  const filteredEmployees =
  employees.filter((employee) => {

    const matchesSearch =
      employee.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        );

    const matchesOffice =
      selectedOffice === "" ||
      employee.office_id ===
        Number(selectedOffice);

    const matchesStatus =
      selectedStatus === "" ||
      employee.status ===
        selectedStatus;

    return (
      matchesSearch &&
      matchesOffice &&
      matchesStatus
    );
  });

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
              Employees
            </h1>

            <p
              className="
              text-[#8696A0]
              mt-1
              "
            >
              Manage workforce records.
            </p>
          </div>

          <button
            onClick={() =>
              router.push(
                "/admin/employees/add"
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
            + Add Employee
          </button>

        </div>

        {/* Search + Filter */}
       <div
        className="
        flex
        flex-col
        lg:flex-row
        gap-4
        "
        >

        {/* Search */}
        <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) =>
            setSearch(e.target.value)
            }
            className="
            flex-1
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

        {/* Office Filter */}
        <select
            value={selectedOffice}
            onChange={(e) =>
            setSelectedOffice(
                e.target.value
            )
            }
            className="
            w-full
            lg:w-64
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
            All Offices
            </option>

            {offices.map((office) => (
            <option
                key={office.id}
                value={office.id}
            >
                {office.office_name}
            </option>
            ))}
        </select>

        {/* Status Filter */}
        <select
            value={selectedStatus}
            onChange={(e) =>
            setSelectedStatus(
                e.target.value
            )
            }
            className="
            w-full
            lg:w-52
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

            <option value="active">
            Active
            </option>

            <option value="inactive">
            Inactive
            </option>
        </select>
                <button
        onClick={() => {
            setSearch("");
            setSelectedOffice("");
            setSelectedStatus("");
        }}
        className="
        px-5
        py-4
        rounded-xl
        border
        border-[#2A3942]
        text-white
        hover:border-[#00A884]
        hover:text-[#00A884]
        transition
        "
        >
        Reset
        </button>
        </div>

        {/* Table */}
        <div
          className="
          mt-8
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
            <div>Name</div>
            <div>Phone</div>
            <div>Office</div>
            <div>Status</div>
            <div className="text-center">Actions</div>
          </div>

          {loading && (
            <div
              className="
              p-6
              text-center
              text-[#8696A0]
              "
            >
              Loading employees...
            </div>
          )}

          {!loading &&
            filteredEmployees.length === 0 && (
              <div
                className="
                p-6
                text-center
                text-[#8696A0]
                "
              >
                No employees found.
              </div>
            )}

          {!loading &&
            filteredEmployees.map(
              (employee) => (
                <div
                  key={employee.id}
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
                    {employee.name}
                  </div>

                  <div>
                    {employee.phone}
                  </div>

                  <div>
                    {getOfficeName(
                      employee.office_id
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
                        employee.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }
                        `}
                    >
                      {employee.status}
                    </span>
                  </div>

                  <div
                    className="
                    flex
                    justify-center
                    gap-2
                    "
                    >

                    <button
                        onClick={() =>
                            router.push(
                            `/admin/employees/${employee.id}`
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