import ProductsTable from "@/components/dashboard/dashboard-components/products-table/ProductsTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const ProductList = () => {
  return (
    <div className="mt-3 p-4">
      <div className="flex items-center justify-between p-4 bg-white mb-3 shadow-sm">
        <h2 className=" text-xl font-semibold mb-4 px-4 bg-white">Products </h2>
        <Link href="/dashboard/products/add">
          <Button className="text-white">+ Add Products</Button>
        </Link>
      </div>
      <div className=" bg-white shadow-sm max-w-7xl rounded-md mx-auto p-4 ">
        <ProductsTable />
      </div>
    </div>
  );
};

export default ProductList;
