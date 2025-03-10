"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/api/categories";
import { Skeleton } from "@/components/ui/skeleton";

// Define the Category type based on your API response
export interface Category {
  id: string;
  name: string;
  image: string;
}

const HomeCategorySlider = () => {
  // Remove initialData so that isLoading is true until data arrives
  const { data, isLoading, isError, error } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      // If the response is an array, return it.
      // Otherwise, assume the response has a `categories` property.
      return Array.isArray(response) ? response : response.categories ?? [];
    },
  });

  // Show the skeleton slider if data is still loading or if no categories exist
  if (isLoading || !data || data.length === 0) {
    return (
      <section className="w-full bg-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-10 text-center text-3xl md:text-4xl font-bold text-gray-800">
            Shop by Categories
          </h1>
          <Swiper
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 15 },
              480: { slidesPerView: 2, spaceBetween: 15 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 25 },
              1280: { slidesPerView: 6, spaceBetween: 30 },
            }}
            navigation
            modules={[Navigation]}
            className="category-slider"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <SwiperSlide key={i}>
                <span className="group block p-4 bg-gray-50 border border-gray-200 rounded-xl transition-shadow hover:shadow-lg">
                  <div className="flex justify-center items-center">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden relative">
                      <Skeleton className="w-full h-full rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="mt-4 w-24 h-6 mx-auto" />
                </span>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full bg-white py-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-lg text-red-600">
            {(error as Error)?.message || "Error loading categories"}
          </p>
        </div>
      </section>
    );
  }

  // Data is loaded and not empty
  const categories = data;

  return (
    <section className="w-full bg-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="mb-10 text-center text-3xl md:text-4xl font-bold text-gray-800">
          Shop by Categories
        </h1>
        <Swiper
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 15 },
            480: { slidesPerView: 2, spaceBetween: 15 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 25 },
            1280: { slidesPerView: 6, spaceBetween: 30 },
          }}
          navigation
          modules={[Navigation]}
          className="category-slider"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id}>
              <Link href={`/product-list?categoryId=${category.id}`}>
                <span className="group block p-4 bg-gray-50 border border-gray-200 rounded-xl transition-shadow hover:shadow-lg">
                  <div className="flex justify-center items-center">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden relative">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <p className="mt-4 text-center text-lg font-medium text-gray-700">
                    {category.name}
                  </p>
                </span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HomeCategorySlider;
