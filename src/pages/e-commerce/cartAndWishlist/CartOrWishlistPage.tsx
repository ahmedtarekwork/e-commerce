// react-router-dom
import { useLocation, useNavigate } from "react-router-dom";

// redux
import useSelector from "../../../hooks/redux/useSelector";

// components
import CartArea from "../../../components/cartArea/CartArea";
import Heading from "../../../components/Heading";
import WishlistArea from "../../../components/WishlistArea";
import CartOrWishlistPageBtns from "./CartOrWishlistPageComponents/CartOrWishlistPageBtns";

// layouts
import AnimatedLayout from "../../../layouts/AnimatedLayout";

const CartOrWishlistPage = () => {
  const { user, userCart } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isCartPage = pathname.includes("cart");

  let title = isCartPage && userCart?.products?.length ? "Your Cart" : "";
  if (!isCartPage && user?.wishlist.length) title = "Your Wishlist";

  if (!user) {
    navigate("/login", { relative: "path" });
    return;
  }

  return (
    <AnimatedLayout>
      <Heading>{title}</Heading>

      {isCartPage ? (
        <CartArea
          withAddMore
          withDeleteBtn
          showTotal={false}
          userId={user._id}
        />
      ) : (
        <WishlistArea userId={user._id} withDeleteBtn isCurrentUserProfile />
      )}

      <CartOrWishlistPageBtns isCartPage={isCartPage} />
    </AnimatedLayout>
  );
};
export default CartOrWishlistPage;
