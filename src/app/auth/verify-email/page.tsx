"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const VerifyCodeForm: React.FC = () => {
  const [email, setEmail] = useState<string>(""); 
  const [code, setCode] = useState<string>(""); 
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean | null>(null);
  const router = useRouter();
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(6).fill(null)); 

  // التركيز على المربع الأول عند تحميل الصفحة
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    // تحديث القيمة الكاملة للرمز
    const newCode = code.split("");
    newCode[index] = value;
    setCode(newCode.join(""));

    // الانتقال إلى المربع التالي إذا تم إدخال قيمة
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // الانتقال إلى المربع السابق 
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
    const pastedData = e.clipboardData.getData("text").trim(); // Get copied text

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
    setLoading(true)

    try {
      const response = await fetch("/api/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }), 
      });

      const data = await response.json();
      setLoading(false)

      if (response.ok) {
        setIsSuccess(true);
        setMessage(data.message || "Email verified successfully!");
        setTimeout(() => {
          router.push("/auth/login");
        }, 1000);
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
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "20px", color: "#333" }}>Verify Your Email</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "5px", color: "#555" }}
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
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
              style={{
                width: "40px",
                height: "40px",
                textAlign: "center",
                fontSize: "18px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                margin: "0 5px",
              }}
            />
          ))}
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {loading ? 
          (
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
          )  : 
          ("Verify")}
        </button>
      </form>
      {message && (
        <p
          style={{
            marginTop: "15px",
            color: isSuccess ? "green" : "red",
            fontSize: "14px",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default VerifyCodeForm;
