import PropCell from "../../../../components/PropCell";
import useSelector from "../../../../hooks/redux/useSelector";

import type { CartType } from "../../../../utils/types";

type Props = {
  userCart: CartType | undefined;
};

const CartAreaDownInfo = ({ userCart }: Props) => {
  const { totalItemsLength } = useSelector((state) => state.user.userCart);

  const totalPrice = userCart?.products
    .map((prd) => prd.price * prd.wantedQty)
    .reduce((a, b) => a + b, 0);

  return (
    <>
      <PropCell
        style={{
          marginTop: 15,
        }}
        name="Total Products"
        val={
          <>
            <strong
              style={{
                color: "var(--dark)",
              }}
              data-testid="cart-products-count"
            >
              {totalItemsLength || 0}{" "}
            </strong>
            items
          </>
        }
      />
      <PropCell
        style={{
          marginTop: 15,
        }}
        name="Total Price"
        val={`${totalPrice || 0}$`}
      />
    </>
  );
};
export default CartAreaDownInfo;
