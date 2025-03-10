"use client";

import React, { useState } from "react";
import { Divider, Drawer, IconButton, List, ListItem } from "@mui/material";
import Link from "next/link";
import { Collapse } from "react-collapse";
import { CiSquareMinus } from "react-icons/ci";
import { FaRegSquarePlus } from "react-icons/fa6";
import { IoRocketSharp } from "react-icons/io5";
import { RiMenu2Fill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/api/categories";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Category interface for type safety (dynamic categories from API)
interface Category {
  id: string;
  name: string;
  parentId: string | null;
  subCategories?: Category[];
}

const Navbar = () => {
  const [open, setOpen] = useState(false);
  // A set of expanded category IDs for controlling collapsible items in the Drawer
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const router = useRouter();

  // Toggle Drawer open/close
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  // Toggle a specific category's expanded state (for Drawer)
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Fetch dynamic categories via TanStack Query
  const { data, isLoading, isError } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      // Assume getCategories returns an object with a "categories" array.
      const response = await getCategories();
      return response.categories;
    },
    initialData: [],
  });

  // --- Drawer Render (DO NOT CHANGE) ---
  const renderCategory = (category: Category, level: number = 0) => {
    const hasChildren =
      category.subCategories && category.subCategories.length > 0;
    const isExpanded = expandedCategories.has(category.id);

    return (
      <React.Fragment key={category.id}>
        <ListItem disablePadding>
          <div
            className="flex items-center justify-between w-full p-2 cursor-pointer hover:bg-gray-200 rounded"
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={() => {
              if (hasChildren) {
                toggleCategory(category.id);
              } else {
                router.push(`/product-list?categoryId=${category.id}`);
              }
            }}
          >
            <span className="text-sm font-medium text-gray-800">
              {category.name}
            </span>
            {hasChildren && (
              <IconButton size="small">
                {isExpanded ? (
                  <CiSquareMinus size={15} />
                ) : (
                  <FaRegSquarePlus size={15} />
                )}
              </IconButton>
            )}
          </div>
        </ListItem>
        {hasChildren && (
          <Collapse isOpened={isExpanded}>
            {category.subCategories?.map((sub) =>
              renderCategory(sub, level + 1)
            )}
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const DrawerList = (
    <div role="presentation">
      <List className="text-sm">
        {isLoading ? (
          <p className="p-4 text-gray-600">Loading categories...</p>
        ) : isError ? (
          <p className="p-4 text-red-600">Error loading categories.</p>
        ) : (
          data.map((category) => renderCategory(category))
        )}
      </List>
      <Divider />
    </div>
  );
  // --- End of Drawer Render ---

  // --- Dynamic Center Nav Links ---
  // Filter top-level categories (those with parentId === null)
  const topCategories = data.filter((cat) => cat.parentId === null);

  // Recursive function to render dynamic nav links with Framer Motion animations
  const renderDynamicNavCategory = (category: Category) => {
    const hasSub = category.subCategories && category.subCategories.length > 0;
    return (
      <motion.div
        key={category.id}
        className="relative group"
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        <Link
          href={`/product-list?categoryId=${category.id}`}
          className="text-sm font-medium text-gray-700 relative inline-block transition-colors duration-300 hover:text-primary"
        >
          {category.name}
        </Link>
        {hasSub && (
          <motion.div
            variants={{
              rest: { opacity: 0, y: -10, display: "none" },
              hover: { opacity: 1, y: 0, display: "block" },
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute left-0 top-full mt-2 bg-white shadow-xl rounded border border-gray-300 z-10 min-w-[220px] p-4"
          >
            <ul className="space-y-2">
              {category.subCategories!.map((subCat) => (
                <li key={subCat.id} className="relative group">
                  <Link
                    href={`/product-list?categoryId=${subCat.id}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    {subCat.name}
                  </Link>
                  {subCat.subCategories && subCat.subCategories.length > 0 && (
                    <motion.div
                      variants={{
                        rest: { opacity: 0, x: -10, display: "none" },
                        hover: { opacity: 1, x: 0, display: "block" },
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="absolute left-full top-0 ml-2 bg-white shadow-xl rounded border border-gray-300 z-20 min-w-[200px] p-4"
                    >
                      <ul className="space-y-2">
                        {subCat.subCategories.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={`/product-list?categoryId=${child.id}`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>
    );
  };
  // --- End of Dynamic Center Nav Links ---

  return (
    <div className="flex justify-between items-center px-4 py-4 container">
      {/* Left: Drawer Toggle Button */}
      <Button
        variant="outline"
        className="flex items-center justify-between space-x-2"
        onClick={toggleDrawer(true)}
      >
        <RiMenu2Fill />
        <span>SHOP BY CATEGORIES</span>
      </Button>

      {/* Center: Dynamic Nav Links */}
      <div className="hidden md:flex space-x-6 w-[80%] justify-center">
        <div className="flex space-x-6 text-sm font-medium text-gray-700">
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Error loading categories</p>
          ) : (
            topCategories.map((cat) => renderDynamicNavCategory(cat))
          )}
        </div>
      </div>

      {/* Right: International Delivery */}
      <div className="w-[20%] flex justify-end gap-2 items-center">
        <IoRocketSharp className="text-gray-600" />
        <span className="font-medium text-sm hidden sm:block">
          International Delivery
        </span>
      </div>

      {/* Drawer for Dynamic Categories */}
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <div className="flex justify-between items-center gap-6 p-6">
          <h2 className="font-medium text-lg uppercase">Shop by categories</h2>
          <IconButton onClick={toggleDrawer(false)}>
            <RxCross2 className="text-gray-600" />
          </IconButton>
        </div>
        {/* Wrap the category list in a fixed-height container */}
        <div className="border-t border-gray-200 max-h-[500px] overflow-y-auto">
          {DrawerList}
        </div>
      </Drawer>
    </div>
  );
};

export default Navbar;
