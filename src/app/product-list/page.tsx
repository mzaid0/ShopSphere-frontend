"use client";

import { Checkbox } from "@/components/ui/checkbox"; // <-- Imported shadcn Checkbox
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Rating from "@mui/material/Rating";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import { getCategories } from "@/api/categories";
import { getProducts } from "@/api/products";
import { Category } from "@/components/Home/ProductsSlider";
import Sidebar from "@/components/ProductList/Sidebar";
import ProductCard from "@/components/sub-components/ProductCard";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface MetaField {
  id: string;
  fieldName: string;
  fieldType: string;
  fieldValue: string;
  createdAt: string;
  updatedAt: string;
  productId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  brand: string;
  price: number;
  oldPrice: number;
  stock: number;
  ratings: number;
  isFeatured: boolean;
  sale: number;
  discount: number;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  isDeleted: boolean;
  metaFields: MetaField[];
  category: {
    id: string;
    name: string;
    parentId: string | null;
    image: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
  };
  categoryName: string;
}

interface ProductResponse {
  success: boolean;
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
  };
}
interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// ------------------------------------------------------------------
// Skeleton Components (for loading state)
// ------------------------------------------------------------------
const ProductCardSkeleton: React.FC = () => {
  return (
    <article className="group relative h-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm p-4">
      <div className="w-full h-64 mb-4">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-1/2 h-4" />
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-3/4 h-3" />
        <Skeleton className="w-1/3 h-6" />
      </div>
    </article>
  );
};

interface ProductListSkeletonProps {
  itemsPerPage: number;
}

