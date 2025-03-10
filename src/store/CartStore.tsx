import { cartItems } from "@/api/cart";
import { useQuery } from "@tanstack/react-query";
export const CartStore = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: cartItems,
  });
};

export default CartStore;
