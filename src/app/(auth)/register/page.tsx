"use client";
import { registerUser } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import useAuthStore from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaFacebookF } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineFileUpload } from "react-icons/md";
import { z } from "zod";
import Tuser from "../../../assets/user.webp";
import {
  googleLogin,
  facebookLoginHandler,
  FacebookResponse,
} from "@/utils/socialAuth";
import FacebookLogin from "@greatsumini/react-facebook-login";

const registrationSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
    address: z.object({
      addressLine: z.string().min(5, "Street is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      zipCode: z.string().min(5, "Zip Code must be at least 5 digits"),
      country: z.string().min(1, "Country is required"),
    }),
    gender: z.enum(["Male", "Female", "Other"], {
      errorMap: () => ({ message: "Gender is required" }),
    }),
    avatar: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export interface Error {
  response: {
    data: {
      message: string;
    };
  };
}

type RegistrationFormData = z.infer<typeof registrationSchema>;

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setUser } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setUser(data.user);
      toast({
        title: "Verify email",
        description: data.message,
      });
      router.push("/verify?type=signup");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Error",
        description: error.response.data.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit: SubmitHandler<RegistrationFormData> = (data) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("password", data.password);
    formData.append("gender", data.gender);
    formData.append("address[addressLine]", data.address.addressLine);
    formData.append("address[city]", data.address.city);
    formData.append("address[state]", data.address.state);
    formData.append("address[zipCode]", data.address.zipCode);
    formData.append("address[country]", data.address.country);
    if (data.avatar && data.avatar.length > 0) {
      formData.append("avatar", data.avatar[0]);
    }
    mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="flex flex-col w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden relative">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="relative mx-auto col-span-full">
            <div className="w-32 h-32 md:w-40 md:h-40 mx-auto group relative">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-100">
                <Image
                  src={Tuser}
                  alt="Avatar"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <label
                htmlFor="avatarInput"
                className="absolute inset-0 flex items-center justify-center bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
              >
                <div className="text-center">
                  <MdOutlineFileUpload className="w-8 h-8 md:w-10 md:h-10 mx-auto animate-bounce" />
                  <span className="text-xs font-medium mt-1 block">
                    Upload Photo
                  </span>
                </div>
              </label>
              <input
                id="avatarInput"
                type="file"
                {...register("avatar")}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-center col-span-full mt-16 mb-8 text-gray-800">
            Create Account
          </h2>

          <div className="space-y-4 col-span-full md:col-span-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <Input
                type="text"
                placeholder="John"
                {...register("firstName")}
                className="focus-visible:ring-primary"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <Input
                type="text"
                placeholder="Doe"
                {...register("lastName")}
                className="focus-visible:ring-primary"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                placeholder="john@example.com"
                {...register("email")}
                className="focus-visible:ring-primary"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <Input
                type="tel"
                placeholder="+1 234 567 890"
                {...register("phone")}
                className="focus-visible:ring-primary"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4 col-span-full md:col-span-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="focus-visible:ring-primary"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className="focus-visible:ring-primary"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-primary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible />
                  ) : (
                    <AiOutlineEye />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <Input
                type="text"
                placeholder="123 Main St"
                {...register("address.addressLine")}
                className="focus-visible:ring-primary"
              />
              {errors.address?.addressLine && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.address.addressLine.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <Input
                  type="text"
                  placeholder="New York"
                  {...register("address.city")}
                  className="focus-visible:ring-primary"
                />
                {errors.address?.city && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address.city.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <Input
                  type="text"
                  placeholder="NY"
                  {...register("address.state")}
                  className="focus-visible:ring-primary"
                />
                {errors.address?.state && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address.state.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zip Code
                </label>
                <Input
                  type="text"
                  placeholder="10001"
                  {...register("address.zipCode")}
                  className="focus-visible:ring-primary"
                />
                {errors.address?.zipCode && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address.zipCode.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <Input
                  type="text"
                  placeholder="United States"
                  {...register("address.country")}
                  className="focus-visible:ring-primary"
                />
                {errors.address?.country && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address.country.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <Select
                onValueChange={(value: "Male" | "Female" | "Other") =>
                  setValue("gender", value)
                }
              >
                <SelectTrigger className="w-full focus:ring-primary">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>
          </div>

          <div className="col-span-full flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full md:w-auto px-8 bg-primary hover:bg-primary/90 transition-colors"
            >
              {isPending ? "Registering..." : "Create Account"}
            </Button>
            <p className="text-sm text-gray-600 text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>

        <div className="container mb-6 col-span-full mt-8">
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

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                const fbResponse: FacebookResponse = {
                  name: response.name,
                  email: response.email,
                  picture: response.picture,
                };
                facebookLoginHandler(fbResponse);
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    </div>
  );
};

export default Register;
