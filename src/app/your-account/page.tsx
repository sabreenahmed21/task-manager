import { auth } from '@/auth';
import Image from 'next/image';
import React from 'react';

export default async function ProfilePage() {
  const session = await auth();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full text-center">
        <Image
          src={session?.user?.image || '/assets/default-avatar.png'}
          alt="Profile Image"
          width={150}
          height={150}
          className="rounded-full mx-auto border-4 border-blue-500 shadow-md"
        />
        <h2 className="mt-4 text-xl font-bold text-gray-800">Your Name:</h2>
        <p className="text-gray-600">{session?.user?.name || 'No Name Available'}</p>

        <h2 className="mt-4 text-xl font-bold text-gray-800">Your Email:</h2>
        <p className="text-gray-600">{session?.user?.email || 'No Email Available'}</p>
      </div>
    </div>
  );
}
