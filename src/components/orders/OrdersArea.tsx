// components
import Spinner from "../spinners/Spinner";
import OrderCard from "./OrderCard";
import OrderCellWithChangeStatus from "./OrderCellWithChangeStatus";

// utiles
import axios from "../../utiles/axios";

// types
import { OrderType } from "../../utiles/types";

type Props = {
  loading: boolean;
  isError: boolean;
  error: unknown;
  orders: OrderType[];
  noOrdersMsg: string;
  withId?: boolean;
  withEditStatus?: boolean;
};

const OrdersArea = ({
  loading,
  isError,
  error,
  orders,
  noOrdersMsg,
  withId = false,
  withEditStatus = false,
}: Props) => {
  console.log(orders);

  if (loading)
    return (
      <Spinner
        settings={{
          clr: "var(--main)",
        }}
      >
        <strong
          style={{
            color: "var(--main)",
          }}
        >
          Loading Orders...
        </strong>
      </Spinner>
    );

  if (isError) {
    if (axios.isAxiosError(error))
      return (
        <h1>
          {error.response?.data.msg ||
            error.response?.data ||
            "something went wrong while getting user orders"}
        </h1>
      );
  }

  if (orders.length === 0)
    return (
      <strong
        style={{
          fontSize: 20,
        }}
      >
        {noOrdersMsg}
      </strong>
    );

  return (
    <>
      <ul className="orders-list">
        {orders.map((order) => (
          <li key={order._id} className="orders-page-order-cell">
            {withEditStatus ? (
              <OrderCellWithChangeStatus order={order} withId={withId} /> // render in dashboard for admins only
            ) : (
              <OrderCard order={order} withId={withId} /> // render for each user outside the dashboard
            )}
          </li>
        ))}
      </ul>
    </>
  );
};
export default OrdersArea;
