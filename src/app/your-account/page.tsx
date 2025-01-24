"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 relative">
      <Link
        href={"/dashboard"}
        className="absolute top-4 left-4 px-6 py-2 text-black font-semibold flex items-center gap-2"
      >
        <FaArrowLeft />Back
      </Link>
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center transform hover:scale-105 transition-transform duration-300">
        <div className="relative w-32 h-32 mx-auto">
          <Image
            src={session?.user?.image || "/assets/default-avatar.png"}
            alt="Profile Image"
            fill
            className="rounded-full object-cover border-4 border-blue-500 shadow-lg"
          />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-gray-800">Your Name:</h2>
        <p className="text-gray-600 text-lg">
          {session?.user?.name || "No Name Available"}
        </p>

        <h2 className="mt-4 text-2xl font-bold text-gray-800">Your Email:</h2>
        <p className="text-gray-600 text-lg">
          {session?.user?.email || "No Email Available"}
        </p>
      </div>
    </div>
  );
}