// react-router-dom
import { useLocation } from "react-router-dom";

// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// hooks
import useHandleErrorMsg from "../../hooks/useHandleErrorMsg";

// components
import SelectList, {
  type selectListOptionType,
} from "../selectList/SelectList";
import OrderCard from "./OrderCard";

// types
import type { OrderType } from "../../utils/types";

// utils
import axios from "../../utils/axios";

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
  return (await axios.patch("orders/" + orderId, { newStatus })).data;
};

const statusList: selectListOptionType<OrderType["orderStatus"]>[] = [
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
  const handleError = useHandleErrorMsg();

  const { pathname } = useLocation();

  const queryClient = useQueryClient();

  const { mutate: changeOrderStatus, isPending: newOrderLoading } = useMutation(
    {
      mutationKey: ["changeStatus", order._id],
      mutationFn: changeOrderStatusMutationFn,
      onSuccess: () => {
        queryClient.prefetchQuery({
          queryKey: ["getOrders", pathname.includes("dashboard")],
        });
      },
      onError(error) {
        handleError(
          error,
          {
            forAllStates: "something went wrong while change order status",
          },
          5000
        );
      },
    }
  );

  return (
    <>
      <OrderCard order={order} withId={withId} loading={newOrderLoading} />

      <SelectList
        disabled={{
          value: newOrderLoading,
          text: "loading...",
        }}
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
    </>
  );
};
export default OrderCellWithChangeStatus;
