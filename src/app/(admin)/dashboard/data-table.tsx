"use client";
import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image"; // Import Image from Next.js for rendering images

// Define Product type
interface Product {
  productId: string;
  image: string;
  title: string;
  quantity: number;
  price: number;
}

// Define OrderData type which includes the products field
interface OrderData {
  orderId: string;
  products: Product[]; // The products field is an array of Product
}

// Update the DataTableProps to constrain TData to extend OrderData
interface DataTableProps<TData extends OrderData, TValue> {
  columns: ColumnDef<TData, TValue>[]; // Table columns
  data: TData[]; // Table data
}

export function DataTable<TData extends OrderData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null); // Track expanded row
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRowToggle = (orderId: string) => {
    setExpandedRow((prev) => (prev === orderId ? null : orderId)); // Toggle the expanded row
  };

  return (
    <div className="rounded-md border overflow-x-auto w-full">
      <Table className="table-auto w-full ">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="p-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const orderId = row.getValue("orderId") as string;
              const isExpanded = expandedRow === orderId; // Check if this row is expanded

              return (
                <React.Fragment key={row.id}>
                  <TableRow
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleRowToggle(orderId)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="whitespace-nowrap p-4 text-sm leading-6"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Render product details if the row is expanded */}
                  {isExpanded && (
                    <TableRow key={`${row.id}-expanded`}>
                      <TableCell
                        colSpan={columns.length}
                        className="p-4 bg-gray-100"
                      >
                        <div className="flex flex-col gap-3">
                          <h3 className="font-semibold text-lg">
                            Product Details
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {row.original.products.map((product: Product) => (
                              <div
                                key={product.productId}
                                className="border p-4 rounded-md"
                              >
                                <div className="flex items-center gap-4">
                                  <Image
                                    src={product.image} // Path to product image
                                    alt={product.title}
                                    width={50} // You can adjust the size
                                    height={50} // You can adjust the size
                                    className="rounded"
                                  />
                                  <div className="flex items-center justify-center gap-7">
                                    <h4 className="font-medium">
                                      {product.title}
                                    </h4>
                                    <div className="flex gap-2">
                                      <p className="text-sm">
                                        Product ID:{" "}
                                        <span className="text-xs text-primary">
                                          {product.productId}
                                        </span>
                                      </p>
                                      <p className="text-sm">
                                        Quantity:{" "}
                                        <span className="text-xs text-primary">
                                          {product.quantity}
                                        </span>{" "}
                                      </p>
                                      <p className="text-sm">
                                        Price:{" "}
                                        <span className="text-xs text-primary">
                                          ${product.price}
                                        </span>{" "}
                                      </p>
                                    </div>
                                    <p className="text-sm font-bold">
                                      Subtotal: $
                                      {product.price * product.quantity}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-gray-500"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
