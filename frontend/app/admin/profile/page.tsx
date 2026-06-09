"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";

export default function ProfilePage() {

  const router = useRouter();

  const [name, setName] =
    useState("");

  const [role, setRole] =
    useState("");

  useEffect(() => {

    const storedName =
      localStorage.getItem("name");

    const storedRole =
      localStorage.getItem("role");

    if (storedName) {
      setName(storedName);
    }

    if (storedRole) {
      setRole(storedRole);
    }

  }, []);

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
            My Profile
          </h1>

          <p
            className="
            text-[#8696A0]
            mt-1
            "
          >
            Manage your account information.
          </p>

        </div>

        {/* Profile Card */}
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

          {/* Avatar */}
          <div
            className="
            flex
            items-center
            gap-5
            mb-8
            "
          >

            <div
              className="
              w-20
              h-20
              rounded-full
              bg-[#00A884]
              flex
              items-center
              justify-center
              text-white
              text-3xl
              font-bold
              "
            >
              {name
                ? name.charAt(0).toUpperCase()
                : "A"}
            </div>

            <div>

              <h2
                className="
                text-2xl
                font-bold
                text-white
                "
              >
                {name}
              </h2>

            </div>

          </div>

          {/* Details */}
          <div
            className="
            grid
            md:grid-cols-2
            gap-6
            "
          >

            <div>

              <p
                className="
                text-[#8696A0]
                text-sm
                "
              >
                Admin Name
              </p>

              <p
                className="
                text-white
                text-lg
                mt-1
                "
              >
                {name}
              </p>

            </div>

            <div>

              <p
                className="
                text-[#8696A0]
                text-sm
                "
              >
                Role
              </p>

              <p
                className="
                text-white
                text-lg
                mt-1
                capitalize
                "
              >
                {role}
              </p>

            </div>

            <div>

              <p
                className="
                text-[#8696A0]
                text-sm
                "
              >
                Account Status
              </p>

              <span
                className="
                inline-block
                mt-2
                px-3
                py-1
                rounded-full
                bg-green-500/20
                text-green-400
                text-sm
                "
              >
                Active
              </span>

            </div>

            <div>

              <p
                className="
                text-[#8696A0]
                text-sm
                "
              >
                Access Level
              </p>

              <p
                className="
                text-white
                text-lg
                mt-1
                "
              >
                Full Access
              </p>

            </div>

          </div>

          {/* Actions */}
          <div
            className="
            flex
            gap-4
            mt-10
            "
          >

            <button
              onClick={() =>
                router.push(
                  "/admin/change-password"
                )
              }
              className="
              bg-[#00A884]
              hover:bg-[#029977]
              text-white
              px-6
              py-3
              rounded-xl
              font-semibold
              transition
              "
            >
              Change Password
            </button>

          </div>

        </div>

      </DashboardLayout>
    </ProtectedRoute>
  );
}