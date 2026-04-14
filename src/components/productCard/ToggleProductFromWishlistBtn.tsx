// components
import FillIcon from "../FillIcon";
import IconAndSpinnerSwitcher from "../animatedBtns/IconAndSpinnerSwitcher";

// react router dom
import { Link } from "react-router-dom";

// redux
import useDispatch from "../../hooks/redux/useDispatch";
// redux actions
import { setUserWishlist } from "../../store/fetures/userSlice";

// hooks
import useToggleFromWishlist from "../../hooks/ReactQuery/useToggleFromWishlist";
import useHandleErrorMsg from "../../hooks/useHandleErrorMsg";

// icons
import { FaHeart, FaRegHeart } from "react-icons/fa";

// types
import type { ProductType, UserType } from "../../utils/types";

type Props = {
  isDashboard: boolean;
  user: UserType | null;
  productId: ProductType["_id"];
  dispatch: ReturnType<typeof useDispatch>;
  handleError: ReturnType<typeof useHandleErrorMsg>;
};

const ToggleProductFromWishlistBtn = ({
  isDashboard,
  user,
  productId,
  dispatch,
  handleError,
}: Props) => {
  const { toggleFromWishlist, isPending: wishlistLoading } =
    useToggleFromWishlist(
      productId,
      (data: string[]) => {
        dispatch(setUserWishlist(data));
      },
      (error: unknown) => {
        handleError(
          error,
          {
            forAllStates:
              "something went wrong while adding the product to wishlist",
          },
          4000,
        );
      },
    );

  if (isDashboard) return null;

  if (!user) {
    return (
      <Link
        title="add product to wishlist btn"
        className="add-to-wishlist"
        to="/login"
        relative="path"
      >
        <FillIcon fill={<FaHeart />} stroke={<FaRegHeart />} />
      </Link>
    );
  }

  return (
    <button
      title="add to wishlist btn"
      disabled={wishlistLoading}
      className="add-to-wishlist"
      onClick={toggleFromWishlist}
    >
      <IconAndSpinnerSwitcher
        toggleIcon={wishlistLoading}
        icon={
          <FillIcon
            className={
              user?.wishlist?.some((prdId) => prdId === productId)
                ? " active"
                : ""
            }
            fill={<FaHeart />}
            stroke={<FaRegHeart />}
          />
        }
      />
    </button>
  );
};
export default ToggleProductFromWishlistBtn;
