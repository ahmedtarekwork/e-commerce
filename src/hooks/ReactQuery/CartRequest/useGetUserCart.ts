// react
import { useEffect } from "react";

// react query
import { useQuery } from "@tanstack/react-query";

// redux
import useDispatch from "../../redux/useDispatch";
// redux actions
import { setCartLoading } from "../../../store/fetures/userSlice";

// types
import type { CartType } from "../../../utils/types";

// utils
import axios from "../../../utils/axios";

const getCartQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, userId],
}: {
  queryKey: string[];
}): Promise<CartType> => {
  if (!userId)
    throw new axios.AxiosError("__APP_ERROR__ user id is required", "400");

  return (await axios(`carts/${userId}`)).data;
};

const useGetUserCart = (userId: string, enabled: boolean = false) => {
  const dispatch = useDispatch();

  const cartQuery = useQuery({
    queryKey: ["getCart", userId],
    queryFn: getCartQueryFn,
    enabled,
  });

  const { isPending } = cartQuery;

  useEffect(() => {
    dispatch(setCartLoading(isPending));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]);

  return cartQuery;
};

export default useGetUserCart;
