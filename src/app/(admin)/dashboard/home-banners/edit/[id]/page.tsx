"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { FaUpload } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { getSingleBanner, updateBanner } from "@/api/banner";

// Zod schema for updating a banner. For updates, the image is optional.
const bannerSchema = z.object({
  title: z
    .string()
    .min(1, "Banner title is required")
    .max(50, "Banner title must be less than 50 characters"),
  description: z
    .string()
    .min(1, "Banner description is required")
    .max(200, "Banner description must be less than 200 characters"),
  image: z
    .any()
    .optional()
    .refine(
      (file) => !file || (file && file.length > 0),
      "Banner image is required"
    )
    .refine(
      (file) => !file || file[0]?.size < 15000000,
      "Image must be smaller than 15MB"
    )
    .refine(
      (file) =>
        !file ||
        ["image/jpeg", "image/png", "image/webp"].includes(file[0]?.type),
      "Invalid image type"
    ),
});

type FormData = z.infer<typeof bannerSchema>;
interface Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const UpdateBanner = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { id } = useParams(); // Banner ID from URL parameters
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch the current banner data
  const {
    data: bannerData,
    isLoading: isBannerLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["banner", id],
    queryFn: () => getSingleBanner(id as string),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(bannerSchema),
  });

  // Prepopulate form fields and set the initial image preview when banner data is loaded
  useEffect(() => {
    if (bannerData?.banner) {
      reset({
        title: bannerData.banner.title,
        description: bannerData.banner.description,
      });
      setImagePreview(bannerData.banner.image);
    }
  }, [bannerData, reset]);

  // Watch for changes in the image input and update the preview
  const imageFile = watch("image");
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [imageFile]);

  // Mutation for updating the banner
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      // Append a new image if provided; if not, the API should retain the existing image.
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }
      return await updateBanner(id as string, formData);
    },
    onSuccess: (data) => {
      toast({
        title: "Banner Updated",
        description: data.message,
      });
      router.push("/dashboard/home-banners");
    },
    onError: (error: Error) => {
      toast({
        title: "Banner Update Error",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data);
    // We intentionally do not call reset() so that the form stays populated.
  };

  if (isBannerLoading) {
    return (
      <div className="py-4 flex items-center justify-center">
        <p>Loading banner data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-4 flex items-center justify-center">
        <p>
          Error loading banner data:
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Update Banner
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Banner Title Field */}
          <div>
            <label htmlFor="title" className="block text-gray-700">
              Banner Title
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Enter banner title"
              className={`w-full p-4 mt-2 border rounded-md shadow-sm ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Banner Description Field */}
          <div>
            <label htmlFor="description" className="block text-gray-700">
              Banner Description
            </label>
            <textarea
              id="description"
              placeholder="Enter banner description"
              className={`w-full p-2 mt-2 border rounded-md shadow-sm resize-none h-20 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Banner Image Upload */}
          <div>
            <label htmlFor="image" className="block text-gray-700">
              Banner Image
            </label>
            <div
              className={`w-full mt-2 p-6 border-2 border-dashed rounded-md shadow-sm ${
                errors.image ? "border-red-500" : "border-gray-300"
              } bg-gray-100`}
            >
              <label
                htmlFor="image"
                className="w-full h-full flex flex-col items-center justify-center text-gray-600 cursor-pointer"
              >
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("image")}
                />
                {imagePreview ? (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Banner Image Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <FaUpload className="text-4xl mb-3 mx-auto" />
                    <p className="text-sm">
                      Click or drag to upload an image (JPEG, PNG, WebP, max
                      size 5MB)
                    </p>
                  </div>
                )}
              </label>
            </div>
            {errors.image && (
              <p className="text-sm text-red-500 mt-1">
                {errors.image.message as string}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/home-banners")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Banner"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBanner;
