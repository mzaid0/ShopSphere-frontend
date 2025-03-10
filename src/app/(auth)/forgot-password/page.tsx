"use client";
import { forgotPassword } from "@/api/auth"; // Axios function for forgot password
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Zod Schema for Validation
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface Error {
  response: {
    data: {
      message: string;
    };
  };
}

const ForgotPassword: React.FC = () => {
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
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      toast({
        title: "Request Sent",
        description: data.message,
      });
      localStorage.setItem("user-email", data.user);
      router.push("/verify?type=forgot-password");
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
    mutate(data); // Call mutation function
  };

  return (
    <div className="container min-h-screen bg-gray-100">
      <div className="flex w-[90%] max-w-4xl my-6 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Forgot Password Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 p-8 grid grid-cols-1 gap-4"
        >
          <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

          <div>
            <Input type="email" placeholder="Email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="mt-4 text-white"
          >
            {isPending ? "Sending..." : "Confirm"}
          </Button>
          <Link
            href="/login"
            className="text-primary hover:opacity-80 font-[500]"
          >
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
