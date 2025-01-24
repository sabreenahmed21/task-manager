"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";

type FormData = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<{ field: string; message: string } | null>(
    null
  );
  const [pending, setPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setError(null);
    setPending(true);

    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (res?.error) {
        switch (res.error) {
          case "CredentialsSignin":
            if (res.code === "UserNotFound") {
              setError({
                field: "email",
                message: "This email is not registered.",
              });
            } else if (res.code === "CreatedUsingProvider") {
              setError({
                field: "email",
                message:
                  "This account was created using Google or GitHub. Please log in using Google or GitHub or sign up with this email.",
              });
            } else if (res.code === "PasswordIncorrect") {
              setError({
                field: "password",
                message: "The password is incorrect.",
              });
            } else {
              setError({
                field: "",
                message: "Invalid email or password.",
              });
            }
            break;
          default:
            setError({
              field: "",
              message: "An unknown error occurred. Please try another way.",
            });
        }
        return;
      }
      router.push("/");
    } catch (err) {
      console.error("Unexpected error:", err);
      setError({
        field: "",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {error?.field === "" && (
        <div className="flex items-center text-red-500 text-sm mt-1 border-l-4 border-red-500 pl-2">
          <p>{error.message}</p>
        </div>
      )}
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
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
        {error?.field === "email" && (
          <p className="text-red-500 text-sm mt-1">{error.message}</p>
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
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
        {error?.field === "password" && (
          <p className="text-red-500 text-sm mt-1">{error.message}</p>
        )}
      </div>
      <div className="flex justify-end">
    <Link
      href={"/auth/forget-password"}
      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
    >
      Forgot password?
    </Link>
  </div>
      <button
        type="submit"
        disabled={pending}
        className={`w-full bg-gray-900 hover:bg-gray-800  px-4 py-2 rounded-md text-white flex items-center justify-center ${
          pending
            ? "bg-gray-600 cursor-not-allowed"
            : "transition-colors"
        }`}
      >
        {pending ? (
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
          "Login"
        )}
      </button>
      
    </form>
  );
}
