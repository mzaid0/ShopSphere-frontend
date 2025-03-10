"use client";
import React, { useEffect, useState } from "react";
import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { useDashboardData } from "@/utils/dashboardUtils"; // Adjust path if needed

// Static month data (no sales, just months as a base)
const staticData = [
  { name: "Jan" },
  { name: "Feb" },
  { name: "Mar" },
  { name: "Apr" },
  { name: "May" },
  { name: "Jun" },
  { name: "Jul" },
  { name: "Aug" },
  { name: "Sep" },
  { name: "Oct" },
  { name: "Nov" },
  { name: "Dec" },
];

// Define the chart data type
interface ChartData {
  name: string;
  totalUsers: number;
  totalOrders: number;
}

const DashboardChart = () => {
  const [mounted, setMounted] = useState(false);
  const { totalUsers, totalOrders, isLoading, error } = useDashboardData(); // Fetch dynamic data
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Ensure client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update chart data when totalUsers and totalOrders are fetched
  useEffect(() => {
    if (
      !isLoading &&
      !error &&
      totalUsers !== undefined &&
      totalOrders !== undefined
    ) {
      // Distribute totalUsers and totalOrders across months (evenly for simplicity)
      const usersPerMonth = Math.round(totalUsers / 12); // Assuming 12 months
      const ordersPerMonth = Math.round(totalOrders / 12); // Assuming 12 months
      const updatedChartData = staticData.map((item) => ({
        ...item,
        totalUsers: usersPerMonth, // Evenly distribute totalUsers
        totalOrders: ordersPerMonth, // Evenly distribute totalOrders
      }));
      setChartData(updatedChartData);
    }
  }, [totalUsers, totalOrders, isLoading, error]);

  // During SSR or before mounting/loading, render a loading state
  if (!mounted || isLoading) {
    return (
      <div className="flex flex-col bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-xl font-semibold mb-4 px-4">
          Total Users & Total Orders
        </h2>
        <div className="mx-auto">Loading chart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-xl font-semibold mb-4 px-4">
          Total Users & Total Orders
        </h2>
        <div className="mx-auto text-red-500">
          Error loading chart data: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-xl font-semibold mb-4 px-4">
        Total Users & Total Orders
      </h2>
      <div className="mx-auto">
        <LineChart
          width={1200}
          height={500}
          data={chartData}
          margin={{
            top: 20,
            right: 50,
            left: 20,
            bottom: 20,
          }}
        >
          <XAxis
            dataKey="name"
            stroke="#333"
            tick={{ fontSize: 14, fill: "#555" }}
          />
          <YAxis stroke="#333" tick={{ fontSize: 14, fill: "#555" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#f4f4f4",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
            labelStyle={{ color: "#333" }}
          />
          <Legend
            wrapperStyle={{
              top: 10,
              textAlign: "center",
              fontSize: "16px",
              color: "#555",
            }}
          />
          <Line
            type="monotone"
            dataKey="totalOrders"
            name="Total Orders"
            stroke="#20b2aa" // Teal color for orders
            strokeWidth={3}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="totalUsers"
            name="Total Users"
            stroke="#42a5f5" // Blue color for users
            strokeWidth={3}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </div>
    </div>
  );
};

export default DashboardChart;
