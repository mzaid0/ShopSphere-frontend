"use client";
import { getProducts } from "@/api/products";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import TruckLoader from "@/components/Loader";

const ProductsTable = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full">
        <TruckLoader />
      </div>
    );
  if (isError)
    return (
      <div>Error loading products: {error?.message || "Unknown error"}</div>
    );

  return (
    <div className="overflow-x-auto">
      <DataTable columns={columns} data={data.products} />
    </div>
  );
};

export default ProductsTable;
