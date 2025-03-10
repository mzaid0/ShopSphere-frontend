"use client";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/authStore";
import { useAddToWishList } from "@/store/useAddToWishList"; // Update path as needed
import React from "react";
import { FaRegHeart } from "react-icons/fa";

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  className?: string;
}

const AddToWishListButton: React.FC<AddToCartButtonProps> = ({
  productId,
  quantity = 1,
  className,
}) => {
  const { user } = useAuthStore();
  const { mutate, isPending } = useAddToWishList();

  const handleClick = () => {
    if (!user) {
      alert("Please login to add items to your wish list.");
      return;
    }
    mutate({
      userId: user.id,
      productId,
      quantity,
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      onClick={handleClick}
      disabled={isPending}
    >
      <FaRegHeart className="h-4 w-4 mr-2" />
    </Button>
  );
};

export default AddToWishListButton;
