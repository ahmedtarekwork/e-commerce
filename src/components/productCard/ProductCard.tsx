// react-router-dom
import { Link, useLocation } from "react-router-dom";

// redux
import useDispatch from "../../hooks/redux/useDispatch";
import useSelector from "../../hooks/redux/useSelector";
// redux actions
import { setUserWishlist } from "../../store/fetures/userSlice";

// components
import ProductCardAddToCartBtn from "../AddProductToCartBtn";
import IconAndSpinnerSwitcher from "../animatedBtns/IconAndSpinnerSwitcher";
import FillIcon from "../FillIcon";
import ImgsSlider from "../ImgsSlider";
import PropCell from "../PropCell";
import DeleteProductBtn, {
  type ProductCardDeleteBtn,
} from "./DeleteProductBtn";
import ProductCardQtyList from "./ProductCardQtyList";

// icons
import { FaHeart, FaRegHeart } from "react-icons/fa";

// types
import type { OrderProductType, ProductType } from "../../utils/types";

// hooks
import useToggleFromWishlist from "../../hooks/ReactQuery/useToggleFromWishlist";
import useHandleErrorMsg from "../../hooks/useHandleErrorMsg";
import useInitProductsCells from "../../hooks/useInitProductsCells";

type Props = {
  product: ProductType;
  cells?: (keyof Partial<ProductType> | string)[];
  withAddToCart?: boolean;
  withAddToWishList?: boolean;
  withAddMore?: boolean;
  imgWidth?: `${number}px`;
  TagName?: "div" | "li";
  withQty?: boolean;
  className?: string;
  withDeleteBtn?: ProductCardDeleteBtn;
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

      <ImgsSlider
        imgWidth={imgWidth || "150px"}
        // TODO: REMOVE ZEROS AFTER CHANGE ALL IMAGES IN THE APPLICATION
        imgs={imgs.slice().sort((a, b) => (a.order || 0) - (b.order || 0))}
      />

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

      {withDeleteBtn && user && (
        <DeleteProductBtn
          {...withDeleteBtn}
          productId={_id}
          userId={user._id}
        />
      )}
    </TagName>
  );
};
export default ProductCard;
