// react
import {
  type Dispatch,
  type SetStateAction,
  forwardRef,
  useEffect,
} from "react";

// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// react router dom
import { useNavigate } from "react-router-dom";

// redux
import useDispatch from "../../../../hooks/redux/useDispatch";
// redux actions
import { setCart } from "../../../../store/fetures/userSlice";

// components
import IconAndSpinnerSwitcher from "../../../../components/animatedBtns/IconAndSpinnerSwitcher";

// hooks
import useGetPaymentSessionURL from "../../../../hooks/ReactQuery/useGetPaymentSessionURL";
import useHandleErrorMsg from "../../../../hooks/useHandleErrorMsg";
import useShowMsg from "../../../../hooks/useShowMsg";

// utils
import axios from "../../../../utils/axios";

// icons
import { FaCreditCard } from "react-icons/fa";
import { IoBagCheckOutline } from "react-icons/io5";

// types
import type { OrderType, UserType } from "../../../../utils/types";

type Props = {
  user: UserType | null;
  payMethod: OrderType["method"];
  setSubmitOrderLoading: Dispatch<SetStateAction<boolean>>;
  clearCartLoading: boolean;
};

const makeOrderMutationFn = async () => {
  return (await axios.post("orders", {})).data;
};

const SubmitOrderBtn = forwardRef<HTMLButtonElement, Props>(
  ({ user, payMethod, setSubmitOrderLoading, clearCartLoading }, ref) => {
    const showMsg = useShowMsg();
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleError = useHandleErrorMsg();

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

    useEffect(() => {
      if (sessionUrlLoading || orderLoading) setSubmitOrderLoading(true);

      if (!sessionUrlLoading && !orderLoading) setSubmitOrderLoading(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionUrlLoading, orderLoading]);

    return (
      <button
        title="submit order btn"
        ref={ref}
        className="btn submit-user-order-btn"
        onClick={() => {
          if (payMethod === "Card")
            return handlePayment({ sessionType: "payment" });

          makeOrder();
        }}
        disabled={sessionUrlLoading || orderLoading || clearCartLoading}
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
    );
  }
);
export default SubmitOrderBtn;
