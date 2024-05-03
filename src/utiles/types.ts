import { ComponentProps } from "react";
import { store } from "../store/store";

export type getArrayType<T> = T extends (infer U)[] ? U : T;

// redux
export type RootStateType = ReturnType<typeof store.getState>;

export type UserType = {
  username: string;
  _id: string;
  email: string;
  isAdmin: boolean;
  address?: string;
  wishlist: string[];
};

export type OrderProductType = Omit<ProductType, "quantity"> & {
  count: number;
};

export type CartType = {
  products: OrderProductType[];
  cartTotal: number;
  orderdby: string;
};

export type OrderType = {
  _id: string;
  orderby?: UserType;

  orderStatus:
    | "Not Processed"
    | "Cash on Delivery"
    | "Processing"
    | "Dispatched"
    | "Cancelled"
    | "Delivered";

  paymentIntent: {
    id: string;
    method: string;
    amount: number;
    status: string;
    created: Date;
    currency: string;
  };

  products: OrderProductType[];
};

export type ProductType = {
  title: string;
  price: number;
  category: string;
  brand: string;
  quantity: number;
  color: string;
  imgs: string[];
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

// main app reducer \\
// components \\

export type InputPropsType = ComponentProps<"input"> & {
  label?: string;
  errorMsg?: string;

  noSubmit?: boolean;
  submitFunction?: () => void;
  inputFunction?: () => void;
};
