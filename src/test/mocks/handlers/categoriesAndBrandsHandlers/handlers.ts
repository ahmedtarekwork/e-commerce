import { http, HttpResponse } from "msw";

import { brands, categories } from "./static";

const handlers = [
  // categories \\

  http.patch("*/categories/:id", async ({ params }) => {
    const { id } = params;

    const category = categories.find((cat) => cat._id === id);

    await new Promise((resolve) => setTimeout(resolve, 500));
    return HttpResponse.json(category);
  }),

  http.get("*/categories/:id", ({ params }) => {
    const { id } = params;

    const category = categories.find((cat) => cat._id === id);

    return HttpResponse.json(category);
  }),

  http.get("http://localhost/categories", () => {
    return HttpResponse.json(categories);
  }),

  http.post("*/categories", async () => {
    // Add delay to simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 500));
    return HttpResponse.json(categories[0]);
  }),

  // brands \\

  http.patch("*/brands/:id", async ({ params }) => {
    const { id } = params;

    const category = brands.find((cat) => cat._id === id);

    await new Promise((resolve) => setTimeout(resolve, 500));
    return HttpResponse.json(category);
  }),

  http.get("*/brands/:id", ({ params }) => {
    const { id } = params;

    const category = brands.find((cat) => cat._id === id);

    return HttpResponse.json(category);
  }),

  http.post("*/brands", async () => {
    // Add delay to simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 500));
    return HttpResponse.json(brands[0]);
  }),

  http.get("http://localhost/brands", () => {
    return HttpResponse.json(brands);
  }),
];

export default handlers;
