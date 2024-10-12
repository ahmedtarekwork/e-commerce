// react-router-dom
import { Link, useLocation } from "react-router-dom";

// react query
import { useMutation } from "@tanstack/react-query";

// redux
import useSelector from "../../hooks/redux/useSelector";
import useDispatch from "../../hooks/redux/useDispatch";
// redux actions
import { setUserWishlist, setCart } from "../../store/fetures/userSlice";

// components
import ImgsSlider from "../ImgsSlider";
import PropCell from "../PropCell";
import FillIcon from "../FillIcon";
import ProductCardQtyList from "./ProductCardQtyList";
import IconAndSpinnerSwitcher from "../animatedBtns/IconAndSpinnerSwitcher";
import ProductCardAddToCartBtn from "../AddProductToCartBtn";

// icons
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AiOutlineDelete, AiFillDelete } from "react-icons/ai";

// utils
import axios from "../../utils/axios";

// types
import type { OrderProductType, ProductType } from "../../utils/types";

// hooks
import useInitProductsCells from "../../hooks/useInitProductsCells";
import useToggleFromWishlist from "../../hooks/ReactQuery/useToggleFromWishlist";
import useHandleErrorMsg from "../../hooks/useHandleErrorMsg";

export type ProductCardDeleteBtn = {
  withDeleteBtn?: "cart" | "wishlist";
};

type Props = ProductCardDeleteBtn & {
  product: ProductType;
  cells?: (keyof Partial<ProductType> | string)[];
  withAddToCart?: boolean;
  withAddToWishList?: boolean;
  withAddMore?: boolean;
  imgWidth?: `${number}px`;
  TagName?: "div" | "li";
  withQty?: boolean;
  className?: string;
};

// fetchers
const removeItemFromCartMutationFn = async ({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) => {
  return (
    await axios.delete(`/carts/${userId}/removeProduct`, {
      data: { productId },
    })
  ).data;
};

const ProductCard = ({
  product,
  cells,
  withAddToCart,
  withAddToWishList,
  withDeleteBtn,
  withAddMore,
  imgWidth,
  withQty = true,
  TagName = "li",
  className,
}: Props) => {
  const { _id, imgs, title } = product;

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // react router dom
  const { pathname } = useLocation();
  const isDashboard = pathname.includes("dashboard");

  // hooks
  const { productCardCells } = useInitProductsCells();
  const handleError = useHandleErrorMsg();

  // react query \\

  // remove item from cart
  const { mutate: removeFromCart, isPending: removeFromCartLoading } =
    useMutation({
      mutationKey: ["removeItemFromCart", _id],
      mutationFn: removeItemFromCartMutationFn,

      onSuccess(data) {
        dispatch(setCart(data));
      },

      onError(error) {
        handleError(error, {
          forAllStates:
            "something went wrong while removing the item from your cart",
        });
      },
    });

  // add to wishlist
  const { toggleFromWishlist, isPending: wishlistLoading } =
    useToggleFromWishlist(
      _id,
      (data: string[]) => {
        dispatch(setUserWishlist(data));
      },
      (error: unknown) => {
        handleError(
          error,
          {
            forAllStates:
              "something went wrong while adding the product to wishlist",
          },
          4000
        );
      }
    );

  return (
    <TagName
      key={_id}
      className={`product-card${className ? ` ${className}` : ""}`}
    >
      {withAddToWishList &&
        !isDashboard &&
        (user ? (
          <button
            title="add to wishlist btn"
            disabled={wishlistLoading}
            className="add-to-wishlist"
            onClick={toggleFromWishlist}
          >
            <IconAndSpinnerSwitcher
              toggleIcon={wishlistLoading}
              icon={
                <FillIcon
                  className={
                    user?.wishlist?.some((prdId) => prdId === _id)
                      ? " active"
                      : ""
                  }
                  fill={<FaHeart />}
                  stroke={<FaRegHeart />}
                />
              }
            />
          </button>
        ) : (
          <Link
            title="add product to wishlist btn"
            className="add-to-wishlist"
            to="/login"
            relative="path"
          >
            <FillIcon fill={<FaHeart />} stroke={<FaRegHeart />} />
          </Link>
        ))}

      <ImgsSlider imgWidth={imgWidth || "150px"} imgs={imgs} />

      <div className="product-data-big-holder">
        <strong className="product-card-title">{title}</strong>

        {(cells || productCardCells).map((prop) => {
          if (!withQty && prop === "quantity") return;

          if (withAddMore && prop === "count") {
            return (
              <ProductCardQtyList
                product={product as OrderProductType}
                propName="count"
                key={prop}
              />
            );
          }

          let propValue = product[prop as keyof typeof product];

          if (prop === "price") propValue += "$";

          const isCategoryOrBrandProp = ["brand", "category"].includes(prop);

          if (isCategoryOrBrandProp) {
            propValue =
              (propValue as ProductType["category" | "brand"])?.name ||
              "not specified";
          }

          return (
            <PropCell
              key={prop}
              name={prop}
              val={
                isCategoryOrBrandProp && propValue === "not specified" ? (
                  <span style={{ color: "var(--danger)", fontWeight: "500" }}>
                    {propValue?.toString()}
                  </span>
                ) : (
                  propValue?.toString()
                )
              }
              valueAsLink={
                propValue !== "not specified" && isCategoryOrBrandProp
                  ? { path: `/products?${prop}=${propValue}` }
                  : undefined
              }
            />
          );
        })}

        <div className="product-card-btns-holder">
          <Link
            title="go to single product page btn"
            relative="path"
            to={`${isDashboard ? "/dashboard" : ""}/product/${_id}`}
            className="product-card-more-info btn"
          >
            more info
          </Link>

          {withAddToCart && (
            <ProductCardAddToCartBtn
              productId={product._id}
              productQty={(product as ProductType).quantity}
            />
          )}
        </div>
      </div>

      {withDeleteBtn && (
        <button
          title="remove product from cart red btn"
          disabled={wishlistLoading || removeFromCartLoading}
          className="red-btn delete-product-btn"
          onClick={() => {
            if (withDeleteBtn === "cart") {
              if (user) removeFromCart({ productId: _id, userId: user._id });
            } else toggleFromWishlist();
          }}
        >
          <IconAndSpinnerSwitcher
            toggleIcon={wishlistLoading || removeFromCartLoading}
            icon={
              <FillIcon stroke={<AiOutlineDelete />} fill={<AiFillDelete />} />
            }
          />
        </button>
      )}
    </TagName>
  );
};
export default ProductCard;
