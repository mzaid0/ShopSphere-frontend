"use client";
import Link from "next/link";
import { useNotFoundContext } from "../components/layouts/Layout"; // Adjust path as needed
import { useEffect } from "react";

function NotFound() {
  const { setIsNotFound } = useNotFoundContext();

  useEffect(() => {
    setIsNotFound(true);
    return () => setIsNotFound(false); // Reset when component unmounts
  }, [setIsNotFound]);

  console.log("Not Found Page");
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#20b2aa]/10 flex items-center">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated 404 Number */}
          <div className="mb-8 animate-bounce">
            <span className="text-9xl font-extrabold bg-gradient-to-r from-[#20b2aa] to-[#20b2aa]/70 bg-clip-text text-transparent">
              404
            </span>
          </div>

          {/* Main Content */}
          <div className="relative mb-12">
            {/* SVG Decoration */}
            <svg
              className="absolute -top-24 left-1/2 -translate-x-1/2 opacity-20 w-72 h-72"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#20b2aa"
                d="M45,-78.3C58.1,-69.7,68.2,-57.3,75.8,-43.5C83.4,-29.6,88.5,-14.3,88.7,0.1C88.9,14.5,84.2,29.1,76.4,41.6C68.6,54.1,57.7,64.6,45.3,73.6C32.9,82.6,18.9,90.2,3.3,85.3C-12.3,80.4,-24.6,63,-36.8,51.4C-49.1,39.8,-61.3,34,-71.1,24.9C-80.9,15.8,-88.3,3.4,-85.8,-7.3C-83.3,-18,-70.9,-27,-60.4,-37.2C-49.9,-47.4,-41.3,-58.7,-30.8,-68.6C-20.3,-78.6,-7.8,-87.1,5.3,-94.9C18.4,-102.7,36.8,-109.7,45,-78.3Z"
                transform="translate(100 100)"
              />
            </svg>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Oops! Something&apos;s missing...
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The page you&apos;re looking for seems to have vanished into the
              digital void. Don&apos;t worry though - even the best maps
              sometimes miss a spot!
            </p>
          </div>

          {/* Action Button */}
          <Link
            href="/"
            className="inline-block relative group px-8 py-4 bg-[#20b2aa] hover:bg-[#1b9c94] text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#20b2aa]/30"
          >
            <span className="flex items-center space-x-2">
              <span>Return to Homepage</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
          </Link>

          {/* Additional Help Text */}
          <p className="mt-8 text-gray-500 italic">
            Still lost? Let us know at{" "}
            <a
              href="mailto:m.zaid.connect@gmail.com"
              className="text-[#20b2aa] hover:underline"
            >
              m.zaid.connect@gmail.com{" "}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
