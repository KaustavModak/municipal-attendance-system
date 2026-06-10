"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import toast from "react-hot-toast";

interface Props {
  onCapture: (
    blob: Blob,
    preview: string
  ) => void;
}

export default function TaskCameraCapture({
  onCapture,
}: Props) {

  const videoRef =
    useRef<HTMLVideoElement>(null);

  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const [cameraStarted,
    setCameraStarted] =
    useState(false);

  const [loading,
    setLoading] =
    useState(false);

  const startCamera =
    async () => {

      try {

        setLoading(true);

        const stream =
          await navigator
            .mediaDevices
            .getUserMedia({
              video: {
                facingMode:
                  "environment",
              },
              audio: false,
            });

        if (
          videoRef.current
        ) {

          videoRef.current.srcObject =
            stream;

          setCameraStarted(
            true
          );

        }

      } catch {

        toast.error(
          "Unable to access camera"
        );

      } finally {

        setLoading(false);

      }
    };

  const capturePhoto =
    () => {

      if (
        !videoRef.current ||
        !canvasRef.current
      ) {
        return;
      }

      const video =
        videoRef.current;

      const canvas =
        canvasRef.current;

      canvas.width =
        video.videoWidth;

      canvas.height =
        video.videoHeight;

      const ctx =
        canvas.getContext(
          "2d"
        );

      if (!ctx) return;

      ctx.drawImage(
        video,
        0,
        0
      );

      canvas.toBlob(
        (blob) => {

          if (!blob) return;

          const preview =
            canvas.toDataURL(
              "image/jpeg"
            );

          onCapture(
            blob,
            preview
          );

          toast.success(
            "Photo captured"
          );

        },
        "image/jpeg",
        0.9
      );
    };

  useEffect(() => {

    return () => {

      if (
        videoRef.current
          ?.srcObject
      ) {

        const stream =
          videoRef.current
            .srcObject as MediaStream;

        stream
          .getTracks()
          .forEach(
            (track) =>
              track.stop()
          );

      }

    };

  }, []);

  return (

    <div>

      {!cameraStarted && (

        <button
          onClick={
            startCamera
          }
          disabled={
            loading
          }
          className="
          bg-[#22313B]
          text-white
          px-5
          py-3
          rounded-xl
          "
        >
          {loading
            ? "Starting..."
            : "Start Camera"}
        </button>

      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="
        mt-4
        w-full
        max-w-xl
        rounded-xl
        border
        border-[#2A3942]
        "
      />

      <canvas
        ref={canvasRef}
        className="hidden"
      />

      {cameraStarted && (

        <button
          onClick={
            capturePhoto
          }
          className="
          mt-4
          bg-[#00A884]
          text-white
          px-5
          py-3
          rounded-xl
          "
        >
          📷 Capture Photo
        </button>

      )}

    </div>

  );
}