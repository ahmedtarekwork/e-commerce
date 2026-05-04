// icons
import { FaHeart, FaRegHeart } from "react-icons/fa";

// components
import FillIcon from "../../../../components/FillIcon";
import IconAndSpinnerSwitcher from "../../../../components/animatedBtns/IconAndSpinnerSwitcher";

// utils
import activeFillIcon from "../../../../utils/activeFillIcon";

// types
import type { ProductType } from "../../../../utils/types";

// hooks
import useToggleFromWishlist from "../../../../hooks/ReactQuery/useToggleFromWishlist";
import useHandleErrorMsg from "../../../../hooks/useHandleErrorMsg";

// redux
import useSelector from "../../../../hooks/redux/useSelector";
import useDispatch from "../../../../hooks/redux/useDispatch";
// redux actions
import { setUserWishlist } from "../../../../store/fetures/userSlice";

type Props = Pick<ProductType, "_id">;
const SingleProductPageWishlistBtn = ({ _id }: Props) => {
  const handleError = useHandleErrorMsg();
  const dispatch = useDispatch();

  const isInWishlist = useSelector((state) =>
    state.user.user?.wishlist?.some((prdId: string) => prdId === _id),
  );

  // toggle from wishlist
  const { toggleFromWishlist, isPending: wishlistLoading } =
    useToggleFromWishlist(
      _id || "",

      (data: string[]) => {
        dispatch(setUserWishlist(data));
      },

      (error: unknown) => {
        handleError(error, {
          forAllStates: "something went wrong while update your wishlist",
        });
      },
    );

  return (
    <button
      title="toggle product from wishlist"
      className="btn"
      onClick={toggleFromWishlist}
      disabled={wishlistLoading}
      {...activeFillIcon}
    >
      <IconAndSpinnerSwitcher
        toggleIcon={wishlistLoading}
        icon={
          isInWishlist ? (
            <FaHeart />
          ) : (
            <FillIcon
              diminsions={21}
              stroke={<FaRegHeart />}
              fill={<FaHeart />}
            />
          )
        }
      />

      {isInWishlist ? "Remove from wishlist" : "add to wishlist"}
    </button>
  );
};
export default SingleProductPageWishlistBtn;
