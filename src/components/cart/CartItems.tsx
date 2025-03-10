"use client"; // For using hooks like useState in Next.js

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Rating from "@mui/material/Rating";
import Image from "next/image";
import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { Button } from "../ui/button";

type Product = {
  id: number;
  image: { src: string };
  brand: string;
  productName: string;
  rating: number;
  size: string;
  quantity: number;
  oldPrice: number;
  newPrice: number;
  discount: string;
};

type CartItemsProps = {
  cartItems: Product[];
};

const CartItems: React.FC<CartItemsProps> = ({ cartItems }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [quantityAnchorEl, setQuantityAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>, type: "size" | "quantity") => {
    if (type === "size") setAnchorEl(event.currentTarget);
    else setQuantityAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setQuantityAnchorEl(null);
  };

  const handleSelect = (type: "size" | "quantity", value: string | number) => {
    if (type === "size") setSelectedSize(value as string);
    else setSelectedQuantity(value as number);
    handleClose();
  };

  return (
    <>
      {cartItems.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center p-4 mb-4 bg-white border-b"
        >
          <div className="flex items-center space-x-4">
            <Image
              src={item.image.src}
              alt={item.productName}
              width={96}
              height={112}
              className="rounded-md"
            />
            <div className="space-y-1">
              <div className="text-xs">{item.brand}</div>
              <div className="font-medium">{item.productName}</div>
              <Rating
                name="half-rating-read"
                defaultValue={item.rating}
                precision={0.5}
                readOnly
              />
              <div className="text-xs flex items-center gap-3">
                <span
                  onClick={(e) => handleClick(e, "size")}
                  className="bg-gray-200 px-2 py-1 flex items-center gap-1 rounded-sm cursor-pointer"
                >
                  Size: {selectedSize || item.size} <FaAngleDown />
                </span>
                <span
                  onClick={(e) => handleClick(e, "quantity")}
                  className="bg-gray-200 px-2 py-1 flex items-center gap-1 rounded-sm cursor-pointer"
                >
                  Quantity: {selectedQuantity || item.quantity} <FaAngleDown />
                </span>
              </div>
              <div className="flex space-x-2 text-xs mt-2">
                <div className="line-through text-red-500">${item.oldPrice}</div>
                <div className="font-semibold text-green-500">${item.newPrice}</div>
                <div className="font-semibold text-green-500">{item.discount}</div>
              </div>
            </div>
          </div>
          <div>
            <Button variant="ghost" className="cursor-pointer">
              <IoCloseSharp />
            </Button>
          </div>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            {["S", "M", "L", "XL"].map((size) => (
              <MenuItem key={size} onClick={() => handleSelect("size", size)}>
                {size}
              </MenuItem>
            ))}
          </Menu>

          <Menu anchorEl={quantityAnchorEl} open={Boolean(quantityAnchorEl)} onClose={handleClose}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((qty) => (
              <MenuItem key={qty} onClick={() => handleSelect("quantity", qty)}>
                {qty}
              </MenuItem>
            ))}
          </Menu>
        </div>
      ))}
    </>
  );
};

export default CartItems;
