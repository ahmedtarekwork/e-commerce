import { http, HttpResponse } from "msw";

// mock data
import { orderProducts as products } from "../products/static";
import { orders } from "./statics";

const handlers = [
  http.get("*/orders/:id", async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { id } = params;

    const order = orders.find((o) => o._id === id);
    return HttpResponse.json(order);
  }),

  http.get("*/orders", async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return HttpResponse.json(orders);
  }),

  http.post("*/orders", async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return HttpResponse.json({ products });
  }),
];

export default handlers;
