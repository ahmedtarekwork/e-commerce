// react router dom
import { Link, useLocation } from "react-router-dom";
// components
import PropCell from "../PropCell";

// redux
import useSelector from "../../hooks/redux/useSelector";

// types
import type { OrderType } from "../../utiles/types";

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
    paymentIntent: { amount, method },
    createdAt,
    orderby,
  },
  withId = false,
  loading = false,
}: Props) => {
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.user);

  return (
    <Link
      to={`${pathname.includes("dashboard") ? "/dashboard" : ""}/orders/${_id}`}
      relative="path"
      className={`order-card${loading ? " loading" : ""}`}
    >
      <ul>
        {withId && (
          <li>
            <PropCell name="ID" val={_id} />
          </li>
        )}
        <li>
          <PropCell name="Order Status" val={orderStatus} />
        </li>
        <li>
          <PropCell
            name="Items Count"
            val={products
              .map((p) => p.count)
              .reduce((a, b) => a + b)
              .toString()}
          />
        </li>
        <li>
          <PropCell name="Total Price" val={amount + "$"} />
        </li>
        <li>
          <PropCell name="payment method" val={method} />
        </li>
        <li>
          <PropCell name="Orderd At" val={new Date(createdAt).toDateString()} />
        </li>
        <li>
          <PropCell
            name="Orderd By"
            val={
              user?.username === orderby?.username ? "You" : orderby?.username
            }
          />
        </li>
      </ul>
    </Link>
  );
};
export default OrderCard;
