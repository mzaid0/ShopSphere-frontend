"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getBlogs } from "@/api/blogs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import BlogCard from "../sub-components/BlogCard";
import "swiper/css";
import "swiper/css/navigation";

// Define the Blog interface based on your API response
interface Blog {
  id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

// Define the response type from the getBlogs API
interface BlogResponse {
  message: string;
  blogs: Blog[];
}

interface BlogSliderProps {
  item: number; // Number of slides to show on larger screens
}

const BlogSlider: React.FC<BlogSliderProps> = ({ item }) => {
  // Fetch blogs using React Query
  const { data, isLoading, isError } = useQuery<BlogResponse>({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });

  // While loading, show a simple loading message
  if (isLoading) {
    return (
      <div className="bg-white py-6">
        <div className="container mx-auto px-4">
          <p>Loading blogs...</p>
        </div>
      </div>
    );
  }

  // In case of an error, show an error message
  if (isError) {
    return (
      <div className="bg-white py-6">
        <div className="container mx-auto px-4">
          <p>Error loading blogs.</p>
        </div>
      </div>
    );
  }

  const blogs = data?.blogs;

  return (
    <div className="bg-white py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-gray-800 font-semibold text-2xl pb-3">
          From the Blogs
        </h1>
        <Swiper
          slidesPerView={item}
          spaceBetween={30}
          navigation
          modules={[Navigation]}
          // Responsive breakpoints for different screen sizes
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: item,
              spaceBetween: 30,
            },
          }}
          className="mySwiper"
        >
          {blogs?.map((blog) => (
            <SwiperSlide key={blog.id}>
              <BlogCard
                image={blog.image}
                title={blog.title}
                description={blog.description}
                date={new Date(blog.createdAt).toLocaleDateString()}
                id={blog.id}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BlogSlider;
