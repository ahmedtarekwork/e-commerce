// react
import { useEffect } from "react";

// react query
import { useQuery } from "@tanstack/react-query";

// components
import DisplayError from "./layout/DisplayError";
import Spinner from "./spinners/Spinner";
import GridList from "./gridList/GridList";
import ProductCard, { ProductCardDeleteBtn } from "./ProductCard";

// utiles
import axios from "axios";

// types
import { ProductType } from "../utiles/types";

// hooks
import useInitProductsCells from "../hooks/useInitProductsCells";

type Props = ProductCardDeleteBtn & {
  isCurrentUserProfile: boolean;
  wishlist: string[];
};

const getWishlistProductsQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, wishlist],
}: {
  queryKey: [string, string[]];
}): Promise<ProductType[]> => {
  const productsRequests = wishlist.map((prdId) =>
    axios.get("products/" + prdId)
  );

  return (await axios.all(productsRequests)).map((prd) => prd.data);
};

const WishlistArea = ({
  isCurrentUserProfile,
  wishlist,
  withDeleteBtn,
}: Props) => {
  // get wishlist products
  const {
    refetch: getWishlistProducts,
    data: wishlistProducts,
    error: wishlistProductsErrData,
    isError: wishlistProductsErr,
    isPending: wishlistLoading,
  } = useQuery({
    queryKey: ["getWishlistProducts", wishlist],
    queryFn: getWishlistProductsQueryFn,
    enabled: false,
  });

  const { listCell, productCardCells } = useInitProductsCells();

  // make requests for all wishlist products and get them
  useEffect(() => {
    if (wishlist) getWishlistProducts();
  }, [wishlist, getWishlistProducts]);

  if (wishlistLoading)
    return (
      <Spinner settings={{ clr: "var(--main)" }}>
        <strong>Loading Wishlist Products...</strong>
      </Spinner>
    );

  if (wishlistProductsErr)
    return <DisplayError error={wishlistProductsErrData} />;

  if (wishlistProducts?.length === 0) {
    return (
      <strong>
        {isCurrentUserProfile
          ? "you don't have items in your wishlist"
          : "this user hasn't any products in his wishlist"}
      </strong>
    );
  } else {
    return (
      <>
        <h3>wishlist</h3>
        <GridList
          withMargin={!!withDeleteBtn}
          cells={listCell}
          initType="row"
          isChanging={false}
        >
          {wishlistProducts?.map((prd) => (
            <ProductCard
              withDeleteBtn={withDeleteBtn}
              key={prd._id}
              product={prd}
              cells={productCardCells}
            />
          ))}
        </GridList>
      </>
    );
  }
};
export default WishlistArea;
