"use client";

import { ColumnDef, TableMeta } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the Order type
export type Order = {
  orderId: string;
  paymentId: string;
  products: {
    productId: string;
    title: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  name: string;
  phoneNumber: string;
  address: string;
  pincode: string;
  totalAmount: number;
  email: string;
  userId: string;
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
};

// Extend TableMeta to include onStatusUpdate
interface CustomTableMeta extends TableMeta<Order> {
  onStatusUpdate?: () => void;
}

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
    cell: ({ row, table }) => {
      const order = row.original;
      const status = order.orderStatus;
      const statusColors: Record<string, string> = {
        pending: "text-yellow-500",
        processing: "text-blue-500",
        shipped: "text-green-500",
        delivered: "text-green-600",
        cancelled: "text-red-500",
      };

      const handleStatusChange = async (newStatus: string) => {
        try {
          const response = await fetch(
            "http://localhost:8000/api/orders/update-status",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                orderId: order.orderId,
                status: newStatus,
              }),
            }
          );
          if (!response.ok) throw new Error("Failed to update status");
          // Safely access onStatusUpdate with proper typing
          const meta = table.options.meta as CustomTableMeta;
          if (meta?.onStatusUpdate) meta.onStatusUpdate();
        } catch (error) {
          console.error("Error updating status:", error);
        }
      };

      return (
        <Select
          value={status}
          onValueChange={handleStatusChange}
          disabled={status === "delivered"}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue>
              <span className={statusColors[status]}>{status}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
  },
];
