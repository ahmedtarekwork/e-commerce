import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("http://localhost/categories", () => {
    return HttpResponse.json([
      {
        _id: "1",
        name: "Electronics",
        image: {
          public_id: "1",
          secure_url: "https://picsum.photos/200/300",
          productsCount: 0,
        },
      },
      {
        _id: "2",
        name: "Clothes",
        image: {
          public_id: "2",
          secure_url: "https://picsum.photos/200/300",
          productsCount: 0,
        },
      },
    ]);
  }),

  http.get("http://localhost/brands", () => {
    return HttpResponse.json([
      {
        _id: "1",
        name: "Dell",
        image: {
          public_id: "1",
          secure_url: "https://picsum.photos/200/300",
          productsCount: 0,
        },
      },
      {
        _id: "2",
        name: "HP",
        image: {
          public_id: "2",
          secure_url: "https://picsum.photos/200/300",
          productsCount: 0,
        },
      },
    ]);
  }),
];
