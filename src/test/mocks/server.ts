import { setupServer } from "msw/node";

// handlers
import cartHandlers from "./handlers/cart/handlers";
import categoriesAndBrandsHandlers from "./handlers/categoriesAndBrandsHandlers/handlers";
import ordersHandlers from "./handlers/orders/handlers";
import wishlistHandlers from "./handlers/wishlist/handlers";

export const server = setupServer(
  ...[
    ...categoriesAndBrandsHandlers,
    ...wishlistHandlers,
    ...cartHandlers,
    ...ordersHandlers,
  ]
);
