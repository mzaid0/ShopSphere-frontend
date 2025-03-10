"use client";
import DashboardBoxes from "@/components/dashboard/dashboard-components/DashboardBoxes";
import InfoSection from "@/components/dashboard/dashboard-components/InfoSection";
import ProductsTable from "@/components/dashboard/dashboard-components/products-table/ProductsTable";
import { useDashboardData } from "@/utils/dashboardUtils";
import AllOrders from "./orders/page";

const Dashboard = () => {
  const {
    totalOrders,
    totalUsers,
    totalCategories,
    totalProducts,
    isLoading,
    error,
  } = useDashboardData();

  if (error) {
    return (
      <div className="bg-white h-screen overflow-y-auto p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-red-500">
          Error loading dashboard data: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white h-screen overflow-y-auto">
      <InfoSection />
      <DashboardBoxes
        totalOrders={totalOrders}
        totalUsers={totalUsers}
        totalCategories={totalCategories}
        totalProducts={totalProducts}
        isLoading={isLoading}
      />
      <div className="space-y-6">
        <div className="mt-3">
          <h2 className="text-xl font-semibold mb-4 px-4">Products</h2>
          <div className="bg-white shadow-sm max-w-7xl rounded-md mx-auto px-4">
            <ProductsTable />
          </div>
        </div>
        <div className="mt-3">
          <h2 className="text-xl font-semibold mb-4 px-4">Recent Orders</h2>
          <div className="bg-white shadow-sm max-w-7xl rounded-md mx-auto px-4">
            <AllOrders />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
