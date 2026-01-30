import { setupServer } from "msw/node";
import categoriesAndBrandsHandlers from "./handlers/categoriesAndBrandsHandlers/handlers";
import wishlistHandlers from "./handlers/wishlist/handlers";

export const server = setupServer(
  ...[...categoriesAndBrandsHandlers, ...wishlistHandlers]
);
