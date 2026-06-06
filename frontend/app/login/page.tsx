// This is the login page for the Municipal Attendance System.
// It is a simple page that allows users to log in as either an admin or an employee.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function LoginPage() {
  const [role, setRole] = useState("employee");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
   
  const handleLogin = async () => {
    try {
      setLoading(true);

      const endpoint =
        role === "admin"
          ? "/auth/admin/login"
          : "/auth/employee/login";

      const response =
        await api.post(endpoint, {
          phone,
          password,
        });

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      localStorage.setItem(
        "role",
        role
      );
      localStorage.setItem(
        "name",
        response.data.name
      );
      toast.success(
        "Login Successful"
      );

      if (role === "admin") {
        router.push(
          "/admin/dashboard"
        );
      } else {
        router.push(
          "/employee/dashboard"
        );
      }

    } catch (error) {

      toast.error(
        "Invalid Credentials"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-[#07141A]
      px-6
      "
    >
      <div
        className="
        w-full
        max-w-2xl
        bg-[#1B2730]
        border
        border-[#2A3942]
        rounded-3xl
        p-10
        shadow-2xl
        "
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="
            w-20
            h-20
            mx-auto
            mb-6
            rounded-full
            border
            border-[#00A884]
            flex
            items-center
            justify-center
            text-4xl
            "
          >
            🏛
          </div>

          <h1
            className="
            text-4xl
            font-bold
            text-[#E9EDEF]
            leading-tight
            "
          >
            Workforce Management
          </h1>

          <p
            className="
            mt-4
            text-[#8696A0]
            text-lg
            "
          >
            Attendance • Tasks • Reports
          </p>

          <div
          className="
          mt-6
          h-px
          bg-[#2A3942]
          relative
          "
        >
          <div
            className="
            absolute
            left-0
            top-0
            w-full
            h-[3px]
            bg-[#00A884]
            "
          />
        </div>
        </div>

        {/* Login As */}
        <div className="mb-6">
          <label
            className="
            block
            mb-3
            text-[#E9EDEF]
            text-lg
            font-medium
            "
          >
            Login As
          </label>

          <div
            className="
            grid
            grid-cols-2
            rounded-xl
            overflow-hidden
            border
            border-[#2A3942]
            "
          >
            <button
              type="button"
              onClick={() => setRole("employee")}
              className={`
                p-4
                text-lg
                font-semibold
                transition
                ${
                  role === "employee"
                    ? "bg-[#00A884]/15 text-[#00A884] border-r border-[#00A884]"
                    : "bg-[#07141A] text-[#8696A0] border-r border-[#2A3942]"
                }
              `}
            >
              Employee
            </button>

            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`
                p-4
                text-lg
                font-semibold
                transition
                ${
                  role === "admin"
                    ? "bg-[#00A884]/15 text-[#00A884]"
                    : "bg-[#07141A] text-[#8696A0]"
                }
              `}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Phone */}
        <div className="mb-5">
          <label
            className="
            block
            mb-2
            text-[#E9EDEF]
            "
          >
            Phone Number
          </label>

          <input
            type="text"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            placeholder="Enter phone number"
            className="
            w-full
            bg-[#07141A]
            border
            border-[#2A3942]
            rounded-xl
            p-4
            text-[#E9EDEF]
            placeholder:text-[#8696A0]
            focus:outline-none
            focus:border-[#00A884]
            "
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label
            className="
            block
            mb-2
            text-[#E9EDEF]
            "
          >
            Password
          </label>

          <div className="relative">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
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
              text-[#E9EDEF]
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
              transition
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

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="
          w-full
          bg-[#00A884]
          hover:bg-[#029977]
          text-white
          font-semibold
          text-xl
          p-4
          rounded-xl
          transition
          disabled:opacity-50
          "
        >
          {
            loading
              ? "Logging In..."
              : "Login"
          }
        </button>
      </div>
    </div>
  );
}