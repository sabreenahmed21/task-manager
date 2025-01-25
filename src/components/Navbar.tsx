"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import Logout from "./Logout";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { logout } from "@/actions/auth";
import Swal from "sweetalert2";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      const response = await fetch("/api/delete-account", {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok) {
        await Swal.fire({
          title: "Deleted!",
          text: "Your account has been deleted.",
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
        });
        await logout();
      } else {
        await Swal.fire({
          title: "Error",
          text: data.message || "Something went wrong!",
          icon: "error",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    }
  };

  return (
    <nav className="bg-custom-color py-4  px-6 flex justify-between items-center">
      <Link
        href="/dashboard"
        className="text-white text-xl sm:text-2xl font-bold"
      >
        Task Manager
      </Link>
      <div className="flex items-center space-x-4">
        {!session?.user ? (
          <Link href="/auth/login">
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg flex items-center space-x-2">
              <FaUserCircle className="text-xl" />
              <span>Login</span>
            </button>
          </Link>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center cursor-pointer focus:outline-none"
            >
              <span className="text-white pr-2">{session?.user?.name}</span>
              <Image
                src={session?.user?.image || "/assets/default-avatar.png"}
                alt="Profile Image"
                width={30}
                height={30}
                className="rounded-full border-2 border-solid border-gray-600 bg-gray-100"
              />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <button
                    onClick={() => {
                      router.push("/your-account");
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Your Account
                  </button>
                  <button
                    onClick={() => {
                      router.push("/auth/change-password");
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Change Password
                  </button>
                  <Logout />
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
