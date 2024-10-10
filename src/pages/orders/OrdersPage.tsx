// react
import { useEffect } from "react";

// react-router-dom
import { useLocation } from "react-router-dom";

// react query
import { useQuery } from "@tanstack/react-query";

// redux
import useDispatch from "../../hooks/redux/useDispatch";
// redux actions
import { setOrders } from "../../store/fetures/ordersSlice";

// components
import Heading from "../../components/Heading";
import OrdersArea from "../../components/orders/OrdersArea";
import DisplayError from "../../components/layout/DisplayError";

// utils
import axios from "../../utils/axios";

// types
import type { OrderType } from "../../utils/types";

// layouts
import AnimatedLayout from "../../layouts/AnimatedLayout";

// fetchers
const getOrdersQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, allOrders],
}: {
  queryKey: [string, boolean];
}): Promise<OrderType[]> => {
  return (await axios(`orders${allOrders ? `?allOrders=${allOrders}` : ""}`))
    .data;
};

const OrdersPage = () => {
  // react router
  const { pathname } = useLocation();
  const isDashboard = pathname.includes("dashboard");

  // redux
  const dispatch = useDispatch();

  // get orders
  const {
    data: orders,
    error,
    isError,
    isPending: isLoading,
  } = useQuery({
    queryKey: ["getOrders", isDashboard],
    queryFn: getOrdersQueryFn,
  });

  useEffect(() => {
    if (orders?.length) dispatch(setOrders(orders));
  }, [orders, dispatch]);

  if (error) {
    return (
      <DisplayError
        error={error}
        initMsg={"can't get the orders at the momment"}
      />
    );
  }

  return (
    <AnimatedLayout>
      {!!(!isError && orders?.length) && (
        <Heading>{isDashboard ? "Orders Page" : "Your Orders"}</Heading>
      )}

      <OrdersArea
        withEditStatus={isDashboard}
        isError={isError}
        loading={isLoading}
        orders={orders || []}
        withId
        noOrdersMsg={
          isDashboard
            ? "there aren't any orders yet"
            : "you don't have any orders yet"
        }
      />
    </AnimatedLayout>
  );
};
export default OrdersPage;
