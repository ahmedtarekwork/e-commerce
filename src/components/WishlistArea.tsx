// react
import { useEffect, useState } from "react";

// react router dom
import { Link } from "react-router-dom";

// react query
import { useQuery } from "@tanstack/react-query";

// redux
import useDispatch from "../hooks/redux/useDispatch";
import useSelector from "../hooks/redux/useSelector";
// redux actions
import {
  resetUserWishlist,
  setUserWishlist,
  toggleWishlistLoading,
} from "../store/fetures/userSlice";

// components
import DisplayError from "./layout/DisplayError";
import GridList from "./gridList/GridList";
import EmptyPage from "./layout/EmptyPage";
import UserAreaLoading from "./UserAreaLoading";
import ProductCard, {
  type ProductCardDeleteBtn,
} from "./productCard/ProductCard";

// utiles
import axios from "axios";

// types
import type { ProductType } from "../utiles/types";

// hooks
import useInitProductsCells from "../hooks/useInitProductsCells";

// icons
import { FaHeartBroken } from "react-icons/fa";

// SVGs
import wishlistSvg from "../../imgs/wishe-list.svg";

// framer motion
import { AnimatePresence, motion } from "framer-motion";
// variants
import { slideOutVariant } from "../utiles/variants";

type Props = ProductCardDeleteBtn & {
  isCurrentUserProfile: boolean;
  userId: string;
};

type getWishlistProductsFnType = (p: {
  queryKey: [string, string];
}) => Promise<ProductType[]>;

const getWishlistProductsQueryFn: getWishlistProductsFnType = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, userId],
}) => {
  return (await axios.get(`/users/wishlist/${userId}`)).data.wishlist;
};

const WishlistArea = ({
  isCurrentUserProfile,
  userId,
  withDeleteBtn,
}: Props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [currentWishlist, setCurrentWishlist] = useState<ProductType[]>([]);

  const choosedWishlist = isCurrentUserProfile
    ? (user?.wishlist
        ?.map((id) => currentWishlist.find(({ _id }) => _id === id))
        ?.filter((prd) => prd) as ProductType[]) || []
    : currentWishlist;

  // get wishlist products
  const {
    refetch: getWishlistProducts,
    data: wishlistProducts,
    error: wishlistProductsErrData,
    isError: wishlistProductsErr,
    fetchStatus,
  } = useQuery({
    queryKey: ["getWishlistProducts", userId === user?._id ? "" : userId],
    queryFn: getWishlistProductsQueryFn,
    enabled: false,
    refetchInterval: false,
  });

  const { listCell, productCardCells } = useInitProductsCells();

  useEffect(() => {
    getWishlistProducts();
  }, []);

  useEffect(() => {
    if (fetchStatus === "fetching") {
      dispatch(toggleWishlistLoading(true));
    } else dispatch(toggleWishlistLoading(false));
  }, [fetchStatus]);

  useEffect(() => {
    if (wishlistProducts) {
      if (isCurrentUserProfile) {
        dispatch(setUserWishlist(wishlistProducts.map(({ _id }) => _id)));
      }
      setCurrentWishlist(wishlistProducts);
    }
  }, [wishlistProducts]);

  // wishlistLoading &&
  if (fetchStatus === "fetching")
    return (
      <UserAreaLoading isCurrentUserProfile={isCurrentUserProfile}>
        Loading Wishlist...
      </UserAreaLoading>
    );

  if (wishlistProductsErr) {
    if (isCurrentUserProfile) {
      dispatch(resetUserWishlist());

      return (
        <DisplayError
          error={wishlistProductsErrData}
          initMsg="Can't get your wishlist items at the moment"
        />
      );
    } else {
      return (
        <strong
          style={{
            color: "var(--dark)",
            fontSize: 25,
          }}
        >
          Can't get this user wishlist items at the moment
        </strong>
      );
    }
  }

  if (!isCurrentUserProfile && !currentWishlist?.length) {
    return (
      <div className="no-specific-user-wishlist-holder">
        <FaHeartBroken />

        <strong>this user hasn't any products in his wishlist</strong>
      </div>
    );
  }

  if (isCurrentUserProfile) {
    return (
      <AnimatePresence mode="wait">
        {!choosedWishlist?.length ? (
          <motion.div
            key="one"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            variants={slideOutVariant}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <EmptyPage
              content="you don't have items in your wishlist"
              svg={wishlistSvg}
              withBtn={{
                type: "custom",
                btn: (
                  <Link
                    style={{
                      marginTop: 10,
                      marginInline: "auto",
                    }}
                    to="/products"
                    relative="path"
                    className="btn"
                  >
                    Browse Our Products
                  </Link>
                ),
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="two"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            variants={slideOutVariant}
            initial={"initial"}
            animate="animate"
            exit="exit"
          >
            <GridList
              withMargin={!!withDeleteBtn}
              cells={listCell}
              initType="row"
              isChanging={false}
            >
              <AnimatePresence>
                {choosedWishlist?.map((prd) => (
                  <motion.li
                    className="no-grid"
                    variants={slideOutVariant}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    layout
                    key={prd._id}
                  >
                    <ProductCard
                      TagName="div"
                      className="rows-list-cell"
                      withDeleteBtn={
                        isCurrentUserProfile ? withDeleteBtn : undefined
                      }
                      product={prd}
                      cells={productCardCells}
                    />
                  </motion.li>
                ))}
              </AnimatePresence>
            </GridList>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
};
export default WishlistArea;
