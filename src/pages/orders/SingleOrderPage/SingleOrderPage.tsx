// react
import { useEffect, useState } from "react";

// react-router-dom
import { useParams } from "react-router-dom";

// react query
import { useQuery } from "@tanstack/react-query";

// components
import Heading from "../../../components/Heading";
import GridList from "../../../components/gridList/GridList";
import DisplayError from "../../../components/layout/DisplayError";
import EmptyPage from "../../../components/layout/EmptyPage";
import ProductCard from "../../../components/productCard/ProductCard";
import SplashScreen from "../../../components/spinners/SplashScreen";
import TopSingleOrderInfo from "./components/TopSingleOrderInfo";

// utils
import axios from "../../../utils/axios";

// types
import type { OrderType } from "../../../utils/types";

// hooks
import useInitProductsCells from "../../../hooks/useInitProductsCells";

// SVGs
import IdRequired from "../../../../imgs/ID_required.svg";
import DeletedSvg from "../../../../imgs/deleted.svg";

// layouts
import AnimatedLayout from "../../../layouts/AnimatedLayout";

// fetchers
const getOrderQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, id],
}: {
  queryKey: [string, string];
}) => {
  return (await axios(`orders/${id}`)).data;
};

const SingleOrderPage = () => {
  // react router
  const { id } = useParams();

  // states
  const [order, setOrder] = useState<OrderType | undefined>(undefined);

  // hooks
  const { listCell, productCardCells } = useInitProductsCells("count");

  // react query
  const {
    data: resOrder,
    isError: orderErr,
    error: orderErrData,
    isPending: orderLoading,
    fetchStatus,
  } = useQuery({
    queryKey: ["getOrder", id || ""],
    queryFn: getOrderQueryFn,
    enabled: !!id,
  });

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

  return (
    <AnimatedLayout>
      <Heading>Order Preview</Heading>

      <TopSingleOrderInfo order={order} />

      {order.products.length ? (
        <GridList initType="row" isChanging={false} cells={listCell}>
          {order.products.map((prd) => (
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
