// react
import type { RefObject, ComponentProps } from "react";

// react router dom
import { Link, useNavigate } from "react-router-dom";

// redux
import useSelector from "../hooks/redux/useSelector";

// components
import IconAndSpinnerSwitcher from "./animatedBtns/IconAndSpinnerSwitcher";

// hooks
import useAddToCart from "../hooks/ReactQuery/CartRequest/useAddToCart";

// icons
import { FaEye, FaShoppingCart } from "react-icons/fa";
import { MdBlockFlipped } from "react-icons/md";

// framer motion
import { AnimatePresence, motion } from "framer-motion";

// types
import type { TopMessageRefType } from "./TopMessage";

type Props = {
  productId: string;
  productQty: number;
  msgRef: RefObject<TopMessageRefType>;
} & ComponentProps<"button">;

// variants
const addToCartBtnContentVariant = {
  initial: {
    translateY: "100%",
    opacity: 0,
  },
  animate: {
    translateY: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      type: "tween",
    },
  },
};

const AddProductToCartBtn = ({
  msgRef,
  productQty,
  productId,
  ...attr
}: Props) => {
  // react router dom
  const navigate = useNavigate();

  // redux
  const { user, userCart } = useSelector((state) => state.user);

  const isProductInCart =
    userCart?.products.some((prd) => prd._id === productId) || false;

  const isInStock = +(productQty || 0) > 0;

  // react query
  const { mutate: addToCart, isPending } = useAddToCart(msgRef);

  if (!user)
    return (
      <Link
        title="go to login before add to cart btn"
        to="/login"
        className="btn"
        relative="path"
        data-disabled={!isInStock}
      >
        <FaShoppingCart />
        {isInStock ? "add to cart" : "sold out"}
      </Link>
    );

  return (
    <button
      {...attr}
      title="add to cart btn"
      className="btn add-product-to-cart-btn"
      disabled={isPending || !isInStock || attr.disabled}
      onClick={(e) => {
        if (isProductInCart) return navigate("/cart", { relative: "path" });
        else {
          if (!isInStock) return;
          addToCart({
            productId: productId,
            count: 1,
          });
        }

        attr.onClick?.(e);
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isProductInCart && (
          <motion.div
            key="one"
            className="add-product-to-cart-btn-content-holder"
            variants={addToCartBtnContentVariant}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <FaEye /> show cart
          </motion.div>
        )}

        {!isProductInCart &&
          (isInStock ? (
            <motion.div
              key="two"
              className="add-product-to-cart-btn-content-holder"
              variants={addToCartBtnContentVariant}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <IconAndSpinnerSwitcher
                toggleIcon={isPending}
                icon={<FaShoppingCart />}
              />
              add to cart
            </motion.div>
          ) : (
            <>
              <MdBlockFlipped />
              sold out
            </>
          ))}
      </AnimatePresence>
    </button>
  );
};

export default AddProductToCartBtn;
