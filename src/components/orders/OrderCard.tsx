// react router dom
import { Link, useLocation } from "react-router-dom";
// components
import PropCell from "../PropCell";

// redux
import useSelector from "../../hooks/redux/useSelector";

// types
import type { OrderType } from "../../utils/types";

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
    totalPrice,
    method,
    createdAt,
    orderby,
    removedProductsCount,
  },
  withId = false,
  loading = false,
}: Props) => {
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.user);

  return (
    <Link
      title="go to single order page btn"
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
            val={
              products.map((p) => p.wantedQty).reduce((a, b) => a + b, 0) +
              removedProductsCount
            }
          />
        </li>
        <li>
          <PropCell name="Total Price" val={totalPrice + "$"} />
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
