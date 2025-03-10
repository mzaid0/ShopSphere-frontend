"use client";

import React, { useState } from "react";
import { getCategories } from "@/api/categories";
import { createProduct } from "@/api/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

// Import ShadCN Select and Checkbox components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// ─── TYPES & SCHEMAS ─────────────────────────────────────────────────────────

// Category interface
export interface Category {
  id: string;
  name: string;
  image?: string;
  subCategories: Category[];
}

// Schema for each meta field (e.g., weight, ram, etc.)
const metaFieldSchema = z.object({
  fieldType: z.enum(["size", "color", "weight", "material", "ram"], {
    required_error: "Meta field type is required",
  }),
  fieldValue: z.string().nonempty("Meta field value is required"),
  fieldName: z.string().optional(),
});

// ─── UPDATED PRODUCT SCHEMA ────────────────────────────────────────────────
// Added isFeatured field of type boolean.
const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  price: z.number().positive("Price must be a positive number."),
  oldPrice: z.number().optional(),
  stock: z.number().min(1, "Stock must be at least 1."),
  brand: z.string().min(2, "Brand must be at least 2 characters."),
  discount: z.number().min(0).max(100, "Discount must be between 0 and 100."),
  ratings: z.number().min(0).max(5, "Rating must be between 0 and 5."),
  isFeatured: z.boolean(), // <-- New isFeatured field
  metaFields: z.array(metaFieldSchema).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export type ErrorResponse = {
  response: { data: { message: string } };
};

// ─── COMPONENT ─────────────────────────────────────────────────────────────

