'use client';
import { logout } from "@/actions/auth";
import { FaSignOutAlt } from "react-icons/fa";

export default function Logout() {
  return (
    <button
      onClick={() => logout()}
      className="w-full px-4 py-2 text-sm flex items-center justify-center hover:bg-gray-100"
    >
      <FaSignOutAlt className="text-lg" />
      <span className="pl-2">Logout</span>
    </button>
  );
}