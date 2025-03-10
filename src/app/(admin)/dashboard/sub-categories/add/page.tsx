"use client";

import React, { useState } from "react";
import { createCategory, getCategories } from "@/api/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

// Zod schema for form validation
const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Subcategory name is required")
    .max(50, "Name must be less than 50 characters"),
});

// Rename type to avoid conflict
type CategoryFormData = z.infer<typeof categorySchema>;

// Define a Category interface for type safety
export interface Category {
  id: string;
  name: string;
  image: string;
  subCategories: Category[];
}

// Error types
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
  message?: string;
}

const AddCategory = () => {
  const queryClient = useQueryClient();
  const [selectedHierarchy, setSelectedHierarchy] = useState<Category[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  // Robust query function (similar to your other component)
  const {
    data: categoriesData,
    isError: isCategoriesError,
    error: categoriesError,
    isLoading,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await getCategories();
        console.log("API Response:", response);

        // Check for different response shapes:
        // 1. API returns an array directly.
        // 2. API returns an object with a "data.categories" property.
        // 3. API returns an object with a "categories" property.
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

  console.log(categoriesData);

  // Create category mutation
  const { mutate: createCategoryMutate, isPending } = useMutation({
    mutationFn: createCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      reset();
      setSelectedHierarchy([]);
      toast({
        title: "Category created successfully",
        description: data.message,
      });
      router.push("/dashboard/sub-categories");
    },
    onError: (error: Error) => {
      toast({
        title: "Category Error",
        description: error.response.data.message,
        variant: "destructive",
      });
    },
  });

  // Recursive function to find a category in the nested structure
  const findCategory = (
    categories: Category[],
    targetId: string
  ): Category | undefined => {
    for (const category of categories) {
      if (category.id === targetId) return category;
      const found = findCategory(category.subCategories, targetId);
      if (found) return found;
    }
  };

  // Handle category selection at a specific level
  const handleLevelSelection = (categoryId: string, level: number) => {
    const selectedCategory = findCategory(categoriesData || [], categoryId);
    if (!selectedCategory) return;
    setSelectedHierarchy((prev) => [...prev.slice(0, level), selectedCategory]);
  };

  // Generate dynamic select boxes based on the selected hierarchy
  const renderSelectBoxes = () => {
    const boxes = [];
    // Start with the top-level categories from the API response.
    let currentCategories = categoriesData || [];

    // Render a select box for each level.
    for (let level = 0; level <= selectedHierarchy.length; level++) {
      if (level > 0) {
        currentCategories = selectedHierarchy[level - 1]?.subCategories || [];
      }
      if (currentCategories.length === 0) break;
      boxes.push(
        <div key={level} className="mb-4">
          <label className="block mb-2 font-medium">
            {level === 0 ? "Parent Category" : `Subcategory Level ${level}`}
          </label>
          <Select
            onValueChange={(value) => handleLevelSelection(value, level)}
            value={selectedHierarchy[level]?.id || ""}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={`Select ${
                  level === 0 ? "category" : "subcategory"
                }`}
              />
            </SelectTrigger>
            <SelectContent>
              {currentCategories.map((category: Category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }
    return boxes;
  };

  // Handle form submission – using FormData to match expected input type
  const onSubmit = (formData: CategoryFormData) => {
    const parentId =
      selectedHierarchy.length > 0
        ? selectedHierarchy[selectedHierarchy.length - 1].id
        : null;
    const payload = new FormData();
    payload.append("name", formData.name);
    if (parentId) {
      payload.append("parentId", parentId);
    }
    createCategoryMutate(payload);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading categories...</p>
      </div>
    );
  }

  if (isCategoriesError) {
    const error = categoriesError as unknown as ApiError;
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 font-semibold">
          Error: {error?.response?.data?.message || "Failed to load categories"}
        </p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Create Category Hierarchy
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dynamic Category Selectors */}
          {renderSelectBoxes()}
          {/* Subcategory Name Input */}
          <div>
            <label className="block text-gray-700 mb-2">
              New Subcategory Name
            </label>
            <Input
              {...register("name")}
              placeholder="Enter subcategory name"
              className={`w-full ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isPending}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Category"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setSelectedHierarchy([]);
              }}
              disabled={isPending}
            >
              Reset Form
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
