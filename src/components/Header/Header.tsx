"use client";

import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/services/apiClient";
import useAuthStore from "@/store/authStore";
import {
  Divider,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiFillApple } from "react-icons/ai";
import { FaHeart, FaShoppingBag, FaSignOutAlt } from "react-icons/fa";
import {
  FiArrowRight,
  FiCreditCard,
  FiHeart,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiShoppingCart,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import logo from "../../assets/logo.png";
import Tuser from "../../assets/user.webp";
import { Button } from "../ui/button";
import Navbar from "./Navbar";

// Import your cart store and API functions for updating/deleting cart items.
import { deleteCartItemAPI, updateCartItemAPI } from "@/api/cart";
import CartStore from "@/store/CartStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import WishListStore from "@/store/WishListStore";
import { transformWishlistItems } from "@/utils/transformWishlistItems";

// ── HELPER: Transform Dynamic Cart Data ──
interface CartItem {
  id: string;
  productId: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
  // You can add more fields as needed (e.g., discount, size, etc.)
  size: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformCartItems = (data: any): CartItem[] => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?.cartItems?.map((item: any) => {
      // Find the size from product metaFields (if available)
      const sizeValue =
        item.product.metaFields?.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (f: any) => f.fieldType.toLowerCase() === "size"
        )?.fieldValue || "";
      return {
        id: item.id,
        productId: item.productId,
        image: item.product.images?.[0] || "",
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        size: sizeValue,
      };
    }) || []
  );
};

