import { myListItems } from "@/api/my-list";
import { useQuery } from "@tanstack/react-query";
export const WishListStore = () => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: myListItems,
  });
};

export default WishListStore;
