// react
import { useEffect, useState } from "react";

// react-router-dom
import { useParams } from "react-router-dom";

// redux
import useSelector from "../../hooks/redux/useSelector";

// react query
import { useQuery } from "@tanstack/react-query";

// components
import DisplayError from "../../components/layout/DisplayError";
import SplashScreen from "../../components/spinners/SplashScreen";
import Heading from "../../components/Heading";
import PropCell from "../../components/PropCell";
import GridList from "../../components/gridList/GridList";
import ProductCard from "../../components/productCard/ProductCard";
import EmptyPage from "../../components/layout/EmptyPage";

// utiles
import { axiosWithToken } from "../../utiles/axios";

// types
import { OrderType } from "../../utiles/types";

// hooks
import useInitProductsCells from "../../hooks/useInitProductsCells";

// SVGs
import IdRequired from "../../../imgs/ID_required.svg";
import DeletedSvg from "../../../imgs/deleted.svg";

// fetchers
const getOrderQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, id],
}: {
  queryKey: string[];
}) => {
  if (!id) throw new Error("order id required");
  return (await axiosWithToken("orders/" + id)).data;
};

const SingleOrderPage = () => {
  const { id } = useParams();
  const appStateOrder = useSelector((state) =>
    state.orders.orders.find((order) => order._id === id)
  );
  const [order, setOrder] = useState<OrderType | undefined>(appStateOrder);

  const { listCell, productCardCells } = useInitProductsCells();

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
    paymentIntent: { amount, currency, method },
    products,
    orderby,
    createdAt,
    removedProductsCount,
  } = order;

  return (
    <>
      <div className="section">
        <Heading content="Order Preview" />
      </div>

      <h3>order informations</h3>
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
          <PropCell name="total price" val={amount + "$"} />
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
              products.map(({ count }) => count).reduce((a, b) => a + b, 0)
            }
          />
        </li>

        {orderby && (
          <li>
            <PropCell
              name="ordered by"
              val={orderby.username}
              valueAsLink={{
                path: "/dashboard/singleUser/" + orderby._id,
                data: orderby,
              }}
            />
          </li>
        )}
      </ul>

      {products.length ? (
        <GridList
          initType="row"
          isChanging={false}
          cells={listCell.map((cell) => (cell === "quantity" ? "count" : cell))}
        >
          {products.map((prd) => (
            <ProductCard
              key={prd._id}
              cells={productCardCells.map((cell) =>
                cell === "quantity" ? "count" : cell
              )}
              product={prd}
            />
          ))}
        </GridList>
      ) : (
        <div
          style={{
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "calc(12px + 1vw)",
            textTransform: "capitalize",
            color: "var(--dark)",
          }}
        >
          <img
            src={DeletedSvg}
            alt="all orders deleted icon image"
            width="600"
            style={{
              maxWidth: "100%",
            }}
          />

          <p>
            All products that you have orderd in this order has been deleted
            from the store.
          </p>
          <p style={{ marginTop: 15 }}>
            don't worry, you will receve all produts that you have orders in
            this order.
          </p>
        </div>
      )}
    </>
  );
};
export default SingleOrderPage;
