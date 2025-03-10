// app/page.js
"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getSingleBlog } from "@/api/blogs"; // Ensure this function is defined and returns blog data
import TruckLoader from "@/components/Loader";

export default function BlogPage() {
  const { id: blogId } = useParams();

  // Always call useQuery unconditionally.
  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: () => getSingleBlog(blogId as string),
    enabled: Boolean(blogId), // The query runs only if blogId exists
  });

  if (!blogId) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>No blog selected.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <TruckLoader />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Error loading blog.</p>
      </div>
    );
  }

  // Extract blog data from the API response.
  const blog = data.blog || data;

  // Format the creation date for display.
  const formattedDate = new Date(blog.createdAt).toLocaleDateString();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-[#f5fffe]">
      <main className="w-full">
        <article key={blog.id} className="w-full mb-16">
          {/* Full Width Image with Gradient */}
          <div className="w-full h-[350px] relative">
            {blog.image ? (
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              // Fallback if no image is available
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <p className="text-gray-700">No image available</p>
              </div>
            )}
            {/* Bottom Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#20b2aa]/60 to-transparent" />

            {/* Date Badge using the createdAt field */}
            <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur rounded-full text-sm font-medium text-[#1a9089]">
              {formattedDate}
            </div>
          </div>

          {/* Content Container */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
              {blog.title}
            </h1>
            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              {blog.description}
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
