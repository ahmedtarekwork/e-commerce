import type { ChartData } from "chart.js";
import type { MessageDataType } from "../components/TopMessage";
import { store } from "../store/store";

export type getArrayType<T> = T extends (infer U)[] ? U : T;

export type ChartDataType<T extends "bar" | "pie" | "doughnut"> = ChartData<
  T,
  (number | [number, number] | null)[],
  unknown
>;

// redux
export type RootStateType = ReturnType<typeof store.getState>;

export type showMsgFnParamsType = Pick<MessageDataType, "clr" | "content"> & {
  time?: MessageDataType["time"];
};

export type ImageType = { order?: number } & Record<
  "public_id" | "secure_url" | "_id",
  string
>;

export type ReplacementImage = ImageType & { replacementImg?: File };

export type CategoryAndBrandType = {
  name: string;
  image: ImageType;
  products: string[];
  productsCount: number;
  _id: string;
};

export type UserType = {
  username: string;
  _id: string;
  email: string;
  isAdmin: boolean;
  address?: string;
  wishlist: string[];
  donationPlan?: "pro" | "premium pro" | "standard";
};

export type OrderProductType = ProductType & {
  wantedQty: number;
};

export type LineItemType = {
  quantity: number;
  price_data: {
    recurring?: {
      interval: "day" | "month" | "week" | "year";
      interval_count: number;
    };
    currency: string;
    unit_amount: number;
    product_data: {
      name: string;
      description: string;
      images?: string[];
    };
  };
};

export type CartType = {
  products: OrderProductType[];
  orderdby: string;
};

export type OrderType = {
  _id: string;
  orderby: UserType;

  orderStatus: "Processing" | "Dispatched" | "Cancelled" | "Delivered";

  method: "Cash on Delivery" | "Card";
  totalPrice: number;
  currency: "USD" | string;

  removedProductsCount: number;
  products: OrderProductType[];
  createdAt: string;
};

export type ProductType = Record<
  "category" | "brand",
  { _id: string; name: string }
> & {
  title: string;
  price: number;
  quantity: number;
  color: string;
  imgs: ImageType[];
  _id: string;
  sold: number;
  totalRating: string;
  description: string;

  ratings: {
    star: number;
    comments: string;
    postedby: string;
  }[];
};
