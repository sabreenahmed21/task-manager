import { auth } from "@/auth";
import Link from "next/link";
import React from "react";
import Logout from "./Logout";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

export default async function Navbar() {
  const session = await auth();
  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center">
      <Link href="/" className="text-white text-2xl font-bold">
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
          <div className="flex items-center space-x-4">
            <span className="text-white">{session?.user?.name}</span>
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
            <Logout />
          </div>
        )}
      </div>
    </nav>
  );
}