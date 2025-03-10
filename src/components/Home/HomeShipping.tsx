import React from "react";
import { FaShippingFast } from "react-icons/fa"; // Importing an icon from react-icons

const HomeShipping = () => {
  return (
    <div className="py-6 bg-white mt-6">
      <div className="container mx-auto p-6 border-2 border-[#20b2aa] rounded-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left Section: Icon and Title */}
          <div className="flex items-center gap-4 md:w-1/3 w-full">
            <FaShippingFast size={60} className="text-teal-500" />
            <p className="text-3xl font-semibold text-gray-700 uppercase">
              Free Shipping
            </p>
          </div>

          {/* Center Section: Text */}
          <div className="text-center md:w-1/2 w-full">
            <p className="text-gray-800">
              Free Delivery now on your first order and over $200.
            </p>
          </div>

          {/* Right Section: Additional Text */}
          <div className="text-right md:w-1/6 w-full">
            <p className="text-3xl font-[600] text-gray-600 text-center">Only $200</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeShipping;
