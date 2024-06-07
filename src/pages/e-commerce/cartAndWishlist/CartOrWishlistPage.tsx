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
  const { user } = useSelector((state) => state.user);

  const { pathname } = useLocation();
  const isCartPage = pathname.includes("cart");

  return (
    <>
      <div className="section">
        <Heading content={isCartPage ? "Your Cart" : "Your Wishlist"} />
      </div>

      {isCartPage ? (
        <CartArea withAddMore withDeleteBtn="cart" />
      ) : (
        <WishlistArea
          withDeleteBtn="wishlist"
          isCurrentUserProfile
          wishlist={user?.wishlist || []}
        />
      )}

      <hr style={{ marginBlock: 15 }} />

      <CartOrWishlistPageBtns isCartPage={isCartPage} />
    </>
  );
};
export default CartOrWishlistPage;
