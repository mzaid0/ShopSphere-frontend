"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Rating } from "@mui/material";
import ProductZoom from "@/components/sub-components/product-details/ProductZoom";
import QuantityBox from "@/components/sub-components/product-details/QuantityBox";
import ProductsTab from "@/components/sub-components/product-details/ProductsTab";
import { getProduct } from "@/api/products";
import { getReviews } from "@/api/review"; // API helper to get reviews
import TruckLoader from "@/components/Loader";
import RelatedProductsSlider from "@/components/sub-components/product-details/RelatedProductsSlider";  // New component

// Define interfaces for your product data
export interface MetaField {
  id: string;
  fieldName: string;
  fieldType: string;
  fieldValue: string;
  createdAt: string;
  updatedAt: string;
  productId: string;
}

export interface Category {
  id: string;
  name: string;
  parentId: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
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
  category: Category;
  categoryName: string;
}

export interface ProductResponse {
  success: boolean;
  product: Product;
}

// Define an interface for a review
interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
  user: {
    firstName: string;
    lastName: string;
    avatar: string;
  };
}

const ProductDetails = () => {
  // Get the product id from the URL parameters (assuming route /products/[id])
  const params = useParams();
  const productId = params?.id as string;

  // Fetch product details using React Query with proper typing
  const {
    data: productResponse,
    isLoading,
    error,
  } = useQuery<ProductResponse>({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
    enabled: !!productId,
  });

  // Fetch reviews for this product to compute dynamic review count and average rating
  const { data: reviewsData } = useQuery<Review[]>({
    queryKey: ["reviews", productId],
    queryFn: () => getReviews(productId),
    enabled: !!productId,
  });

  // Compute review count and average rating from reviewsData.
  const reviewsCount = reviewsData ? reviewsData.length : 0;
  const averageRating =
    reviewsData && reviewsData.length > 0
      ? reviewsData.reduce((acc, review) => acc + review.rating, 0) /
        reviewsData.length
      : productResponse?.product.ratings || 0;

  // Extract the product from the response
  const product = productResponse?.product;

  // Active image state for the zoom and thumbnails.
  const [activeImage, setActiveImage] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setActiveImage(product.images[0]);
      setActiveIndex(0);
    }
  }, [product]);

  // Additional states for size selection and quantity.
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [quantity, setQuantity] = useState<number>(1);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const increment = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrement = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <TruckLoader />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error loading product details.</p>
      </div>
    );
  }

  // Ensure that we always have an image to display.
  const displayImage = activeImage || (product.images && product.images[0]);

  // Extract available sizes from metaFields (if any), otherwise use a default.
  const availableSizes = product.metaFields
    .filter((field) => field.fieldType.toLowerCase() === "size")
    .map((field) => field.fieldValue);
  const sizesToShow =
    availableSizes.length > 0 ? availableSizes : ["S", "M", "L", "XL"];

  // Extract additional meta fields (exclude sizes)
  const additionalMetaFields = product.metaFields.filter(
    (field) => field.fieldType.toLowerCase() !== "size"
  );

  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 md:gap-10">
        {/* Left Section: Product Zoom & Thumbnails */}
        <div className="w-full lg:w-[40%] flex flex-col md:flex-row gap-4 sm:gap-6">
          {/* Thumbnails */}
          <div className="w-full md:w-1/4 h-auto flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {product.images && product.images.length > 0 ? (
              product.images.map((img: string, index: number) => (
                <div
                  key={index}
                  className={`min-w-[70px] h-[70px] md:w-16 md:h-16 rounded-md cursor-pointer transition-all duration-300 ${
                    index === activeIndex
                      ? "opacity-100 border-2 border-primary scale-105"
                      : "opacity-70 hover:opacity-90"
                  }`}
                  onClick={() => {
                    setActiveImage(img);
                    setActiveIndex(index);
                  }}
                >
                  <Image
                    src={img}
                    alt={`Product ${index + 1}`}
                    width={70}
                    height={70}
                    className="object-cover w-full h-full rounded-md"
                  />
                </div>
              ))
            ) : (
              <p>No images available.</p>
            )}
          </div>

          {/* Main Image */}
          <div className="w-full md:w-3/4 h-[350px] sm:h-[400px] flex items-center justify-center border rounded-md bg-white shadow-lg overflow-hidden">
            {displayImage ? (
              <ProductZoom src={displayImage} />
            ) : (
              <p>No image available</p>
            )}
          </div>
        </div>

        {/* Right Section: Product Details */}
        <div className="w-full lg:w-[60%] flex flex-col justify-center space-y-4 sm:space-y-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-800 leading-tight">
            {product.name}
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="text-base text-gray-700 font-medium">
              Brand:{" "}
              <span className="font-normal text-gray-500">{product.brand}</span>
            </div>
            <div className="flex items-center gap-2">
              <Rating
                name="product-rating"
                value={averageRating}
                precision={0.5}
                size="medium"
                readOnly
              />
              <span className="text-sm sm:text-base text-gray-600">
                ({reviewsCount} Reviews)
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              {product.oldPrice && (
                <span className="text-sm sm:text-base text-gray-500 line-through">
                  ${product.oldPrice}
                </span>
              )}
              <span className="text-xl sm:text-2xl font-bold text-red-600">
                ${product.price}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm sm:text-base">
              <span className="text-gray-700">Available In Stock:</span>
              <span className="font-semibold text-green-600">
                {product.stock} items
              </span>
            </div>
          </div>

          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            {product.description || "No description available."}
          </p>

          {/* Size Selection */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <span className="font-semibold text-gray-700 text-sm sm:text-base">
              Size:
            </span>
            <div className="flex flex-wrap gap-2">
              {sizesToShow.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md border transition-colors duration-200 text-xs sm:text-sm ${
                    selectedSize === size
                      ? "bg-primary text-white border-primary"
                      : "bg-gray-100 text-gray-700 border-gray-300"
                  } hover:bg-primary hover:text-white`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="text-sm sm:text-base text-gray-700">
            Free shipping (Est. Delivery: 2 - 3 days)
          </div>

          {/* Quantity Box */}
          <div className="w-full sm:w-auto">
            <QuantityBox
              quantity={quantity}
              increment={increment}
              decrement={decrement}
              productId={productId}
            />
          </div>

          {/* Additional Meta Fields (e.g. Color, Weight, etc.) */}
          {additionalMetaFields.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-bold text-gray-800">
                Additional Information
              </h3>
              <ul className="mt-2 space-y-1">
                {additionalMetaFields.map((field) => (
                  <li key={field.id} className="text-sm text-gray-600">
                    <span className="font-semibold capitalize">
                      {field.fieldType}:
                    </span>{" "}
                    {field.fieldValue}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Additional Content */}
      <div className="px-4 sm:px-6 lg:px-2">
        <ProductsTab description={product.description} />
        <RelatedProductsSlider categoryId={product.categoryId} />
      </div>
    </div>
  );
};

export default ProductDetails;
