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

// utils
import axios from "../../utiles/axios";

// types
import type { OrderType } from "../../utiles/types";

// layouts
import AnimatedLayout from "../../layouts/AnimatedLayout";

// fetchers
const getOrdersQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, pathname],
}: {
  queryKey: string[];
}): Promise<OrderType[]> => {
  const endpoint = `orders${
    pathname.includes("dashboard") ? "" : "/user-orders"
  }`;
  const res = (await axios(endpoint + "?withUser=true")).data;
  const finalRes = (res.orders || res).reverse();

  return finalRes;
};

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isDashboard = pathname.includes("dashboard");

  // get orders
  const {
    data: orders,
    isError,
    isPending: isLoading,
  } = useQuery({
    queryKey: ["getOrders", pathname],
    queryFn: getOrdersQueryFn,
  });

  useEffect(() => {
    if (orders?.length) dispatch(setOrders(orders));
  }, [orders, dispatch]);

  return (
    <AnimatedLayout>
      {!isError && (
        <Heading>{isDashboard ? "Orders Page" : "Your Orders"}</Heading>
      )}

      <OrdersArea
        withEditStatus={isDashboard}
        isError={isError}
        loading={isLoading}
        orders={orders || []}
        withId
        noOrdersMsg={
          pathname.includes("dashboard")
            ? "this user hasn't any orders yet"
            : "you don't have any orders yet"
        }
      />
    </AnimatedLayout>
  );
};
export default OrdersPage;
