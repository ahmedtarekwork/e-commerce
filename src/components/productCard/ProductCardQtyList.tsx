// components
import PropCell from "../PropCell";
import SelectList, {
  type selectListOptionType,
} from "../selectList/SelectList";

// hooks
import useAddToCart from "../../hooks/ReactQuery/CartRequest/useAddToCart";

// types
import type { OrderProductType } from "../../utils/types";

type Props = {
  propName: string;
  product: OrderProductType;
};

const ProductCardQtyList = ({ propName, product }: Props) => {
  const { _id } = product;

  const { mutate: addToCart, isPending: cartLoading } = useAddToCart();

  const list = Array.from({
    length: product.quantity,
  }).map((_, i) => ({
    selected: product.wantedQty === i + 1,
    text: i + 1,
  })) as unknown as selectListOptionType<`${number}`>[];

  return (
    <PropCell
      name={propName}
      propNameProps={{ className: "product-card-qty" }}
      val={
        <SelectList
          disabled={{
            value: cartLoading,
            text: "loading...",
          }}
          outOfFlow={{
            value: true,
            fullWidth: true,
          }}
          optClickFunc={(e) => {
            const value = e.currentTarget.dataset.opt;

            if (value) {
              addToCart({
                productId: _id,
                wantedQty: +value - +product.wantedQty,
              });
            }
          }}
          listOptsArr={list}
        />
      }
    />
  );
};
export default ProductCardQtyList;
