// react
import { useEffect, useRef, useState } from "react";

// react router dom
import { useNavigate } from "react-router-dom";

// redux
import useSelector from "../../../../hooks/redux/useSelector";
import useDispatch from "../../../../hooks/redux/useDispatch";
// redux actions
import { resteCart, setUser } from "../../../../store/fetures/userSlice";

// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// components
import CartCheckoutMethod from "./CartCheckoutMethod";
import CartAreaDownInfo from "../../../../components/cartArea/CartAreaDownInfo";
import IconAndSpinnerSwitcher from "../../../../components/animatedBtns/IconAndSpinnerSwitcher";
import TopMessage, {
  type TopMessageRefType,
} from "../../../../components/TopMessage";

// hooks
import useGetPaymentSessionURL from "../../../../hooks/ReactQuery/useGetPaymentSessionURL";

// types
import type { UserType } from "../../../../utiles/types";

// utils
import axios from "../../../../utiles/axios";
import handleError from "../../../../utiles/functions/handleError";

// icons
import { IoBagCheckOutline } from "react-icons/io5";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import { IoMdHeartDislike } from "react-icons/io";
import { FaCreditCard } from "react-icons/fa";

// framer motion
import { AnimatePresence, motion } from "framer-motion";
// variants
import { slideOutVariant } from "../../../../utiles/variants";

type Props = {
  isCartPage: boolean;
};

// fetchers
const clearCartMutationFn = async () => {
  return await axios.delete("carts/empty-user-cart");
};

const deleteWishlistMutationFn = async (user: UserType) => {
  return (await axios.put("users/" + user._id, user)).data;
};

const makeOrderMutationFn = async () => {
  return (await axios.post("/orders")).data;
};

export type PayMethods = "Cash on Delivery" | "Card";

const CartOrWishlistPageBtns = ({ isCartPage }: Props) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // states
  const { user, userCart, wishlistLoading } = useSelector(
    (state) => state.user
  );
  const [payMethod, setPayMethod] = useState<PayMethods>("Card");

  const isCartItems = !!userCart?.products.length;
  const isWishlistItems = !!user?.wishlist?.length && !wishlistLoading;
  const isShow = isCartPage ? isCartItems : isWishlistItems;

  const showCartComponents = isCartPage && userCart?.products.length;

  // refs
  const msgRef = useRef<TopMessageRefType>(null);
  const makeOrderBtnRef = useRef<HTMLButtonElement>(null);

  // react query
  const {
    mutate: clearCart,
    error: clearCartErrData,
    isPending: clearCartLoading,
    isSuccess: clearCartSuccess,
  } = useMutation({
    mutationKey: ["clearCart"],
    mutationFn: clearCartMutationFn,
  });
  const {
    mutate: deleteWishlist,
    isPending: deleteWishlistLoading,
    data: deleteWishlistData,
    isError: deleteWishlistErr,
    error: deleteWishlistErrData,
  } = useMutation({
    mutationFn: deleteWishlistMutationFn,
    mutationKey: ["deleteWishlist"],
  });

  // get stripe checkout session url
  const {
    data: sessionUrl,
    isPending: sessionUrlLoading,
    isError: sessionUrlErr,
    error: sessionUrlErrData,
    handlePayment,
  } = useGetPaymentSessionURL(msgRef);

  // make order
  const {
    mutate: makeOrder,
    error: orderErrData,
    isPending: orderLoading,
    isSuccess: orderSuccess,
  } = useMutation({
    mutationKey: ["makeOrder"],
    mutationFn: makeOrderMutationFn,
    onSuccess: () => queryClient.prefetchQuery({ queryKey: ["getProducts"] }),
  });

  // useEffects

  // clear cart when create order success or when clear cart success
  useEffect(() => {
    if (orderSuccess || clearCartSuccess) {
      dispatch(resteCart());
    }

    if (orderSuccess) {
      msgRef.current?.setMessageData({
        clr: "green",
        content: "order created successfully",
        show: true,
        time: 3500,
      });

      setTimeout(() => {
        navigate("/", {
          relative: "path",
        });
      }, 3750);
    }
  }, [clearCartSuccess, orderSuccess, dispatch, navigate]);

  // if there is an error while makign order
  useEffect(() => {
    if (orderErrData)
      handleError(
        orderErrData,
        msgRef,
        {
          forAllStates: "something went wrong while making the order for you",
        },
        4000
      );
  }, [orderErrData]);

  // if there is an error while clearing the cart
  useEffect(() => {
    if (clearCartErrData)
      handleError(clearCartErrData, msgRef, {
        forAllStates: "something went wrong while clearing your cart",
      });
  }, [clearCartErrData]);

  // delete wishlist
  useEffect(() => {
    if (deleteWishlistData) dispatch(setUser(deleteWishlistData));

    if (deleteWishlistErr)
      handleError(deleteWishlistErrData, msgRef, {
        forAllStates:
          "something went wrong while trying to delete your wishlist",
      });
  }, [deleteWishlistData, deleteWishlistErr, deleteWishlistErrData, dispatch]);

  // stripe checkout session url
  useEffect(() => {
    if (sessionUrl) window.location.href = sessionUrl.url;

    if (sessionUrlErr) {
      handleError(sessionUrlErrData, msgRef, {
        forAllStates: "something went wrong while trying to handle payment",
      });
    }
  }, [sessionUrlErr, sessionUrlErrData, sessionUrl]);

  return (
    <AnimatePresence initial={false}>
      {isShow && (
        <>
          <motion.div
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            variants={slideOutVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            className="cart-or-wishlist-down-holder"
          >
            {showCartComponents && (
              <>
                <CartCheckoutMethod
                  payMethod={payMethod}
                  setPayMethod={setPayMethod}
                  cartBtnRef={makeOrderBtnRef}
                />
                <CartAreaDownInfo userCart={userCart} />
              </>
            )}

            <div
              className="cart-or-wishlist-btns"
              style={{
                marginTop: 15,
              }}
            >
              {showCartComponents && (
                <button
                  title="submit order btn"
                  ref={makeOrderBtnRef}
                  className="btn submit-user-order-btn"
                  onClick={() => {
                    if (payMethod === "Card")
                      return handlePayment({ sessionType: "payment" });
                    else if (payMethod === "Cash on Delivery") makeOrder();
                  }}
                  disabled={
                    sessionUrlLoading || clearCartLoading || orderLoading
                  }
                >
                  <IconAndSpinnerSwitcher
                    toggleIcon={sessionUrlLoading || orderLoading}
                    icon={
                      payMethod === "Cash on Delivery" ? (
                        <IoBagCheckOutline />
                      ) : (
                        <FaCreditCard />
                      )
                    }
                  />

                  {payMethod === "Cash on Delivery"
                    ? "Submit Order"
                    : "Checkout"}
                </button>
              )}

              <button
                title="clear your cart or wishlist"
                className="red-btn"
                onClick={() => {
                  if (isCartPage) return clearCart();
                  if (user) deleteWishlist({ ...user, wishlist: [] });
                }}
                disabled={clearCartLoading || deleteWishlistLoading}
              >
                <IconAndSpinnerSwitcher
                  toggleIcon={clearCartLoading || deleteWishlistLoading}
                  icon={
                    isCartPage ? (
                      <MdOutlineRemoveShoppingCart />
                    ) : (
                      <IoMdHeartDislike />
                    )
                  }
                />
                Clear Your {isCartPage ? "Cart" : "Wishlist"}
              </button>
            </div>
          </motion.div>

          <TopMessage ref={msgRef} />
        </>
      )}
    </AnimatePresence>
  );
};
export default CartOrWishlistPageBtns;
