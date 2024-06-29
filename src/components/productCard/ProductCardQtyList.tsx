// react
import { type RefObject, useEffect } from "react";

// react query
import { useQuery } from "@tanstack/react-query";

// components
import EmptySpinner from "../spinners/EmptySpinner";
import PropCell from "../PropCell";
import SelectList, {
  type selectListOptionType,
} from "../selectList/SelectList";

// hooks
import useAddToCart from "../../hooks/ReactQuery/CartRequest/useAddToCart";

// utils
import axios from "../../utiles/axios";

// types
import type { OrderProductType, ProductType } from "../../utiles/types";
import type { TopMessageRefType } from "../TopMessage";

// framer motion
import { motion, AnimatePresence } from "framer-motion";
// variants
import { scaleUpDownVariant } from "../../utiles/variants";

type Props = {
  propName: string;
  product: ProductType | OrderProductType;
  msgRef: RefObject<TopMessageRefType>;
};

const getProductQtyQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, prdId],
}: {
  queryKey: string[];
}) => {
  return (await axios("products/" + prdId)).data.quantity;
};

const ProductCardQtyList = ({ propName, product, msgRef }: Props) => {
  const { _id } = product;

  const { mutate: addToCart, isPending: cartLoading } = useAddToCart(msgRef);

  const {
    refetch: getProductQty,
    data: resProductQty,
    isPending: productQtyLoading,
    isError: productQtyErr,
  } = useQuery({
    queryKey: ["getProductQty", _id],
    queryFn: getProductQtyQueryFn,
    enabled: false,
  });

  useEffect(() => {
    getProductQty();
  }, []);

  if (productQtyErr)
    return (
      <PropCell
        key={propName}
        name={propName}
        val={product[propName as keyof typeof product]?.toString()}
      />
    );

  const list = Array.from({
    length: resProductQty,
  }).map((_, i) => ({
    selected: (product as OrderProductType).count === i + 1,
    text: i + 1,
  })) as unknown as selectListOptionType<`${number}`>[];

  return (
    <AnimatePresence mode="popLayout">
      {productQtyLoading && (
        <motion.div
          key="one"
          variants={scaleUpDownVariant}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{
            display: "grid",
            placeContent: "center",
          }}
        >
          <EmptySpinner
            key={propName}
            settings={{ diminsions: "40px", "brdr-width": "3px" }}
          />
        </motion.div>
      )}

      {!productQtyLoading && (
        <motion.div
          key="two"
          variants={scaleUpDownVariant}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <PropCell
            key={propName}
            name={propName}
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

                  if (value)
                    addToCart({
                      productId: _id,
                      count: +value - +(product as OrderProductType).count,
                    });
                }}
                listOptsArr={list}
              />
            }
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default ProductCardQtyList;
