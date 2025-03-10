"use client";
import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Order } from "./columns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
}

export function DataTable<TData extends Order, TValue>({
  columns,
  data,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const toggleRow = (orderId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  const ProductCard = ({ product }: { product: Order["products"][0] }) => (
    <div className="flex items-center p-4 bg-muted/50 rounded-lg gap-4 shadow-sm hover:shadow transition-shadow">
      {product.image ? (
        <Image
          src={product.image}
          alt={product.title}
          width={80}
          height={80}
          className="rounded-lg object-cover border"
        />
      ) : (
        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}
      <div className="flex-1 grid grid-cols-3 gap-4 items-center">
        <div className="space-y-1">
          <p className="font-medium">{product.title}</p>
          <p className="text-sm text-muted-foreground">
            SKU: {product.productId}
          </p>
        </div>
        <div className="flex items-center gap-4 justify-self-center">
          <Badge variant="outline" className="gap-2">
            <span className="text-muted-foreground">Qty:</span>
            {product.quantity}
          </Badge>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className="font-medium">${product.price.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">
            Subtotal: ${(product.price * product.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <Table className="relative">
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              <TableHead className="w-[60px] px-6 py-4" />
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="px-6 py-4 font-semibold text-foreground text-nowrap"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell className="px-6 py-4">
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  {columns.map((_, j) => (
                    <TableCell key={j} className="px-6 py-4">
                      <Skeleton className="h-4 w-[80%]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const isExpanded = expandedRows.has(row.original.orderId);
              const order = row.original;

              return (
                <React.Fragment key={row.id}>
                  <TableRow
                    className={isExpanded ? "bg-muted/30" : undefined}
                    data-state={isExpanded ? "expanded" : "collapsed"}
                  >
                    <TableCell className="pl-6 pr-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => toggleRow(order.orderId)}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-6 py-4 text-nowrap"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>

                  {isExpanded && (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={columns.length + 1}>
                        <div className="px-6 py-4 space-y-6 border-t">
                          <div className="grid gap-4">
                            <h3 className="text-lg font-semibold">
                              Order Details
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                <p className="text-muted-foreground">
                                  Customer:
                                  <span className="ml-2 text-foreground">
                                    {order.name}
                                  </span>
                                </p>
                                <p className="text-muted-foreground">
                                  Order Date:
                                  <span className="ml-2 text-foreground">
                                    {new Date(order.date).toLocaleDateString()}
                                  </span>
                                </p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-muted-foreground">
                                  Total Amount:
                                  <span className="ml-2 text-foreground">
                                    $
                                    {typeof order.totalAmount === "number"
                                      ? order.totalAmount.toFixed(2)
                                      : "0.00"}
                                  </span>
                                </p>
                                <div className="text-muted-foreground">
                                  Status:
                                  <Badge
                                    variant={
                                      order.orderStatus === "completed"
                                        ? "secondary"
                                        : order.orderStatus === "cancelled"
                                        ? "destructive"
                                        : "default"
                                    }
                                    className="ml-2"
                                  >
                                    {order.orderStatus}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="font-medium">Products</h4>
                            <div className="space-y-4">
                              {order.products.map((product) => (
                                <ProductCard
                                  key={product.productId}
                                  product={product}
                                />
                              ))}
                            </div>
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
                colSpan={columns.length + 1}
                className="h-24 text-center text-muted-foreground"
              >
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}