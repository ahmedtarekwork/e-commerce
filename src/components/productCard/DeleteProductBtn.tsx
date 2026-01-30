// components
import IconAndSpinnerSwitcher from "../animatedBtns/IconAndSpinnerSwitcher";
import FillIcon from "../FillIcon";

// react query
import { useMutation } from "@tanstack/react-query";

// icons
import { AiFillDelete, AiOutlineDelete } from "react-icons/ai";

// redux
import useDispatch from "../../hooks/redux/useDispatch";

// redux actions
import { setCart, setUserWishlist } from "../../store/fetures/userSlice";

// utils
import axios from "../../utils/axios";

// hooks
import useToggleFromWishlist from "../../hooks/ReactQuery/useToggleFromWishlist";
import useHandleErrorMsg from "../../hooks/useHandleErrorMsg";

// types
import type { Dispatch, SetStateAction } from "react";
import type { ProductType } from "../../utils/types";

export type ProductCardDeleteBtn =
  | {
      type: "wishlist";
      setCurrentWishlist: Dispatch<SetStateAction<ProductType[]>>;
    }
  | { type: "cart"; setCurrentWishlist?: never };

type Props = ProductCardDeleteBtn & Record<"productId" | "userId", string>;

// fetchers
const removeItemFromCartMutationFn = async ({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) => {
  return (
    await axios.delete(`/carts/${userId}/removeProduct`, {
      data: { productId },
    })
  ).data;
};

const DeleteProductBtn = ({
  type,
  productId,
  userId,
  setCurrentWishlist,
}: Props) => {
  const dispatch = useDispatch();
  const handleError = useHandleErrorMsg();

  // react query \\

  // remove item from cart
  const { mutate: removeFromCart, isPending: removeFromCartLoading } =
    useMutation({
      mutationKey: ["removeItemFromCart", productId],
      mutationFn: removeItemFromCartMutationFn,

      onSuccess(data) {
        dispatch(setCart(data));
      },

      onError(error) {
        handleError(error, {
          forAllStates:
            "something went wrong while removing the item from your cart",
        });
      },
    });

  // add to wishlist
  const { toggleFromWishlist, isPending: wishlistLoading } =
    useToggleFromWishlist(
      productId,
      (data: string[]) => {
        dispatch(setUserWishlist(data));
        setCurrentWishlist?.((prev) =>
          prev.filter(({ _id }) => _id !== productId)
        );
      },
      (error: unknown) => {
        handleError(
          error,
          {
            forAllStates:
              "something went wrong while adding the product to wishlist",
          },
          4000
        );
      }
    );

  return (
    <button
      data-testid={`delete-product-${productId}`}
      title="remove product from cart btn"
      disabled={wishlistLoading || removeFromCartLoading}
      className="red-btn delete-product-btn"
      onClick={() => {
        if (type === "cart") {
          removeFromCart({ productId, userId });
        } else {
          toggleFromWishlist();
        }
      }}
    >
      <IconAndSpinnerSwitcher
        toggleIcon={wishlistLoading || removeFromCartLoading}
        icon={<FillIcon stroke={<AiOutlineDelete />} fill={<AiFillDelete />} />}
      />
    </button>
  );
};
export default DeleteProductBtn;
