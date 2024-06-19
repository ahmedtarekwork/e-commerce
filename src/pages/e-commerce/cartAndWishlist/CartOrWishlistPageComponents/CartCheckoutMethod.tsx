// types
import {
  useEffect,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import { type PayMethods } from "./CartOrWishlistPageBtns";

// components
import FormList from "../../../../components/appForm/FormList";

// utils
import { nanoid } from "@reduxjs/toolkit";

type Props = {
  setPayMethod: Dispatch<SetStateAction<PayMethods>>;
  payMethod: PayMethods;
  cartBtnRef: RefObject<HTMLButtonElement>;
};

const CartCheckoutMethod = ({ setPayMethod, payMethod, cartBtnRef }: Props) => {
  const payMethods: PayMethods[] = ["Cash on Delivery", "Card"];

  useEffect(() => {
    if (cartBtnRef.current) cartBtnRef.current.disabled = false;
  }, [payMethod]);

  return (
    <div>
      <h2>Checkout Method</h2>

      <FormList
        ListType="radio-list"
        inputsList={payMethods.map((method) => ({
          id: nanoid(),
          label: method,
          defaultChecked: payMethod === method,
          onChange: () => {
            if (cartBtnRef.current) cartBtnRef.current.disabled = true;
            setTimeout(() => setPayMethod(method), 100);
          },
          name: "payMethod",
        }))}
      />
    </div>
  );
};
export default CartCheckoutMethod;
