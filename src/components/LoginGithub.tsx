"use client";
import { login } from "@/actions/auth";
import React from "react";
import { FaGithub } from "react-icons/fa";

export default function LoginGithub() {
  return (
    <button
      onClick={() => login("github")}
      className="w-full bg-white text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 border border-gray-300 hover:bg-gray-50 transition-colors"
    >
      <FaGithub className="text-xl" />
      <span>Continue with GitHub</span>
    </button>
  );
}
