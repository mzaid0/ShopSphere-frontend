"use client";
import useAuthStore from "@/store/authStore";
import Link from "next/link";
import { FaSkyatlas } from "react-icons/fa";

const InfoSection = () => {
  const { user } = useAuthStore();
  return (
    <div className="p-4">
      <div className="p-6 flex flex-col md:flex-row items-center justify-between border border-gray-200 rounded-lg">
        {/* Left Side - Welcome Text */}
        <div className="flex flex-col justify-center space-y-4 w-full md:w-auto">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome {`${user?.firstName} ${user?.lastName}`}
          </h2>
          <p className="text-gray-600">
            We are thrilled to have you on board. Explore and track your
            progress effortlessly.
          </p>
          <Link
            href="/dashboard/products/add"
            className="bg-primary w-full md:w-[30%] text-center py-2 rounded-md text-white hover:bg-primary/80 transition-colors duration-100"
          >
            + Add Products
          </Link>
        </div>

        {/* Right Side - Icon */}
        <div className="mt-4 md:mt-0 w-16 h-16 md:w-24 md:h-24 text-primary">
          <FaSkyatlas className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default InfoSection;