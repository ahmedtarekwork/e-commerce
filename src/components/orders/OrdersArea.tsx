// components
import OrderCard from "./OrderCard";
import OrderCellWithChangeStatus from "./OrderCellWithChangeStatus";
import DisplayError from "../layout/DisplayError";
import EmptyPage from "../layout/EmptyPage";

// types
import type { OrderType } from "../../utiles/types";

// SVGs
import EmptyOrdersListSvg from "../../../imgs/no-orders.svg";

// layouts
import AnimatedLayout from "../../layouts/AnimatedLayout";
import Spinner from "../spinners/Spinner";

type Props = {
  loading: boolean;
  isError: boolean;
  orders: OrderType[];
  noOrdersMsg: string;
  withId?: boolean;
  withEditStatus?: boolean;
};

const OrdersArea = ({
  loading,
  isError,
  orders,
  noOrdersMsg,
  withId = false,
  withEditStatus = false,
}: Props) => {
  if (loading)
    return (
      <AnimatedLayout
        style={{
          justifyContent: "center",
        }}
      >
        <Spinner
          style={{
            marginInline: "auto",
            marginBlock: 60,
          }}
        >
          Loading Orders...
        </Spinner>
      </AnimatedLayout>
    );

  if (isError) {
    return (
      <DisplayError
        error={null}
        initMsg="Can't get your orders at the moment"
      />
    );
  }

  if (orders.length === 0)
    return (
      <EmptyPage
        content={noOrdersMsg}
        svg={EmptyOrdersListSvg}
        withBtn={{
          type: "GoToHome",
        }}
      />
    );

  return (
    <AnimatedLayout>
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
    </AnimatedLayout>
  );
};
export default OrdersArea;
