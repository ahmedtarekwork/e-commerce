import { setupServer } from "msw/node";
import categoriesAndBrandsHandlers from "./handlers/categoriesAndBrandsHandlers/handlers";

export const server = setupServer(...[...categoriesAndBrandsHandlers]);
