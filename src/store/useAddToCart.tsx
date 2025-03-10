"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart as addToCartAPI } from "@/api/cart";
import { useToast } from "@/hooks/use-toast";

interface APIError {
  response: {
    data: {
      message: string;
    };
  };
}

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: {
      userId: string;
      productId: string;
      quantity: number;
    }) => addToCartAPI(data),
    onSuccess: (data) => {
      toast({ title: "Cart Product", description: data.message });

      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: APIError) => {
      toast({
        title: "Cart Error",
        description: error.response.data.message,
        variant: "destructive",
      });
    },
  });
};
