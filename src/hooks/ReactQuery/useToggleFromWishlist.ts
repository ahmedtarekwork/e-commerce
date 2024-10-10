// react query
import { useMutation } from "@tanstack/react-query";

// redux
import useSelector from "../redux/useSelector";

// utils
import axios from "../../utils/axios";

const addToWishlistMutationFn = async ({
  userId,
  data,
}: {
  userId: string;
  data: { product: string };
}) => {
  return (await axios.post(`users/wishlist/${userId}`, data)).data;
};

const useToggleFromWishlist = (
  prdId: string,
  onSuccess?: (typeof useMutation.arguments)[0]["onSuccess"],
  onError?: (typeof useMutation.arguments)[0]["onError"]
) => {
  const { user } = useSelector((state) => state.user);

  const mutateHook = useMutation({
    mutationKey: ["toggleProductFromWishlist", prdId],
    mutationFn: addToWishlistMutationFn,
    onSuccess,
    onError,
  });

  const toggleFromWishlist = () => {
    if (user) {
      mutateHook.mutate({
        userId: user._id,
        data: { product: prdId },
      });
    }
  };

  return {
    ...mutateHook,

    toggleFromWishlist,
  };
};

export default useToggleFromWishlist;
