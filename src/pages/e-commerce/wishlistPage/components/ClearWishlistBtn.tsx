// icons
import { IoMdHeartDislike } from "react-icons/io";

// components
import IconAndSpinnerSwitcher from "../../../../components/animatedBtns/IconAndSpinnerSwitcher";

// react query
import { useMutation } from "@tanstack/react-query";

// redux
import useSelector from "../../../../hooks/redux/useSelector";

// utils
import axios from "../../../../utils/axios";

// hooks
import useHandleErrorMsg from "../../../../hooks/useHandleErrorMsg";
import useShowMsg from "../../../../hooks/useShowMsg";

// types
import type { Dispatch, SetStateAction } from "react";
import useDispatch from "../../../../hooks/redux/useDispatch";
import { resetUserWishlist } from "../../../../store/fetures/userSlice";
import type { ProductType } from "../../../../utils/types";

type Props = {
  setCurrentWishlist: Dispatch<SetStateAction<ProductType[]>>;
};

const deleteWishlistMutationFn = async (userId: string) => {
  if (!userId)
    throw new axios.AxiosError("__APP_ERROR__ you need to login first", "403");

  return (await axios.delete(`users/wishlist/${userId}`)).data;
};

const ClearWishlistBtn = ({ setCurrentWishlist }: Props) => {
  const showMsg = useShowMsg();
  const handleError = useHandleErrorMsg();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  const { mutate: deleteWishlist, isPending: deleteWishlistLoading } =
    useMutation({
      mutationFn: () => deleteWishlistMutationFn(user?._id || ""),
      mutationKey: ["deleteWishlist"],
      onSuccess(data) {
        showMsg?.({
          content:
            "message" in data
              ? data.message
              : "your wishlist deleted successfully",
          clr: "green",
        });

        setCurrentWishlist((prev) => prev.filter(() => false));
        dispatch(resetUserWishlist());
      },
      onError(error) {
        handleError(error, {
          forAllStates:
            "something went wrong while trying to delete your wishlist",
        });
      },
    });

  return (
    <div className="cart-and-wishlist-down-holder" id="wishlist-btn-holder">
      <button
        title="clear your cart or wishlist"
        className="red-btn"
        onClick={() => {
          if (user) deleteWishlist();
        }}
        disabled={deleteWishlistLoading}
      >
        <IconAndSpinnerSwitcher
          toggleIcon={deleteWishlistLoading}
          icon={<IoMdHeartDislike />}
        />
        Clear Your Wishlist
      </button>
    </div>
  );
};
export default ClearWishlistBtn;
