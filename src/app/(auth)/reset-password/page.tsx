"use client";
import { resetPassword } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Error {
  response: {
    data: {
      message: string;
    };
  };
}

// Zod Schema for Validation
const forgotPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toast({
        title: "Login Success",
        description: data.message,
      });
      localStorage.removeItem("user-email");
      router.push("/login"); // Redirect to home page
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.response.data.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = (data) => {
    const email = localStorage.getItem("user-email") as string;
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
    }
    mutate({
      email,
      newPassword: data.password,
      confirmPassword: data.confirmPassword,
    });

  };

  return (
    <div className="container min-h-screen bg-gray-100">
      <div className="flex w-[90%] max-w-4xl my-6 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 p-8 grid grid-cols-1 gap-4"
        >
          <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              {...register("password")}
            />
            <span
              className="absolute right-3 top-3 text-gray-600 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              {...register("confirmPassword")}
            />
            <span
              className="absolute right-3 top-3 text-gray-600 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </span>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="mt-4 text-white">
            {isPending ? "Resetting Password..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
