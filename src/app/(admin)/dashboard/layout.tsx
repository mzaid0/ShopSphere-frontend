import Sidebar from "@/components/dashboard/navigations/Sidebar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-4 py-2 h-screen overflow-y-auto">
      <div className="flex gap-3">
        <Sidebar />
        <div className="flex-1 overflow-x-auto">
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
