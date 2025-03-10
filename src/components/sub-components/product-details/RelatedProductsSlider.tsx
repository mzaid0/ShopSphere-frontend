"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductListSlider, {
  ProductListSliderSkeleton,
} from "../../Home/ProductListSlider";
import { getProductsByCategory } from "@/api/products";
import type { Product } from "../../Home/ProductListSlider";

export type ProductsResponse = {
  success: boolean;
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
  };
}; // Ensure correct types

const RelatedProductsSlider = ({ categoryId }: { categoryId: string }) => {
  // Minimum delay for skeleton UI
  const [minDelay, setMinDelay] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setMinDelay(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch products for the given category
  const {
    data: productData,
    isLoading,
    isError,
  } = useQuery<ProductsResponse>({
    queryKey: ["products", categoryId],
    queryFn: () => getProductsByCategory(categoryId),
    enabled: !!categoryId,
  });

  // Transform products if necessary (e.g., convert discount to string)
  const transformedProducts = productData?.products?.map(
    (product: Product) => ({
      ...product,
      discount: product.discount.toString(),
    })
  );

  return (
    <div className="bg-white mt-4">
      <div className="container mx-auto">
        {isError ? (
          <p className="text-center text-red-500">
            Error loading related products.
          </p>
        ) : isLoading || minDelay ? (
          <ProductListSliderSkeleton item={5} />
        ) : (
          <ProductListSlider item={5} products={transformedProducts} />
        )}
      </div>
    </div>
  );
};

export default RelatedProductsSlider;
