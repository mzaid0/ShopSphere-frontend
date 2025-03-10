"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useAddToCart } from "@/store/useAddToCart"; // Update path as needed
import useAuthStore from "@/store/authStore";

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  className?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  quantity = 1,
  className,
}) => {
  const { user } = useAuthStore();
  const { mutate, isPending } = useAddToCart();

  const handleClick = () => {
    if (!user) {
      alert("Please login to add items to your cart.");
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
      <ShoppingCart className="h-4 w-4 mr-2" />
      {isPending ? "Adding..." : "Add to Cart"}
    </Button>
  );
};

export default AddToCartButton;
