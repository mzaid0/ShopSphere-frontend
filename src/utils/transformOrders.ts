// src/utils/transformOrders.ts

export interface APIOrder {
    id: string;
    userId: string;
    addressId: string | null;
    subTotal: number;
    total: number;
    status: "pending" | "processing" | "completed" | "cancelled";
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    orderItems: {
      id: string;
      orderId: string;
      productId: string;
      quantity: number;
      price: number;
      createdAt: string;
      updatedAt: string;
      product?: {
        images: string[];
        name: string;
      };
    }[];
    Payment: {
      id: string;
      orderId: string;
      transactionId: string;
      paymentMethod: string;
      amount: number;
      currency: string;
      mobileNumber: string | null;
      status: string;
      paymentDate: string;
      createdAt: string;
      updatedAt: string;
      isDeleted: boolean;
    }[];
    user?: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string | null;
      addresses?: {
        id: string;
        userId: string;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        phone: string | null;
        addressLine: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        status: boolean;
        createdAt: string;
        updatedAt: string;
      }[];
    };
  }
  
  export interface Order {
    orderId: string;
    paymentId: string;
    products: {
      productId: string;
      title: string;
      quantity: number;
      price: number;
      image: string;
    }[];
    name: string;
    phoneNumber: string;
    address: string;
    pincode: string;
    totalAmount: number;
    email: string;
    userId: string;
    orderStatus: string;
    date: string;
  }
  
  export const transformOrders = (apiOrders: APIOrder[]): Order[] => {
    return apiOrders.map((order) => {
      const user = order.user || {
        firstName: "Unknown",
        lastName: "",
        email: "",
        phone: "",
      };
      const primaryAddress =
        user.addresses && user.addresses.length > 0
          ? user.addresses[0]
          : { addressLine: "", zipCode: "", phone: "" };
  
      const products = order.orderItems.map((item) => ({
        productId: item.productId,
        title: item.product?.name || item.productId,
        quantity: item.quantity,
        price: item.price,
        image: item.product?.images?.[0] || "",
      }));
  
      return {
        orderId: order.id,
        paymentId:
          order.Payment && order.Payment.length > 0 ? order.Payment[0].id : "",
        products,
        name: `${user.firstName} ${user.lastName}`.trim() || "Unknown",
        phoneNumber: user.phone || "",
        address: primaryAddress.addressLine || "",
        pincode: primaryAddress.zipCode || "",
        totalAmount: order.total,
        email: user.email || "",
        userId: order.userId,
        orderStatus: order.status,
        date: new Date(order.createdAt).toLocaleDateString(),
      };
    });
  };
  