import PropCell from "../PropCell";

import type { CartType } from "../../utiles/types";

type Props = {
  userCart: CartType | undefined;
};

const CartAreaDownInfo = ({ userCart }: Props) => {
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
        val={`${userCart?.cartTotal || 0}$`}
      />
    </>
  );
};
export default CartAreaDownInfo;
