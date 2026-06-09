"use client";

import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (
    value: boolean
  ) => void;
}) {

  const router = useRouter();

  const [name, setName] =
    useState("");

  const [role, setRole] =
    useState("");

  const [showMenu, setShowMenu] =
    useState(false);

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

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "name"
    );

    localStorage.removeItem(
      "role"
    );

    router.push("/login");
  };

  const handleProfile = () => {

    setShowMenu(false);

    if (role === "admin") {
      router.push(
        "/admin/profile"
      );
    } else {
      router.push(
        "/employee/profile"
      );
    }
  };

  return (
    <header
      className="
      h-16
      bg-[#1B2730]
      border-b
      border-[#2A3942]
      flex
      items-center
      justify-between
      px-6
      "
    >

      {/* Left Side */}
      <div
        className="
        flex
        items-center
        gap-4
        "
      >
        <button
          onClick={() =>
            setSidebarOpen(
              !sidebarOpen
            )
          }
        >
          <Menu
            className="
            text-white
            "
          />
        </button>

        <h1
          className="
          text-white
          text-xl
          font-bold
          tracking-tight
          "
        >
          Workforce Management
        </h1>
      </div>

      {/* Right Side */}
      <div className="relative">

        <button
          onClick={() =>
            setShowMenu(
              !showMenu
            )
          }
          className="
          flex
          items-center
          gap-3
          "
        >

          <span
            className="
            text-white
            font-medium
            "
          >
            {name}
          </span>

          <div
            className="
            w-9
            h-9
            rounded-full
            bg-[#00A884]
            flex
            items-center
            justify-center
            text-white
            font-bold
            "
          >
            {name
              ? name
                  .charAt(0)
                  .toUpperCase()
              : "U"}
          </div>

        </button>

        {showMenu && (

          <div
            className="
            absolute
            right-0
            mt-3
            w-48
            bg-[#1B2730]
            border
            border-[#2A3942]
            rounded-xl
            overflow-hidden
            shadow-xl
            z-50
            "
          >

            <button
              onClick={
                handleProfile
              }
              className="
              w-full
              text-left
              px-4
              py-3
              text-white
              hover:bg-[#22313B]
              transition
              "
            >
              My Profile
            </button>

            <button
              onClick={
                handleLogout
              }
              className="
              w-full
              text-left
              px-4
              py-3
              text-red-400
              hover:bg-[#22313B]
              transition
              "
            >
              Logout
            </button>

          </div>

        )}

      </div>

    </header>
  );
}