"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Order = {
  orderId: string;
  paymentId: string;
  products: { productId: string; title: string; quantity: number; price: number; image: string }[];
  name: string;
  phoneNumber: string;
  address: string;
  pincode: string;
  totalAmount: number;
  email: string;
  userId: string;
  orderStatus: "pending" | "processing" | "completed" | "cancelled";
  date: string;
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => {
      const orderId = row.getValue("orderId") as string;
      return <span className="text-primary font-medium">{orderId}</span>;
    },
  },
  {
    accessorKey: "paymentId",
    header: "Payment ID",
    cell: ({ row }) => {
      const paymentId = row.getValue("paymentId") as string;
      return <span className="text-primary font-medium">{paymentId}</span>;
    },
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => {
      const products = row.getValue("products") as { title: string }[];
      return <span>{products.map((product) => product.title).join(", ")}</span>;
    },
  },
  {
    accessorKey: "name",
    header: "Customer Name",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "pincode",
    header: "Pincode",
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: ({ row }) => {
      const totalAmount = row.getValue("totalAmount") as number;
      return `$${totalAmount}`;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "userId",
    header: "User ID",
  },
  {
    accessorKey: "orderStatus",
    header: "Order Status",
    cell: ({ row }) => {
      const status = row.getValue("orderStatus") as "pending" | "processing" | "completed" | "cancelled";
      const statusColors: Record<string, string> = {
        pending: "text-yellow-500",
        processing: "text-blue-500",
        completed: "text-green-500",
        cancelled: "text-red-500",
      };
      return <span className={statusColors[status]}>{status}</span>;
    },
  },
  {
    accessorKey: "date",
    header: "Date",
  },
];
