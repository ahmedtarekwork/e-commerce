import {
  useEffect,

  // types
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";

// components
import FormList from "../../../../components/appForm/FormList";

// utils
import { nanoid } from "@reduxjs/toolkit";

// types
import type { OrderType } from "../../../../utils/types";

type Props = {
  setPayMethod: Dispatch<SetStateAction<OrderType["method"]>>;
  payMethod: OrderType["method"];
  cartBtnRef: RefObject<HTMLButtonElement>;
};

const CartCheckoutMethod = ({ setPayMethod, payMethod, cartBtnRef }: Props) => {
  const payMethods: OrderType["method"][] = ["Cash on Delivery", "Card"];

  useEffect(() => {
    if (cartBtnRef.current) cartBtnRef.current.disabled = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
