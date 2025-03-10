import axiosInstance from "@/services/apiClient";

export const newBlog = async (data: FormData) => {
  const response = await axiosInstance.client.post("/api/blogs/create", data);
  return response.data;
};

export const getBlogs = async () => {
  const response = await axiosInstance.client.get("/api/blogs/all");
  return response.data;
};

export const getSingleBlog = async (id: string) => {
  const response = await axiosInstance.client.get(`/api/blogs/${id}`);
  return response.data;
};

export const updateBlog = async (id: string, data: FormData) => {
  const response = await axiosInstance.client.put(
    `/api/blogs/update-blog/${id}`,
    data
  );
  return response.data;
};

export const deleteBlog = async (id: string) => {
  const response = await axiosInstance.client.delete(
    `/api/blogs/delete-blog/${id}`
  );
  return response.data;
};
