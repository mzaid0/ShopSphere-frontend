"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdEdit, MdDelete } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBlogs, deleteBlog } from "@/api/blogs";
import TruckLoader from "@/components/Loader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { AiFillEye } from "react-icons/ai";

// Define the Blog interface based on your API response
export interface Blog {
  id: string;
  title: string;
  description?: string;
  image: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const HomeBlogBanners = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // State for delete confirmation dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  // Fetch blogs using React Query
  const { data, isLoading, isError, error } = useQuery<{
    success: boolean;
    blogs: Blog[];
  }>({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });

  // Mutation for deleting a blog
  const { mutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteBlog,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast({
        title: "Blog Deleted",
        description: data.message,
      });
      setShowDeleteConfirm(false);
    },
    onError: (error: ApiError) => {
      toast({
        title: "Blog Delete Error",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
      setShowDeleteConfirm(false);
    },
  });

  // Handler when delete icon is clicked – set the blog ID and open the dialog.
  const handleDeleteClick = (id: string) => {
    setBlogToDelete(id);
    setShowDeleteConfirm(true);
  };

  // Handler for confirming deletion
  const handleConfirmDelete = () => {
    if (blogToDelete) {
      mutate(blogToDelete);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <TruckLoader />
      </div>
    );
  }

  if (isError) {
    const apiError = error as unknown as ApiError;
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 font-semibold text-4xl capitalize">
          {apiError?.response?.data?.message || "Unknown error occurred"}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between p-6 bg-white mb-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Blogs
          </h1>
          <p className="mt-1 text-sm text-gray-500">Manage your blogs here.</p>
        </div>
        <Link href="/dashboard/blogs/add">
          <Button>+ Add New Blog</Button>
        </Link>
      </div>

      {/* Table Container with vertical scroll */}
      <div className="border border-gray-200 rounded-xl shadow-xs bg-white max-h-[500px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="text-center">
              <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px]">
                Blog Image
              </th>
              <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">
                Title
              </th>
              <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[250px]">
                Description
              </th>
              <th className="px-6 py-5 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.blogs?.map((blog: Blog) => (
              <tr
                key={blog.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                {/* Blog Image */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative w-32 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-inner">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover hover:scale-105 duration-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/default-blog.png";
                      }}
                    />
                  </div>
                </td>
                {/* Title */}
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {blog.title || "Untitled Blog"}
                  </div>
                  <div className="text-sm text-gray-500">ID: {blog.id}</div>
                </td>
                {/* Description rendered as HTML */}
                <td className="px-6 py-4">
                  <div
                    className="text-sm text-gray-700"
                    // The blog.description is rendered as HTML. Ensure that the content is sanitized.
                    dangerouslySetInnerHTML={{
                      __html: blog.description || "No description provided.",
                    }}
                  />
                </td>
                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center ">
                    <Tooltip title="View Blog" arrow>
                      <Link href={`/blog/${blog.id}`}>
                        <button className="p-2 rounded-lg hover:bg-blue-50 text-primary hover:text-blue-700 transition-colors duration-200">
                          <AiFillEye size={22} />
                        </button>
                      </Link>
                    </Tooltip>
                    <Tooltip title="Edit Blog" arrow>
                      <Link href={`/dashboard/blogs/edit/${blog.id}`}>
                        <button className="p-2 rounded-lg hover:bg-blue-50 text-primary hover:text-blue-700 transition-colors duration-200">
                          <MdEdit size={22} />
                        </button>
                      </Link>
                    </Tooltip>
                    <Tooltip title="Delete Blog" arrow>
                      <button
                        onClick={() => handleDeleteClick(blog.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors duration-200"
                      >
                        <MdDelete size={22} />
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HomeBlogBanners;
