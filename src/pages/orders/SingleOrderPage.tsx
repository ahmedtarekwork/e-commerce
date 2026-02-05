// react
import { useEffect, useState } from "react";

// react-router-dom
import { useParams } from "react-router-dom";

// redux
import useSelector from "../../hooks/redux/useSelector";

// react query
import { useQuery } from "@tanstack/react-query";

// components
import Heading from "../../components/Heading";
import PropCell from "../../components/PropCell";
import GridList from "../../components/gridList/GridList";
import DisplayError from "../../components/layout/DisplayError";
import EmptyPage from "../../components/layout/EmptyPage";
import ProductCard from "../../components/productCard/ProductCard";
import SplashScreen from "../../components/spinners/SplashScreen";

// utils
import axios from "../../utils/axios";

// types
import type { OrderType } from "../../utils/types";

// hooks
import useInitProductsCells from "../../hooks/useInitProductsCells";

// SVGs
import IdRequired from "../../../imgs/ID_required.svg";
import DeletedSvg from "../../../imgs/deleted.svg";
import AnimatedLayout from "../../layouts/AnimatedLayout";

// fetchers
const getOrderQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, id],
}: {
  queryKey: [string, string];
}) => {
  if (!id) throw new Error("order id required");

  return (await axios(`orders/${id}`)).data;
};

const SingleOrderPage = () => {
  // react router
  const { id } = useParams();

  // states
  const { user } = useSelector((state) => state.user);
  const appStateOrder = useSelector((state) =>
    state.orders.orders.find((order) => order._id === id)
  );
  const [order, setOrder] = useState<OrderType | undefined>(appStateOrder);

  // hooks
  const { listCell, productCardCells } = useInitProductsCells("count");

  // react query
  const {
    refetch: getOrder,
    data: resOrder,
    isError: orderErr,
    error: orderErrData,
    isPending: orderLoading,
    fetchStatus,
  } = useQuery({
    queryKey: ["getOrder", id || ""],
    queryFn: getOrderQueryFn,
    enabled: false,
  });

  // useEffects
  useEffect(() => {
    if (id && !appStateOrder) getOrder();
  }, []);

  useEffect(() => {
    if (resOrder) setOrder(resOrder);
  }, [resOrder]);

  if (orderLoading && fetchStatus !== "idle")
    return <SplashScreen>Loading Order...</SplashScreen>;

  if (orderErr) {
    return (
      <DisplayError
        error={orderErrData}
        initMsg="Can't get the order at the moment"
      />
    );
  }
  if (!id) {
    return <EmptyPage content="Order Id is required!" svg={IdRequired} />;
  }
  if (!order) {
    return (
      <EmptyPage
        content={
          <>
            Can't get order with id: <br /> "{id}"
          </>
        }
        svg={IdRequired}
      />
    );
  }

  const {
    _id,
    orderStatus,
    totalPrice,
    currency,
    method,
    products,
    orderby,
    createdAt,
    removedProductsCount,
  } = order;

  return (
    <AnimatedLayout>
      <Heading>Order Preview</Heading>

      <h2>order informations</h2>
      <ul
        className="single-order-info"
        style={{
          marginBottom: 15,
        }}
      >
        <li>
          <PropCell name="order id" val={_id} />
        </li>
        <li>
          <PropCell name="order status" val={orderStatus} />
        </li>
        <li>
          <PropCell name="total price" val={totalPrice + "$"} />
        </li>
        <li>
          <PropCell name="currency" val={currency} />
        </li>
        <li>
          <PropCell name="payment method" val={method} />
        </li>
        <li>
          <PropCell name="orderd at" val={new Date(createdAt).toDateString()} />
        </li>
        <li>
          <PropCell
            name="items count"
            val={
              removedProductsCount +
              products
                .map(({ wantedQty }) => wantedQty)
                .reduce((a, b) => a + b, 0)
            }
          />
        </li>

        {orderby && (
          <li>
            <PropCell
              name="ordered by"
              val={
                orderby.username === user?.username ? "You" : orderby.username
              }
              valueAsLink={{
                path:
                  orderby.username === user?.username
                    ? "/profile"
                    : "/dashboard/singleUser/" + orderby._id,
              }}
            />
          </li>
        )}
      </ul>

      {products.length ? (
        <GridList initType="row" isChanging={false} cells={listCell}>
          {products.map((prd) => (
            <ProductCard
              key={prd._id}
              cells={productCardCells}
              product={{ ...prd, count: prd.wantedQty }}
            />
          ))}
        </GridList>
      ) : (
        <EmptyPage
          content={
            <>
              <p>
                All products that you have orderd in this order has been deleted
                from the store.
              </p>
              <p style={{ marginTop: 15 }}>
                don't worry, you will receve all produts that you have orders in
                this order.
              </p>
            </>
          }
          svg={DeletedSvg}
          centerPage={false}
        />
      )}
    </AnimatedLayout>
  );
};
export default SingleOrderPage;
