"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

export default function EmployeeDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [employee, setEmployee] =
    useState<Employee | null>(null);

  const [offices, setOffices] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showStatusModal, setShowStatusModal] =
   useState(false);

  const [selectedEmployee, setSelectedEmployee] =
   useState<any>(null);

  useEffect(() => {
    fetchEmployee();
    fetchOffices();
  }, []);

  const fetchEmployee = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await api.get(
        `/employees/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEmployee(res.data);
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load employee"
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

  const handleStatusChange =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const newStatus =
          employee?.status ===
          "active"
            ? "inactive"
            : "active";

        await api.patch(
          `/employees/${params.id}/status`,
          {
            status: newStatus,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(
          `Employee ${newStatus} successfully`
        );

        fetchEmployee();
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to update employee status"
        );
      }
    };
    const confirmStatusChange =
  async () => {

    if (!selectedEmployee) {
      return;
    }

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      const newStatus =
        selectedEmployee.status ===
        "active"
          ? "inactive"
          : "active";

      await api.patch(
        `/employees/${selectedEmployee.id}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        `Employee ${newStatus} successfully`
      );

      setShowStatusModal(false);

      setSelectedEmployee(null);

      fetchEmployee();

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to update employee status"
      );

    }

  };
  return (
    <ProtectedRoute allowedRole="admin">
      <DashboardLayout>

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1
              className="
              text-3xl
              font-bold
              text-white
              "
            >
              Employee Details
            </h1>

            <p
              className="
              text-[#8696A0]
              mt-1
              "
            >
              View employee information.
            </p>
          </div>

          <button
            onClick={() =>
              router.push(
                "/admin/employees"
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

        {loading ? (
          <div className="text-[#8696A0]">
            Loading...
          </div>
        ) : employee ? (

          <div
            className="
            bg-[#1B2730]
            border
            border-[#2A3942]
            rounded-2xl
            p-8
            max-w-3xl
            "
          >

            <div className="space-y-6">

              <div>
                <p className="text-[#8696A0] text-sm">
                  Employee ID
                </p>

                <p className="text-white text-lg">
                  {employee.id}
                </p>
              </div>

              <div>
                <p className="text-[#8696A0] text-sm">
                  Name
                </p>

                <p className="text-white text-lg font-medium">
                  {employee.name}
                </p>
              </div>

              <div>
                <p className="text-[#8696A0] text-sm">
                  Phone Number
                </p>

                <p className="text-white text-lg">
                  {employee.phone}
                </p>
              </div>

              <div>
                <p className="text-[#8696A0] text-sm">
                  Office
                </p>

                <p className="text-white text-lg">
                  {getOfficeName(
                    employee.office_id
                  )}
                </p>
              </div>

              <div>
                <p className="text-[#8696A0] text-sm">
                  Status
                </p>

                <span
                  className={`
                  px-3
                  py-1
                  rounded-full
                  text-sm
                  ${
                    employee.status ===
                    "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }
                  `}
                >
                  {employee.status}
                </span>
              </div>

            </div>

            <div className="flex gap-4 mt-10">

              <button
                onClick={() =>
                  router.push(
                    `/admin/employees/${employee.id}/edit`
                  )
                }
                className="
                bg-[#00A884]
                hover:bg-[#029977]
                px-5
                py-3
                rounded-xl
                text-white
                font-semibold
                transition
                "
              >
                Edit Employee
              </button>

              <button
                onClick={() => {
                    setSelectedEmployee(employee);
                    setShowStatusModal(true);
                }}
                className={`
                px-5
                py-3
                rounded-xl
                text-white
                font-semibold
                transition
                ${
                    employee.status === "active"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-600 hover:bg-green-700"
                }
                `}
              >
                {employee.status ===
                "active"
                  ? "Deactivate"
                  : "Activate"}
              </button>

            </div>

          </div>

        ) : (
          <div className="text-red-400">
            Employee not found.
          </div>
        )}
        {showStatusModal && (
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
            w-[450px]
            "
            >

            <h2
                className="
                text-2xl
                font-bold
                text-white
                mb-4
                "
            >
                Confirm Action
            </h2>

            <p
                className="
                text-[#8696A0]
                mb-8
                "
            >
                Are you sure you want to{" "}
                <span className="text-white font-semibold">
                {selectedEmployee?.status ===
                "active"
                    ? "deactivate"
                    : "activate"}
                </span>{" "}
                employee{" "}
                <span className="text-white font-semibold">
                {selectedEmployee?.name}
                </span>
                ?
            </p>

            <div className="flex gap-4">

                <button
                onClick={() => {
                    setShowStatusModal(false);
                    setSelectedEmployee(null);
                }}
                className="
                flex-1
                bg-[#22313B]
                hover:bg-[#2A3942]
                text-white
                py-3
                rounded-xl
                "
                >
                Cancel
                </button>

                <button
                onClick={
                    confirmStatusChange
                }
                className="
                flex-1
                bg-[#00A884]
                hover:bg-[#029977]
                text-white
                py-3
                rounded-xl
                "
                >
                Confirm
                </button>

            </div>

            </div>

        </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}