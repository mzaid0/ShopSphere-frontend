/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  googleLogin,
  facebookLoginHandler,
  FacebookResponse,
} from "@/utils/socialAuth";
import { loginUser } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import useAuthStore from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa6";
import { z } from "zod";
import FacebookLogin from "@greatsumini/react-facebook-login";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type LoginFormData = z.infer<typeof loginSchema>;

interface APIError {
  response: {
    data: {
      message: string;
    };
  };
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { setUser } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setUser(data.user);
      toast({ title: "Login Success", description: data.message });
      if (data.user.role === "Admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    },
    onError: (error: APIError) => {
      toast({
        title: "Login Error",
        description: error.response.data.message,
        variant: "destructive",
      });
    },
  });
  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    mutate(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-[90%] max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 grid grid-cols-1 gap-4"
        >
          <h2 className="text-2xl font-bold mb-4">Login to your account</h2>
          <div>
            <Input type="email" placeholder="Email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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
          <Button
            type="submit"
            disabled={isPending}
            className="mt-4 text-white"
          >
            {isPending ? "Logging..." : "Login"}
          </Button>
          <Link
            href="/forgot-password"
            className="text-primary hover:opacity-80 font-medium"
          >
            Forgot password?
          </Link>
          <div className="text-sm flex items-center gap-3">
            Don&apos;t have an account?
            <Link
              href="/register"
              className="text-primary hover:opacity-80 font-medium"
            >
              Register
            </Link>
          </div>
          <div className="col-span-full mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
          </div>
        </form>
        <div className="container mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 hover:bg-gray-50"
            onClick={googleLogin}
          >
            <FcGoogle className="w-5 h-5" />
            <span className="text-gray-700">Google</span>
          </Button>
          <FacebookLogin
            appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID as string}
            fields="name,email,picture"
            scope="email,public_profile"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onProfileSuccess={(response: any) => {
              console.log("Get Profile Success:", response);
              const fbResponse: FacebookResponse = {
                name: response.name,
                email: response.email,
                picture: response.picture,
              };
              facebookLoginHandler(fbResponse);
            }}
            onFail={(error: any) => {
              console.error("Facebook Login Failed:", error);
            }}
            render={({ onClick }) => (
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 hover:bg-blue-50"
                onClick={onClick}
              >
                <FaFacebookF className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Facebook</span>
              </Button>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
