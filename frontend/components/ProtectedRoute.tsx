"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole: string;
}) {

  const router = useRouter();

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    const role =
      localStorage.getItem("role");

    if (!token) {
      router.push("/login");
      return;
    }

    if (role !== allowedRole) {
      router.push("/login");
      return;
    }

  }, [router, allowedRole]);

  const token =
    typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    const role =
    typeof window !== "undefined"
        ? localStorage.getItem("role")
        : null;

    if (!token || role !== allowedRole) {
    return null;
    }

    return <>{children}</>;
}