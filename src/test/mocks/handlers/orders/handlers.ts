import { http, HttpResponse } from "msw";

import { orderProducts as products } from "../products/static";

const handlers = [
  http.post("*/orders", async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return HttpResponse.json({ products });
  }),
];

export default handlers;
