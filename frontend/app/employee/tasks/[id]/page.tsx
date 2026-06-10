"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import api from "@/lib/api";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";

import toast from "react-hot-toast";
import TaskCameraCapture from "@/components/TaskCameraCapture";

interface Task {
  id: number;
  title: string;
  description: string;
  employee_id: number;
  assigned_by: number;
  status: string;
  deadline: string;
  assigned_at: string;
  completed_at: string | null;
  is_late: boolean;
  completion_lat: number | null;
  completion_lng: number | null;
}

interface TaskImage {
  id: number;
  task_id: number;
  image_url: string;
}

export default function EmployeeTaskDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const taskId = params.id;

  const [task, setTask] =
    useState<Task | null>(null);

  const [images, setImages] =
    useState<TaskImage[]>([]);

  const [capturedBlob,
    setCapturedBlob] =
    useState<Blob | null>(
    null
    );

  const [previewUrl, setPreviewUrl] =
    useState("");

  const [lastUploadedUrl, setLastUploadedUrl] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  const [completing, setCompleting] =
    useState(false);

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

      const res =
        await api.get(
          `/tasks/my/tasks/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setTask(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load task");
    }
  };

  const fetchImages = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res =
        await api.get(
          `/tasks/${taskId}/images`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setImages(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const uploadImage = async () => {

    if (!capturedBlob) {
      toast.error(
        "Please capture an image"
      );
      return;
    }

    try {

      setUploading(true);

      const token =
        localStorage.getItem("token");

      const formData =
        new FormData();

      formData.append(
        "file",
        new File(
            [capturedBlob],
            `proof_${Date.now()}.jpg`,
            {
            type:
                "image/jpeg",
            }
        )
        );

      const uploadRes =
        await api.post(
          "/upload/image",
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      await api.post(
        `/tasks/${taskId}/images`,
        {
          image_url:
            uploadRes.data.image_url,
          public_id:
            uploadRes.data.public_id,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Image uploaded successfully"
      );

      setLastUploadedUrl(
        uploadRes.data.image_url
      );

      setCapturedBlob(null);

      setPreviewUrl("");

      fetchImages();

    } catch (error: any) {

      toast.error(
        error?.response?.data?.detail ||
        "Upload failed"
      );

    } finally {

      setUploading(false);

    }
  };

  const completeTask = async () => {

    if (images.length === 0) {
      toast.error(
        "Upload at least one proof image"
      );
      return;
    }

    if (!navigator.geolocation) {
      toast.error(
        "Geolocation not supported"
      );
      return;
    }

    setCompleting(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {

          const token =
            localStorage.getItem("token");

          await api.put(
            `/tasks/${taskId}/complete`,
            {
              latitude:
                position.coords.latitude,
              longitude:
                position.coords.longitude,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

          toast.success(
            "Task completed successfully"
          );

          fetchTask();

        } catch (error: any) {

          toast.error(
            error?.response?.data?.detail ||
            "Failed to complete task"
          );

        } finally {

          setCompleting(false);

        }
      },
      () => {

        toast.error(
          "Location access denied"
        );

        setCompleting(false);

      }
    );
  };
  const deleteImage = async (
    imageId: number
    ) => {
    try {
        const deleteImage = async (
  imageId: number
) => {

  console.log(
    "Deleting image:",
    imageId
  );

  try {

    const token =
      localStorage.getItem("token");

    const res =
            await api.delete(
                `/tasks/images/${imageId}`,
                {
                headers: {
                    Authorization:
                    `Bearer ${token}`,
                },
                }
            );

            console.log(
            "Delete response:",
            res.data
            );

            toast.success(
            "Image deleted"
            );

            await fetchImages();

        } catch (error: any) {

            console.log(
            "Delete error:",
            error
            );

            console.log(
            error?.response?.data
            );

            toast.error(
            error?.response?.data?.detail ||
            "Failed to delete image"
            );

        }
        };
        const token =
        localStorage.getItem("token");

        await api.delete(
        `/tasks/images/${imageId}`,
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

        toast.error(
        "Failed to delete image"
        );

    }
    };
  if (!task) return null;

  return (
    <ProtectedRoute allowedRole="employee">

      <DashboardLayout>

        <div>

          <div className="flex justify-between items-center">

            <div>

              <h1
                className="
                text-4xl
                font-bold
                text-white
                "
              >
                {task.title}
              </h1>

              <p
                className="
                text-[#8696A0]
                mt-2
                "
              >
                Task Details
              </p>

            </div>

            <button
              onClick={() =>
                router.push(
                  "/employee/tasks"
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

          <div
            className="
            mt-8
            bg-[#1B2730]
            border
            border-[#2A3942]
            rounded-2xl
            p-6
            "
          >

            <div
            className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-8
            "
            >

            <div>
                <p className="text-[#8696A0]">
                Task ID
                </p>

                <p className="text-white font-semibold mt-1">
                {task.id}
                </p>
            </div>

            <div>
                <p className="text-[#8696A0]">
                Status
                </p>

                <span
                className={`
                    inline-block
                    mt-1
                    px-4
                    py-1
                    rounded-full
                    text-sm
                    font-medium

                    ${
                    task.status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }
                `}
                >
                {task.status}
                </span>
            </div>

            <div>
                <p className="text-[#8696A0]">
                Title
                </p>

                <p className="text-white font-semibold mt-1">
                {task.title}
                </p>
            </div>

            <div>
                <p className="text-[#8696A0]">
                Late Status
                </p>

                <span
                className={`
                    inline-block
                    mt-1
                    px-4
                    py-1
                    rounded-full
                    text-sm
                    font-medium

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

            <div className="md:col-span-2">
                <p className="text-[#8696A0]">
                Description
                </p>

                <p className="text-white mt-1">
                {task.description}
                </p>
            </div>

            <div>
                <p className="text-[#8696A0]">
                Deadline
                </p>

                <p className="text-white mt-1">
                {new Date(
                    task.deadline
                ).toLocaleString()}
                </p>
            </div>

            <div>
                <p className="text-[#8696A0]">
                Assigned At
                </p>

                <p className="text-white mt-1">
                {new Date(
                    task.assigned_at
                ).toLocaleString()}
                </p>
            </div>

            {task.completed_at && (

                <div>
                <p className="text-[#8696A0]">
                    Completed At
                </p>

                <p className="text-white mt-1">
                    {new Date(
                    task.completed_at
                    ).toLocaleString()}
                </p>
                </div>

            )}

            {task.completion_lat !== null && (

                <div>
                <p className="text-[#8696A0]">
                    Completion Location
                </p>

                <p className="text-white mt-1">
                    {task.completion_lat.toFixed(6)},
                    {" "}
                    {task.completion_lng?.toFixed(6)}
                </p>
                </div>

            )}

            </div>

          </div>

          {/* IMAGES */}

          <div className="mt-10">

            <h2
              className="
              text-2xl
              font-bold
              text-white
              mb-5
              "
            >
              Proof Images
            </h2>

            <div
              className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-4
              "
            >

              {images.map((image) => (

                <div
                  key={image.id}
                  className="
                  bg-[#1B2730]
                  border
                  border-[#2A3942]
                  rounded-xl
                  p-3
                  "
                >

                  <img
                    src={image.image_url}
                    alt="Task Proof"
                    className="
                    w-full
                    h-60
                    object-cover
                    rounded-lg
                    "
                  />

                  <div className="flex gap-3 mt-3">

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
                        setSelectedImageId(
                            image.id
                        );
                        setShowDeleteModal(
                            true
                        );
                        }}
                        className="
                        flex-1
                        bg-red-500
                        hover:bg-red-600
                        text-white
                        py-2
                        rounded-lg
                        "
                    >
                        Delete
                    </button>

                    </div>

                </div>

              ))}

            </div>

          </div>

          {/* UPLOAD */}

          <div
            className="
            mt-10
            bg-[#1B2730]
            border
            border-[#2A3942]
            rounded-2xl
            p-6
            "
          >

            <h2
              className="
              text-2xl
              text-white
              font-bold
              mb-5
              "
            >
              Upload Proof
            </h2>

            <TaskCameraCapture
            onCapture={(
                blob,
                preview
            ) => {

                setCapturedBlob(
                blob
                );

                setPreviewUrl(
                preview
                );

            }}
            />

            {previewUrl && (

              <div className="mt-5">

                <p
                  className="
                  text-[#8696A0]
                  mb-3
                  "
                >
                  Preview
                </p>

                <img
                  src={previewUrl}
                  alt="Preview"
                  className="
                  w-64
                  h-64
                  object-cover
                  rounded-xl
                  border
                  border-[#2A3942]
                  "
                />

              </div>

            )}

            {lastUploadedUrl && (

              <a
                href={lastUploadedUrl}
                target="_blank"
                rel="noreferrer"
                className="
                block
                mt-4
                text-[#00A884]
                underline
                "
              >
                Open Last Uploaded Image
              </a>

            )}

            <button
              onClick={uploadImage}
              disabled={uploading}
              className="
              mt-6
              bg-[#00A884]
              text-white
              px-6
              py-3
              rounded-xl
              "
            >
              {uploading
                ? "Uploading..."
                : "Upload Image"}
            </button>

          </div>

          {task.status !==
            "completed" && (

            <div className="mt-10">

              <button
                onClick={completeTask}
                disabled={completing}
                className="
                w-full
                bg-[#00A884]
                text-white
                py-4
                rounded-2xl
                text-lg
                font-semibold
                "
              >
                {completing
                  ? "Completing..."
                  : "Complete Task"}
              </button>

            </div>

          )}

        </div>
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