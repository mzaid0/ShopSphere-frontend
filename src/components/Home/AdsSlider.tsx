"use client";

import React, { useEffect, useState } from "react";
import { getSmallBanners } from "@/api/small-banner";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "../ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Banner } from "./HomeSlider";

const AdsSlider = ({ item }: { item: number }) => {
  // React Query for fetching banners
  const { data, isLoading, isError, error } = useQuery<{
    success: boolean;
    smallBanners: Banner[];
  }>({
    queryKey: ["smallBanners"],
    queryFn: getSmallBanners,
  });

  // Enforce a minimum delay of 2 seconds before showing real data
  const [minDelay, setMinDelay] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setMinDelay(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // In case of error, render an error message
  if (isError) {
    return (
      <section className="relative container bg-white py-16 dark:bg-gray-900 overflow-hidden">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-lg text-red-600">
            {(error as Error)?.message || "Error loading banners"}
          </p>
        </div>
      </section>
    );
  }

  // While loading or during the minimum delay, render the skeleton slider
  if (isLoading || minDelay) {
    return (
      <section className="relative container bg-white py-16 dark:bg-gray-900 overflow-hidden">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Featured Offers
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Discover exclusive deals and promotions
              </p>
            </div>
            <div className="hidden gap-3 md:flex">
              <button className="ad-prev rounded-full bg-primary p-3 shadow-lg transition hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
                <ChevronLeft className="h-6 w-6 text-white duration-200 hover:text-gray-900 dark:text-white" />
              </button>
              <button className="ad-next rounded-full bg-primary p-3 shadow-lg transition hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
                <ChevronRight className="h-6 w-6 text-white duration-200 hover:text-gray-900 dark:text-white" />
              </button>
            </div>
          </div>

          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: ".ad-prev",
              nextEl: ".ad-next",
            }}
            spaceBetween={30}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: item },
            }}
            loop={true}
            speed={600}
            grabCursor={true}
            className="!overflow-visible"
          >
            {Array.from({ length: item }).map((_, idx) => (
              <SwiperSlide key={idx}>
                <Link
                  href="#"
                  className="group block overflow-hidden rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
                >
                  <div className="relative aspect-[3/2] w-full overflow-hidden">
                    <Skeleton className="w-full h-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent p-6 flex flex-col justify-end">
                      <div className="space-y-2">
                        <Skeleton className="w-1/2 h-8" />
                        <Skeleton className="mt-2 w-3/4 h-4" />
                        <Skeleton className="mt-4 w-24 h-8" />
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    );
  }

  // Once loaded and delay is over, render the actual slider
  return (
    <section className="relative mt-5 bg-white py-16 dark:bg-gray-900 overflow-hidden">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Featured Offers
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Discover exclusive deals and promotions
            </p>
          </div>
          <div className="hidden gap-3 md:flex">
            <button className="ad-prev rounded-full bg-primary p-3 shadow-lg transition hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
              <ChevronLeft className="h-6 w-6 text-white duration-200 hover:text-gray-900 dark:text-white" />
            </button>
            <button className="ad-next rounded-full bg-primary p-3 shadow-lg transition hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
              <ChevronRight className="h-6 w-6 text-white duration-200 hover:text-gray-900 dark:text-white" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: ".ad-prev",
            nextEl: ".ad-next",
          }}
          spaceBetween={30}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: item },
          }}
          loop={true}
          speed={600}
          grabCursor={true}
          className="!overflow-visible"
        >
          {data?.smallBanners.map((ad) => (
            <SwiperSlide key={ad.id}>
              <Link
                href={`/product-list?categoryId=${ad.category?.id}`}
                className="group block overflow-hidden rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden">
                  <Image
                    src={ad.image}
                    alt={ad.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent p-6 flex flex-col justify-end">
                    <div className={`text-gray-100 text-${ad.alignInfo}`}>
                      <h3 className="text-2xl font-bold tracking-tight">
                        {ad.title}
                      </h3>
                      {ad.description && (
                        <p className="mt-2 text-sm opacity-90">
                          {ad.description}
                        </p>
                      )}
                      <Button
                        size="sm"
                        className="mt-4 w-fit bg-white/20 backdrop-blur-sm hover:bg-white/30"
                      >
                        {"Learn More"}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default AdsSlider;
