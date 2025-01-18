import LoginForm from "@/components/LoginForm";
import LoginGithub from "@/components/LoginGithub";
import LoginGoogle from "@/components/LoginGoogle";
import Link from "next/link";
import { FaTasks } from "react-icons/fa";

export default function page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <FaTasks className="text-2xl text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-800">
            Welcome to Task Manager
          </h3>
        </div>
        <div className="space-y-4">
          <LoginGoogle />
          <LoginGithub />
        </div>
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">or Sign in with Email</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <LoginForm />

        <div className="mt-6 text-center">
          <span className="text-gray-600">Don&apos;t have an account? </span>
          <Link
            href="/auth/register"
            className="text-blue-500 hover:text-blue-800 font-semibold"
          >
            Create a free account
          </Link>
        </div>
      </div>
    </div>
  );
}
