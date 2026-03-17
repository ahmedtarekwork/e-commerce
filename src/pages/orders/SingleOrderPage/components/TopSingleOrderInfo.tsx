// components
import PropCell from "../../../../components/PropCell";

// redux
import useSelector from "../../../../hooks/redux/useSelector";

// types
import type { OrderType } from "../../../../utils/types";

type Props = {
  order: OrderType;
};

const TopSingleOrderInfo = ({ order }: Props) => {
  const { user } = useSelector((state) => state.user);

  const {
    _id,
    orderStatus,
    totalPrice,
    currency,
    method,
    products,
    orderby,
    createdAt,
    removedProductsCount,
  } = order;

  return (
    <ul
      className="single-order-info"
      style={{
        marginBottom: 15,
      }}
    >
      <li>
        <PropCell name="order id" val={_id} />
      </li>
      <li>
        <PropCell name="order status" val={orderStatus} />
      </li>
      <li>
        <PropCell name="total price" val={totalPrice + "$"} />
      </li>
      <li>
        <PropCell name="currency" val={currency} />
      </li>
      <li>
        <PropCell name="payment method" val={method} />
      </li>
      <li>
        <PropCell name="orderd at" val={new Date(createdAt).toDateString()} />
      </li>
      <li>
        <PropCell
          name="items count"
          val={
            removedProductsCount +
            products
              .map(({ wantedQty }) => wantedQty)
              .reduce((a, b) => a + b, 0)
          }
        />
      </li>

      <li>
        {orderby ? (
          <PropCell
            name="ordered by"
            val={orderby.username === user?.username ? "You" : orderby.username}
            valueAsLink={{
              path:
                orderby.username === user?.username
                  ? "/profile"
                  : "/dashboard/singleUser/" + orderby._id,
            }}
          />
        ) : (
          <PropCell name="ordered by" val="_DELETED_USER_" />
        )}
      </li>
    </ul>
  );
};
export default TopSingleOrderInfo;
