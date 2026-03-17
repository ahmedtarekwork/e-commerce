// components
import OrderCard from "./OrderCard";
import ChangeOrderStatus from "./ChangeOrderStatus";
import DisplayError from "../layout/DisplayError";
import EmptyPage from "../layout/EmptyPage";
import Spinner from "../spinners/Spinner";

// types
import type { OrderType } from "../../utils/types";

// SVGs
import EmptyOrdersListSvg from "../../../imgs/no-orders.svg";

// layouts
import AnimatedLayout from "../../layouts/AnimatedLayout";

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
  if (loading) {
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
  }

  if (isError) {
    return (
      <DisplayError
        error={null}
        initMsg="Can't get your orders at the moment"
      />
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyPage
        content={noOrdersMsg}
        svg={EmptyOrdersListSvg}
        withBtn={{
          type: "GoToHome",
        }}
      />
    );
  }

  return (
    <AnimatedLayout>
      <ul className="orders-list" data-testid="orders-list">
        {orders.map((order) => (
          <li key={order._id} className="orders-page-order-cell">
            <OrderCard order={order} withId={withId} />

            {withEditStatus && <ChangeOrderStatus order={order} />}
          </li>
        ))}
      </ul>
    </AnimatedLayout>
  );
};
export default OrdersArea;
