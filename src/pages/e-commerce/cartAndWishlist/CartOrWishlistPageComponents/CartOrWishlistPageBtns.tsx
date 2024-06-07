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
import TopMessage, {
  type TopMessageRefType,
} from "../../../../components/TopMessage";

// hooks
import useGetPaymentSessionURL from "../../../../hooks/ReactQuery/useGetPaymentSessionURL";

// types
import type { UserType } from "../../../../utiles/types";

// utils
import { axiosWithToken } from "../../../../utiles/axios";
import handleError from "../../../../utiles/functions/handleError";

type Props = {
  isCartPage: boolean;
};

// fetchers
const clearCartMutationFn = async () => {
  return await axiosWithToken.delete("carts/empty-user-cart");
};

const deleteWishlistMutationFn = async (user: UserType) => {
  return (await axiosWithToken.put("users/" + user._id, user)).data;
};

const makeOrderMutationFn = async () => {
  return (await axiosWithToken.post("/orders")).data;
};

export type PayMethods = "Cash on Delivery" | "Card";

const CartOrWishlistPageBtns = ({ isCartPage }: Props) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // states
  const { user, userCart } = useSelector((state) => state.user);
  const [payMethod, setPayMethod] = useState<PayMethods>("Card");

  const showDeleteBtn = isCartPage
    ? !!userCart?.products.length
    : !!user?.wishlist.length;

  const showCartComponents = isCartPage && userCart?.products.length;

  // refs
  const msgRef = useRef<TopMessageRefType>(null);
  const makeOrderBtnRef = useRef<HTMLButtonElement>(null);
  const clearCartBtnRef = useRef<HTMLButtonElement>(null);

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

  // show spinners while loading
  useEffect(() => {
    makeOrderBtnRef.current?.classList.toggle(
      "active",
      sessionUrlLoading || orderLoading
    );
  }, [sessionUrlLoading, orderLoading]);
  useEffect(() => {
    setTimeout(() => {
      clearCartBtnRef.current?.classList.toggle(
        "active",
        clearCartLoading || deleteWishlistLoading
      );
    });
  }, [clearCartLoading, deleteWishlistLoading]);

  return (
    <>
      <div className="cart-or-wishlist-down-holder">
        {showCartComponents && (
          <CartCheckoutMethod
            payMethod={payMethod}
            setPayMethod={setPayMethod}
          />
        )}

        <div
          className="cart-or-wishlist-btns"
          style={{
            marginTop: 15,
          }}
        >
          {showCartComponents && (
            <button
              ref={makeOrderBtnRef}
              className={`btn ${
                sessionUrlLoading || orderLoading
                  ? "center spinner-pseudo-after fade scale"
                  : ""
              }`}
              onClick={() => {
                if (payMethod === "Card")
                  return handlePayment({ sessionType: "payment" });
                else if (payMethod === "Cash on Delivery") makeOrder();
              }}
              disabled={sessionUrlLoading || clearCartLoading || orderLoading}
            >
              {payMethod === "Cash on Delivery" ? "Submit Order" : "Checkout"}
            </button>
          )}

          {showDeleteBtn && (
            <button
              className={`red-btn ${
                clearCartLoading || deleteWishlistLoading
                  ? "center spinner-pseudo-after fade scale"
                  : ""
              }`}
              ref={clearCartBtnRef}
              onClick={() => {
                if (isCartPage) return clearCart();
                if (user) deleteWishlist({ ...user, wishlist: [] });
              }}
              disabled={clearCartLoading || deleteWishlistLoading}
              // || orderLoading
            >
              Clear Your {isCartPage ? "Cart" : "Wishlist"}
            </button>
          )}
        </div>
      </div>

      <TopMessage ref={msgRef} />
    </>
  );
};
export default CartOrWishlistPageBtns;
