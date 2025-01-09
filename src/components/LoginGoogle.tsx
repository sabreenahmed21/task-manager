'use client';
import { login } from '@/actions/auth';
import React from 'react';
import { FaGoogle } from 'react-icons/fa';

export default function LoginGoogle() {
  return (
    <button
      onClick={() => login("google")}
      className="bg-white text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 border border-gray-300 hover:bg-gray-50 transition-colors"
    >
      <FaGoogle className="text-xl" />
      <span>Continue with Google</span>
    </button>
  );
}