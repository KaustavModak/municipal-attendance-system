"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

import api from "@/lib/api";

import toast from "react-hot-toast";

export default function EditOfficePage() {

  const params = useParams();
  const router = useRouter();

  const [officeName, setOfficeName] =
    useState("");

  const [latitude, setLatitude] =
    useState("");

  const [longitude, setLongitude] =
    useState("");

  const [radiusMeters, setRadiusMeters] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [pageLoading, setPageLoading] =
    useState(true);

  useEffect(() => {
    fetchOffice();
  }, []);

  const fetchOffice = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await api.get(
        `/offices/${params.id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setOfficeName(
        res.data.office_name
      );

      setLatitude(
        String(res.data.latitude)
      );

      setLongitude(
        String(res.data.longitude)
      );

      setRadiusMeters(
        String(res.data.radius_meters)
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to load office"
      );

    } finally {

      setPageLoading(false);

    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (
      !officeName ||
      !latitude ||
      !longitude ||
      !radiusMeters
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
        `/offices/${params.id}`,
        {
          office_name: officeName,
          latitude:
            Number(latitude),
          longitude:
            Number(longitude),
          radius_meters:
            Number(radiusMeters),
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Office updated successfully"
      );

      router.push(
        "/admin/offices"
      );

    } catch (error: any) {

      console.error(error);

      toast.error(
        error?.response?.data?.detail ||
        "Failed to update office"
      );

    } finally {

      setLoading(false);

    }
  };

  if (pageLoading) {

    return (
      <ProtectedRoute allowedRole="admin">
        <DashboardLayout>

          <div className="text-[#8696A0]">
            Loading office...
          </div>

        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRole="admin">
      <DashboardLayout>

        <div className="max-w-3xl mx-auto">

          {/* Header */}
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
                Edit Office
              </h1>

              <p
                className="
                text-[#8696A0]
                "
              >
                Update office information.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/offices"
                )
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

            <div>

              <label
                className="
                block
                mb-2
                text-white
                "
              >
                Office Name
                <span className="text-red-400">
                  {" "}*
                </span>
              </label>

              <input
                type="text"
                value={officeName}
                onChange={(e) =>
                  setOfficeName(
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
                Latitude
                <span className="text-red-400">
                  {" "}*
                </span>
              </label>

              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) =>
                  setLatitude(
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
                Longitude
                <span className="text-red-400">
                  {" "}*
                </span>
              </label>

              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) =>
                  setLongitude(
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
                Radius (meters)
                <span className="text-red-400">
                  {" "}*
                </span>
              </label>

              <input
                type="number"
                value={radiusMeters}
                onChange={(e) =>
                  setRadiusMeters(
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
                ? "Updating Office..."
                : "Update Office"}
            </button>

          </form>

        </div>

      </DashboardLayout>
    </ProtectedRoute>
  );
}