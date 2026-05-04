import { http, HttpResponse } from "msw";

// mock data
import { products } from "./static";

const handlers = [
  http.get("*/products/:id", async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { id } = params;

    const product = products.find((p) => p._id === id);
    return HttpResponse.json(product);
  }),

  http.delete("*/products/:id", async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return HttpResponse.json({ message: "product deleted successfully" });
  }),
];

export default handlers;
