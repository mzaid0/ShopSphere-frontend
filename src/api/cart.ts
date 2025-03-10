// /api/cart.ts
import axiosInstance from "@/services/apiClient";

export const cartItems = async () => {
  const response = await axiosInstance.client.get("/api/carts/all");
  return response.data; // Should contain a cartItems property.
};

export const addToCart = async (data: {
  userId: string;
  productId: string;
  quantity: number;
}) => {
  const response = await axiosInstance.client.post(
    "/api/carts/add",
    data
  );
  return response.data;
};

export const updateCartItemAPI = async (data: {
  productId: string;
  quantity: number;
}) => {
  // Note the leading slash and sending data as body.
  const response = await axiosInstance.client.put(
    "/api/carts/update-cart",
    data
  );
  return response.data;
};

export const deleteCartItemAPI = async (data: { productId: string }) => {
  const response = await axiosInstance.client.delete("/api/carts/delete-cart", {
    data,
  });
  return response.data;
};
