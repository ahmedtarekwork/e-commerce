import PropCell from "../PropCell";

import type { CartType } from "../../utils/types";

type Props = {
  userCart: CartType | undefined;
};

const CartAreaDownInfo = ({ userCart }: Props) => {
  const total = userCart?.products
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
            >
              {userCart?.products?.length || 0}{" "}
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
        val={`${total || 0}$`}
      />
    </>
  );
};
export default CartAreaDownInfo;
