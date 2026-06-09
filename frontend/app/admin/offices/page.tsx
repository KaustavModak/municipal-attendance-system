"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";

import api from "@/lib/api";
import toast from "react-hot-toast";

export default function OfficesPage() {

  const router = useRouter();

  const [offices, setOffices] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [selectedOffice, setSelectedOffice] =
    useState<any>(null);

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
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setOffices(res.data);

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to load offices"
      );

    } finally {

      setLoading(false);

    }
  };

  const deleteOffice =
    async () => {

      try {

        const token =
          localStorage.getItem("token");

        await api.delete(
          `/offices/${selectedOffice.id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        toast.success(
          "Office deleted successfully"
        );

        setShowDeleteModal(false);
        setSelectedOffice(null);

        fetchOffices();

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to delete office"
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
              Offices
            </h1>

            <p
              className="
              text-[#8696A0]
              mt-1
              "
            >
              Manage office locations.
            </p>

          </div>

          <button
            onClick={() =>
              router.push(
                "/admin/offices/add"
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
            + Add Office
          </button>

        </div>

        {/* Table */}
        <div
          className="
          bg-[#1B2730]
          border
          border-[#2A3942]
          rounded-2xl
          overflow-hidden
          "
        >

          {/* Header Row */}
          <div
            className="
            grid
            grid-cols-6
            p-4
            border-b
            border-[#2A3942]
            text-[#8696A0]
            font-semibold
            "
          >

            <div>ID</div>
            <div>Office Name</div>
            <div>Latitude</div>
            <div>Longitude</div>
            <div>Radius</div>
            <div className="text-center">
              Actions
            </div>

          </div>

          {loading && (

            <div
              className="
              p-6
              text-center
              text-[#8696A0]
              "
            >
              Loading offices...
            </div>

          )}

          {!loading &&
            offices.length === 0 && (

              <div
                className="
                p-6
                text-center
                text-[#8696A0]
                "
              >
                No offices found.
              </div>

            )}

          {!loading &&
            offices.map(
              (office) => (

                <div
                  key={office.id}
                  className="
                  grid
                  grid-cols-6
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
                    {office.id}
                  </div>

                  <div>
                    {office.office_name}
                  </div>

                  <div>
                    {office.latitude}
                  </div>

                  <div>
                    {office.longitude}
                  </div>

                  <div>
                    {office.radius_meters}m
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
                          `/admin/offices/${office.id}/edit`
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
                      Edit
                    </button>

                    <button
                      onClick={() => {

                        setSelectedOffice(
                          office
                        );

                        setShowDeleteModal(
                          true
                        );

                      }}
                      className="
                      px-3
                      py-1
                      rounded-lg
                      bg-red-500
                      hover:bg-red-600
                      transition
                      "
                    >
                      Delete
                    </button>

                  </div>

                </div>

              )
            )}

        </div>

        {/* Delete Modal */}
        {showDeleteModal && (

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
                Delete Office
              </h2>

              <p
                className="
                text-[#8696A0]
                mb-8
                "
              >
                Are you sure you want to
                delete office{" "}
                <span className="text-white font-semibold">
                  {
                    selectedOffice?.office_name
                  }
                </span>
                ?
              </p>

              <div className="flex gap-4">

                <button
                  onClick={() => {
                    setShowDeleteModal(
                      false
                    );
                    setSelectedOffice(
                      null
                    );
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
                    deleteOffice
                  }
                  className="
                  flex-1
                  bg-red-500
                  hover:bg-red-600
                  text-white
                  py-3
                  rounded-xl
                  "
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        )}

      </DashboardLayout>
    </ProtectedRoute>
  );
}