// react-router-dom
import { Link, useLocation } from "react-router-dom";

// redux
import useDispatch from "../../hooks/redux/useDispatch";
import useSelector from "../../hooks/redux/useSelector";

// components
import AddProductToCartBtn from "../AddProductToCartBtn";
import ImgsSlider from "../ImgsSlider";
import PropCell from "../PropCell";
import DeleteProductBtn, {
  type ProductCardDeleteBtn,
} from "./DeleteProductBtn";
import ProductCardQtyList from "./ProductCardQtyList";

// types
import type { OrderProductType, ProductType } from "../../utils/types";

// hooks
import useHandleErrorMsg from "../../hooks/useHandleErrorMsg";
import useInitProductsCells from "../../hooks/useInitProductsCells";
import ToggleProductFromWishlistBtn from "./ToggleProductFromWishlistBtn";

type Props = {
  product: ProductType | OrderProductType;
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
  const { _id, imgs, title, existsInCart } = product;

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // react router dom
  const { pathname } = useLocation();
  const isDashboard = pathname.includes("dashboard");
  const isDashboardProfile = pathname.includes("dashboard/singleUser");

  // hooks
  const { productCardCells } = useInitProductsCells();
  const handleError = useHandleErrorMsg();

  return (
    <TagName
      key={_id}
      className={`product-card${className ? ` ${className}` : ""}`}
      data-testid="product-card"
    >
      {withAddToWishList && (
        <ToggleProductFromWishlistBtn
          isDashboard={isDashboard}
          user={user}
          handleError={handleError}
          dispatch={dispatch}
          productId={_id}
        />
      )}

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

          if (isDashboardProfile && prop === "count") {
            propValue = (product as OrderProductType)["wantedQty"];
          }

          if (prop === "price") propValue = "$" + propValue;

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
            data-testid={`go-to-${product._id}`}
          >
            more info
          </Link>

          {withAddToCart && (
            <AddProductToCartBtn
              existsInCart={existsInCart}
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
