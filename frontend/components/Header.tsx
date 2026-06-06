"use client";

import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (
    value: boolean
  ) => void;
}) {

  const [name, setName] =
    useState("");

  useEffect(() => {

    const storedName =
      localStorage.getItem("name");

    if (storedName) {
      setName(storedName);
    }

  }, []);

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
      <div
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
            ? name.charAt(0).toUpperCase()
            : "U"}
        </div>

      </div>

    </header>
  );
}