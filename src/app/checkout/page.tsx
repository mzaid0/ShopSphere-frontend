"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import CartStore from "@/store/CartStore";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getUserDetails } from "@/api/auth";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { SiStripe } from "react-icons/si";

// Zod schema for billing details
const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  company: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  zipCode: z.string().min(5, "Zip Code must be at least 5 digits"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Define types for cart product and cart item
interface CartProduct {
  id: string;
  brand: string;
  discount: number;
  images: string[];
  metaFields: { size?: string; color?: string }[];
  name: string;
  price: number;
}

interface CartItem {
  id: string;
  quantity: number;
  product: CartProduct;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// Interface for order data payload sent to backend
interface OrderDataPayload {
  billing: CheckoutFormData;
  items: {
    productId: string;
    quantity: number;
    price: number;
    productName: string;
  }[];
  subTotal: number;
  total: number;
  userId: string;
}

const OrderComponent: React.FC = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
  });

  // Auto-fill user details
  const { data: userDetails } = useQuery({
    queryKey: ["user-details"],
    queryFn: getUserDetails,
  });

  useEffect(() => {
    if (userDetails && userDetails.user) {
      reset({
        firstName: userDetails.user.firstName,
        lastName: userDetails.user.lastName,
        email: userDetails.user.email,
        phone: userDetails.user.phone || "",
        company: "",
        address: userDetails.user.addresses?.[0]?.addressLine || "",
        city: userDetails.user.addresses?.[0]?.city || "",
        state: userDetails.user.addresses?.[0]?.state || "",
        country: userDetails.user.addresses?.[0]?.country || "",
        zipCode: userDetails.user.addresses?.[0]?.zipCode || "",
      });
    }
  }, [userDetails, reset]);

  // Get cart data from CartStore
  const {
    data: cartData,
    isLoading: cartLoading,
    error: cartError,
  } = CartStore();
  const items: CartItem[] = cartData?.cartItems ?? [];

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    const effectivePrice =
      item.product.price * (1 - item.product.discount / 100);
    return sum + effectivePrice * item.quantity;
  }, 0);
  const total = subtotal;

  // Mutation to create order and get Stripe session URL
  const { mutate, isPending } = useMutation({
    mutationFn: (orderData: OrderDataPayload) =>
      fetch("http://localhost:8000/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (data.stripeSessionUrl) {
        router.push(data.stripeSessionUrl);
      } else {
        router.push("/my-orders/success");
      }
    },
  });

  // Get userId from auth store
  const { user } = useAuthStore();
  const userId = user?.id || "";

  const onSubmit: SubmitHandler<CheckoutFormData> = (billingData) => {
    const orderData: OrderDataPayload = {
      billing: billingData,
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price * (1 - item.product.discount / 100),
        productName: item.product.name,
      })),
      subTotal: subtotal,
      total: total,
      userId,
    };
    mutate(orderData);
  };

  return (
    <div className="container px-4 md:px-6">
      <div className="flex flex-col-reverse lg:flex-row gap-6 my-6">
        {/* Billing Details Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-full lg:w-[70%] p-6 lg:p-8 space-y-4 bg-white rounded-xl border border-gray-100 shadow-sm"
        >
          <h2 className="text-2xl font-bold mb-4">Billing Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                type="text"
                placeholder="First Name"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder="Last Name"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input type="email" placeholder="Email" {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Input type="text" placeholder="Phone" {...register("phone")} />
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone.message}</p>
              )}
            </div>
          </div>
          <Input
            type="text"
            placeholder="Company (Optional)"
            {...register("company")}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                type="text"
                placeholder="Address"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-red-500 text-xs">{errors.address.message}</p>
              )}
            </div>
            <div>
              <Input type="text" placeholder="City" {...register("city")} />
              {errors.city && (
                <p className="text-red-500 text-xs">{errors.city.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input type="text" placeholder="State" {...register("state")} />
              {errors.state && (
                <p className="text-red-500 text-xs">{errors.state.message}</p>
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder="Country"
                {...register("country")}
              />
              {errors.country && (
                <p className="text-red-500 text-xs">{errors.country.message}</p>
              )}
            </div>
          </div>
          <Input type="text" placeholder="Zip Code" {...register("zipCode")} />
          {errors.zipCode && (
            <p className="text-red-500 text-xs">{errors.zipCode.message}</p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="mt-4 flex items-center justify-center gap-2 px-8 py-3 bg-[#6772e5] hover:bg-[#5469d4] text-white font-semibold rounded-lg shadow transition-colors duration-200"
          >
            {isPending ? (
              "Processing..."
            ) : (
              <>
                <SiStripe size={10} />
                Pay with Stripe
              </>
            )}
          </Button>
        </form>
        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-[30%]">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              Order Summary
            </h2>
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-sm text-gray-500">
                  Purchases ({items.length})
                </span>
              </div>
            </div>
            {cartLoading ? (
              <p>Loading cart...</p>
            ) : cartError ? (
              <p>Error loading cart.</p>
            ) : items.length > 0 ? (
              <div className="space-y-5 mb-8 max-h-[400px] overflow-y-auto pr-2">
                {items.map((item) => {
                  const effectivePrice =
                    item.product.price * (1 - item.product.discount / 100);
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 group hover:bg-gray-50 p-3 rounded-lg transition-colors"
                    >
                      <div className="overflow-hidden rounded-lg border border-gray-200">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                          {item.product.name}
                        </h3>
                        <div className="text-xs text-gray-500">
                          Quantity: {item.quantity}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.product.brand}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ${(effectivePrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>No items in cart.</p>
            )}
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="text-sm font-medium text-gray-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Shipping:</span>
                <span className="text-sm font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-base font-semibold text-gray-900">
                  Total:
                </span>
                <span className="text-base font-semibold text-gray-900">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderComponent;
