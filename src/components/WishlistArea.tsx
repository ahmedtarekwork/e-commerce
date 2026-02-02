// react
import {
  type Dispatch,
  type SetStateAction,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

// react router dom
import { Link } from "react-router-dom";

// react query
import { useQuery } from "@tanstack/react-query";

// redux
import useDispatch from "../hooks/redux/useDispatch";
// redux actions
import {
  resetUserWishlist,
  setUserWishlist,
  toggleWishlistLoading,
} from "../store/fetures/userSlice";

// components
import ProfilePageTabsError from "./ProfilePageTabsError";
import UserAreaLoading from "./UserAreaLoading";
import GridList from "./gridList/GridList";
import DisplayError from "./layout/DisplayError";
import EmptyPage from "./layout/EmptyPage";
import ProductCard from "./productCard/ProductCard";

// utils
import axios from "axios";

// types
import type { ProductType } from "../utils/types";

// hooks
import useInitProductsCells from "../hooks/useInitProductsCells";

// icons
import { FaHeartBroken } from "react-icons/fa";

// SVGs
import wishlistSvg from "../../imgs/wish-list.svg";

// framer motion
import { AnimatePresence, motion } from "framer-motion";
// variants
import { slideOutVariant } from "../utils/variants";

export type WishlistAreaRefType = {
  setCurrentWishlist: Dispatch<SetStateAction<ProductType[]>>;
};

type Props = {
  isCurrentUserProfile: boolean; // for dashboard
  userId: string;
  withDeleteBtn?: boolean;
};

type getWishlistProductsFnType = (p: {
  queryKey: [string, string];
}) => Promise<ProductType[]>;

const getWishlistProductsQueryFn: getWishlistProductsFnType = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, userId],
}) => {
  return (await axios.get(`/users/wishlist/${userId}`)).data;
};

const WishlistArea = forwardRef<WishlistAreaRefType, Props>(
  ({ isCurrentUserProfile, userId, withDeleteBtn }, ref) => {
    const dispatch = useDispatch();
    const [currentWishlist, setCurrentWishlist] = useState<ProductType[]>([]);

    // get wishlist products
    const {
      data: wishlistProducts,
      error: wishlistProductsErrData,
      isError: wishlistProductsErr,
      fetchStatus,
    } = useQuery({
      queryKey: ["getWishlistProducts", userId],
      queryFn: getWishlistProductsQueryFn,
      refetchInterval: false,
    });

    const { listCell, productCardCells } = useInitProductsCells();

    useEffect(() => {
      dispatch(toggleWishlistLoading(fetchStatus === "fetching"));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchStatus]);

    useEffect(() => {
      if (wishlistProducts) {
        if (isCurrentUserProfile) {
          dispatch(setUserWishlist(wishlistProducts?.map(({ _id }) => _id)));
        }
        setCurrentWishlist(wishlistProducts);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wishlistProducts]);

    useEffect(() => {
      if (wishlistProductsErr && isCurrentUserProfile) {
        dispatch(resetUserWishlist());
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wishlistProductsErr, isCurrentUserProfile]);

    useImperativeHandle(ref, () => ({ setCurrentWishlist }), []);

    if (fetchStatus === "fetching") {
      return (
        <UserAreaLoading isCurrentUserProfile={isCurrentUserProfile}>
          Loading Wishlist...
        </UserAreaLoading>
      );
    }

    if (wishlistProductsErr) {
      if (isCurrentUserProfile) {
        return (
          <DisplayError
            error={wishlistProductsErrData}
            initMsg="Can't get your wishlist items at the moment"
          />
        );
      }

      return (
        <ProfilePageTabsError
          Icon={FaHeartBroken}
          content="Can't get this user wishlist items at the moment"
        />
      );
    }

    if (!isCurrentUserProfile && !currentWishlist?.length) {
      return (
        <ProfilePageTabsError
          Icon={FaHeartBroken}
          content="this user doesn't have any products in his wishlist"
        />
      );
    }

    if (!isCurrentUserProfile && currentWishlist.length) {
      return (
        <GridList
          withMargin={!!withDeleteBtn}
          cells={listCell}
          initType="row"
          isChanging={false}
        >
          {currentWishlist?.map((prd) => (
            <li
              className="no-grid"
              title={"product-" + prd._id}
              key={prd._id}
              data-testid="wishlist-item"
            >
              <ProductCard
                TagName="div"
                className="rows-list-cell"
                product={prd}
                cells={productCardCells}
              />
            </li>
          ))}
        </GridList>
      );
    }

    if (isCurrentUserProfile) {
      return (
        <AnimatePresence mode="wait">
          {!currentWishlist?.length ? (
            <motion.div
              key="one"
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
              variants={slideOutVariant}
              initial="initial"
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
                  {currentWishlist?.map((prd) => (
                    <motion.li
                      className="no-grid"
                      variants={slideOutVariant}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      layout
                      title={"product-" + prd._id}
                      key={prd._id}
                      data-testid="wishlist-item"
                    >
                      <ProductCard
                        TagName="div"
                        className="rows-list-cell"
                        withDeleteBtn={{
                          type: "wishlist",
                          setCurrentWishlist,
                        }}
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
  }
);
export default WishlistArea;
