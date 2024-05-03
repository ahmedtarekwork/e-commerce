import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosWithToken } from "../../utiles/axios";

const addToCartMutationFn = async (product: {
  productId: string;
  count: number;
}) => {
  return (
    await axiosWithToken.post("carts", {
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
