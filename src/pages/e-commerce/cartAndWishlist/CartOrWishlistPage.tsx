// react-router-dom
import { useLocation } from "react-router-dom";

// redux
import useSelector from "../../../hooks/redux/useSelector";

// components
import Heading from "../../../components/Heading";
import CartArea from "../../../components/CartArea";
import WishlistArea from "../../../components/WishlistArea";
import CartOrWishlistPageBtns from "./CartOrWishlistPageComponents/CartOrWishlistPageBtns";

const CartOrWishlistPage = () => {
  const { user, userCart } = useSelector((state) => state.user);

  const { pathname } = useLocation();
  const isCartPage = pathname.includes("cart");

  let title = isCartPage && userCart?.products.length ? "Your Cart" : "";
  if (!isCartPage && user?.wishlist.length) title = "Your Wishlist";

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Heading>{title}</Heading>

      {isCartPage ? (
        <CartArea
          withTitle={false}
          withAddMore
          withDeleteBtn="cart"
          showTotal={false}
        />
      ) : (
        <WishlistArea
          withDeleteBtn="wishlist"
          isCurrentUserProfile
          wishlist={user?.wishlist || []}
          withTitle={false}
        />
      )}

      <CartOrWishlistPageBtns isCartPage={isCartPage} />
    </div>
  );
};
export default CartOrWishlistPage;
