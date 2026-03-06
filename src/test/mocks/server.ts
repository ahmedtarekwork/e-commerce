import { setupServer } from "msw/node";

// handlers
import cartHandlers from "./handlers/cart/handlers";
import categoriesAndBrandsHandlers from "./handlers/categoriesAndBrandsHandlers/handlers";
import ordersHandlers from "./handlers/orders/handlers";
import wishlistHandlers from "./handlers/wishlist/handlers";
import loginHandlers from "./handlers/auth/login/handlers";
import registerHandlers from "./handlers/auth/signup/handlers";

export const server = setupServer(
  ...[
    ...categoriesAndBrandsHandlers,
    ...wishlistHandlers,
    ...cartHandlers,
    ...ordersHandlers,
    ...loginHandlers,
    ...registerHandlers,
  ],
);
