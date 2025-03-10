"use client";
import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
  TableMeta,
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
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order } from "./columns";

// Define custom TableMeta type
interface CustomTableMeta extends TableMeta<Order> {
  onStatusUpdate?: () => void;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  onStatusUpdate?: () => void;
}

export function DataTable<TData extends Order, TValue>({
  columns,
  data,
  isLoading,
  onStatusUpdate,
}: DataTableProps<TData, TValue>) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    meta: {
      onStatusUpdate,
    } as CustomTableMeta, // Type the meta object
  });

  const toggleRow = (orderId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
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
      <div className="p-4 flex items-center justify-between gap-4">
        <Input
          placeholder="Search orders..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={table.getState().pagination.pageSize.toString()}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Show" />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()}>
                Show {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
                                      order.orderStatus === "delivered"
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

      <div className="flex items-center justify-between p-4 border-t">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()} ({table.getRowModel().rows.length} of{" "}
          {data.length} rows)
        </div>
      </div>
    </div>
  );
}
