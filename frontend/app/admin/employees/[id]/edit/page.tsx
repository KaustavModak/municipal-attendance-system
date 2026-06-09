"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

import api from "@/lib/api";

import toast from "react-hot-toast";

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [officeId, setOfficeId] =
    useState("");

  const [offices, setOffices] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

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

      setName(res.data.name);
      setPhone(res.data.phone);

      setOfficeId(
        String(res.data.office_id)
      );

    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load employee"
      );
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

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !name ||
      !phone ||
      !officeId
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

      await api.put(
        `/employees/${params.id}`,
        {
          name,
          phone,
          office_id:
            Number(officeId),
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Employee updated successfully"
      );

      router.push(
        `/admin/employees/${params.id}`
      );

    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.detail ||
          "Failed to update employee"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRole="admin">
      <DashboardLayout>

        <div className="max-w-3xl mx-auto">

          <div className="flex justify-between items-center mb-8">

            <div>

              <h1
                className="
                text-3xl
                font-bold
                text-white
                "
              >
                Edit Employee
              </h1>

              <p
                className="
                text-[#8696A0]
                mt-1
                "
              >
                Update employee information.
              </p>

            </div>

            <button
              onClick={() =>
                router.back()
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

          <form
            onSubmit={handleSubmit}
            className="
            bg-[#1B2730]
            border
            border-[#2A3942]
            rounded-2xl
            p-8
            space-y-6
            "
          >

            <div>

              <label
                className="
                block
                mb-2
                text-white
                "
              >
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(
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

            <div>

              <label
                className="
                block
                mb-2
                text-white
                "
              >
                Phone Number
              </label>

              <input
                type="text"
                value={phone}
                onChange={(e) =>
                  setPhone(
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

            <div>

              <label
                className="
                block
                mb-2
                text-white
                "
              >
                Office
              </label>

              <select
                value={officeId}
                onChange={(e) =>
                  setOfficeId(
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

                {offices.map(
                  (office) => (
                    <option
                      key={office.id}
                      value={office.id}
                    >
                      {
                        office.office_name
                      }
                    </option>
                  )
                )}

              </select>

            </div>

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
                ? "Updating..."
                : "Save Changes"}
            </button>

          </form>

        </div>

      </DashboardLayout>
    </ProtectedRoute>
  );
}