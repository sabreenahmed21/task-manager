import LoginForm from "@/components/LoginForm";
import LoginGithub from "@/components/LoginGithub";
import LoginGoogle from "@/components/LoginGoogle";
import Image from "next/image";
import Link from "next/link";


export default function page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white sm:p-8 p-4 mx-3 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Image src={'/assets/logo.png'} alt="logo" width={50} height={50}/>
          <h3 className="sm:text-2xl text-xl font-bold text-gray-800">
            Welcome to Task Manager
          </h3>
        </div>
        <div className="space-y-4">
          <LoginGoogle />
          <LoginGithub />
        </div>
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 sm:mx-4 text-sm sm:text-base text-gray-500">or Sign in with Email</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <LoginForm />

        <div className="mt-6 text-center">
          <span className="text-gray-600">Don&apos;t have an account? </span>
          <Link
            href="/auth/register"
            className="text-blue-500 hover:text-blue-800 font-semibold text-sm sm:text-base"
          >
            Create a free account
          </Link>
        </div>
      </div>
    </div>
  );
}
