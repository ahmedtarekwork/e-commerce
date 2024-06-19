import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../utiles/axios";

const addToCartMutationFn = async (product: {
  productId: string;
  count: number;
}) => {
  return (
    await axios.post("carts", {
      cart: [product],
    })
  ).data;
};

const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["addToCart"],
    mutationFn: (product: { productId: string; count: number }) =>
      addToCartMutationFn(product),

    onSuccess: () => {
      queryClient.prefetchQuery({ queryKey: ["getCart", ""] });
      queryClient.prefetchQuery({ queryKey: ["getProducts"] });
    },
  });
};

export default useAddToCart;
