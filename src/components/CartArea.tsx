// react
import { CSSProperties, useEffect } from "react";

// redux
import useDispatch from "../hooks/useDispatch";
import { useSelector } from "react-redux";
import { resteCart, setCart } from "../store/fetures/userSlice";

// hooks
import useGetUserCart from "../hooks/CartRequest/useGetUserCart";
import useInitProductsCells from "../hooks/useInitProductsCells";

// components
import Spinner from "./spinners/Spinner";
import ProductCard, { ProductCardDeleteBtn } from "./ProductCard";
import GridList from "./gridList/GridList";

// utiles
import axios from "../utiles/axios";

// types
import { RootStateType } from "../utiles/types";

type Props = ProductCardDeleteBtn & {
  userId?: string;
  withAddMore?: boolean;
};

const errMsg = "something went wrong while getting your cart items";

const replaceQty = (arr: string[]) =>
  arr.map((cell) => (cell === "quantity" ? "count" : cell));

const CartArea = ({ userId, withDeleteBtn, withAddMore }: Props) => {
  const dispatch = useDispatch();
  const { userCart, cartMsg } = useSelector(
    (state: RootStateType) => state.user
  );
  const { listCell, productCardCells } = useInitProductsCells();

  const {
    data: cart,
    error: cartErrData,
    isError: cartErr,
    isLoading: cartLoading,
    isFetching: cartFetching,
  } = useGetUserCart(userId, true);

  useEffect(() => {
    if (cart) {
      if ("msg" in cart) dispatch(resteCart(cart.msg));
      else dispatch(setCart(cart));
    }
  }, [cart, dispatch]);

  if (cartLoading)
    return (
      <Spinner
        content="Loading Cart Items..."
        style={{
          color: "var(--main)",
          fontWeight: "bold",
        }}
        settings={{ clr: "var(--main)" }}
      />
    );

  if (cartErr) {
    if (axios.isAxiosError(cartErrData))
      <h1>
        {cartErrData.response?.data.msg || cartErrData.response?.data || errMsg}
      </h1>;
  }

  if (!cart) return <strong>{errMsg}</strong>;
  if (cartMsg)
    return (
      <strong
        style={{
          fontSize: 20,
        }}
      >
        {cartMsg}
      </strong>
    );

  if (!userCart && !cartMsg) return <h1>can't find the cart</h1>;

  return (
    <>
      <h2>Cart items List</h2>

      {!cartLoading && cartFetching && (
        <div
          className="spinner-pseudo-after"
          style={{ "--clr": "var(--main)" } as CSSProperties}
        >
          updating the cart...
        </div>
      )}

      <div className="cart-area">
        <GridList
          withMargin={!!withDeleteBtn}
          initType="row"
          isChanging={false}
          cells={replaceQty(listCell)}
        >
          {userCart?.products?.map((prd) => {
            return (
              <ProductCard
                withAddMore={withAddMore}
                withDeleteBtn={withDeleteBtn}
                key={prd._id}
                product={prd}
                cells={replaceQty(productCardCells)}
              />
            );
          })}
        </GridList>

        <p
          style={{
            marginBlock: 10,
          }}
        >
          <strong className="cell-prop-name">cart total price: </strong>
          {userCart?.cartTotal}$
        </p>
      </div>
    </>
  );
};
export default CartArea;
