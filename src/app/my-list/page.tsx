"use client";

import { deleteMyList, myListItems } from "@/api/my-list";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import {
  transformWishlistItems,
  WishlistItem,
  MyListResponse,
} from "@/utils/transformWishlistItems";

interface APIError {
  response: {
    data: {
      message: string;
    };
  };
}

// -------------------- Rating Renderer --------------------
const renderRating = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <span key={index}>
          {index < fullStars ? (
            <StarFilledIcon className="w-5 h-5 text-yellow-400" />
          ) : index === fullStars && hasHalfStar ? (
            <StarIcon className="w-5 h-5 text-yellow-400" />
          ) : (
            <StarIcon className="w-5 h-5 text-gray-300" />
          )}
        </span>
      ))}
      <span className="ml-2 text-sm font-medium text-gray-500">
        ({rating.toFixed(1)})
      </span>
    </div>
  );
};

// -------------------- Main MyList Component --------------------
const MyList: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery<MyListResponse>({
    queryKey: ["wishlist"],
    queryFn: myListItems,
  });

  const { toast } = useToast();

  const wishlist: WishlistItem[] = transformWishlistItems(data);

  // Mutation for removing an item from the wishlist.
  const { mutate: removeFromWishlist, isPending: removeLoading } = useMutation({
    mutationFn: (id: string) => deleteMyList(id),
    onSuccess: (data) => {
      toast({ title: "Wish List Product", description: data.message });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error: APIError) => {
      toast({
        title: "Cart Error",
        description: error.response.data.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-6 text-center">
        <h3 className="text-xl font-semibold">Loading wishlist...</h3>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-6 text-center">
        <h3 className="text-xl font-semibold">Error loading wishlist</h3>
        <p className="text-gray-500">
          {(error as { response?: { data?: { message?: string } } }).response
            ?.data?.message || "An error occurred."}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="border-b pb-4">
          <h2 className="text-3xl font-bold tracking-tight">My Wishlist</h2>
          <p className="mt-1 text-sm text-gray-500">
            {wishlist.length} items in your list
          </p>
        </div>
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-6 text-center">
            <h3 className="text-xl font-semibold">Your wishlist is empty</h3>
            <p className="text-gray-500">
              Start saving your favorite items here
            </p>
            <Button>Continue Shopping</Button>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 gap-6"
            style={{ maxHeight: "500px", overflowY: "auto" }}
          >
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-xl bg-card border border-muted hover:border-primary/20 transition-all duration-300"
              >
                <div className="relative w-28 h-32 rounded-xl overflow-hidden shadow-sm">
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={product.productName}
                      fill
                      style={{ objectFit: "cover" }}
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <h3 className="text-lg font-semibold tracking-tight line-clamp-2">
                    {product.productName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Brand:{" "}
                    <span className="font-medium text-gray-700">
                      {product.brand}
                    </span>
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1">
                      Size: {product.size}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-green-800">
                      {product.stock > 5 ? "In Stock" : "Low Stock"}
                    </span>
                  </div>
                  {renderRating(product.rating)}
                </div>
                <div className="w-full sm:w-auto flex flex-col items-start sm:items-end gap-3">
                  <div className="flex flex-col items-end">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">
                        ${product.newPrice.toFixed(2)}
                      </span>
                      <span className="text-sm line-through text-gray-400">
                        ${product.oldPrice.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      {product.discount}% Off
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => removeFromWishlist(product.id)}
                    disabled={removeLoading}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyList;
