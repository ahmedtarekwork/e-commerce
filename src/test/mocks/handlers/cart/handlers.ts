import { http, HttpResponse } from "msw";

import { orderProducts as products } from "../products/static";

const handlers = [
  http.get("*/carts/:userId", async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return HttpResponse.json({
      products,
      totalItemsLength: products
        .map((prd) => prd.wantedQty)
        .reduce((a, b) => a + b, 0),
    });
  }),

  http.delete("*/carts/:userId/removeProduct", async ({ request }) => {
    const body = (await request.json()) as { productId: string };

    const productId = body.productId;

    await new Promise((resolve) => setTimeout(resolve, 500));

    const filteredProducts = products.filter((prd) => prd._id !== productId);

    return HttpResponse.json({
      products: filteredProducts,
      totalItemsLength: filteredProducts
        .map((prd) => prd.wantedQty)
        .reduce((a, b) => a + b, 0),
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
