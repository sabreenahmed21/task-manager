import LoginGithub from '@/components/LoginGithub';
import LoginGoogle from '@/components/LoginGoogle';
import LoginForm from '@/components/LoginForm';
import React from 'react';

export default function page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-2xl font-bold mb-6 text-center">Login</h3>
        <LoginForm />
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <div className="space-y-4">
          <LoginGithub />
          <LoginGoogle />
        </div>
      </div>
    </div>
  );
}