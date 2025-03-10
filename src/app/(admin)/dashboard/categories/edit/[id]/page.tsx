"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { FaUpload } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSingleCategory, updateCategory } from "@/api/categories";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

// Zod schema for validation
const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Category name must be less than 50 characters"),
  image: z
    .any()
    .refine(
      (file) => !file || (file.length > 0 && file[0]?.size < 5000000),
      "Image must be smaller than 5MB"
    )
    .refine(
      (file) =>
        !file ||
        ["image/jpeg", "image/png", "image/webp"].includes(file[0]?.type),
      "Invalid image type (JPEG, PNG, WebP only)"
    ),
});

type FormDataType = z.infer<typeof categorySchema>;

interface Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const UpdateCategory = () => {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.id as string;

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch category data
  const {
    data: categoryData,
    isError,
    error,
    isLoading: isFetching,
  } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => getSingleCategory(categoryId),
    enabled: !!categoryId, // Fetch only if categoryId exists
  });

  console.log(categoryData);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormDataType>({
    resolver: zodResolver(categorySchema),
  });

  // Watch image file for preview
  const imageFile = watch("image");

  useEffect(() => {
    if (categoryData) {
      setValue("name", categoryData.category.name);
      setImagePreview(categoryData.category.image); // Set existing image URL for preview
    }
  }, [categoryData, setValue]);

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [imageFile]);

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) => updateCategory(categoryId, formData),
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message,
      });
      router.push("/dashboard/categories");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormDataType) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }
    mutate(formData);
  };
  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 font-semibold">
          Error fetching categories:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Update Category
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Category Name Field */}
          <div>
            <label htmlFor="name" className="block text-gray-700">
              Category Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Enter category name"
              className={`w-full p-4 mt-2 border rounded-md shadow-sm ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Category Image Upload */}
          <div>
            <label htmlFor="image" className="block text-gray-700">
              Category Image
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
                      alt="Category Image Preview"
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
              onClick={() => router.push("/dashboard/categories")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || isFetching}>
              {isPending || isFetching ? "Updating..." : "Update Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCategory;
