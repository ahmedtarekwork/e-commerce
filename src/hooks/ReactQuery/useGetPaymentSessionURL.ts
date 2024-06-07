// react
import { type RefObject } from "react";

// react query
import { useMutation } from "@tanstack/react-query";

// redux
import useSelector from "../redux/useSelector";

// utils
import { axiosWithToken } from "../../utiles/axios";

// types
import type { LineItemType } from "../../utiles/types";
import { type TopMessageRefType } from "../../components/TopMessage";
import { AxiosInstance } from "axios";

type GetCheckoutSessionUrlFnType = (params: {
  customer_email: string;
  line_items: LineItemType[];
  sessionType: "payment" | "donation" | "changeDonatePlan";
}) => Promise<{ url: string }>;

const getCheckoutSessionUrlMutationFn: GetCheckoutSessionUrlFnType = async ({
  customer_email,
  line_items,
  sessionType,
}) => {
  const method: keyof Pick<AxiosInstance, "post" | "patch"> =
    sessionType === "changeDonatePlan" ? "patch" : "post";

  return (
    await axiosWithToken[method](
      `payment${sessionType !== "payment" ? "/donate" : ""}`,
      {
        customer_email,
        line_items,
      }
    )
  ).data;
};

const useGetPaymentSessionURL = (msgRef: RefObject<TopMessageRefType>) => {
  const mutation = useMutation({
    mutationKey: ["goToCheckout"],
    mutationFn: getCheckoutSessionUrlMutationFn,
  });

  const { user, userCart } = useSelector((state) => state.user);

  type HandlePaymentParams =
    | {
        sessionType: "payment";
        donationPlan?: never;
        recurring?: never;
      }
    | {
        sessionType: "donation" | "changeDonatePlan";
        donationPlan: {
          name: "pro" | "premium pro" | "standard";
          price: number | "Free";
          description: string;
        };
        recurring: LineItemType["price_data"]["recurring"];
      };

  const handlePayment = ({
    sessionType,
    donationPlan,
    recurring,
  }: HandlePaymentParams) => {
    if (!user)
      return msgRef.current?.setMessageData({
        clr: "red",
        content: "you need to login first",
        show: true,
        time: 6000,
      });

    let line_items: LineItemType[] = [];

    if (sessionType === "payment") {
      if (!userCart?.products?.length)
        return msgRef.current?.setMessageData({
          clr: "red",
          content: "you cart is empty",
          show: true,
          time: 6000,
        });

      line_items = userCart.products.map(
        ({ count, price, title, description }): LineItemType => ({
          quantity: count,
          price_data: {
            currency: "usd",
            unit_amount: price * 100,
            product_data: {
              name: title,
              description,
            },
          },
        })
      );

      mutation.mutate({
        customer_email: user.email,
        line_items,
        sessionType,
      });
    } else {
      const { name, price, description } = donationPlan;
      const finalName = name
        .split(" ")
        .map((n) => `${n[0].toUpperCase()}${n.slice(1)}`)
        .join(" ");

      line_items = [
        {
          quantity: 1,
          price_data: {
            recurring,
            currency: "usd",
            unit_amount: price === "Free" ? 0 : price * 100,
            product_data: {
              name: `${finalName} Plan`,
              description,
            },
          },
        },
      ];

      mutation.mutate({
        customer_email: user.email,
        line_items,
        sessionType,
      });
    }
  };

  return { ...mutation, handlePayment };
};

export default useGetPaymentSessionURL;
