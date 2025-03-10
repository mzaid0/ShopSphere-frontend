// columns.ts
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import Tooltip from "@mui/material/Tooltip";
import { AiFillEye } from "react-icons/ai";
import { MdEdit, MdDelete } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "@/api/products"; // Ensure this path is correct
import { useToast } from "@/hooks/use-toast";
// Import AlertDialog components (adjust the import path as necessary)
import { Rating } from "@mui/material";
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

export interface Product {
  id: string;
  name: string;
  description?: string;
  images?: string[];
  brand: string;
  price: number;
  oldPrice: number;
  stock: number;
  ratings: number;
  isFeatured: boolean;
  discount: number;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  isDeleted: boolean;
  metaFields: {
    id: string;
    fieldName: string;
    fieldType: string;
    fieldValue: string;
    createdAt: string;
    updatedAt: string;
    productId: string;
  }[];
  category: {
    id: string;
    name: string;
    parentId: string | null;
    image: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
  };
  categoryName: string;
}

interface ApiError {
  response: {
    data: {
      message: string;
    };
  };
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "images",
    header: "Image",
    cell: ({ row }) => {
      const images = row.getValue("images") as string[];
      const firstImage = images && images.length > 0 ? images[0] : "";
      return firstImage ? (
        <Image
          src={firstImage}
          alt="Product"
          className="w-10 h-10 object-cover rounded-md"
          width={100}
          height={100}
        />
      ) : null;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => "$" + row.getValue("price"),
  },
  {
    accessorKey: "oldPrice",
    header: "Old Price",
    cell: ({ row }) => {
      const oldPrice = row.getValue("oldPrice");
      return oldPrice ? "$" + oldPrice : "-";
    },
  },
  {
    accessorKey: "discount",
    header: "Discount (%)",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "ratings",
    header: "Ratings",
    cell: ({ row }) => {
      const ratingValue = row.getValue("ratings") as number;
      return (
        <Rating value={ratingValue} precision={0.5} readOnly size="small" />
      );
    },
  },
  {
    accessorKey: "categoryName",
    header: "Category",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;

      // Inline delete button component using hooks and AlertDialog for confirmation
      const InlineDeleteButton = () => {
        const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
        const { toast } = useToast();
        const queryClient = useQueryClient();
        const mutation = useMutation({
          mutationFn: () => deleteProduct(product.id),
          onSuccess: (data) => {
            // Invalidate the "products" query to refresh the list
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast({
              title: "Product Deleted",
              description: data.message,
            });
          },
          onError: (error: ApiError) => {
            toast({
              title: "Product Delete Error",
              description: error.response.data.message,
              variant: "destructive",
            });
          },
        });

        const handleConfirmDelete = () => {
          mutation.mutate(undefined, {
            onSuccess: () => {
              console.log("Mutation success for product:", product.id);
              setShowDeleteConfirm(false);
            },
            onError: (error) => {
              console.error("Mutation error:", error);
              setShowDeleteConfirm(false);
            },
          });
        };

        const handleDeleteClick = () => {
          // Open the custom confirmation dialog instead of using window.confirm
          setShowDeleteConfirm(true);
        };

        return (
          <>
            <Tooltip title="Delete Product" arrow>
              <button
                onClick={handleDeleteClick}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors duration-200"
              >
                <MdDelete size={18} className="stroke-current" />
              </button>
            </Tooltip>
            <AlertDialog
              open={showDeleteConfirm}
              onOpenChange={setShowDeleteConfirm}
            >
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
                    {mutation.isPending ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        );
      };

      return (
        <div className="flex  items-center">
          <Tooltip title="View Product" arrow>
            <Link
              href={`/product-detail/${product.id}`}
              className="text-gray-600 hover:underline"
            >
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-700 transition-colors duration-200">
                <AiFillEye size={18} className="stroke-current" />
              </button>
            </Link>
          </Tooltip>
          <Tooltip title="Edit Product" arrow>
            <Link href={`/products/edit/${product.id}`}>
              <button className="p-2 rounded-lg hover:bg-blue-50 text-primary hover:text-blue-700 transition-colors duration-200">
                <MdEdit size={18} className="stroke-current" />
              </button>
            </Link>
          </Tooltip>
          {/* Inline Delete Button with custom confirmation dialog */}
          <InlineDeleteButton />
        </div>
      );
    },
  },
];
