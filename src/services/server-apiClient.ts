"use server";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const success = (response: any) => response;

const serverAxiosInstance = axios.create({
  baseURL: process.env.SERVER_BASEURL,
  withCredentials: true,
});

serverAxiosInstance.interceptors.request.use(async (config) => {
  const nextCookies = await cookies();
  const token = nextCookies.get("token");
  if (!token?.value) {
    redirect("/login");
  } else {
    config.headers["Cookie"] = `token=${token.value}`;
  }
  return config;
});

serverAxiosInstance.interceptors.response.use(success, (config) => {
  if (
    config.status === 401 &&
    config.data.message ===
      "Authentication token is required, Please Login first"
  ) {
    redirect("/login");
  }
  return config;
});

export default serverAxiosInstance;
