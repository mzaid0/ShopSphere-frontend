"use client";

import React, { useState } from "react";
import { MdEdit, MdDelete, MdChevronRight } from "react-icons/md";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { Tooltip } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  deleteCategory,
  updateCategory,
} from "@/api/categories";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

// Define a Category interface for type safety
interface Category {
  id: string;
  name: string;
  parentId: string | null;
  subCategories?: Category[];
}

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

const CategorySubcategoryList: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // State for deletion dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  // State for inline editing (for subcategories only)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editingName, setEditingName] = useState<string>("");

  // To control which categories are expanded in the accordion
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  // Robust query function:
  const { data, isLoading, isError, error } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await getCategories();
        console.log("API Response:", response);

        // Handle different response structures
        const categories = Array.isArray(response)
          ? response
          : response?.data?.categories
          ? response.data.categories
          : response?.categories
          ? response.categories
          : [];

        return Array.isArray(categories) ? categories : [];
      } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
    },
    initialData: [],
    refetchOnMount: true,
    staleTime: 0,
  });

  // Mutation for deleting a category
  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Category Deleted",
        description: data.message,
      });
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
    },
    onError: (err: Error) => {
      toast({
        title: "Category Deletion Error",
        description: err.response?.data?.message || "An error occurred.",
        variant: "destructive",
      });
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
    },
  });

  // Mutation for updating a category
  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateCategory(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Category Updated",
        description: data.message,
      });
      setEditingCategoryId(null);
      setEditingName("");
    },
    onError: (err: Error) => {
      toast({
        title: "Category Update Error",
        description: err.response?.data?.message || "An error occurred.",
        variant: "destructive",
      });
    },
  });

  // ----- Handlers -----

  const handleDelete = (id: string) => {
    setCategoryToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteMutate(categoryToDelete);
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingName(category.name);
  };

  const handleEditCancel = () => {
    setEditingCategoryId(null);
    setEditingName("");
  };

  const handleUpdate = () => {
    if (editingCategoryId && editingName.trim() !== "") {
      const formData = new FormData();
      formData.append("name", editingName.trim());
      updateMutate({ id: editingCategoryId, data: formData });
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // ----- Recursive Render Function -----
  const renderCategory = (category: Category, level: number = 0) => {
    const hasChildren =
      category.subCategories && category.subCategories.length > 0;
    const isExpanded = expandedCategories.has(category.id);

    return (
      <React.Fragment key={category.id}>
        <div
          className={`grid grid-cols-12 items-center p-4 hover:bg-gray-50 transition-colors ${
            level > 0 ? "border-t border-dashed border-gray-200" : ""
          }`}
          style={{ paddingLeft: `${level * 32 + 16}px` }}
        >
          <div className="col-span-6 flex items-center gap-2">
            {hasChildren && (
              <button
                onClick={() => toggleCategory(category.id)}
                className="p-1 rounded hover:bg-gray-200 transition-colors"
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MdChevronRight className="w-5 h-5 text-gray-600" />
                </motion.div>
              </button>
            )}
            {editingCategoryId === category.id ? (
              <Input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="border border-gray-300 rounded p-1 text-sm w-1/2"
              />
            ) : (
              <span className="text-sm font-medium text-gray-900">
                {category.name}
              </span>
            )}
          </div>
          <div className="col-span-3 text-sm text-gray-500">
            {hasChildren
              ? `${category.subCategories!.length} Subcategories`
              : "No subcategories"}
          </div>
          <div className="col-span-3 flex items-center justify-end gap-4">
            {category.parentId !== null && (
              <>
                {editingCategoryId === category.id ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleUpdate}
                      disabled={isUpdating}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <Tooltip title="Edit Category" arrow>
                      <button onClick={() => handleEditClick(category)}>
                        <MdEdit className="w-5 h-5 text-blue-600 hover:text-blue-700" />
                      </button>
                    </Tooltip>
                    <Tooltip title="Delete Category" arrow>
                      <button onClick={() => handleDelete(category.id)}>
                        <MdDelete className="w-5 h-5 text-red-600 hover:text-red-700" />
                      </button>
                    </Tooltip>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {category.subCategories!.map((sub) =>
                renderCategory(sub, level + 1)
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </React.Fragment>
    );
  };

  // ----- Render Main Component -----
  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
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
            Sub Category Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product categories and subcategories
          </p>
        </div>
        <Link href="/dashboard/sub-categories/add">
          <Button>+ New Sub Category</Button>
        </Link>
      </div>

      {/* Wrap the category list in a fixed-height container with vertical scroll */}
      <div className="border border-gray-200 rounded-xl shadow-xs bg-white overflow-hidden max-h-[500px] overflow-y-auto">
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200">
          <div className="col-span-6 text-sm font-semibold text-gray-700 uppercase">
            Category Name
          </div>
          <div className="col-span-3 text-sm font-semibold text-gray-700 uppercase">
            Subcategories
          </div>
          <div className="col-span-3 text-sm font-semibold text-gray-700 uppercase text-right">
            Actions
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {(Array.isArray(data) ? data : []).map((category: Category) =>
            renderCategory(category)
          )}
        </div>
      </div>
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category and all its
              subcategories. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategorySubcategoryList;
