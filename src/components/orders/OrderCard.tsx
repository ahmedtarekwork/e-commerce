import { Link, useLocation } from "react-router-dom";
import PropCell from "../PropCell";
import { OrderType } from "../../utiles/types";

type Props = {
  order: OrderType;
  withId?: boolean;
  loading?: boolean;
};

const OrderCard = ({
  order: {
    _id,
    orderStatus,
    products,
    paymentIntent: { amount },
  },
  withId = false,
  loading = false,
}: Props) => {
  const { pathname } = useLocation();

  return (
    <Link
      to={`${pathname.includes("dashboard") ? "/dashboard" : ""}/orders/${_id}`}
      relative="path"
      className={`order-card${loading ? " loading" : ""}`}
    >
      {withId && <PropCell name="ID" val={_id} />}

      <PropCell name="order status" val={orderStatus} />

      <PropCell
        name="items count"
        val={products
          .map((p) => p.count)
          .reduce((a, b) => a + b)
          .toString()}
      />

      <PropCell name="total price" val={amount + "$"} />
    </Link>
  );
};
export default OrderCard;
