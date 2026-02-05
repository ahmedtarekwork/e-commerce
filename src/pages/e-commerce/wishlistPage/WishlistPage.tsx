// react
import { useEffect, useState } from "react";

// react router dom
import { Link, useLocation } from "react-router-dom";

// react query
import { useQuery } from "@tanstack/react-query";

// redux
import useDispatch from "../../../hooks/redux/useDispatch";
import useSelector from "../../../hooks/redux/useSelector";
// redux actions
import {
  resetUserWishlist,
  setUserWishlist,
  toggleWishlistLoading,
} from "../../../store/fetures/userSlice";

// components
import Heading from "../../../components/Heading";
import ProfilePageTabsError from "../../../components/ProfilePageTabsError";
import UserAreaLoading from "../../../components/UserAreaLoading";
import GridList from "../../../components/gridList/GridList";
import DisplayError from "../../../components/layout/DisplayError";
import EmptyPage from "../../../components/layout/EmptyPage";
import ProductCard from "../../../components/productCard/ProductCard";
import ClearWishlistBtn from "./components/ClearWishlistBtn";

// utils
import axios from "axios";

// types
import type { ProductType } from "../../../utils/types";

// hooks
import useInitProductsCells from "../../../hooks/useInitProductsCells";

// icons
import { FaHeartBroken } from "react-icons/fa";

// SVGs
import wishlistSvg from "../../../../imgs/wish-list.svg";

// framer motion
import { AnimatePresence, motion } from "framer-motion";
// variants
import { slideOutVariant } from "../../../utils/variants";

type Props = {
  userId?: string; // for dashboard
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

const WishlistPage = ({ userId }: Props) => {
  const { user } = useSelector((state) => state.user);

  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const [currentWishlist, setCurrentWishlist] = useState<ProductType[]>([]);
  const isCurrentUserProfile = pathname === "/wishlist";

  // get wishlist products
  const {
    data: wishlistProducts,
    error: wishlistProductsErrData,
    isError: wishlistProductsErr,
    fetchStatus,
  } = useQuery({
    queryKey: [
      "getWishlistProducts",
      (isCurrentUserProfile ? user?._id : userId) || "",
    ],
    queryFn: getWishlistProductsQueryFn,
    refetchInterval: false,
    enabled: isCurrentUserProfile ? !!user?._id : !!userId,
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

  if (!isCurrentUserProfile && !userId) {
    return (
      <ProfilePageTabsError
        Icon={FaHeartBroken}
        content="user id is required"
      />
    );
  }

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
      <GridList cells={listCell} initType="row" isChanging={false}>
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
        <motion.div
          key="one"
          variants={slideOutVariant}
          initial="initial"
          animate="animate"
          exit="exit"
          className="cart-and-wishlist-pages-holder"
        >
          {!currentWishlist?.length ? (
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
          ) : (
            <>
              {isCurrentUserProfile && <Heading>Your Wishlist</Heading>}
              <GridList cells={listCell} initType="row" isChanging={false}>
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

              <ClearWishlistBtn setCurrentWishlist={setCurrentWishlist} />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }
};
export default WishlistPage;
