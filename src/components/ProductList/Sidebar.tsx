"use client";

import React, { useState } from "react";
import { Collapse } from "react-collapse";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Checkbox } from "@/components/ui/checkbox";
import { Category } from "@/components/Home/ProductsSlider";

interface SidebarProps {
  title: string;
  categories: Category[] | undefined;
  loading: boolean;
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  title,
  categories,
  loading,
  selectedCategory,
  onCategoryChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const toggleCollapse = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="container">
      <div className="p-2 rounded-md">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-medium">{title}</h2>
          <button
            onClick={toggleCollapse}
            className="text-lg bg-transparent text-gray-600 rounded-full hover:bg-gray-200"
          >
            {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
        </div>
        <Collapse isOpened={isOpen}>
          <div
            className="space-y-2 mt-4"
            style={{ maxHeight: "250px", overflowY: "auto" }}
          >
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {/* "All Products" Checkbox */}
                <div className="py-1">
                  <div className="flex items-center">
                    <Checkbox
                      id="all-products"
                      className="mr-2"
                      checked={selectedCategory === null}
                      onCheckedChange={() => onCategoryChange(null)}
                    />
                    <label
                      htmlFor="all-products"
                      className="text-xs flex-1 cursor-pointer"
                      onClick={() => onCategoryChange(null)}
                    >
                      All Products
                    </label>
                  </div>
                </div>
                {/* Render individual category checkboxes */}
                {categories?.map((category) => (
                  <div key={category.id} className="py-1">
                    <div className="flex items-center">
                      <Checkbox
                        id={category.id}
                        className="mr-2"
                        checked={selectedCategory === category.id}
                        onCheckedChange={(checked: boolean) => {
                          if (checked) {
                            onCategoryChange(category.id);
                          } else {
                            onCategoryChange(null);
                          }
                        }}
                      />
                      <label
                        htmlFor={category.id}
                        className="text-xs flex-1 cursor-pointer"
                        onClick={() =>
                          onCategoryChange(
                            selectedCategory === category.id
                              ? null
                              : category.id
                          )
                        }
                      >
                        {category.name}
                      </label>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default Sidebar;
