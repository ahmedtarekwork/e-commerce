// react
import { useEffect } from "react";

// react query
import { useQuery } from "@tanstack/react-query";

// react router
import { Link, useLocation } from "react-router-dom";

// components
import EmptySpinner from "../../../../spinners/EmptySpinner";

// icons
import { FaShoppingCart } from "react-icons/fa";

// redux
import useSelector from "../../../../../hooks/redux/useSelector";
import useDispatch from "../../../../../hooks/redux/useDispatch";
// redux actions
import { setCartLength } from "../../../../../store/fetures/userSlice";

// types
import type { CartType } from "../../../../../utils/types";

// framer motion
import { AnimatePresence, motion } from "framer-motion";
// variants
import { scaleUpDownVariant } from "../../../../../utils/variants";

// utils
import axios from "../../../../../utils/axios";

// fetchers
const getCartItemsLengthQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, userId],
}: {
  queryKey: string[];
}): Promise<CartType> => {
  if (!userId)
    throw new axios.AxiosError("__APP_ERROR__ user id is required", "400");

  return (await axios(`carts/currentUserCartItemsCount`)).data;
};

const CartBtn = () => {
  const dispatch = useDispatch();
  const {
    user,
    cartLoading,
    userCart: { totalItemsLength },
  } = useSelector((state) => state.user);

  const isCartPage = useLocation().pathname === "/cart";

  const { data: cartLength, isPending: CartLengthLoading } = useQuery({
    queryKey: ["getCurrentUserCartLength", user?._id || ""],
    queryFn: getCartItemsLengthQueryFn,
    enabled: !!user && !isCartPage,
  });

  useEffect(() => {
    if (cartLength) {
      dispatch(setCartLength(cartLength.totalItemsLength));
    }
  }, [cartLength, dispatch]);

  return (
    <li>
      <Link
        title="go to your cart btn"
        to="/cart"
        relative="path"
        id="header-cart-icon"
      >
        <span id="cart-products-length">
          <AnimatePresence mode="popLayout">
            {(CartLengthLoading && !isCartPage) || cartLoading ? (
              <EmptySpinner
                settings={{
                  clr: "white",
                  diminsions: "10px",
                }}
              />
            ) : (
              <motion.span
                variants={scaleUpDownVariant}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {totalItemsLength > 9 ? "9+" : totalItemsLength}
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        <FaShoppingCart />
        your cart
      </Link>
    </li>
  );
};
export default CartBtn;
