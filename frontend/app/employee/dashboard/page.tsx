"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function EmployeeDashboard() {
  return (
    <ProtectedRoute allowedRole="employee">
      <div className="min-h-screen bg-[#07141A] text-white p-8">
        <h1 className="text-4xl font-bold">
          Employee Dashboard
        </h1>

        <p className="mt-4 text-gray-400">
          Welcome Employee
        </p>
      </div>
    </ProtectedRoute>
  );
}