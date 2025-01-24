"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";

type FormData = {
  currentPassword: string;
  newPassword: string;
};

export default function ChangePasswordForm() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!session) {
      setMessage("You must be logged in to change your password.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Change Password",
          text: result.message,
          timer: 1000
        })
        reset();
        router.push("/dashboard");
      } else {
        switch (result.error) {
          case "This user does not have a password, is logged in with a Google or GitHub account.":
            setMessage("You signed up with Google or GitHub. Please use that method to log in.");
            break;
          case "Current password is incorrect":
            setMessage("The current password you entered is incorrect.");
            break;
          default:
            setMessage(result.error);
        }
      }
    } catch {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-sm mx-auto mt-10 p-6 bg-white shadow-md rounded-lg"
    >
      <div className="mb-4">
        <label
          htmlFor="currentPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Current Password
        </label>
        <input
          type="password"
          id="currentPassword"
          {...register("currentPassword", {
            required: "Current password is required",
          })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        />
        {errors.currentPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
        )}
      </div>
      <div className="mb-6">
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-gray-700"
        >
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          {...register("newPassword", {
            required: "New password is required",
            minLength: {
              value: 6,
              message: "New password must be at least 8 characters long",
            },
          })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        />
        {errors.newPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
        disabled={loading}
      >
        {loading ? (
          <>
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
            Changing...
          </>
        ) : (
          "Change Password"
        )}
      </button>
      {message && (
        <p className="mt-4 text-center text-sm text-red-700">{message}</p>
      )}
    </form>
  );
}