// ── HEADER COMPONENT ──
const Header = () => {
  // Local state for Drawer, User Menu and Logout confirmation.
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const openMenu = Boolean(anchorEl);

  const { user, setUser } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();

  // --- Cart Data ---
  const {
    data: cartData,
    isLoading: cartLoading,
    error: cartError,
  } = CartStore();
  const dynamicCartItems = transformCartItems(cartData);
  const cartCount = dynamicCartItems.length;
  const subtotal = dynamicCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const { data: wishlistData } = WishListStore();
  const dynamicWishListCount = transformWishlistItems(wishlistData);
  const wishListCount = dynamicWishListCount.length;
  const shipping = 10; // Static shipping cost
  const taxes = subtotal * 0.05; // Example: 5% tax
  const total = subtotal + shipping + taxes;

  // Mutation for updating quantity
  const queryClient = useQueryClient();
  const { mutate: updateQuantity } = useMutation({
    mutationFn: (data: { productId: string; quantity: number }) =>
      updateCartItemAPI(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    onError: (error) => console.error("Error updating quantity:", error),
  });

  // Mutation for removing a cart item
  const { mutate: removeCartItem } = useMutation({
    mutationFn: (productId: string) => deleteCartItemAPI({ productId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    onError: (error) => console.error("Error removing item:", error),
  });

  const handleQuantityChange = (productId: string, delta: number) => {
    const item = dynamicCartItems.find((i) => i.productId === productId);
    if (!item) return;
    const newQuantity = Math.max(1, item.quantity + delta);
    updateQuantity({ productId, quantity: newQuantity });
  };

  const handleRemoveItem = (productId: string) => {
    removeCartItem(productId);
  };

  // --- Menu Handlers (User Dropdown) ---
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // --- Logout Handler ---
  const handleConfirmLogout = async () => {
    setShowDeleteConfirm(false);
    try {
      const response = await axiosInstance.client.post(
        "/api/users/logout",
        null
      );
      if (response.data?.success) {
        toast({
          title: "Logout Successful",
          description: response.data.message || "You have been logged out.",
        });
        router.push("/login");
        setUser(null);
      } else {
        toast({
          title: "Logout Failed",
          description: "Something went wrong. Please try again.",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.response?.data?.message || "Unexpected error.",
      });
    }
  };

  // Drawer toggle handler
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        (event as React.KeyboardEvent).key === "Tab"
      ) {
        return;
      }
      setIsDrawerOpen(open);
    };

  // If cart is loading or errored, you can show a fallback UI inside the drawer
  const renderCartContent = () => {
    if (cartLoading) {
      return <Typography variant="body1">Loading cart...</Typography>;
    }
    if (cartError) {
      return (
        <Typography variant="body1" color="error">
          Error loading cart.
        </Typography>
      );
    }
    if (cartCount === 0) {
      return <Typography variant="body1">Your cart is empty.</Typography>;
    }

    return (
      <div className="flex flex-col space-y-4">
        {dynamicCartItems.map((item) => (
          <div
            key={item.id}
            className="group flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="relative">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-lg border object-cover hover:scale-105 transition-transform"
                />
              )}
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate hover:text-primary transition-colors">
                {item.name}
              </h3>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button
                    className="p-1 hover:bg-gray-100 rounded-md text-gray-500"
                    onClick={() => handleQuantityChange(item.productId, -1)}
                  >
                    <FiMinus className="h-4 w-4" />
                  </button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button
                    className="p-1 hover:bg-gray-100 rounded-md text-gray-500"
                    onClick={() => handleQuantityChange(item.productId, 1)}
                  >
                    <FiPlus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    className="p-1.5 hover:bg-red-50 text-red-500 rounded-md transition-colors"
                    onClick={() => handleRemoveItem(item.productId)}
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <header className="bg-white">
      {/* Top Bar */}
      <div className="border-t border-b border-gray-300 mt-3 hidden md:block">
        <div className="container flex flex-col sm:flex-row justify-between items-center py-2 px-6">
          <div className="text-sm text-gray-500 text-center sm:text-left">
            Get up to 50% off new season styles, limited time only
          </div>
          <nav className="flex space-x-4 text-sm mt-2 sm:mt-0">
            <Link
              href="/about-us"
              className="text-slate-700 link hover:text-primary"
            >
              About
            </Link>
            <Link
              href="/careers"
              className="text-slate-700 link hover:text-primary"
            >
              Careers
            </Link>
            <Link
              href="/privacy-policy"
              className="text-slate-700 link hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-slate-700 link hover:text-primary"
            >
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Header */}
      <div className="mt-2 border-b border-gray-300 py-4">
        <div className="container mx-auto flex sm:flex-col md:flex-row items-center justify-between">
          {/* Logo */}
          <div className="flex items-center w-full md:w-[30%] justify-center md:justify-start">
            <Link href="/">
              <Image
                src={logo}
                alt="Logo"
                width={180}
                height={100}
                className="cursor-pointer"
              />
            </Link>
          </div>

          {/* Header Title */}
          <div className="text-center">
            <h1 className="hidden md:block text-3xl font-semibold">
              Welcome to <span className="text-primary">ShopSphere</span>
            </h1>
          </div>

          {/* Right Section: Wishlist, Cart, and User Menu */}
          <div className="flex items-center justify-end space-x-4 w-full md:w-[30%]">
            {user?.role === "Admin" && (
              <Tooltip title="Admin Panel">
                <Link href="/dashboard" className="link text-gray-700">
                  <IoShieldCheckmarkOutline size={32} />
                </Link>
              </Tooltip>
            )}

            {!user && (
              <>
                <Link href="/login" className="link font-[500]">
                  Login
                </Link>
                <span className="text-gray-400">/</span>
                <Link href="/register" className="link font-[500]">
                  Register
                </Link>
              </>
            )}

            {user && (
              <Tooltip title="Wishlist">
                <Link href="/my-list" className="relative link hidden md:block">
                  <FiHeart size={26} />
                  {/* Example Wishlist Count */}
                  {wishListCount > 0 && (
                    <span className="absolute -top-1 -right-2 text-xs text-white bg-primary rounded-full w-4 h-4 flex items-center justify-center">
                      {wishListCount}
                    </span>
                  )}
                </Link>
              </Tooltip>
            )}

            {user && (
              <Tooltip title="Cart">
                <div
                  className="relative link cursor-pointer"
                  onClick={toggleDrawer(true)}
                >
                  <FiShoppingCart size={26} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-2 text-xs text-white bg-primary rounded-full w-4 h-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Tooltip>
            )}

            {user && (
              <>
                <IconButton onClick={handleMenuOpen}>
                  <Image
                    src={user.avatar || Tuser}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem onClick={handleMenuClose}>
                    <Link href="/account" className="link">
                      <span className="flex items-center gap-2">
                        <MdAccountCircle size={22} /> My Account
                      </span>
                    </Link>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleMenuClose}>
                    <Link href="/my-orders" className="link">
                      <span className="flex items-center gap-2">
                        <FaShoppingBag size={22} /> Orders
                      </span>
                    </Link>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleMenuClose}>
                    <Link href="/my-list" className="link">
                      <span className="flex items-center gap-2">
                        <FaHeart size={22} /> My List
                      </span>
                    </Link>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleMenuClose}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setShowDeleteConfirm(true);
                      }}
                    >
                      <span className="flex items-center gap-2 text-red-500">
                        <FaSignOutAlt size={22} /> Logout
                      </span>
                    </button>
                  </MenuItem>
                  <Divider />
                </Menu>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Drawer for Cart */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 420 },
            background: "hsl(0 0% 98%)",
            borderRadius: "12px 0 0 12px",
          },
        }}
      >
        <div className="h-full flex flex-col">
          {/* Drawer Header */}
          <div className="bg-gradient-to-r from-primary to-[#1d9d97] p-4">
            <div className="flex justify-between items-center text-white">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FiShoppingBag className="text-white" />
                Your Cart ({cartCount})
              </h2>
              <IconButton
                onClick={toggleDrawer(false)}
                className="hover:bg-white/10 rounded-full"
              >
                <FiX className="text-white" />
              </IconButton>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            {renderCartContent()}
          </div>

          {/* Order Summary */}
          <div className="border-t p-4 bg-white">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxes</span>
                <span className="font-medium">${taxes.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold text-gray-800">
                ${total.toFixed(2)}
              </span>
            </div>
            <div className="grid gap-3 mt-6">
              <Button>
                <Link
                  href="/cart"
                  className="flex items-center justify-center gap-2"
                >
                  <FiShoppingCart /> Cart Items
                </Link>
              </Button>
              <Button variant="outline">
                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-2"
                >
                  <FiArrowRight /> Checkout
                </Link>
              </Button>
              <div className="mt-4 flex justify-center gap-3 opacity-75">
                <FiCreditCard className="h-6 w-6" />
                <AiFillApple className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      <Navbar />
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLogout}>
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default Header;
