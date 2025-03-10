"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { FaUpload } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { createCategory } from "@/api/categories";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Zod schema for validation
const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Category name must be less than 50 characters"),
  image: z
    .any()
    .refine((file) => file && file.length > 0, "Category image is required")
    .refine((file) => file[0]?.size < 5000000, "Image must be smaller than 5MB")
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/webp"].includes(file[0]?.type),
      "Invalid image type"
    ),
});

type FormData = z.infer<typeof categorySchema>;

export type Error = {
  response: {
    data: {
      message: string;
    };
  };
};

const AddCategory = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(categorySchema),
  });

  const imageFile = watch("image"); // Watch the image file input

  // Update image preview when a new file is selected
  React.useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      setImagePreview(URL.createObjectURL(file)); // Generate a preview URL
    }
  }, [imageFile]);

  const { mutate, isPending } = useMutation({
    mutationFn: createCategory,
    onSuccess: (data) => {
      toast({
        title: "Category",
        description: data.message,
      });
      router.push("/dashboard/categories");
    },
    onError: (error: Error) => {
      toast({
        title: "Category Error",
        description: error.response.data.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }
    mutate(formData);
  };

  return (
    <div className="py-4">
      <div className="p-6 bg-white">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Add Category
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
                  // Display the image preview if available
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Category Image Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  // Default upload prompt
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

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button disabled={isPending}>
              {isPending ? "Adding..." : "Add Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