const AddProduct: React.FC = () => {
  // State for image uploads
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  // State for category hierarchy
  const [selectedHierarchy, setSelectedHierarchy] = useState<Category[]>([]);

  // Fetch categories – using a robust query function
  const {
    data: categoriesData,
    isError: isCategoriesError,
    isLoading: isCategoriesLoading,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await getCategories();
        console.log("API Response:", response);

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

  // Mutation for product creation
  const { mutate, isPending } = useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      toast({
        title: "Product Created",
        description: data.message,
      });
      router.push("/dashboard/products");
    },
    onError: (error: ErrorResponse) => {
      toast({
        title: "Error",
        description: error.response.data.message,
        variant: "destructive",
      });
    },
  });

  // ─── Initialize react-hook-form ─────────────────────────────────────────
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { metaFields: [], isFeatured: false },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "metaFields",
  });

  // ─── CATEGORY HIERARCHY HANDLERS ─────────────────────────────────────────
  const findCategory = (
    categories: Category[],
    targetId: string
  ): Category | undefined => {
    for (const category of categories) {
      if (category.id === targetId) return category;
      const found = findCategory(category.subCategories, targetId);
      if (found) return found;
    }
    return undefined;
  };

  const handleLevelSelection = (categoryId: string, level: number) => {
    const selectedCategory = findCategory(categoriesData || [], categoryId);
    if (!selectedCategory) return;
    setSelectedHierarchy((prev) => [...prev.slice(0, level), selectedCategory]);
  };

  const renderSelectBoxes = () => {
    const boxes = [];
    let currentCategories = categoriesData || [];

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

  // ─── IMAGE UPLOAD HANDLERS ─────────────────────────────────────────
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + images.length > 5) {
      alert("You can upload a maximum of 5 images.");
      return;
    }
    const updatedImages = [...images, ...selectedFiles];
    const updatedPreviews = [
      ...previews,
      ...selectedFiles.map((file) => URL.createObjectURL(file)),
    ];
    setImages(updatedImages);
    setPreviews(updatedPreviews);
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setImages(updatedImages);
    setPreviews(updatedPreviews);
  };

  // ─── FORM SUBMISSION ─────────────────────────────────────────
  const onSubmit = (data: ProductFormValues) => {
    if (selectedHierarchy.length === 0) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }
    const finalCategoryId = selectedHierarchy[selectedHierarchy.length - 1].id;
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("categoryId", finalCategoryId);
    formData.append("price", data.price.toString());
    if (data.oldPrice !== undefined) {
      formData.append("oldPrice", data.oldPrice.toString());
    }
    formData.append("stock", data.stock.toString());
    formData.append("brand", data.brand);
    formData.append("discount", data.discount.toString());
    formData.append("ratings", data.ratings.toString());

    // Append the isFeatured value (converted to a string for FormData)
    formData.append("isFeatured", data.isFeatured.toString());

    if (data.metaFields && data.metaFields.length > 0) {
      formData.append("metaField", JSON.stringify(data.metaFields));
    }

    images.forEach((file) => {
      formData.append("images", file);
    });

    mutate(formData);
  };

  if (isCategoriesLoading) {
    return (
      <p className="text-center text-gray-600 py-8">Loading categories...</p>
    );
  }

  if (isCategoriesError) {
    return (
      <p className="text-center text-red-600 py-8">Error loading categories.</p>
    );
  }

  return (
    <div className="py-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-wrap bg-white shadow-sm rounded-lg overflow-hidden"
      >
        {/* LEFT SIDE: MAIN PRODUCT FIELDS */}
        <div className="flex-1 p-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {/* Category Hierarchy Section */}
          <div className="col-span-2">
            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
            <div className="space-y-4">
              <div>
                <Input {...register("name")} placeholder="Product Name" />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name.message}</p>
                )}
              </div>
              <div className="col-span-2">
                <Textarea
                  {...register("description")}
                  placeholder="Product Description"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4">
              {isCategoriesLoading ? <h1>Loading...</h1> : renderSelectBoxes()}
            </div>
          </div>

          <div>
            <Input
              type="number"
              {...register("price", { valueAsNumber: true })}
              placeholder="Price"
            />
            {errors.price && (
              <p className="text-red-500 text-xs">{errors.price.message}</p>
            )}
          </div>

          <div>
            <Input
              type="number"
              {...register("oldPrice", { valueAsNumber: true })}
              placeholder="Old Price (Optional)"
            />
          </div>

          <div>
            <Input
              type="number"
              {...register("stock", { valueAsNumber: true })}
              placeholder="Stock Quantity"
            />
            {errors.stock && (
              <p className="text-red-500 text-xs">{errors.stock.message}</p>
            )}
          </div>

          <div>
            <Input {...register("brand")} placeholder="Brand" />
            {errors.brand && (
              <p className="text-red-500 text-xs">{errors.brand.message}</p>
            )}
          </div>

          <div>
            <Input
              type="number"
              {...register("discount", { valueAsNumber: true })}
              placeholder="Discount (%)"
            />
            {errors.discount && (
              <p className="text-red-500 text-xs">{errors.discount.message}</p>
            )}
          </div>

          <div>
            <Input
              type="number"
              {...register("ratings", { valueAsNumber: true })}
              placeholder="Rating (0-5)"
            />
            {errors.ratings && (
              <p className="text-red-500 text-xs">{errors.ratings.message}</p>
            )}
          </div>

          {/* ─── IS FEATURED CHECKBOX USING SHADCN COMPONENT ───────────────────────── */}
          <div className="col-span-2">
            <Controller
              control={control}
              name="isFeatured"
              render={({ field: { onChange, value, ref } }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured"
                    checked={value}
                    onCheckedChange={(checked) => onChange(checked)}
                    ref={ref}
                  />
                  <label htmlFor="isFeatured" className="font-medium">
                    Featured Product
                  </label>
                </div>
              )}
            />
            {errors.isFeatured && (
              <p className="text-red-500 text-xs">
                {errors.isFeatured.message}
              </p>
            )}
          </div>

          {/* META FIELDS SECTION */}
          <div className="col-span-2 border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">
              Product Specifications
            </h3>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-wrap gap-4 items-end mb-4"
              >
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Field Type
                  </label>
                  <Controller
                    control={control}
                    name={`metaFields.${index}.fieldType`}
                    defaultValue="size"
                    render={({ field: { onChange, value } }) => (
                      <Select onValueChange={onChange} value={value}>
                        <SelectTrigger className="border p-2 w-full rounded-md">
                          <SelectValue placeholder="Select Field Type" />
                        </SelectTrigger>
                        <SelectContent className="absolute z-50">
                          <SelectItem value="size">Size</SelectItem>
                          <SelectItem value="color">Color</SelectItem>
                          <SelectItem value="weight">Weight</SelectItem>
                          <SelectItem value="material">Material</SelectItem>
                          <SelectItem value="ram">RAM</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.metaFields && errors.metaFields[index]?.fieldType && (
                    <p className="text-red-500 text-xs">
                      {errors.metaFields[index]?.fieldType?.message}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Field Value
                  </label>
                  <Input
                    {...register(`metaFields.${index}.fieldValue` as const)}
                    placeholder="Enter value"
                  />
                  {errors.metaFields &&
                    errors.metaFields[index]?.fieldValue && (
                      <p className="text-red-500 text-xs">
                        {errors.metaFields[index]?.fieldValue?.message}
                      </p>
                    )}
                </div>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                append({ fieldType: "size", fieldValue: "", fieldName: "" })
              }
            >
              Add Specifications
            </Button>
          </div>

          <Button
            className="col-span-2 mt-6 text-white"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Adding Product..." : "Add Product"}
          </Button>
        </div>

        {/* RIGHT SIDE: IMAGE UPLOAD SECTION */}
        <div className="w-full md:w-1/3 lg:w-1/2 p-6 lg:p-8 bg-gradient-to-b from-gray-50 to-white border-l border-gray-100 max-h-[600px] overflow-y-auto">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Media Gallery
              </h2>
              <p className="text-sm text-gray-500">
                Upload up to 5 high-quality product images.
                <span className="block mt-1">
                  Recommended size: 1200x1200px
                </span>
              </p>
            </div>

            <div
              className="group relative border-2 border-dashed border-gray-300 rounded-xl transition-all duration-200 ease-in-out hover:border-primary hover:bg-primary hover:bg-opacity-10"
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add(
                  "border-blue-500",
                  "bg-blue-50/50"
                );
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove(
                  "border-blue-500",
                  "bg-blue-50/50"
                );
              }}
            >
              <div className="p-6 flex flex-col items-center justify-center min-h-[200px] space-y-4">
                <div className="p-3 bg-white rounded-full">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">
                    <span className="text-primary cursor-pointer">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                </div>
              </div>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                multiple
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Upload product images"
              />
            </div>

            {previews.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">
                    Uploaded Images ({previews.length}/5)
                  </h3>
                  <span className="text-xs text-gray-500">
                    Click image to remove
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {previews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-20 h-20 object-cover transition-opacity group-hover:opacity-75"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                        aria-label="Remove image"
                      >
                        <svg
                          className="w-4 h-4 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
