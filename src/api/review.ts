import axiosInstance from "@/services/apiClient";

export const postReview = async (data: {
  productId: string;
  rating: number;
  review: string;
}) => {
  const response = await axiosInstance.client.post(
    "/api/reviews/post-review",
    data
  );
  return response.data;
};

export const getReviews = async (productId: string) => {
  const response = await axiosInstance.client.get("/api/reviews", {
    params: { productId },
  });
  // Return the reviews array directly
  return response.data.reviews;
};
