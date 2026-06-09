"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

import api from "@/lib/api";

import toast from "react-hot-toast";

import { Eye, EyeOff } from "lucide-react";

export default function AddEmployeePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [officeId, setOfficeId] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [offices, setOffices] = useState<
    any[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    fetchOffices();
  }, []);

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

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
    !name ||
    !phone ||
    !password ||
    !officeId
    ) {
    toast.error(
        "Please fill all fields"
    );
    return;
    }

    if (password.length < 6) {
    toast.error(
        "Password must be at least 6 characters"
    );
    return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      await api.post(
        "/employees/",
        {
          name,
          phone,
          password,
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
        "Employee created successfully"
      );

      router.push(
        "/admin/employees"
      );
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.detail ||
          "Failed to create employee"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRole="admin">
      <DashboardLayout>

        <div className="max-w-3xl mx-auto">

          <div className="flex items-start justify-between mb-8">

            <div>
                <h1
                className="
                text-3xl
                font-bold
                text-white
                mb-2
                "
                >
                Add Employee
                </h1>

                <p
                className="
                text-[#8696A0]
                "
                >
                Create a new employee account.
                </p>
            </div>

            <button
                type="button"
                onClick={() =>
                router.push("/admin/employees")
                }
                className="
                px-4
                py-2
                rounded-xl
                border
                border-[#2A3942]
                text-[#E9EDEF]
                hover:border-[#00A884]
                hover:text-[#00A884]
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
            hover:border-[#00A884]/40
            transition-all
            duration-300
            rounded-2xl
            p-8
            space-y-6
            "
          >
            {/* Name */}
            <div>
              <label
                className="
                block
                mb-2
                text-white
                "
              >
                Name <span className="text-red-400">*</span>
              </label>
    
              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                placeholder="Enter employee name"
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

            {/* Phone */}
            <div>
              <label
                className="
                block
                mb-2
                text-white
                "
              >
                Phone Number <span className="text-red-400">*</span>
              </label>

              <input
                type="text"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                placeholder="Enter phone number"
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

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">

                <label
                    className="
                    text-white
                    "
                >
                    Password <span className="text-red-400">*</span>
                </label>

                <span
                    className="
                    text-sm
                    text-[#8696A0]
                    "
                >
                    Minimum 6 characters
                </span>

                </div>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter password"
                  className="
                  w-full
                  bg-[#07141A]
                  border
                  border-[#2A3942]
                  rounded-xl
                  p-4
                  pr-14
                  text-white
                  placeholder:text-[#8696A0]
                  focus:outline-none
                  focus:border-[#00A884]
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-[#8696A0]
                  hover:text-[#00A884]
                  "
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Office */}
            <div>
              <label
                className="
                block
                mb-2
                text-white
                "
              >
                Office <span className="text-red-400">*</span>
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
                <option value="">
                  Select Office
                </option>

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

            {/* Button */}
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
                ? "Creating Employee..."
                : "Create Employee"}
            </button>

          </form>

        </div>

      </DashboardLayout>
    </ProtectedRoute>
  );
}