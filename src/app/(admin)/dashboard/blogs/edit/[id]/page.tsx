"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { FaUpload } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Editor from "react-simple-wysiwyg";
import { getSingleBlog, updateBlog } from "@/api/blogs";

// Define the Zod schema for updating a blog.
// Note: On update the image is optional.
const blogSchema = z.object({
  title: z
    .string()
    .min(1, "Blog title is required")
    .max(100, "Blog title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Blog description is required")
    .max(2000, "Blog description must be less than 2000 characters"),
  image: z
    .any()
    .optional()
    .refine(
      (file) => !file || (file && file.length > 0),
      "Blog image is required"
    )
    .refine(
      (file) => !file || file[0]?.size < 15000000,
      "Image must be smaller than 15MB"
    )
    .refine(
      (file) =>
        !file ||
        (file &&
          ["image/jpeg", "image/png", "image/webp"].includes(file[0]?.type)),
      "Invalid image type"
    ),
});

type FormData = z.infer<typeof blogSchema>;

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const UpdateBlog = () => {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const blogId = params?.id as string; // Ensure the URL provides a blog id

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      description: "",
      image: undefined,
    },
  });

  // Fetch the existing blog data using useQuery
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: () => getSingleBlog(blogId),
    enabled: !!blogId,
  });

  // When the fetched blog data is available, prepopulate the form fields
  useEffect(() => {
    if (data?.blog) {
      reset({
        title: data.blog.title,
        description: data.blog.description,
        image: undefined, // We don't prefill file inputs
      });
      setImagePreview(data.blog.image);
    }
  }, [data, reset]);

  // Watch for changes in the image input and update the preview accordingly
  const imageFile = watch("image");
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [imageFile]);

  // Use useMutation for updating the blog data
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      // Append a new image file if one is selected; otherwise, the backend retains the current image.
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }
      return await updateBlog(blogId, formData);
    },
    onSuccess: (data: { message: string }) => {
      toast({
        title: "Blog Updated",
        description: data.message,
      });
      router.push("/dashboard/blogs");
    },
    onError: (error: ApiError) => {
      toast({
        title: "Blog Update Error",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data);
    // We do not reset the form here so that in case of an error the form remains populated.
  };

  // Show loader while fetching blog data
  if (isLoading) {
    return (
      <div className="py-4 flex items-center justify-center">
        <p>Loading blog data...</p>
      </div>
    );
  }

  // Show error message if there is an error fetching the blog data
  if (isError) {
    return (
      <div className="py-4 flex items-center justify-center">
        <p className="text-red-600">
          {error &&
            (error instanceof Error ? error.message : "Unknown error occurred")}
        </p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">Edit Blog</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Blog Title Field */}
          <div>
            <label htmlFor="title" className="block text-gray-700">
              Blog Title
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Enter blog title"
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

          {/* Blog Description Field using WYSIWYG Editor */}
          <div>
            <label htmlFor="description" className="block text-gray-700">
              Blog Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div className="mt-2 border rounded-md shadow-sm">
                  <Editor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter blog description"
                  />
                </div>
              )}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Blog Image Upload */}
          <div>
            <label htmlFor="image" className="block text-gray-700">
              Blog Image
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
                      alt="Blog Image Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <FaUpload className="text-4xl mb-3 mx-auto" />
                    <p className="text-sm">
                      Click or drag to upload an image (JPEG, PNG, WebP)
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
              onClick={() => router.push("/dashboard/blogs")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Blog"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBlog;
