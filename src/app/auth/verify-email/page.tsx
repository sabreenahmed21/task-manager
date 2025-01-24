"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const VerifyCodeForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean | null>(null);
  const router = useRouter();
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(6).fill(null));

  // Focus on the first input box on page load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    const newCode = code.split("");
    newCode[index] = value;
    setCode(newCode.join(""));

    // Move to the next input box if a value is entered
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Move to the previous input box on backspace
    if (
      e.key === "Backspace" &&
      !code[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // If the copied text consists of 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      setCode(pastedData);

      pastedData.split("").forEach((char, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index]!.value = char;
        }
      });

      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(null);
    setLoading(true);

    try {
      const response = await fetch("/api/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setIsSuccess(true);
        Swal.fire({
          icon: "success",
          title: "Email is verified",
          text: "Account is created and email verified successfully!",
          showConfirmButton: false,
          timer: 3000,
        });
        router.push("/auth/login");
      } else {
        setIsSuccess(false);
        setMessage(data.error || "Verification failed.");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setIsSuccess(false);
      setMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-5 text-center bg-white rounded-lg mt-10 ">
      <h2 className="mb-5 text-2xl font-bold text-gray-800">Verify Your Email</h2>
      <form onSubmit={handleSubmit} className="mb-5">
        <div className="mb-5">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-base"
          />
        </div>
        <div className="flex justify-between mb-5">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={code[index] || ""}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md mx-1"
            />
          ))}
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 transition-colors"
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white mx-auto"
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
            "Verify"
          )}
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 text-sm ${
            isSuccess ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default VerifyCodeForm;