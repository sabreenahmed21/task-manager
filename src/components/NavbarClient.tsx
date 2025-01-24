"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import Logout from "./Logout";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface NavbarClientProps {
  session: {
    user?: {
      name?: string;
      email?: string;
      image?: string;
    };
  };
}

export default function NavbarClient({ session }: NavbarClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter()

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

  return (
    <nav className="bg-custom-color py-4  px-6 flex justify-between items-center">
      <Link href="/dashboard" className="text-white text-xl sm:text-2xl font-bold">
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
              {session?.user?.image && (
                <div className="rounded-full overflow-hidden w-10 h-10">
                  <Image
                    src={session?.user?.image || "/assets/default-avatar.png"}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <button
                    onClick={() => {
                      router.push('/auth/change-password')
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Change Password
                  </button>
                  <Logout />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
