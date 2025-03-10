"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./data-table";
import { columns, Order } from "./columns";

// Define the APIOrder type to match the backend response
interface APIOrder {
  id: string;
  userId: string;
  addressId: string | null;
  subTotal: number;
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  orderItems: {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    createdAt: string;
    updatedAt: string;
    product?: {
      images: string[]; // Product's images array
      name: string; // Product name
    };
  }[];
  Payment: {
    id: string;
    orderId: string;
    transactionId: string;
    paymentMethod: string;
    amount: number;
    currency: string;
    mobileNumber: string | null;
    status: string;
    paymentDate: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
  }[];
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    addresses?: {
      id: string;
      userId: string;
      firstName: string | null;
      lastName: string | null;
      email: string | null;
      phone: string | null;
      addressLine: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      status: boolean;
      createdAt: string;
      updatedAt: string;
    }[];
  };
}

// Transform API orders into the Order type expected by the DataTable
const transformOrders = (apiOrders: APIOrder[]): Order[] => {
  return apiOrders.map((order) => {
    const user = order.user || {
      firstName: "Unknown",
      lastName: "",
      email: "",
      phone: "",
    };
    const primaryAddress =
      user.addresses && user.addresses.length > 0
        ? user.addresses[0]
        : { addressLine: "", zipCode: "", phone: "" };

    const products = order.orderItems.map((item) => ({
      productId: item.productId,
      title: item.product?.name || item.productId, // Use product name, fallback to productId
      quantity: item.quantity,
      price: item.price,
      image: item.product?.images?.[0] || "", // Select first image
    }));

    return {
      orderId: order.id,
      paymentId:
        order.Payment && order.Payment.length > 0 ? order.Payment[0].id : "",
      products,
      name: `${user.firstName} ${user.lastName}`.trim() || "Unknown",
      phoneNumber: user.phone || "",
      address: primaryAddress.addressLine || "",
      pincode: primaryAddress.zipCode || "",
      totalAmount: order.total,
      email: user.email || "",
      userId: order.userId,
      orderStatus: order.status,
      date: new Date(order.createdAt).toLocaleDateString(),
    };
  });
};

export default function MyOrders() {
  const { data, isLoading, error } = useQuery<{ orders: APIOrder[] }>({
    queryKey: ["userOrders"],
    queryFn: async () => {
      const res = await fetch("http://localhost:8000/api/orders/user", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
  });

  const orders: Order[] =
    data && Array.isArray(data.orders) ? transformOrders(data.orders) : [];

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-lg">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-lg text-red-500">Error loading orders.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-4 text-gray-700">My Orders</h2>
      <DataTable columns={columns} data={orders} isLoading={isLoading} />
    </div>
  );
}
