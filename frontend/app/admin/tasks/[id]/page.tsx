"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";

import api from "@/lib/api";
import toast from "react-hot-toast";

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [task, setTask] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [completing, setCompleting] =
    useState(false);

  const [images, setImages] =
   useState<any[]>([]);

  const [loadingImages, setLoadingImages] =
   useState(true);

  const [showDeleteModal, setShowDeleteModal] =
   useState(false);

  const [selectedImageId, setSelectedImageId] =
    useState<number | null>(null);

  useEffect(() => {
    fetchTask();
    fetchImages();
  }, []);

  const fetchTask = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await api.get(
        `/tasks/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTask(res.data);
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load task"
      );
    } finally {
      setLoading(false);
    }
  };
  const fetchImages = async () => {
  try {

    setLoadingImages(true);

    const token =
      localStorage.getItem("token");

    const res = await api.get(
      `/tasks/admin/${params.id}/images`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    setImages(res.data);

  } catch (error) {

    console.error(error);

    toast.error(
      "Failed to load task images"
    );

  } finally {

    setLoadingImages(false);

  }
};

const deleteImage = async (
    imageId: number
    ) => {
    try {

        const token =
        localStorage.getItem("token");

        await api.delete(
        `/tasks/admin/images/${imageId}`,
        {
            headers: {
            Authorization:
                `Bearer ${token}`,
            },
        }
        );

        toast.success(
        "Image deleted"
        );

        fetchImages();

    } catch (error) {

        console.error(error);

        toast.error(
        "Failed to delete image"
        );

    }
    };
  const handleCompleteTask =
    async () => {
      try {
        setCompleting(true);

        const token =
          localStorage.getItem("token");

        await api.put(
          `/tasks/${params.id}/complete`,
          {
            latitude: 0,
            longitude: 0,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(
          "Task completed successfully"
        );

        fetchTask();
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to complete task"
        );
      } finally {
        setCompleting(false);
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
              Task Details
            </h1>

            <p
              className="
              text-[#8696A0]
              mt-1
              "
            >
              View task information.
            </p>
          </div>

          <button
            onClick={() =>
              router.push("/admin/tasks")
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

        ) : task ? (

            <>

          <div
            className="
            bg-[#1B2730]
            border
            border-[#2A3942]
            rounded-2xl
            p-8
            max-w-4xl
            "
          >

            <div className="space-y-6">

              <div>
                <p className="text-[#8696A0] text-sm">
                  Task ID
                </p>

                <p className="text-white text-lg">
                  {task.id}
                </p>
              </div>

              <div>
                <p className="text-[#8696A0] text-sm">
                  Title
                </p>

                <p className="text-white text-lg">
                  {task.title}
                </p>
              </div>

              <div>
                <p className="text-[#8696A0] text-sm">
                  Description
                </p>

                <p className="text-white text-lg">
                  {task.description}
                </p>
              </div>

              <div>
                <p className="text-[#8696A0] text-sm">
                  Employee
                </p>

                <p className="text-white text-lg">
                  {task.employee_name}
                </p>
              </div>

              <div>
                <p className="text-[#8696A0] text-sm">
                  Deadline
                </p>

                <p className="text-white text-lg">
                  {new Date(
                    task.deadline
                  ).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-[#8696A0] text-sm">
                  Assigned At
                </p>

                <p className="text-white text-lg">
                  {new Date(
                    task.assigned_at
                  ).toLocaleString()}
                </p>
              </div>

              {task.completed_at && (
                <div>
                  <p className="text-[#8696A0] text-sm">
                    Completed At
                  </p>

                  <p className="text-white text-lg">
                    {new Date(
                      task.completed_at
                    ).toLocaleString()}
                  </p>
                </div>
              )}

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

              <div>
                <p className="text-[#8696A0] text-sm">
                  Late Status
                </p>

                <span
                  className={`
                  px-3
                  py-1
                  rounded-full
                  text-sm
                  ${
                    task.is_late
                      ? "bg-red-500/20 text-red-400"
                      : "bg-green-500/20 text-green-400"
                  }
                  `}
                >
                  {task.is_late
                    ? "Late"
                    : "On Time"}
                </span>
              </div>
              
            </div>

            <div className="flex gap-4 mt-10">

              {task.status !==
                "completed" && (
                <button
                  onClick={
                    handleCompleteTask
                  }
                  disabled={completing}
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
                  {completing
                    ? "Completing..."
                    : "Complete Task"}
                </button>
              )}

            </div>

          </div>
          {/* Task Images */}
        <div
        className="
        bg-[#1B2730]
        border
        border-[#2A3942]
        rounded-2xl
        p-6
        mt-8
        max-w-6xl
        "
        >

        <div
            className="
            flex
            justify-between
            items-center
            mb-6
            "
        >

            <h2
            className="
            text-xl
            font-semibold
            text-white
            "
            >
            Task Images
            </h2>

            <span className="text-[#8696A0]">
            {images.length} uploaded
            </span>

        </div>

        {loadingImages ? (

            <p className="text-[#8696A0]">
            Loading images...
            </p>

        ) : images.length === 0 ? (

            <p className="text-[#8696A0]">
            No task images uploaded.
            </p>

        ) : (

            <div
            className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-6
            "
            >

            {images.map((image) => (

                <div
                key={image.id}
                className="
                bg-[#07141A]
                border
                border-[#2A3942]
                rounded-xl
                overflow-hidden
                "
                >

                <img
                    src={image.image_url}
                    alt="Task Image"
                    className="
                    w-full
                    h-56
                    object-cover
                    "
                />

                <div className="p-4">

                    <div className="flex gap-3">

                    <a
                        href={image.image_url}
                        target="_blank"
                        rel="noreferrer"
                        className="
                        flex-1
                        bg-[#00A884]
                        hover:bg-[#029977]
                        text-white
                        text-center
                        py-2
                        rounded-lg
                        "
                    >
                        Open
                    </a>

                    <button
                        onClick={() => {
                            setSelectedImageId(image.id);
                            setShowDeleteModal(true);
                        }}
                        className="
                        flex-1
                        bg-red-500
                        hover:bg-red-600
                        text-white
                        py-2
                        rounded-lg
                        transition
                        "
                        >
                        Delete
                        </button>

                    </div>

                </div>

                </div>

            ))}

            </div>

        )}

        </div>
        </>
            
        ) : (
            
          <div className="text-red-400">
            Task not found.
          </div>

        )}

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
              w-[420px]
              "
            >

              <h2
                className="
                text-2xl
                font-bold
                text-white
                mb-3
                "
              >
                Delete Task Image
              </h2>

              <p
                className="
                text-[#8696A0]
                mb-8
                "
              >
                Are you sure you want to delete this image?
              </p>

              <div className="flex gap-4">

                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedImageId(null);
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
                  onClick={async () => {

                    if (
                      selectedImageId !== null
                    ) {

                      await deleteImage(
                        selectedImageId
                      );

                    }

                    setShowDeleteModal(false);

                    setSelectedImageId(null);

                  }}
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