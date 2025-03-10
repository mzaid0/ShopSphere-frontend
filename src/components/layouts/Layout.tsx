"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { usePathname } from "next/navigation";

// Define the context
export const NotFoundContext = createContext<{
  isNotFound: boolean;
  setIsNotFound: (value: boolean) => void;
}>({
  isNotFound: false,
  setIsNotFound: () => {},
});

// Hook to use the context
export function useNotFoundContext() {
  return useContext(NotFoundContext);
}

interface LayoutProps {
  children: React.ReactNode;
  fontClassName?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, fontClassName }) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hideHeaderRoutes = [
    "/login",
    "/register",
    "/admin",
    "/about-us",
    "/careers",
    "/privacy-policy",
    "/terms-of-service",
    "/my-orders/success",
    "/my-orders/failed"
  ];

  const shouldHideHeaderFooter =
    isNotFound ||
    hideHeaderRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

  if (!mounted) {
    return null;
  }

  return (
    <NotFoundContext.Provider value={{ isNotFound, setIsNotFound }}>
      {shouldHideHeaderFooter ? (
        <>{children}</>
      ) : (
        <div className={fontClassName}>
          <div className="sticky md:-top-[55px] z-50 shadow-md bg-white">
            <Header />
          </div>
          <main>{children}</main>
          <Footer />
        </div>
      )}
    </NotFoundContext.Provider>
  );
};

export default Layout;
