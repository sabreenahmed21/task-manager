'use client';
import { logout } from "@/actions/auth";
import { FaSignOutAlt } from "react-icons/fa";

export default function Logout() {
  return (
    <button
      onClick={() => logout()}
      className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
    >
      <FaSignOutAlt className="text-xl" />
      <span>Logout</span>
    </button>
  );
}