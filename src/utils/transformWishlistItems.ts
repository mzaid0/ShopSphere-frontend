// src/utils/transformWishlistItems.ts

// If these types are only needed for transformation, move them here.
// Otherwise, you can also import them from a shared types file.
export interface MyListResponse {
    success: boolean;
    myListProducts?: {
      id: string;
      userId: string;
      productId: string;
      product: {
        id: string;
        name: string;
        description: string;
        images: string[];
        brand: string;
        price: number;
        oldPrice: number;
        stock: number;
        ratings: number;
        isFeatured: boolean;
        sale: number;
        discount: number;
        createdAt: string;
        updatedAt: string;
        categoryId: string;
        isDeleted: boolean;
        metaFields: {
          id: string;
          fieldName: string;
          fieldType: string;
          fieldValue: string;
          createdAt: string;
          updatedAt: string;
          productId: string;
        }[];
        category: {
          id: string;
          name: string;
          parentId: string | null;
          image: string;
          createdAt: string;
          updatedAt: string;
          isDeleted: boolean;
        };
        categoryName: string;
      };
    }[];
  }
  
  // UI-friendly Wishlist Item type.
  export interface WishlistItem {
    id: string;
    productId: string;
    image: string;
    brand: string;
    productName: string;
    rating: number;
    size: string;
    oldPrice: number;
    newPrice: number;
    discount: number;
    stock: number;
  }
  
  export const transformWishlistItems = (
    data?: MyListResponse
  ): WishlistItem[] => {
    if (!data || !data.myListProducts) return [];
    return data.myListProducts.map((item) => {
      const sizeValue =
        item.product.metaFields?.find(
          (f) => f.fieldType.toLowerCase() === "size"
        )?.fieldValue || "";
      return {
        id: item.id,
        productId: item.productId,
        image: item.product.images?.[0] || "",
        brand: item.product.brand || "",
        productName: item.product.name,
        rating: item.product.ratings || 0,
        size: sizeValue,
        oldPrice: item.product.oldPrice || item.product.price,
        newPrice: item.product.price,
        discount: item.product.discount || 0,
        stock: item.product.stock || 0,
      };
    });
  };
  