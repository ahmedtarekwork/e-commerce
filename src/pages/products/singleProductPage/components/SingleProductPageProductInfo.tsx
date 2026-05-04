import PropCell from "../../../../components/PropCell";
import type { ProductType } from "../../../../utils/types";

type Props = {
  product: ProductType;
};
const SingleProductPageProductInfo = ({ product }: Props) => {
  const { title, brand, price, color, category, quantity, description } =
    product;

  return (
    <div className="single-product-data">
      <h1 className="single-product-title">{title}</h1>
      <PropCell
        name="brand"
        valueAsLink={
          brand?.name
            ? {
                path: `/products?brand=${brand?.name || "not specified"}`,
              }
            : undefined
        }
        val={
          brand?.name || (
            <span style={{ color: "var(--danger)", fontWeight: 500 }}>
              not specified
            </span>
          )
        }
      />
      <PropCell name="price" val={price + "$"} />
      <PropCell
        className="single-product-color"
        name="color"
        val={
          <span
            style={{
              filter: "invert(1)",
              mixBlendMode: "difference",
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              width: "fit-content",
            }}
          >
            {color}
          </span>
        }
        propNameProps={{
          style: {
            backgroundColor: color,
            padding: "5px 15px",
            flex: "unset",
            border: "var(--brdr)",
            borderRadius: 4,
            boxShadow: "var(--bx-shadow)",
          },
        }}
      />
      <PropCell
        name="category"
        val={
          category?.name || (
            <span style={{ color: "var(--danger)", fontWeight: 500 }}>
              not specified
            </span>
          )
        }
        valueAsLink={
          category?.name
            ? {
                path: `/products?category=${category?.name || "not specified"}`,
              }
            : undefined
        }
      />
      <PropCell
        name="quantity"
        val={
          <>
            <span
              className="single-product-quantity-number"
              data-testid="quantity"
            >
              {quantity.toString()}
            </span>{" "}
            units
          </>
        }
      />

      <PropCell
        className="single-product-description"
        name="description"
        val={description}
      />
    </div>
  );
};
export default SingleProductPageProductInfo;
