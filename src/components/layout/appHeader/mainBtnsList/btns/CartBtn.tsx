// react
import { useEffect } from "react";

// react router
import { Link } from "react-router-dom";

// components
import EmptySpinner from "../../../../spinners/EmptySpinner";

// icons
import { FaShoppingCart } from "react-icons/fa";

// redux
import useSelector from "../../../../../hooks/redux/useSelector";
import useDispatch from "../../../../../hooks/redux/useDispatch";
// redux actions
import { setCart } from "../../../../../store/fetures/userSlice";

// hooks
import useGetUserCart from "../../../../../hooks/ReactQuery/CartRequest/useGetUserCart";

// types
import type { OrderProductType } from "../../../../../utils/types";

// framer motion
import { AnimatePresence, motion } from "framer-motion";
// variants
import { scaleUpDownVariant } from "../../../../../utils/variants";

const CartBtn = () => {
  const dispatch = useDispatch();
  const { user, userCart, cartLoading } = useSelector((state) => state.user);

  const {
    refetch: getCart,
    data: cart,
    isPending: initCartLoading,
  } = useGetUserCart(user?._id || "");

  const userCartCount = userCart?.products?.map(
    (prd: OrderProductType) => prd.wantedQty
  );

  let productsLength = 0;

  if (userCartCount?.length)
    productsLength = userCartCount.reduce((a: number, b: number) => a + b);

  useEffect(() => {
    if (user) getCart();
  }, [user]);

  useEffect(() => {
    if (cart) dispatch(setCart(cart));
  }, [cart, dispatch]);

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
            {initCartLoading || cartLoading ? (
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
                {productsLength > 9 ? "9+" : productsLength}
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
