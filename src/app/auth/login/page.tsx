import LoginGithub from '@/components/LoginGithub';
import LoginGoogle from '@/components/LoginGoogle';
import React from 'react';

export default function page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h3 className="text-2xl font-bold mb-6">Login</h3>
        <LoginGithub />
        <br />
        <LoginGoogle />
      </div>
    </div>
  );
}