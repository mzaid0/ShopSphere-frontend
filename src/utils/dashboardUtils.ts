// dashboard-utils.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { transformOrders } from "@/utils/transformOrders"; // Updated import

export type OrdersNewType = {
  totalCount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orders: any[]; // Adjust the type of orders if needed
};

export const useDashboardData = () => {
  // Fetch Orders
  const ordersQuery = useQuery<OrdersNewType>({
    queryKey: ["allOrders"],
    queryFn: async () => {
      try {
        console.log("Attempting to fetch orders from /api/orders/all");
        const res = await fetch("http://localhost:8000/api/orders/all", {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });
        console.log("Orders fetch status:", res.status);
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Orders fetch failed:", res.status, errorText);
          throw new Error(
            `Failed to fetch orders: ${res.status} - ${errorText}`
          );
        }
        const data = await res.json();
        console.log("Orders API response:", data);
        const orders = Array.isArray(data) ? data : data.orders || [];
        const transformedOrders = transformOrders(orders);
        console.log("Transformed orders:", transformedOrders);
        return {
          totalCount: transformedOrders.length,
          orders: transformedOrders,
        };
      } catch (error) {
        console.error("Orders query error:", error);
        throw error;
      }
    },
    retry: false,
  });

  // Fetch Users
  const usersQuery = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      try {
        console.log("Attempting to fetch users from /api/users/all");
        const res = await fetch("http://localhost:8000/api/users/all", {
          credentials: "include",
        });
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Users fetch failed:", res.status, errorText);
          throw new Error(
            `Failed to fetch users: ${res.status} - ${errorText}`
          );
        }
        const data = await res.json();
        console.log("Users API response:", data);
        return (
          data.totalUsers || (Array.isArray(data.users) ? data.users.length : 0)
        );
      } catch (error) {
        console.error("Users query error:", error);
        throw error;
      }
    },
    retry: false,
  });

  // Fetch Categories
  const categoriesQuery = useQuery({
    queryKey: ["allCategories"],
    queryFn: async () => {
      try {
        console.log("Attempting to fetch categories from /api/categories/all");
        const res = await fetch("http://localhost:8000/api/categories/all", {
          credentials: "include",
        });
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Categories fetch failed:", res.status, errorText);
          throw new Error(
            `Failed to fetch categories: ${res.status} - ${errorText}`
          );
        }
        const data = await res.json();
        console.log("Categories API response:", data);
        return Array.isArray(data) ? data.length : data.categories?.length || 0;
      } catch (error) {
        console.error("Categories query error:", error);
        throw error;
      }
    },
    retry: false,
  });

  // Fetch Products
  const productsQuery = useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      try {
        console.log("Attempting to fetch products from /api/products/all");
        const res = await fetch("http://localhost:8000/api/products/all", {
          credentials: "include",
        });
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Products fetch failed:", res.status, errorText);
          throw new Error(
            `Failed to fetch products: ${res.status} - ${errorText}`
          );
        }
        const data = await res.json();
        console.log("Products API response:", data);
        return (
          data.totalProducts ||
          (Array.isArray(data.products) ? data.products.length : 0)
        );
      } catch (error) {
        console.error("Products query error:", error);
        throw error;
      }
    },
    retry: false,
  });

  const isLoading =
    ordersQuery.isLoading ||
    usersQuery.isLoading ||
    categoriesQuery.isLoading ||
    productsQuery.isLoading;

  const error =
    ordersQuery.error ||
    usersQuery.error ||
    categoriesQuery.error ||
    productsQuery.error;

  // Debug ordersQuery.data before returning
  console.log("ordersQuery.data:", ordersQuery.data);

  const result = {
    orders: ordersQuery.data ?? [],
    totalOrders: ordersQuery.data?.orders?.length ?? 0,
    totalUsers: usersQuery.data ?? 0,
    totalCategories: categoriesQuery.data ?? 0,
    totalProducts: productsQuery.data ?? 0,
    isLoading,
    error,
  };

  console.log("useDashboardData result:", result); // Debug final result

  return result;
};
