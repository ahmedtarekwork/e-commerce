import { http, HttpResponse } from "msw";

import { orderProducts as products } from "../products/static";

const handlers = [
  http.get("*/carts/:userId", async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return HttpResponse.json({ products });
  }),

  http.delete("*/carts/:userId/removeProduct", async ({ request }) => {
    const body = (await request.json()) as { productId: string };

    const productId = body.productId;

    await new Promise((resolve) => setTimeout(resolve, 500));

    return HttpResponse.json({
      products: products.filter((prd) => prd._id !== productId),
    });
  }),

  http.delete("*/carts/:userId/resetCart", async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return HttpResponse.json({
      message: "your cart has been cleared successfully",
    });
  }),
];

export default handlers;
