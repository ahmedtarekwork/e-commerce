// react
import { useEffect, useRef } from "react";

// react-router-dom
import { useLocation } from "react-router-dom";

// redux
import useDispatch from "../../hooks/useDispatch";
import { useSelector } from "react-redux";
// redux actions
import { resteCart } from "../../store/fetures/userSlice";

// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// components
import Heading from "../../components/Heading";
import TopMessage, { TopMessageRefType } from "../../components/TopMessage";
import CartArea from "../../components/CartArea";
import WishlistArea from "../../components/WishlistArea";

// utiles
import { axiosWithToken } from "../../utiles/axios";
import handleError from "../../utiles/functions/handleError";

// types
import { RootStateType } from "../../utiles/types";

// fetchers
const makeOrderMutationFn = async () => {
  return (await axiosWithToken.post("/orders")).data;
};

const clearCartMutationFn = async () => {
  return await axiosWithToken.delete("carts/empty-user-cart");
};

const CartOrWishlistPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootStateType) => state.user);
  const queryClient = useQueryClient();

  const { pathname } = useLocation();
  const isCartPage = pathname.includes("cart");

  // refs
  const msgRef = useRef<TopMessageRefType>(null);
  const makeOrderBtnRef = useRef<HTMLButtonElement>(null);
  const clearCartBtnRef = useRef<HTMLButtonElement>(null);

  // clear cart
  const {
    mutate: clearCart,
    error: clearCartErrData,
    isPending: clearCartLoading,
    isSuccess: clearCartSuccess,
  } = useMutation({
    mutationKey: ["clearCart"],
    mutationFn: clearCartMutationFn,
  });

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
    }
  }, [clearCartSuccess, orderSuccess, dispatch]);

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

  // show spinners while loading
  useEffect(() => {
    makeOrderBtnRef.current?.classList.toggle("active", orderLoading);
  }, [orderLoading]);
  useEffect(() => {
    clearCartBtnRef.current?.classList.toggle("active", clearCartLoading);
  }, [clearCartLoading]);

  return (
    <>
      <div className="section">
        <Heading content={isCartPage ? "Your Cart" : "Your Wishlist"} />
      </div>

      {isCartPage ? (
        <CartArea withAddMore withDeleteBtn="cart" />
      ) : (
        <WishlistArea
          withDeleteBtn="wishlist"
          isCurrentUserProfile
          wishlist={user?.wishlist || []}
        />
      )}

      <hr style={{ marginBlock: 15 }} />

      <div className="cart-or-wishlist-down-btns-holder">
        {isCartPage && (
          <button
            ref={makeOrderBtnRef}
            className={`btn ${
              orderLoading ? "center spinner-pseudo-after fade scale" : ""
            }`}
            onClick={() => makeOrder()}
            disabled={orderLoading || clearCartLoading}
          >
            make order
          </button>
        )}

        <button
          className={`red-btn ${
            clearCartLoading ? "center spinner-pseudo-after fade scale" : ""
          }`}
          ref={clearCartBtnRef}
          onClick={() => clearCart()}
          disabled={clearCartLoading || orderLoading}
        >
          Clear Your {isCartPage ? "Cart" : "Wishlist"}
        </button>
      </div>
      <TopMessage ref={msgRef} />
    </>
  );
};
export default CartOrWishlistPage;
