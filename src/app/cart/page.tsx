"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AddCircleOutline,
  LocalShipping,
  RemoveCircleOutline,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import CartStore from "@/store/CartStore";
import { updateCartItemAPI, deleteCartItemAPI } from "@/api/cart";

// Define the shape of a cart item for your UI
interface CartItem {
  id: string;
  productId: string;
  image: string;
  brand: string;
  productName: string;
  rating: number;
  size: string;
  quantity: number;
  oldPrice: number;
  newPrice: number;
  discount: number;
  color: string;
  deliveryDate: string;
  stockStatus: string;
}

// Helper to transform API data into our CartItem format.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformCartItems = (data: any): CartItem[] => {
  const items =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?.cartItems?.map((item: any) => {
      const sizeValue =
        item.product.metaFields?.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (f: any) => f.fieldType.toLowerCase() === "size"
        )?.fieldValue || "";
      console.log("Product:", item.product.name, "Size:", sizeValue);
      return {
        id: item.id,
        productId: item.productId,
        image: item.product.images?.[0] || "",
        brand: item.product.brand || "",
        productName: item.product.name,
        rating: item.product.ratings || 0,
        size: sizeValue,
        quantity: item.quantity,
        oldPrice: item.product.oldPrice || item.product.price,
        newPrice: item.product.price,
        discount: item.product.discount || 0,
        color: "", // Update if available
        deliveryDate: "", // Update if available
        stockStatus: "In Stock",
      };
    }) || [];
  console.log("Transformed Cart Items:", items);
  return items;
};

const Cart = () => {
  const queryClient = useQueryClient();

  // Get dynamic cart data using our CartStore hook.
  const {
    data: cartData,
    isLoading: cartLoading,
    error: cartError,
  } = CartStore();
  const cartItems = transformCartItems(cartData);
  const subtotal = cartItems.reduce(
    (total, item) => total + item.newPrice * item.quantity,
    0
  );

  // Mutation for updating quantity.
  const { mutate: updateQuantity, isPending: updateLoading } = useMutation({
    mutationFn: (data: { productId: string; quantity: number }) =>
      updateCartItemAPI(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => console.error("Error updating quantity:", error),
  });

  // Mutation for deleting a cart item.
  const { mutate: deleteItem } = useMutation({
    mutationFn: (data: { productId: string }) => deleteCartItemAPI(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => console.error("Error deleting item:", error),
  });

  const handleQuantityChange = (productId: string, delta: number) => {
    const item = cartItems.find((i) => i.productId === productId);
    if (!item) return;
    const newQuantity = Math.max(1, item.quantity + delta);
    updateQuantity({ productId, quantity: newQuantity });
  };

  const handleDeleteItem = (productId: string) => {
    deleteItem({ productId });
  };

  if (cartLoading) {
    return (
      <Grid container justifyContent="center" sx={{ p: 4 }}>
        <Typography variant="h6">Loading cart...</Typography>
      </Grid>
    );
  }

  if (cartError) {
    return (
      <Grid container justifyContent="center" sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          Error loading cart items.
        </Typography>
      </Grid>
    );
  }

  return (
    <Grid
      container
      spacing={3}
      sx={{
        p: [2, 4],
        minHeight: "100vh",
        flexDirection: { xs: "column-reverse", md: "row" },
      }}
    >
      {/* Cart Items Section */}
      <Grid item xs={12} md={8} sx={{ pr: { md: 2 }, height: { md: "90vh" } }}>
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <CardHeader
            title={
              <Typography variant="h6">
                Shopping Cart ({cartItems.length})
              </Typography>
            }
            sx={{ borderBottom: "1px solid #e0e0e0", p: 2 }}
          />
          <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
            <Button variant="default">
              <LocalShipping sx={{ mr: 1, fontSize: "1rem" }} />
              Continue Shopping
            </Button>
          </Box>
          <CardContent sx={{ flex: 1, overflow: "auto", p: 2 }}>
            {cartItems.map((item) => (
              <Box key={item.id} sx={{ mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4} sm={3}>
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.productName}
                        width={100}
                        height={100}
                        style={{
                          borderRadius: 8,
                          width: "100%",
                          height: "auto",
                          maxWidth: "100px",
                        }}
                      />
                    )}
                  </Grid>
                  <Grid item xs={5} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                    >
                      {item.productName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      {item.brand}
                    </Typography>
                    <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                      <Chip
                        label={`Size: ${item.size}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.65rem" }}
                      />
                      <Badge variant="outline">{item.discount}% Off</Badge>
                    </Box>
                  </Grid>
                  <Grid item xs={3}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-end"
                      gap={0.5}
                    >
                      <Typography variant="body1">
                        ${(item.newPrice * item.quantity).toFixed(2)}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(item.productId, -1)
                          }
                          sx={{ p: 0.5 }}
                          disabled={updateLoading}
                        >
                          <RemoveCircleOutline fontSize="small" />
                        </IconButton>
                        <Typography
                          variant="body1"
                          sx={{ fontSize: "0.875rem" }}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(item.productId, 1)
                          }
                          sx={{ p: 0.5 }}
                          disabled={updateLoading}
                        >
                          <AddCircleOutline fontSize="small" />
                        </IconButton>
                      </Box>
                      <Button
                        variant="outline"
                        color="error"
                        onClick={() => handleDeleteItem(item.productId)}
                      >
                        <MdDelete />
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Order Summary */}
      <Grid item xs={12} md={4} sx={{ height: { md: "90vh" } }}>
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <CardHeader
            title={<Typography variant="h6">Order Summary</Typography>}
            sx={{ borderBottom: "1px solid #e0e0e0", p: 2 }}
          />
          <CardContent sx={{ flex: 1, overflow: "auto", p: 2 }}>
            <Stack spacing={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body1">
                  Subtotal ({cartItems.length} items)
                </Typography>
                <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
              </Box>
              <Divider />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" className="text-lg font-medium">
                  ${subtotal.toFixed(2)}
                </Typography>
              </Box>
              <Button variant="outline">
                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-2"
                >
                  <FiArrowRight />
                  Proceed to Checkout
                </Link>
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Cart;
