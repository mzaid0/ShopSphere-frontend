"use client";
import { getUserDetails, updateUser } from "@/api/auth";
import TruckLoader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import useAuthStore from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdOutlineFileUpload } from "react-icons/md";
import { z } from "zod";
import userT from "../../assets/user.webp";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const updateUserSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    addresses: z.object({
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
    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

interface ErrorResponse {
  message: string;
}

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

const AccountAndUpdate: React.FC = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const { user, setUser } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const id = user?.id as string;

  const {
    data: userDetails,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user-details"],
    queryFn: getUserDetails,
  });

  useEffect(() => {
    if (userDetails) {
      setValue("firstName", userDetails.user?.firstName);
      setValue("lastName", userDetails.user?.lastName);
      setValue("email", userDetails.user?.email);
      setValue("phone", userDetails.user?.phone);
      setValue("addresses", {
        addressLine: userDetails.user?.addresses[0]?.addressLine,
        city: userDetails.user?.addresses[0]?.city,
        state: userDetails.user?.addresses[0]?.state,
        zipCode: userDetails.user?.addresses[0]?.zipCode,
        country: userDetails.user?.addresses[0]?.country,
      });
      setValue("avatar", userDetails?.user.avatar);
      const userGender = userDetails.user?.gender;
      const validGender = ["Male", "Female", "Other"].includes(userGender || "")
        ? userGender
        : "Other";
      setValue("gender", validGender as "Male" | "Female" | "Other");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateUser(id, data),
    onSuccess: (data) => {
      setUser(data.user);
      setShowChangePasswordForm(false);
      toast({
        title: "Profile Updated",
        description: data.message,
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: "Update Error",
        description: error.response?.data.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  const onSubmit: SubmitHandler<UpdateUserFormData> = (data) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("gender", data.gender);

    if (data.oldPassword) formData.append("oldPassword", data.oldPassword);
    if (data.newPassword) formData.append("newPassword", data.newPassword);

    formData.append("address[addressLine]", data.addresses.addressLine);
    formData.append("address[city]", data.addresses.city);
    formData.append("address[state]", data.addresses.state);
    formData.append("address[zipCode]", data.addresses.zipCode);
    formData.append("address[country]", data.addresses.country);

    if (data.avatar?.[0]) formData.append("avatar", data.avatar[0]);

    mutate({ id, data: formData });
  };

  if (isError) {
    return (
      <Alert variant="default" className="mt-8 w-1/4 mx-auto bg-white">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="capitalize m-2">
          {(error as AxiosError<ErrorResponse>)?.response?.data?.message ||
            "Failed to load user data"}
        </AlertDescription>
        <Button>
          <Link href="/login">Login Again</Link>
        </Button>
      </Alert>
    );
  }

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      {isLoading ? (
        <div className="w-full mx-auto h-full flex items-center justify-center">
          <div className=" mb-8 h-full">
            <TruckLoader />
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="flex bg-white  p-6 rounded-lg shadow-sm items-center justify-between mb-8">
            <h1 className="text-xl sm:3xl md:text-2xl lg:text-2xl font-bold text-gray-900">
              Account Settings
            </h1>
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>

          <div className="bg-white p-6 shadow-sm rounded-lg">
            <h1>
              <CardTitle className="text-xl">Profile Information</CardTitle>
            </h1>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg">
                      <Image
                        src={user?.avatar || userT}
                        alt="Avatar"
                        width={128}
                        height={128}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <label
                      htmlFor="avatarInput"
                      className="absolute bottom-0 right-0 bg-primary rounded-full p-2 cursor-pointer shadow-md hover:bg-primary/90 transition-colors"
                    >
                      <MdOutlineFileUpload className="h-6 w-6 text-white" />
                      <span className="sr-only">Upload new avatar</span>
                    </label>
                    <input
                      id="avatarInput"
                      type="file"
                      {...register("avatar")}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  {errors.avatar && (
                    <p className="text-red-500 text-sm">
                      {errors.avatar.message as string}
                    </p>
                  )}
                </div>

                {/* Personal Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <Input
                      {...register("firstName")}
                      className="focus:ring-2 focus:ring-primary/50"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <Input
                      {...register("lastName")}
                      className="focus:ring-2 focus:ring-primary/50"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      {...register("email")}
                      disabled
                      className="bg-gray-100 opacity-75"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <Input
                      {...register("phone")}
                      className="focus:ring-2 focus:ring-primary/50"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <Select
                      value={watch("gender")}
                      onValueChange={(value: "Male" | "Female" | "Other") =>
                        setValue("gender", value)
                      }
                    >
                      <SelectTrigger className="focus:ring-2 focus:ring-primary/50">
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

                {/* Address Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Address Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        label: "Street Address",
                        name: "addresses.addressLine",
                      },
                      { label: "City", name: "addresses.city" },
                      { label: "State", name: "addresses.state" },
                      { label: "Zip Code", name: "addresses.zipCode" },
                      { label: "Country", name: "addresses.country" },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                        </label>
                        <Input
                          {...register(field.name as keyof UpdateUserFormData)}
                          className="focus:ring-2 focus:ring-primary/50"
                        />
                        {errors.addresses &&
                          errors.addresses[
                            field.name.split(
                              "."
                            )[1] as keyof typeof errors.addresses
                          ] && (
                            <p className="text-red-500 text-xs mt-1">
                              {
                                (
                                  errors.addresses?.[
                                    field.name.split(
                                      "."
                                    )[1] as keyof typeof errors.addresses
                                  ] as import("react-hook-form").FieldError
                                )?.message
                              }
                            </p>
                          )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Password Section */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className=" font-semibold text-gray-900 ">
                      Password Settings
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() =>
                        setShowChangePasswordForm(!showChangePasswordForm)
                      }
                    >
                      {showChangePasswordForm ? "Cancel" : "Change Password"}
                    </Button>
                  </div>

                  {showChangePasswordForm && (
                    <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                      {[
                        {
                          label: "Current Password",
                          name: "oldPassword",
                          state: showOldPassword,
                          setState: setShowOldPassword,
                        },
                        {
                          label: "New Password",
                          name: "newPassword",
                          state: showNewPassword,
                          setState: setShowNewPassword,
                        },
                        {
                          label: "Confirm Password",
                          name: "confirmPassword",
                          state: showConfirmPassword,
                          setState: setShowConfirmPassword,
                        },
                      ].map((field) => (
                        <div key={field.name}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label}
                          </label>
                          <div className="relative">
                            <Input
                              type={field.state ? "text" : "password"}
                              {...register(
                                field.name as keyof UpdateUserFormData
                              )}
                              className="focus:ring-2 focus:ring-primary/50 pr-10"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                              onClick={() => field.setState(!field.state)}
                            >
                              {field.state ? (
                                <AiOutlineEyeInvisible className="h-5 w-5" />
                              ) : (
                                <AiOutlineEye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                          {errors[field.name as keyof typeof errors] && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors[field.name as keyof typeof errors] && (
                                <p className="text-red-500 text-xs mt-1">
                                  {
                                    (
                                      errors[
                                        field.name as keyof typeof errors
                                      ] as { message?: string }
                                    )?.message
                                  }
                                </p>
                              )}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountAndUpdate;
