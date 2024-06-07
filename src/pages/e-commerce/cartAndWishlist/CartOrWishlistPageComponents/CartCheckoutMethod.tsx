import { Dispatch, SetStateAction } from "react";
import { type PayMethods } from "./CartOrWishlistPageBtns";

// utils
import { nanoid } from "@reduxjs/toolkit";

type Props = {
  setPayMethod: Dispatch<SetStateAction<PayMethods>>;
  payMethod: PayMethods;
};
const CartCheckoutMethod = ({ setPayMethod, payMethod }: Props) => {
  const payMethods: PayMethods[] = ["Cash on Delivery", "Card"];

  return (
    <div>
      <h3>Checkout Method</h3>

      <form>
        <ul>
          {payMethods.map((method) => {
            const id = nanoid();
            return (
              <li key={id}>
                <input
                  checked={payMethod === method}
                  onChange={() => setPayMethod(method)}
                  type="radio"
                  name="payMethod"
                  id={id}
                />
                <label
                  htmlFor={id}
                  style={{ marginLeft: 10, userSelect: "none" }}
                >
                  {method}
                </label>
              </li>
            );
          })}
        </ul>
      </form>
    </div>
  );
};
export default CartCheckoutMethod;
