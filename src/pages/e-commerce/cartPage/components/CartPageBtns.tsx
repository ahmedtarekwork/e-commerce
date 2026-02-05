// react
import { useRef, useState } from "react";

// redux
import useSelector from "../../../../hooks/redux/useSelector";

// components
import CartAreaDownInfo from "../../../../components/cartArea/CartAreaDownInfo";
import CartCheckoutMethod from "./CartCheckoutMethod";
import ClearCartBtn from "./ClearCartBtn";
import SubmitOrderBtn from "./SubmitOrderBtn";

// types
import type { OrderType } from "../../../../utils/types";

const CartPageBtns = () => {
  // states
  const { user, userCart } = useSelector((state) => state.user);

  const [payMethod, setPayMethod] = useState<OrderType["method"]>("Card");
  const [clearCartLoading, setClearCartLoading] = useState(false);
  const [submitOrderLoading, setSubmitOrderLoading] = useState(false);

  const isCartItems = !!userCart?.products?.length;

  // refs
  const makeOrderBtnRef = useRef<HTMLButtonElement>(null);

  if (!isCartItems) return;

  return (
    <div className="cart-and-wishlist-down-holder">
      <CartCheckoutMethod
        payMethod={payMethod}
        setPayMethod={setPayMethod}
        cartBtnRef={makeOrderBtnRef}
      />
      <CartAreaDownInfo userCart={userCart} />

      <div
        className="cart-btns"
        style={{
          marginTop: 15,
        }}
      >
        <SubmitOrderBtn
          user={user}
          payMethod={payMethod}
          setSubmitOrderLoading={setSubmitOrderLoading}
          clearCartLoading={clearCartLoading}
        />

        <ClearCartBtn
          user={user}
          setClearCartLoading={setClearCartLoading}
          submitOrderLoading={submitOrderLoading}
        />
      </div>
    </div>
  );
};
export default CartPageBtns;
