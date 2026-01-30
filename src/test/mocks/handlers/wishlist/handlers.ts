import { http, HttpResponse } from "msw";

import { products } from "../products/static";

const handlers = [
  http.get("*/users/wishlist/:id", async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return HttpResponse.json(products);
  }),

  http.post("*/users/wishlist/:id", async ({ request }) => {
    const body = (await request.json()) as { product: string };

    const productId = body.product;

    await new Promise((resolve) => setTimeout(resolve, 500));

    return HttpResponse.json(
      products.filter(({ _id }) => _id.toString() !== productId?.toString())
    );
  }),

  http.delete("*/users/wishlist/:id", async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return HttpResponse.json({ message: "done!" });
  }),
];

export default handlers;
