"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { Navigation, Autoplay } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import { getBanners } from "@/api/banner";
import TruckLoader from "../Loader";

// Define the Banner type based on the backend data
export interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  category: {
    id: string;
    name: string;
    image: string;
    createdAt: string;
    updatedAt: string;
  };
  alignInfo: "left" | "right"; // Must be one of the AlignInfo enum values
  createdAt: string;
  updatedAt: string;
}

const HomeSlider = () => {
  const { data, isLoading, isError, error } = useQuery<{
    success: boolean;
    banners: Banner[];
  }>({
    queryKey: ["banners"],
    queryFn: getBanners,
  });

  if (isLoading) {
    return (
      <section className="container py-4">
        <div className="w-full h-[600px] flex items-center justify-center">
          <TruckLoader />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="container py-4">
        <div className="w-full h-[600px] flex items-center justify-center">
          <p className="text-red-600 text-lg">
            {error?.message || "Error fetching banners"}
          </p>
        </div>
      </section>
    );
  }

  // Use the dynamic banner data
  const slides = data?.banners || [];

  return (
    <section className="container py-4">
      <div className="w-full h-[600px] mx-auto overflow-hidden rounded-[50px] shadow-lg relative">
        <Swiper
          navigation={true}
          modules={[Navigation, Autoplay]}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          className="mySwiper w-full h-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              <div className="w-full h-full relative">
                {/* Background Image */}
                <Image
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover rounded-[50px]"
                />
                {/* Overlay Content */}
                <div
                  className={`absolute inset-0 flex items-center px-8 ${
                    index % 2 === 0
                      ? "justify-start text-left"
                      : "justify-end text-right"
                  } bg-black bg-opacity-10 text-gray-50`}
                >
                  <div
                    className={`max-w-md transform ${
                      index % 2 === 0
                        ? "translate-x-[30px]"
                        : "translate-x-[-30px]"
                    } transition-transform duration-300`}
                  >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 capitalize">
                      {slide.title}
                    </h2>
                    <p className="text-lg md:text-xl font-medium">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HomeSlider;
