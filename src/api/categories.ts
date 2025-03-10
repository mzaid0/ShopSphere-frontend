import axiosInstance from "@/services/apiClient";
export interface Category {
  id: string;
  name: string;
  image: string;
}

export const createCategory = async (data: FormData) => {
  const response = await axiosInstance.client.post(
    "/api/categories/create",
    data
  );
  return response.data;
};

export const getCategories = async () => {
  const response = await axiosInstance.client.get("/api/categories/all");
  return response.data;
};

export const getSingleCategory = async (id: string) => {
  const response = await axiosInstance.client.get(`/api/categories/${id}`);
  return response.data;
};

export const updateCategory = async (id: string, data: FormData) => {
  const response = await axiosInstance.client.put(
    `/api/categories/update-category/${id}`,
    data
  );
  return response.data;
};

export const deleteCategory = async (id: string) => {
  const response = await axiosInstance.client.delete(
    `/api/categories/delete-category/${id}`
  );
  return response.data;
};
