// react query
import { useMutation } from "@tanstack/react-query";

// redux
import useSelector from "../redux/useSelector";

// utils
import axios from "../../utiles/axios";

// types
import type { UserType } from "../../utiles/types";

const addToWishlistMutationFn = async ({
  userId,
  data,
}: {
  userId: string;
  data: UserType;
}) => {
  return (await axios.put("users/" + userId, data)).data;
};

const useToggleFromWishlist = (prdId: string) => {
  const { user } = useSelector((state) => state.user);

  const mutateHook = useMutation({
    mutationKey: ["addProductToWishlist", prdId],
    mutationFn: addToWishlistMutationFn,
  });

  const toggleFromWishlist = () => {
    if (user) {
      let wishlist = user.wishlist;

      if (wishlist.some((id: string) => id === prdId)) {
        wishlist = wishlist.filter((id: string) => id !== prdId);
      } else wishlist = [...wishlist, prdId];

      mutateHook.mutate({
        userId: user._id,
        data: {
          ...user,
          wishlist,
        },
      });
    }
  };

  return {
    ...mutateHook,

    toggleFromWishlist,
  };
};

export default useToggleFromWishlist;
