// react
import { useEffect, useRef } from "react";

// react-router-dom
import { useLocation } from "react-router-dom";

// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// components
import SelectList, { selectListOptionType } from "../selectList/SelectList";
import TopMessage, { TopMessageRefType } from "../TopMessage";
import OrderCard from "./OrderCard";

// types
import { OrderType } from "../../utiles/types";

// utiles
import { nanoid } from "@reduxjs/toolkit";
import { axiosWithToken } from "../../utiles/axios";
import handleError from "../../utiles/functions/handleError";

type Props = {
  order: OrderType;
  withId?: boolean;
};

const changeOrderStatusMutationFn = async ({
  orderId,
  newStatus,
}: {
  orderId: string;
  newStatus: OrderType["orderStatus"];
}) => {
  return (
    await axiosWithToken.patch("orders/" + orderId, {
      status: newStatus,
    })
  ).data;
};

const statusList: selectListOptionType<OrderType["orderStatus"]>[] = [
  {
    selected: false,
    text: "Not Processed",
  },
  {
    selected: false,
    text: "Cash on Delivery",
  },
  {
    selected: false,
    text: "Processing",
  },
  {
    selected: false,
    text: "Dispatched",
  },
  {
    selected: false,
    text: "Cancelled",
  },
  {
    selected: false,
    text: "Delivered",
  },
];

const OrderCellWithChangeStatus = ({ order, withId = false }: Props) => {
  const { pathname } = useLocation();

  const msgRef = useRef<TopMessageRefType>(null);
  const queryClient = useQueryClient();

  const {
    mutate: changeOrderStatus,
    isError: newOrderErr,
    error: newOrderErrData,
    isPending: newOrderLoading,
  } = useMutation({
    mutationKey: ["changeStatus", order._id],
    mutationFn: changeOrderStatusMutationFn,
    onSuccess: () =>
      queryClient.prefetchQuery({ queryKey: ["getOrders", pathname] }),
  });

  useEffect(() => {
    if (newOrderErr) {
      handleError(
        newOrderErrData,
        msgRef,
        {
          forAllStates: "something went wrong while change order status",
        },
        5000
      );
    }
  }, [newOrderErr, newOrderErrData]);

  return (
    <>
      <OrderCard order={order} withId={withId} loading={newOrderLoading} />

      <SelectList
        disabled={{
          value: newOrderLoading,
          text: "loading...",
        }}
        id={nanoid()}
        label="change status"
        listOptsArr={statusList.map((o) =>
          o.text === order.orderStatus ? { ...o, selected: true } : o
        )}
        optClickFunc={(e) => {
          changeOrderStatus({
            orderId: order._id,
            newStatus: e.currentTarget.dataset.opt as OrderType["orderStatus"],
          });
        }}
      />

      <TopMessage ref={msgRef} />
    </>
  );
};
export default OrderCellWithChangeStatus;
