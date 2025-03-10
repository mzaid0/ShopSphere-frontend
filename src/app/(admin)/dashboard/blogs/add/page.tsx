"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { FaUpload } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { newBlog } from "@/api/blogs"; // API function to create a new blog
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Editor from "react-simple-wysiwyg"; // WYSIWYG editor

// Zod schema for blog form validation
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
    .refine((file) => file && file.length > 0, "Blog image is required")
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/webp"].includes(file[0]?.type),
      "Invalid image type"
    ),
});

type FormData = z.infer<typeof blogSchema>;

export type ApiError = {
  response: {
    data: {
      message: string;
    };
  };
};

const AddBlog = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      description: "",
      image: undefined,
    },
  });

  // Watch for changes to the image input and update the preview
  const imageFile = watch("image");
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [imageFile]);

  // Mutation for creating a blog
  const { mutate, isPending } = useMutation({
    mutationFn: newBlog,
    onSuccess: (data) => {
      toast({
        title: "Blog Created",
        description: data.message,
      });
      router.push("/dashboard/blogs");
    },
    onError: (error: ApiError) => {
      toast({
        title: "Blog Creation Error",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    // Prepare FormData for multipart/form-data submission
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
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
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">Add Blog</h1>

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

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button disabled={isPending}>
              {isPending ? "Adding..." : "Add Blog"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
