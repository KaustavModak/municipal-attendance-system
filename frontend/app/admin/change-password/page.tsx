"use client";

import { useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";

import api from "@/lib/api";
import toast from "react-hot-toast";

export default function ChangePasswordPage() {

  const [oldPassword, setOldPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (
      newPassword.length < 6
    ) {

      toast.error(
        "Password must be at least 6 characters"
      );

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {

      toast.error(
        "Passwords do not match"
      );

      return;
    }

    try {

      setLoading(true);

      const token =
        localStorage.getItem(
          "token"
        );

      await api.put(
        "/auth/change-password",
        {
          old_password:
            oldPassword,
          new_password:
            newPassword,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Password changed successfully"
      );

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error: any) {

      toast.error(
        error?.response?.data
          ?.detail ||
        "Failed to change password"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <ProtectedRoute allowedRole="admin">
      <DashboardLayout>

        <div className="max-w-2xl">

          <h1
            className="
            text-3xl
            font-bold
            text-white
            mb-2
            "
          >
            Change Password
          </h1>

          <p
            className="
            text-[#8696A0]
            mb-8
            "
          >
            Update your account password.
          </p>

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

            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) =>
                setOldPassword(
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
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
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
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
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
            />

            <button
              type="submit"
              disabled={loading}
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
              {loading
                ? "Updating..."
                : "Update Password"}
            </button>

          </form>

        </div>

      </DashboardLayout>
    </ProtectedRoute>
  );
}