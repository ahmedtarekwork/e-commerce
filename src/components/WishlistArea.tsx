// react
import { useEffect } from "react";

// react query
import { useQuery } from "@tanstack/react-query";

// redux
import useDispatch from "../hooks/redux/useDispatch";
// redux actions
import { resetUserWishlist } from "../store/fetures/userSlice";

// components
import DisplayError from "./layout/DisplayError";
import Spinner from "./spinners/Spinner";
import GridList from "./gridList/GridList";
import EmptyPage from "./layout/EmptyPage";
import ProductCard, {
  type ProductCardDeleteBtn,
} from "./productCard/ProductCard";

// utiles
import axios from "axios";

// types
import type { ProductType } from "../utiles/types";

// hooks
import useInitProductsCells from "../hooks/useInitProductsCells";

// SVGs
import wishlistSvg from "../../imgs/wishe-list.svg";

type Props = ProductCardDeleteBtn & {
  isCurrentUserProfile: boolean;
  wishlist: string[];
  withTitle?: boolean;
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
  withTitle = true,
}: Props) => {
  const dispatch = useDispatch();

  // get wishlist products
  const {
    refetch: getWishlistProducts,
    data: wishlistProducts,
    error: wishlistProductsErrData,
    isError: wishlistProductsErr,
    isPending: wishlistLoading,
    fetchStatus,
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

  if (wishlistLoading && fetchStatus !== "idle")
    return (
      <Spinner
        fullWidth={true}
        settings={{ clr: "var(--main)" }}
        style={{ color: "var(--main)" }}
      >
        <strong>Loading Products...</strong>
      </Spinner>
    );

  if (wishlistProductsErr) {
    dispatch(resetUserWishlist());

    return (
      <DisplayError
        error={wishlistProductsErrData}
        initMsg="Can't get your wishlist items at the moment."
      />
    );
  }

  if (!wishlistProducts?.length) {
    return (
      <EmptyPage
        content={
          isCurrentUserProfile
            ? "you don't have items in your wishlist"
            : "this user hasn't any products in his wishlist"
        }
        svg={wishlistSvg}
        withBtn={{ type: "GoToHome" }}
      />
    );
  } else {
    return (
      <>
        {withTitle && <h3>wishlist</h3>}

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
