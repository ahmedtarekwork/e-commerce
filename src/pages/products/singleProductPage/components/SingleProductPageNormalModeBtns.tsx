// react router dom
import { Link } from "react-router-dom";

// icons
import { FaHeart, FaRegHeart } from "react-icons/fa";

// types
import type { ProductType, UserType } from "../../../../utils/types";

// components
import AddProductToCartBtn from "../../../../components/AddProductToCartBtn";
import FillIcon from "../../../../components/FillIcon";
import SingleProductPageWishlistBtn from "./SingleProductPageWishlistBtn";

type Props = Pick<ProductType, "_id" | "existsInCart" | "quantity"> & {
  user: UserType | null;
};

const SingleProductPageNormalModeBtns = ({
  _id,
  existsInCart,
  quantity,
  user,
}: Props) => {
  return (
    <>
      <AddProductToCartBtn
        existsInCart={existsInCart}
        productId={_id}
        productQty={quantity}
      />

      {/* toggle from wishlist btn */}
      {user && <SingleProductPageWishlistBtn _id={_id} />}

      {!user && (
        <Link to="/login" relative="path" className="btn">
          <FillIcon
            diminsions={21}
            stroke={<FaRegHeart />}
            fill={<FaHeart />}
          />
          add to wishlist
        </Link>
      )}
    </>
  );
};
export default SingleProductPageNormalModeBtns;
