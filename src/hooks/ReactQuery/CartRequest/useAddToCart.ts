// react
import { type RefObject, useEffect } from "react";

// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// redux
import useDispatch from "../../redux/useDispatch";
// redux actions
import { setCart, setCartLoading } from "../../../store/fetures/userSlice";

// utils
import axios from "../../../utiles/axios";
import handleError from "../../../utiles/functions/handleError";

// types
import type { TopMessageRefType } from "../../../components/TopMessage";

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

const useAddToCart = (msgRef: RefObject<TopMessageRefType>) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const mutate = useMutation({
    mutationKey: ["addToCart"],
    mutationFn: (product: { productId: string; count: number }) =>
      addToCartMutationFn(product),

    onSuccess: () => {
      queryClient.prefetchQuery({ queryKey: ["getCart", ""] });
      queryClient.prefetchQuery({ queryKey: ["getProducts"] });
    },
  });

  const { data, error, isPending } = mutate;

  useEffect(() => {
    if (data) dispatch(setCart(data));
    if (error)
      handleError(error, msgRef, {
        forAllStates: "something went wrong while adding product to cart",
      });
  }, [data, error]);

  useEffect(() => {
    dispatch(setCartLoading(isPending));
  }, [isPending]);

  return mutate;
};

export default useAddToCart;
