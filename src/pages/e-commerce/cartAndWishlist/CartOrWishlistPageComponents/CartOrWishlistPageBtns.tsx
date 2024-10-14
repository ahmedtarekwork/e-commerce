// react
import { useRef, useState } from "react";

// react router dom
import { useNavigate } from "react-router-dom";

// redux
import useSelector from "../../../../hooks/redux/useSelector";
import useDispatch from "../../../../hooks/redux/useDispatch";
// redux actions
import {
  resetUserWishlist,
  setCart,
} from "../../../../store/fetures/userSlice";

// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// components
import CartCheckoutMethod from "./CartCheckoutMethod";
import CartAreaDownInfo from "../../../../components/cartArea/CartAreaDownInfo";
import IconAndSpinnerSwitcher from "../../../../components/animatedBtns/IconAndSpinnerSwitcher";

// hooks
import useGetPaymentSessionURL from "../../../../hooks/ReactQuery/useGetPaymentSessionURL";
import useHandleErrorMsg from "../../../../hooks/useHandleErrorMsg";
import useShowMsg from "../../../../hooks/useShowMsg";

// types
import type { OrderType } from "../../../../utils/types";

// utils
import axios from "../../../../utils/axios";

// icons
import { IoBagCheckOutline } from "react-icons/io5";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import { IoMdHeartDislike } from "react-icons/io";
import { FaCreditCard } from "react-icons/fa";

// framer motion
import { AnimatePresence, motion } from "framer-motion";
// variants
import { slideOutVariant } from "../../../../utils/variants";

type Props = {
  isCartPage: boolean;
};

// fetchers
const clearCartMutationFn = async (userId: string) => {
  if (!userId)
    throw new axios.AxiosError(
      "__APP_ERROR__ you need to login before modify your cart",
      "403"
    );

  return (await axios.delete(`carts/${userId}/resetCart`)).data;
};

const deleteWishlistMutationFn = async (userId: string) => {
  if (!userId)
    throw new axios.AxiosError(
      "__APP_ERROR__ you need to login before modify your wishlist",
      "403"
    );

  return (await axios.delete(`users/wishlist/${userId}`)).data;
};

const makeOrderMutationFn = async () => {
  return (await axios.post("orders", {})).data;
};

const CartOrWishlistPageBtns = ({ isCartPage }: Props) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const handleError = useHandleErrorMsg();

  // states
  const showMsg = useShowMsg();
  const { user, userCart, wishlistLoading } = useSelector(
    (state) => state.user
  );
  const [payMethod, setPayMethod] = useState<OrderType["method"]>("Card");

  const isCartItems = !!userCart?.products?.length;
  const isWishlistItems = !!user?.wishlist?.length && !wishlistLoading;
  const isShow = isCartPage ? isCartItems : isWishlistItems;

  const showCartComponents = isCartPage && userCart?.products?.length;

  // refs
  const makeOrderBtnRef = useRef<HTMLButtonElement>(null);

  // react query
  const { mutate: clearCart, isPending: clearCartLoading } = useMutation({
    mutationKey: ["clearCart"],
    mutationFn: () => clearCartMutationFn(user?._id || ""),

    onSuccess: (data) => {
      showMsg?.({
        content:
          "message" in data
            ? (data.message as string)
            : "your cart reseted successfully",
        clr: "green",
      });

      if (user) dispatch(setCart({ orderdby: user?._id, products: [] }));
    },

    onError(error) {
      handleError(error, {
        forAllStates: "something went wrong while clearing your cart",
      });
    },
  });

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

        dispatch(resetUserWishlist());
      },
      onError(error) {
        handleError(error, {
          forAllStates:
            "something went wrong while trying to delete your wishlist",
        });
      },
    });

  // get stripe checkout session url
  const { isPending: sessionUrlLoading, handlePayment } =
    useGetPaymentSessionURL(
      (data) => (window.location.href = data.url),
      (error) => {
        handleError(error, {
          forAllStates: "something went wrong while trying to handle payment",
        });
      }
    );

  // make order
  const { mutate: makeOrder, isPending: orderLoading } = useMutation({
    mutationKey: ["makeOrder"],
    mutationFn: makeOrderMutationFn,
    onSuccess: () => {
      queryClient.prefetchQuery({ queryKey: ["getProducts"] });
      if (user) dispatch(setCart({ orderdby: user?._id, products: [] }));

      showMsg?.({
        clr: "green",
        content: "order created successfully",
      });

      setTimeout(() => {
        navigate("/", {
          relative: "path",
        });
      }, 3600);
    },
    onError(error) {
      handleError(
        error,
        {
          forAllStates: "something went wrong while making the order for you",
        },
        4000
      );
    },
  });

  return (
    <AnimatePresence initial={false}>
      {isShow && (
        <motion.div
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

                  makeOrder();
                }}
                disabled={sessionUrlLoading || clearCartLoading || orderLoading}
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

                {payMethod === "Cash on Delivery" ? "Submit Order" : "Checkout"}
              </button>
            )}

            <button
              title="clear your cart or wishlist"
              className="red-btn"
              onClick={() => {
                if (isCartPage) return clearCart();
                if (user) deleteWishlist();
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
      )}
    </AnimatePresence>
  );
};
export default CartOrWishlistPageBtns;
