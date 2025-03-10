import axiosInstance from "@/services/apiClient";

export const newSmallBanner = async (data: FormData) => {
  const response = await axiosInstance.client.post(
    "/api/small-banners/create",
    data
  );
  return response.data;
};

export const getSmallBanners = async () => {
  const response = await axiosInstance.client.get("/api/small-banners/all");
  return response.data;
};

export const getSingleSmallBanner = async (id: string) => {
  const response = await axiosInstance.client.get(`/api/small-banners/${id}`);
  return response.data;
};

export const updateSmallBanner = async (id: string, data: FormData) => {
  const response = await axiosInstance.client.put(
    `/api/small-banners/update-small-banner/${id}`,
    data
  );
  return response.data;
};

export const deleteSmallBanner = async (id: string) => {
  const response = await axiosInstance.client.delete(
    `/api/small-banners/delete-small-banner/${id}`
  );
  return response.data;
};
