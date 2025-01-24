"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import LoginGoogle from "@/components/LoginGoogle";
import LoginGithub from "@/components/LoginGithub";
import { FaExclamationCircle } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

type FormData = {
  name: string;
  email: string;
  password: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: "onBlur" });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    setServerError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }
      await response.json();
      router.push("/auth/verify-email");
    } catch (error) {
      console.error("Error during registration:", error);
      setServerError(
        (error as Error).message || "An error occurred during registration."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white sm:p-8 p-4 mx-3 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Image src={'/assets/logo.png'} alt="logo" width={50} height={50}/>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
            Welcome to Task Manager
          </h3>
        </div>
        <div className="space-y-3">
          <LoginGoogle />
          <LoginGithub />
        </div>
        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 sm:mx-4 text-sm sm:text-base text-gray-500">
            or Sign up with Email
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {serverError && (
            <div className="flex items-center text-red-600 bg-red-200 p-2 text-sm border-l-4 border-red-500">
              <FaExclamationCircle className="mr-2" />
              <p>{serverError}</p>
            </div>
          )}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              UserName
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              {...register("name", {
                required: "Name is required",
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="taskmanager@mail.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Min. 6 characters"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-md text-white flex items-center justify-center text-sm sm:text-base ${
              loading ? "bg-gray-600 cursor-not-allowed" : "transition-colors"
            }`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Register"
            )}
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-sm sm:text-base text-gray-600">
            Already have an account?
          </span>
          <Link
            href="/auth/login"
            className="text-blue-500 hover:text-blue-800 font-semibold text-sm sm:text-base"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}