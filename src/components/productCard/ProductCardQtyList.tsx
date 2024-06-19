// react
import { useEffect } from "react";

// react query
import { type UseMutateFunction, useQuery } from "@tanstack/react-query";

// components
import EmptySpinner from "../spinners/EmptySpinner";
import PropCell from "../PropCell";
import SelectList, {
  type selectListOptionType,
} from "../selectList/SelectList";

// utils
import axios from "../../utiles/axios";

// types
import type { OrderProductType, ProductType } from "../../utiles/types";

type Props = {
  propName: string;
  product: ProductType | OrderProductType;
  cartLoading: boolean;

  addToCart: UseMutateFunction<
    unknown,
    Error,
    { productId: string; count: number },
    unknown
  >;
};

const getProductQtyQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, prdId],
}: {
  queryKey: string[];
}) => {
  return (await axios("products/" + prdId)).data.quantity;
};

const ProductCardQtyList = ({
  propName,
  product,
  cartLoading,
  addToCart,
}: Props) => {
  const { _id } = product;

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
  }, [getProductQty]);

  if (productQtyLoading)
    return <EmptySpinner key={propName} settings={{ diminsions: "10px" }} />;

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
          // id={_id}
          listOptsArr={list}
        />
      }
    />
  );
};
export default ProductCardQtyList;
