"use client";
import React, { useState, useRef } from "react";
import { FiShield } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { verifyEmail, verifyForgotPasswordOtp } from "@/api/auth"; // Add new API function
import { useToast } from "@/hooks/use-toast";
import { Error } from "../register/page";
import useAuthStore from "@/store/authStore";

const Verify = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill("")); // Store OTP values
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]); // Refs for inputs
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuthStore();

  // Extract the "type" parameter from query params
  const type = searchParams.get("type");

  const handleChange = (value: string, index: number) => {
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const { mutate: verifySignupOtp, isPending: isSignupPending } = useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
      toast({
        title: "Sign Up Verification",
        description: data.message,
      });
      router.push("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Sign Up Verification Failed",
        description: error.response.data.message,
        variant: "destructive",
      });
    },
  });

  const { mutate: verifyForgotOtp, isPending: isForgotPending } = useMutation({
    mutationFn: verifyForgotPasswordOtp, // New API function
    onSuccess: (data) => {
      toast({
        title: "Forgot Password Verification",
        description: data.message,
      });
      router.push("/reset-password"); // Navigate to reset password page
    },
    onError: (error: Error) => {
      toast({
        title: "Verification Failed",
        description: error.response.data.message,
        variant: "destructive",
      });
    },
  });

  const handleVerifyEmail = () => {
    const enteredOtp = otp.join("");
    if (type === "signup") {
      verifySignupOtp({ email: user!.email, otp: enteredOtp });
    } else if (type === "forgot-password") {
      const email: string = localStorage.getItem("user-email") as string;
      toast({
        title: "Verification Failed",
        description: "Email not found",
        variant: "destructive",
      });
      verifyForgotOtp({ email, forgotPasswordOTP: enteredOtp });
    } else {
      console.error("Invalid type parameter!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-96 bg-gray-50 px-4">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <FiShield size={40} className="text-primary" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          {type === "signup"
            ? "Sign Up Verification"
            : "Forgot Password Verification"}
        </h1>
        <p className="text-sm text-gray-500">
          Enter the 6-digit code sent to your email
        </p>
      </div>

      <div className="flex space-x-2">
        {otp.map((digit, index) => (
          <Input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            className="w-12 h-12 text-center text-lg font-semibold"
          />
        ))}
      </div>

      <Button
        onClick={handleVerifyEmail}
        disabled={otp.some((digit) => digit === "")}
        className={`mt-6 text-white ${
          otp.some((digit) => digit === "")
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        {isSignupPending || isForgotPending ? "Verifying..." : "Verify OTP"}
      </Button>
    </div>
  );
};

export default Verify;
