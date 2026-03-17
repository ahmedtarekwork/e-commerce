import userStateMock from "../../userStateMock";
import { orderProducts } from "../products/static";

import type { OrderType, UserType } from "../../../../utils/types";

export const orders: OrderType[] = [
  {
    _id: "11",
    orderby: userStateMock.user!,

    orderStatus: "Processing",
    method: "Cash on Delivery",
    totalPrice: 100,
    currency: "USD",
    removedProductsCount: 0,
    products: orderProducts,
    createdAt: "2026-02-03T15:38:14.227Z",
  },
  {
    _id: "22",
    orderby: userStateMock.user!,

    orderStatus: "Dispatched",
    method: "Card",
    totalPrice: 200,
    currency: "USD",
    removedProductsCount: 0,
    products: orderProducts.slice(0, 3),
    createdAt: "2026-02-03T15:38:14.227Z",
  },
  {
    _id: "33",
    orderby: userStateMock.user!,

    orderStatus: "Cancelled",
    method: "Cash on Delivery",
    totalPrice: 300,
    currency: "USD",
    removedProductsCount: 0,
    products: orderProducts.slice(0, 2),
    createdAt: "2026-02-03T15:38:14.227Z",
  },
  {
    _id: "44",
    orderby: userStateMock.user!,

    orderStatus: "Delivered",
    method: "Card",
    totalPrice: 400,
    currency: "USD",
    removedProductsCount: 0,
    products: orderProducts.slice(2, 3),
    createdAt: "2026-02-03T15:38:14.227Z",
  },
  {
    _id: "55",
    orderby: { username: "" } as UserType,

    orderStatus: "Delivered",
    method: "Card",
    totalPrice: 500,
    currency: "USD",
    removedProductsCount: 0,
    products: orderProducts.slice(2, 3),
    createdAt: "2026-02-03T15:38:14.227Z",
  },
];
