"use client";

import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";
import AddToCartButton from "./AddToCartButton";
import AddToWishListButton from "./AddToWishListButton";

export interface ProductCardProps {
  image: StaticImageData | string;
  hoverImage: StaticImageData | string;
  brand: string;
  name: string;
  ratings: number;
  oldPrice: number;
  newPrice: number;
  discount?: number;
  detailUrl?: string; // optional, fallback will be used if not provided
  className?: string;
  productId: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  hoverImage,
  brand,
  name,
  ratings,
  oldPrice,
  newPrice,
  discount,
  detailUrl,
  className,
  productId,
}) => {
  const savings = oldPrice - newPrice;
  const ratingPercentage = (ratings / 5) * 100;

  // Use blurDataURL if image is imported statically.
  const imageProps =
    typeof image === "object" && "blurDataURL" in image
      ? { placeholder: "blur" as const, blurDataURL: image.blurDataURL }
      : {};
  const hoverImageProps =
    typeof hoverImage === "object" && "blurDataURL" in hoverImage
      ? { placeholder: "blur" as const, blurDataURL: hoverImage.blurDataURL }
      : {};

  // Provide a fallback URL if detailUrl is not provided.
  const safeDetailUrl = detailUrl || `/products/${productId}`;

  return (
    <div className="flex flex-col">
      <article
        className={cn(
          "group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900",
          className
        )}
      >
        {/* Only one Link here. */}
        <Link href={safeDetailUrl} className="block">
          {discount && (
            <div className="absolute top-3 left-0 z-10 bg-primary px-3 py-1 text-xs font-bold text-white shadow-md before:absolute before:left-0 before:top-full before:border-[6px] before:border-primary before:border-r-transparent">
              {discount}
            </div>
          )}
          <div className="relative w-full h-64 overflow-hidden">
            <Image
              src={image}
              alt={name}
              fill
              style={{ objectFit: "cover" }}
              className="transition-opacity duration-300 ease-in-out group-hover:opacity-0"
              {...imageProps}
            />
            <Image
              src={hoverImage}
              alt={`${name} - Alternate View`}
              fill
              style={{ objectFit: "cover" }}
              className="absolute inset-0 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
              {...hoverImageProps}
            />
          </div>
          <div className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-primary">{brand}</span>
              <div className="flex items-center">
                <div className="relative text-xs text-gray-400">
                  ★★★★★
                  <div
                    className="absolute top-0 overflow-hidden text-yellow-400"
                    style={{ width: `${ratingPercentage}%` }}
                  >
                    ★★★★★
                  </div>
                </div>
                <span className="ml-2 text-xs text-gray-500">({ratings})</span>
              </div>
            </div>
            <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              {name}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ${newPrice.toFixed(2)}
                </span>
                {oldPrice > newPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    ${oldPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  Save ${savings.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </Link>
      </article>
      {/* Add-to-Cart button rendered below the card */}
      <div className="mt-4 flex gap-4">
        <AddToCartButton
          productId={productId}
          className="w-full bg-primary text-white"
        />
        <AddToWishListButton productId={productId} />
      </div>
    </div>
  );
};

export default ProductCard;
