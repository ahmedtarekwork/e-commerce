import { useQuery } from "@tanstack/react-query";
import { axiosWithToken } from "../../utiles/axios";
import { CartType, ProductType } from "../../utiles/types";

// we know the user that's will get his cart with token
type CartResponseType = Omit<CartType, "products"> & {
  products: {
    count: number;
    price: number;
    productId: ProductType;
  }[];
};

const removeQty = (
  prd: Omit<ProductType, "quantity"> & { quantity?: number }
) => {
  delete prd.quantity;
  return prd;
};

const getCartQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, id],
}: {
  queryKey: string[];
}): Promise<CartType | { msg: string }> => {
  const cart: CartResponseType | { msg: string } = (
    await axiosWithToken("carts/get-user-cart" + (id ? "/" + id : ""))
  ).data;

  const emptyMsg = id
    ? "user has no items in his cart"
    : "you don't have items in your cart";

  if ("msg" in cart) return { msg: (cart.msg as string) || emptyMsg };

  // returning object and spreding product properties on it && replace quantity with cart item count
  (cart.products as unknown) = cart.products.map(({ count, productId }) => ({
    ...removeQty(productId),
    count,
  })) as unknown as CartType["products"][];

  return cart as unknown as CartType | { msg: string };
};

const useGetUserCart = (id?: string, enabled: boolean = false) =>
  useQuery({
    queryKey: ["getCart", id || ""],
    queryFn: getCartQueryFn,
    enabled,
  });

export default useGetUserCart;
