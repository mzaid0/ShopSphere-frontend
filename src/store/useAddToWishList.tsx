"use client";
import { addToMyList } from "@/api/my-list";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface APIError {
  response: {
    data: {
      message: string;
    };
  };
}

export const useAddToWishList = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: {
      userId: string;
      productId: string;
      quantity: number;
    }) => addToMyList(data),
    onSuccess: (data) => {
      toast({ title: "Wish List", description: data.message });

      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error: APIError) => {
      toast({
        title: "Wish List Error",
        description: error.response.data.message,
        variant: "destructive",
      });
    },
  });
};
