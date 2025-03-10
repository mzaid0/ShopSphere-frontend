"use client";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "../sub-components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

// Define the Product interface expected by the slider.
export interface Product {
  id: string;
  images: string[]; // images[0]: primary, images[1]: hover
  brand: string;
  name: string;
  ratings: number;
  discount: string;
  oldPrice: number;
  price: number;
}

export interface ProductListSliderProps {
  item: number;
  products?: Product[];
}

// ── SKELETON CARD COMPONENT ──
export const ProductCardSkeleton: React.FC = () => {
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

// ── SKELETON SLIDER COMPONENT ──
export const ProductListSliderSkeleton: React.FC<{ item: number }> = ({
  item,
}) => {
  // Create an array of skeleton cards equal to the number of items to show.
  const skeletons = Array.from({ length: item }, (_, i) => i);
  return (
    <div className="bg-white">
      <div className="container mx-auto py-6 px-4">
        <Swiper
          slidesPerView={item}
          spaceBetween={20}
          navigation
          modules={[Navigation]}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },
            480: { slidesPerView: 2, spaceBetween: 10 },
            768: { slidesPerView: 3, spaceBetween: 15 },
            1024: { slidesPerView: item, spaceBetween: 20 },
          }}
          className="product-slider"
        >
          {skeletons.map((_, i) => (
            <SwiperSlide key={i}>
              <ProductCardSkeleton />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

// ── REAL SLIDER COMPONENT ──
const ProductListSlider: React.FC<ProductListSliderProps> = ({
  item,
  products,
}) => {
  return (
    <div className="bg-white">
      <div className="container mx-auto py-6 px-4">
        <Swiper
          slidesPerView={item}
          spaceBetween={20}
          navigation
          modules={[Navigation]}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },
            480: { slidesPerView: 2, spaceBetween: 10 },
            768: { slidesPerView: 3, spaceBetween: 15 },
            1024: { slidesPerView: item, spaceBetween: 20 },
          }}
          className="product-slider"
        >
          {products?.map((productItem) => (
            <SwiperSlide key={productItem.id}>
              <ProductCard
                image={productItem.images[0]}
                hoverImage={productItem.images[1]}
                brand={productItem.brand}
                name={productItem.name}
                ratings={productItem.ratings ?? 0}
                discount={Number(productItem.discount)}
                oldPrice={productItem.oldPrice ?? 0}
                newPrice={productItem.price ?? 0}
                detailUrl={`/product-detail/${productItem.id}`}
                productId={productItem.id}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductListSlider;
