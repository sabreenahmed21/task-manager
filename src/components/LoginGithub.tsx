'use client';
import { login } from '@/actions/auth';
import React from 'react';
import { FaGithub } from 'react-icons/fa';

export default function LoginGithub() {
  return (
    <button
      onClick={() => login("github")}
      className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
    >
      <FaGithub className="text-xl" />
      <span>Continue with GitHub</span>
    </button>
  );
}