const ProductListSkeleton: React.FC<ProductListSkeletonProps> = ({
  itemsPerPage,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: itemsPerPage }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

// ------------------------------------------------------------------
// Main ProductList Component
// ------------------------------------------------------------------
const ProductList: React.FC = () => {
  // Client‑side search state (name/brand)
  const [searchTerm, setSearchTerm] = useState<string>("");
  // Sort order string (e.g. "priceLowToHigh", etc.)
  const [sortOrder, setSortOrder] = useState<string>("");
  // For pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  // Selected category filter (null means "All Products")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // For rating filter – we allow a single threshold (e.g. rating ≥ value)
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  // Slider for maximum price. Default is high so that all products show.
  const [price, setPrice] = useState<number>(100000);

  const itemsPerPage = 8;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL query parameters only once.
  const initializedRef = useRef<boolean>(false);
  useEffect(() => {
    if (initializedRef.current) return;

    const categoryFromQuery = searchParams.get("categoryId");
    const ratingFromQuery = searchParams.get("rating");
    const priceFromQuery = searchParams.get("maxPrice");

    if (categoryFromQuery) {
      setSelectedCategory(categoryFromQuery);
    }
    if (ratingFromQuery) {
      setSelectedRatings([Number(ratingFromQuery)]);
    }
    if (priceFromQuery) {
      setPrice(Number(priceFromQuery));
    }
    initializedRef.current = true;
  }, [searchParams]);

  // Fetch categories for the sidebar.
  const { data: categoryData, isLoading: categoryLoading } = useQuery<
    Category[]
  >({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      return Array.isArray(response) ? response : response.categories ?? [];
    },
  });

  // Build query parameters for the API call.
  const productQueryParams: Record<string, string> = {
    page: currentPage.toString(),
    limit: itemsPerPage.toString(),
    sortOrder: sortOrder || "desc",
    sortBy: sortOrder.includes("price")
      ? "price"
      : sortOrder.includes("rating")
      ? "ratings"
      : "createdAt",
  };

  if (selectedCategory) {
    productQueryParams.categoryId = selectedCategory;
  }
  if (selectedRatings.length > 0) {
    // Use the minimum rating as the threshold.
    productQueryParams.rating = Math.min(...selectedRatings).toString();
  }
  if (price < 100000) {
    productQueryParams.maxPrice = price.toString();
    productQueryParams.minPrice = "1";
  }

  // Fetch products using react-query.
  const {
    data: productsData,
    isLoading: productsLoading,
    isError,
    error,
  } = useQuery<ProductResponse>({
    queryKey: [
      "products",
      selectedCategory,
      selectedRatings,
      price,
      currentPage,
      sortOrder,
    ],
    queryFn: () => getProducts(productQueryParams),
  });

  // Update the URL query parameters when filters change.
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) {
      params.set("categoryId", selectedCategory);
    }
    if (selectedRatings.length > 0) {
      params.set("rating", Math.min(...selectedRatings).toString());
    }
    if (price < 100000) {
      params.set("maxPrice", price.toString());
    }
    if (sortOrder) {
      params.set("sortOrder", sortOrder);
    }
    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    }

    router.push(
      params.toString() ? `${pathname}?${params.toString()}` : pathname
    );
  }, [
    selectedCategory,
    selectedRatings,
    price,
    sortOrder,
    currentPage,
    router,
    pathname,
  ]);

  // Handler functions.
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (value: string): void => {
    setSortOrder(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId: string | null): void => {
    if (categoryId === null) {
      // Clear all filters to show all products.
      setSelectedCategory(null);
      setSelectedRatings([]);
      setPrice(100000);
      setSortOrder("");
      setCurrentPage(1);
    } else {
      setSelectedCategory(categoryId);
      setCurrentPage(1);
    }
  };

  const handleRatingChange = (value: number): void => {
    if (selectedRatings.includes(value)) {
      setSelectedRatings([]);
    } else {
      setSelectedRatings([value]);
    }
    setCurrentPage(1);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPrice(Number(e.target.value));
    setCurrentPage(1);
  };

  // Client‑side search filtering.
  const displayedProducts: Product[] =
    productsData?.products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="bg-white">
      <div className="container py-6 flex flex-col lg:flex-row">
        {/* Sidebar Section */}
        <div className="w-full lg:w-[20%] border border-gray-300 rounded-lg p-4 mb-4 lg:mb-0 lg:mr-4">
          <div className="space-y-6">
            <Sidebar
              title="Shop by Categories"
              categories={categoryData}
              loading={categoryLoading}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />

            <div className="px-2 py-2 rounded-md">
              <h2 className="text-sm font-medium">Filter by Price</h2>
              <input
                type="range"
                min="1"
                max="100000"
                step="10"
                value={price}
                onChange={handlePriceChange}
                className="w-full accent-[#20b2aa] bg-[#e0e0e0] rounded-lg mt-2"
              />
              <div className="text-xs mt-1">Up to ₹{price}</div>
            </div>

            <div className="px-2 py-2 rounded-md">
              <h2 className="text-sm font-medium">Filter by Rating</h2>
              <div className="space-y-2 mt-2">
                {[5, 4, 3, 2, 1].map((value) => (
                  <div key={value} className="flex items-center">
                    <Checkbox
                      id={`rating-${value}`}
                      checked={selectedRatings.includes(value)}
                      onCheckedChange={() => handleRatingChange(value)}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`rating-${value}`}
                      className="cursor-pointer"
                      onClick={() => handleRatingChange(value)}
                    >
                      <Rating
                        name={`rating-display-${value}`}
                        value={value}
                        readOnly
                        size="small"
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid Section */}
        <div className="w-full lg:w-[80%]">
          {/* Search and Sorting Controls */}
          <div className="mb-4 flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              className="px-3 py-2 border rounded-md w-full sm:w-[300px]"
            />
            <div className="flex items-center space-x-2">
              <h2 className="font-medium text-sm">Sort by:</h2>
              <Select onValueChange={handleSort}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sort Products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sort By</SelectLabel>
                    <SelectItem value="priceLowToHigh">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="priceHighToLow">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="ratingHighToLow">
                      Rating: High to Low
                    </SelectItem>
                    <SelectItem value="ratingLowToHigh">
                      Rating: Low to High
                    </SelectItem>
                    <SelectItem value="alphabeticalAZ">
                      Alphabetically: A-Z
                    </SelectItem>
                    <SelectItem value="alphabeticalZA">
                      Alphabetically: Z-A
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Grid or Skeleton */}
          {productsLoading ? (
            <ProductListSkeleton itemsPerPage={itemsPerPage} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayedProducts.map((productItem) => (
                <ProductCard
                  key={productItem.id}
                  image={productItem.images[0]}
                  hoverImage={productItem.images[1] || productItem.images[0]}
                  brand={productItem.brand}
                  name={productItem.name}
                  ratings={productItem.ratings}
                  discount={productItem.discount}
                  oldPrice={productItem.oldPrice}
                  newPrice={productItem.price}
                  productId={productItem.id}
                  detailUrl={`/product-detail/${productItem.id}`} // optional if you want to override the default fallback
                />
              ))}
            </div>
          )}

          {isError && (
            <div className="text-center text-3xl text-gray-400 capitalize">
              <p>
                {(error as ErrorResponse).response?.data?.message ||
                  "An error occurred"}
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {productsData && productsData.pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from(
                { length: productsData.pagination.totalPages },
                (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 border rounded-md ${
                      currentPage === i + 1 ? "bg-primary text-white" : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(productsData.pagination.totalPages, prev + 1)
                  )
                }
                disabled={currentPage === productsData.pagination.totalPages}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
