"use client";

import { deleteCategory, getCategories } from "@/api/categories";
import Loader from "@/components/Loader";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tooltip } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";

export type Error = {
  response: {
    data: {
      message: string;
    };
  };
};

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface Category {
  id: string;
  name: string;
  image: string;
}

const CategoryList = () => {
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch categories from the API.
  const { data, isLoading, isError, error } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      // If the response is an array, return it.
      // Otherwise, assume the response has a `categories` property.
      return Array.isArray(response) ? response : response.categories ?? [];
    },
    initialData: [],
  });

  const categories = data;

  const { mutate, isPending } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Category Message",
        description: data.message,
      });
      setShowDeleteConfirm(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Category Error",
        description: error.response.data.message,
        variant: "destructive",
      });
      setShowDeleteConfirm(false);
    },
  });

  const handleDelete = (id: string) => {
    setCategoryToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      mutate(categoryToDelete);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader />
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
      <div className="flex items-center justify-between p-6 bg-white mb-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Category Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product categories and organization
          </p>
        </div>
        <Link href="/dashboard/categories/add">
          <Button>+ New Category</Button>
        </Link>
      </div>

      <div className="border border-gray-200 rounded-xl shadow-xs bg-white overflow-hidden">
        {/* Fixed container height with vertical scroll */}
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Category Name
                </th>
                <th className="px-6 py-5 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(categories || []).map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-inner">
                      <Image
                        src={category.image || "/default-category-image.png"}
                        alt={category.name || "Category Image"}
                        fill
                        className="object-cover hover:scale-105 duration-200"
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src =
                            "/default-category-image.png")
                        }
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {category.name || "Unnamed Category"}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {category.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-4">
                      <Tooltip title="Edit Category">
                        <Link
                          href={`/dashboard/categories/edit/${category.id}`}
                        >
                          <button className="p-2 rounded-lg hover:bg-blue-50 text-primary hover:text-blue-700 transition-colors duration-200">
                            <MdEdit size={22} className="stroke-current" />
                          </button>
                        </Link>
                      </Tooltip>
                      <Tooltip title="Delete Category">
                        <button
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors duration-200"
                          onClick={() => handleDelete(category.id)}
                        >
                          <MdDelete size={22} className="stroke-current" />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoryList;
