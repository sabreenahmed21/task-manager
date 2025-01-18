"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";

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
      router.push('/');
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
      <button
        type="submit"
        disabled={pending}
        className={`w-full px-4 py-2 rounded-md text-white ${
          pending
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-black hover:bg-gray-800 transition-colors"
        }`}
      >
        {pending ? (
          <span className="flex items-center justify-center space-x-2">
            <svg
              className="w-5 h-5 animate-spin text-white"
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
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <span>Logging in...</span>
          </span>
        ) : (
          "Login"
        )}
      </button>
    </form>
  );
}
