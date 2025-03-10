// /api/cart.ts
import axiosInstance from "@/services/apiClient";

export const myListItems = async () => {
  const response = await axiosInstance.client.get("/api/my-list/all");
  return response.data; // Should contain a cartItems property.
};

export const addToMyList = async (data: {
  userId: string;
  productId: string;
  quantity: number;
}) => {
  const response = await axiosInstance.client.post("/api/my-list/add", data);
  return response.data;
};

export const deleteMyList = async (id: string) => {
  const response = await axiosInstance.client.delete(`/api/my-list/${id}`);
  return response.data;
};
