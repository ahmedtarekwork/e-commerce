// react
import { type CSSProperties, useEffect } from "react";

// redux
import useDispatch from "../hooks/redux/useDispatch";
import useSelector from "../hooks/redux/useSelector";
// redux actions
import { resteCart, setCart } from "../store/fetures/userSlice";

// hooks
import useGetUserCart from "../hooks/ReactQuery/CartRequest/useGetUserCart";
import useInitProductsCells from "../hooks/useInitProductsCells";

// components
import Spinner from "./spinners/Spinner";
import GridList from "./gridList/GridList";
import PropCell from "./PropCell";
import DisplayError from "./layout/DisplayError";
import EmptyPage from "./layout/EmptyPage";
import ProductCard, {
  type ProductCardDeleteBtn,
} from "./productCard/ProductCard";

// SVGs
import cartSvg from "../../imgs/cart.svg";

type Props = ProductCardDeleteBtn & {
  userId?: string;
  withAddMore?: boolean;
  showTotal?: boolean;
  withTitle?: boolean;
};

const replaceQty = (arr: string[]) =>
  arr.map((cell) => (cell === "quantity" ? "count" : cell));

const CartArea = ({
  userId,
  withDeleteBtn,
  withAddMore,
  withTitle = true,
  showTotal = true,
}: Props) => {
  const dispatch = useDispatch();
  const { userCart, cartMsg } = useSelector((state) => state.user);
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

  if (cartLoading) {
    return (
      <Spinner
        fullWidth={true}
        content="Loading Cart Items..."
        style={{
          color: "var(--main)",
          fontWeight: "bold",
          marginInline: "auto",
        }}
        settings={{ clr: "var(--main)" }}
      />
    );
  }

  if (cartErr || !cart || (!userCart && !cartMsg)) {
    userCart?.products.length ? dispatch(resteCart()) : null;

    return (
      <DisplayError
        error={cartErrData!}
        initMsg="Can't get your cart items at the moment"
      />
    );
  }

  if (cartMsg) {
    userCart?.products.length ? dispatch(resteCart()) : null;

    return <EmptyPage svg={cartSvg} content={cartMsg} />;
  }

  return (
    <>
      {withTitle && <h2>Cart items List</h2>}

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

        {showTotal && (
          <PropCell
            style={{
              marginBlock: 10,
            }}
            name="cart total price"
            val={`${userCart?.cartTotal || 0}$`}
          />
        )}
      </div>
    </>
  );
};
export default CartArea;
