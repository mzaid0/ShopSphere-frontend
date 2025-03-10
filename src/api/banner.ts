import axiosInstance from "@/services/apiClient";

export const newBanner = async (data: FormData) => {
  const response = await axiosInstance.client.post("/api/banners/create", data);
  return response.data;
};

export const getBanners = async () => {
  const response = await axiosInstance.client.get("/api/banners/all");
  return response.data;
};

export const getSingleBanner = async (id: string) => {
  const response = await axiosInstance.client.get(`/api/banners/${id}`);
  return response.data;
};

export const updateBanner = async (id: string, data: FormData) => {
  const response = await axiosInstance.client.put(
    `/api/banners/update-banner/${id}`,
    data
  );
  return response.data;
};

export const deleteBanner = async (id: string) => {
  const response = await axiosInstance.client.delete(
    `/api/banners/delete-banner/${id}`
  );
  return response.data;
};
