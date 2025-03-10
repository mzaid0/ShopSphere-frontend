"use client";
import React from "react";
import { Inventory2, ShoppingCart } from "@mui/icons-material";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineCategory } from "react-icons/md";

interface DashboardBoxProps {
  totalOrders: number;
  totalUsers: number;
  totalCategories: number;
  totalProducts: number;
  isLoading?: boolean;
}

const DashboardBoxes = ({
  totalOrders,
  totalUsers,
  totalCategories,
  totalProducts,
  isLoading = false,
}: DashboardBoxProps) => {
  const boxes = [
    {
      title: "Total Orders",
      icon: <ShoppingCart style={{ fontSize: 40, color: "#4caf50" }} />,
      progress: Math.min((totalOrders / 100) * 100, 100),
      count: totalOrders,
      bgColor: "bg-green-100",
      progressColor: "#4caf50",
    },
    {
      title: "Total Users",
      icon: <FaRegUser style={{ fontSize: 30, color: "#2196f3" }} />,
      progress: Math.min((totalUsers / 200) * 100, 100),
      count: totalUsers,
      bgColor: "bg-blue-100",
      progressColor: "#2196f3",
    },
    {
      title: "Total Categories",
      icon: <MdOutlineCategory style={{ fontSize: 40, color: "#ff9800" }} />,
      progress: Math.min((totalCategories / 50) * 100, 100),
      count: totalCategories,
      bgColor: "bg-orange-100",
      progressColor: "#ff9800",
    },
    {
      title: "Total Products",
      icon: <Inventory2 style={{ fontSize: 40, color: "#9c27b0" }} />,
      progress: Math.min((totalProducts / 300) * 100, 100),
      count: totalProducts,
      bgColor: "bg-purple-100",
      progressColor: "#9c27b0",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4 bg-white rounded-lg">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-4 rounded-lg shadow-sm bg-gray-100 animate-pulse"
            >
              <div className="w-14 h-14 bg-gray-300 rounded-full"></div>
              <div className="mt-4 h-6 w-20 bg-gray-300 rounded"></div>
              <div className="mt-2 h-4 w-10 bg-gray-300 rounded"></div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4 bg-white rounded-lg">
      {boxes.map((box, index) => (
        <div
          key={index}
          className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-sm ${box.bgColor}`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div>{box.icon}</div>
              <div className="flex flex-col">
                <h3 className="font-[600] text-gray-800">{box.title}</h3>
                <span className="text-sm font-semibold text-gray-600">
                  {box.count}
                </span>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 w-14 h-14">
              <CircularProgressbar
                value={box.progress}
                text={`${Math.round(box.progress)}%`}
                styles={{
                  path: { stroke: box.progressColor },
                  text: { fill: "#333", fontSize: "30px", fontWeight: "600" },
                  trail: { stroke: "#e6e6e6" },
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardBoxes;
