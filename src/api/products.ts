import axiosInstance from "@/services/apiClient";

export const createProduct = async (data: FormData) => {
  const response = await axiosInstance.client.post(
    "/api/products/create",
    data
  );
  return response.data;
};

export const getProducts = async (queryParams: Record<string, string> = {}) => {
  const searchParams = new URLSearchParams();
  for (const key in queryParams) {
    if (queryParams[key] !== undefined) {
      searchParams.set(key, queryParams[key]);
    }
  }

  // Generate query string
  const queryString = searchParams.toString();
  // Agar queryString exist karta hai toh "?" ke saath, warna sirf endpoint
  const url = queryString
    ? `/api/products/all?${queryString}`
    : `/api/products/all`;

  const response = await axiosInstance.client.get(url);
  return response.data;
};

export const getProduct = async (productId: string) => {
  const response = await axiosInstance.client.get(`/api/products/${productId}`);
  return response.data;
};

export const deleteProduct = async (productId: string) => {
  const response = await axiosInstance.client.patch(
    `/api/products/${productId}`
  );
  return response.data;
};

export const getProductsByCategory = async (id: string) => {
  const response = await axiosInstance.client.get(`/api/products/all/${id}`);
  return response.data;
};

export const featuredProducts = async () => {
  const response = await axiosInstance.client.get("/api/products/featured");
  return response.data;
};
