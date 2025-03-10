"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaUpload } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { newSmallBanner } from "@/api/small-banner"; // API for creating a small banner
import { getCategories } from "@/api/categories"; // API to fetch all categories
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Category } from "@/components/Home/ProductsSlider";

// Updated Zod schema with "categoryId" instead of "category"
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
    .refine((file) => file && file.length > 0, "Banner image is required")
    .refine(
      (file) =>
        file &&
        file[0] &&
        ["image/jpeg", "image/png", "image/webp"].includes(file[0]?.type),
      "Invalid image type"
    ),
  categoryId: z.string().min(1, "Category is required"),
  alignInfo: z.enum(["left", "right"], {
    errorMap: () => ({ message: "Select a valid align option" }),
  }),
});

type FormDataType = z.infer<typeof bannerSchema>;

export type Error = {
  response: {
    data: {
      message: string;
    };
  };
};

const AddSmallBanner = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Set defaultValues for controlled fields
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<FormDataType>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      categoryId: "",
    },
  });

  // Fetch categories for the dropdown
  const { data: categoriesData } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      // If the response is an array, return it.
      // Otherwise, assume the response has a `categories` property.
      return Array.isArray(response) ? response : response.categories ?? [];
    },
  });

  const categories = categoriesData;

  console.log("Categories:", categoriesData);

  // Watch for changes to the image input and update the preview
  const imageFile = watch("image");
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [imageFile]);

  // Mutation for creating a small banner
  const { mutate, isPending } = useMutation({
    mutationFn: newSmallBanner,
    onSuccess: (data) => {
      toast({
        title: "Small Banner",
        description: data.message,
      });
      router.push("/dashboard/small-banners");
    },
    onError: (error: Error) => {
      toast({
        title: "Small Banner Error",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormDataType) => {
    // Prepare FormData for multipart/form-data submission
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    // Append using the backend-expected key "categoryId"
    formData.append("categoryId", data.categoryId);
    formData.append("alignInfo", data.alignInfo);
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }
    mutate(formData);
    reset();
    setImagePreview(null);
  };

  return (
    <div className="py-4">
      <div className="p-6 bg-white">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Add Small Banner
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
              className={`w-full p-4 mt-2 ${
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
            <Textarea
              id="description"
              placeholder="Enter banner description"
              className={`w-full p-2 mt-2 resize-none h-20 ${
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

          {/* Category Selection using ShadCN Select */}
          <div>
            <label htmlFor="categoryId" className="block text-gray-700">
              Category
            </label>
            <Controller
              name="categoryId"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    className={`w-full mt-2 ${
                      errors.categoryId ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Array.isArray(categoriesData)
                      ? categoriesData
                      : categories || []
                    ).map((cat: { id: string; name: string }) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Align Info Selection using ShadCN Select */}
          <div>
            <label htmlFor="alignInfo" className="block text-gray-700">
              Align Info
            </label>
            <Controller
              name="alignInfo"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    className={`w-full mt-2 ${
                      errors.alignInfo ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <SelectValue placeholder="Select align option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.alignInfo && (
              <p className="text-sm text-red-500 mt-1">
                {errors.alignInfo.message}
              </p>
            )}
          </div>

          {/* Banner Image Upload */}
          <div>
            <label htmlFor="image" className="block text-gray-700">
              Banner Image
            </label>
            <div
              className={`w-full mt-2 p-6 border-2 border-dashed rounded-md shadow-sm bg-gray-100 ${
                errors.image ? "border-red-500" : "border-gray-300"
              }`}
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

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button disabled={isPending}>
              {isPending ? "Adding..." : "Add Small Banner"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSmallBanner;
