"use client";
import React, { useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";
import ProductListSlider, {
  ProductListSliderSkeleton,
} from "./ProductListSlider";

// Import APIs
import { getCategories } from "@/api/categories";
import {
  getProductsByCategory,
  getProducts,
  featuredProducts,
} from "@/api/products";

// ── TYPE DEFINITIONS ──

export type Category = {
  id: string;
  name: string;
  image: string;
  parentId: string | null;
  subCategories: Category[];
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
};

export type MetaField = {
  id: string;
  fieldName: string;
  fieldType: string;
  fieldValue: string;
  createdAt: string;
  updatedAt: string;
  productId: string;
};

export type ProductCategory = {
  id: string;
  name: string;
  parentId: string | null;
  image: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
};

export type Product = {
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
  discount: number; // from API as number
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  isDeleted: boolean;
  metaFields: MetaField[];
  category: ProductCategory;
  categoryName: string;
};

export type ProductsResponse = {
  success: boolean;
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
  };
};

export type ProductText = {
  title: string;
  description?: string;
};

// ── HELPER: TRANSFORM PRODUCTS ──
// Convert discount from number to string.
const transformProducts = (products: Product[] | undefined) =>
  products?.map((product) => ({
    ...product,
    discount: product.discount.toString(),
  }));

// ── COMPONENT FOR CATEGORY-BASED UI ──

const CategoryProductsSlider = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const [selectedCategoryId, setSelectedCategoryId] =
    React.useState<string>("");

  // Add a minimum delay of 2 seconds.
  const [minDelay, setMinDelay] = React.useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setMinDelay(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch categories
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Set the first category as selected when categories load.
  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedCategoryId(newValue);
    console.log("Selected Category ID:", newValue);
  };

  // Fetch products for the selected category.
  const {
    data: productData,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery<ProductsResponse>({
    queryKey: ["products", selectedCategoryId],
    queryFn: () => getProductsByCategory(selectedCategoryId),
    enabled: !!selectedCategoryId,
  });

  // Transform products so discount becomes a string.
  const transformedProducts = transformProducts(productData?.products);

  return (
    <div className="bg-white mt-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between p-4 rounded-md">
        {/* Left Side: Title and Description */}
        <div className="space-y-1 text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-gray-800 font-semibold text-2xl">{title}</h2>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>

        {/* Right Side: Category Tabs */}
        {!categoriesLoading &&
          !categoriesError &&
          categories &&
          categories.length > 0 && (
            <Box
              sx={{
                width: "100%",
                maxWidth: { xs: 320, sm: 480 },
                ml: 0,
              }}
            >
              <Tabs
                value={selectedCategoryId || categories[0].id}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
                textColor="primary"
                indicatorColor="primary"
              >
                {categories.map((category) => (
                  <Tab
                    label={category.name}
                    key={category.id}
                    value={category.id}
                  />
                ))}
              </Tabs>
            </Box>
          )}
      </div>

      {/* Product List */}
      <div className="container mx-auto">
        {productsError ? (
          <p className="text-center text-red-500">Error loading products.</p>
        ) : productsLoading || minDelay ? (
          <ProductListSliderSkeleton item={5} />
        ) : (
          <ProductListSlider item={5} products={transformedProducts} />
        )}
      </div>
    </div>
  );
};

// ── COMPONENT FOR SIMPLE (NON-CATEGORY) UI ──

const SimpleProductsSlider = ({ title }: { title: string }) => {
  // Add a minimum delay of 2 seconds.
  const [minDelay, setMinDelay] = React.useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setMinDelay(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Determine which API to call based on the title.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let queryKey: any;
  let queryFn: () => Promise<ProductsResponse>;

  if (title === "Latest Products") {
    queryKey = ["products", "all"];
    queryFn = getProducts;
  } else if (title === "Featured Products") {
    queryKey = ["products", "featured"];
    queryFn = featuredProducts;
  } else {
    queryKey = ["products", "all"];
    queryFn = getProducts;
  }

  const {
    data: productData,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery<ProductsResponse>({
    queryKey,
    queryFn,
  });

  const transformedProducts = transformProducts(productData?.products);

  return (
    <div className="bg-white mt-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between p-4 rounded-md">
        {/* Title Only */}
        <div className="space-y-1 text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-gray-800 font-semibold text-2xl">{title}</h2>
        </div>
      </div>

      <div className="container mx-auto">
        {productsError ? (
          <p className="text-center text-red-500">Error loading products.</p>
        ) : productsLoading || minDelay ? (
          <ProductListSliderSkeleton item={5} />
        ) : (
          <ProductListSlider item={5} products={transformedProducts} />
        )}
      </div>
    </div>
  );
};

const ProductsSlider = ({ title, description }: ProductText) => {
  return description ? (
    <CategoryProductsSlider title={title} description={description} />
  ) : (
    <SimpleProductsSlider title={title} />
  );
};

export default ProductsSlider;
