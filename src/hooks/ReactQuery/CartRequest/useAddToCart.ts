// react
import { useEffect } from "react";

// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// redux
import useDispatch from "../../redux/useDispatch";
import useSelector from "../../redux/useSelector";
// redux actions
import { setCart, setCartLoading } from "../../../store/fetures/userSlice";

// hooks
import useHandleErrorMsg from "../../useHandleErrorMsg";

// utils
import axios from "../../../utils/axios";

const AddToCartMutationFn = async (
  product: {
    productId: string;
    wantedQty?: number;
  },
  userId: string
) => {
  if (!userId)
    throw new axios.AxiosError(
      "you need to login before modify your cart",
      "403"
    );

  return (await axios.post(`carts/${userId}`, product)).data;
};

const useAddToCart = () => {
  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleError = useHandleErrorMsg();

  const mutate = useMutation({
    mutationKey: ["addToCart"],
    mutationFn: (product: { productId: string; wantedQty?: number }) =>
      AddToCartMutationFn(product, user?._id || ""),

    onSuccess: (data) => {
      dispatch(setCart(data));

      queryClient.prefetchQuery({ queryKey: ["getCart", ""] });
      queryClient.prefetchQuery({ queryKey: ["getProducts"] });
    },
    onError(error) {
      handleError(error, {
        forAllStates: "something went wrong while modifying your cart",
      });
    },
  });

  const { isPending } = mutate;

  useEffect(() => {
    dispatch(setCartLoading(isPending));
  }, [isPending]);

  return mutate;
};

export default useAddToCart;
