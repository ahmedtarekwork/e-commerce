// RTL
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// utils
import { LocationDisplay } from "../../utils/location";
import { renderWithProviders } from "../../utils/renderWithProviders";

// react router dom
import { Route, Routes } from "react-router-dom";
import NeedLoginLayout from "../../../layouts/NeedLoginLayout";

// pages
import WishlistPage from "../../../pages/e-commerce/wishlistPage/WishlistPage";

// mocks
import { products } from "../../mocks/handlers/products/static";
import userStateMock from "../../mocks/userStateMock";

// MSW
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";

// types
import type { ProductType } from "../../../utils/types";

describe("testing wishlist page", () => {
  it("should render forbidden screen when no user signed in", async () => {
    renderWithProviders(
      <Routes>
        <Route element={<NeedLoginLayout />}>
          <Route path="/wishlist" element={<WishlistPage />} />
        </Route>
      </Routes>,
      { route: "/wishlist" }
    );

    const img = await screen.findByRole("img");
    const title = await screen.findByText(
      "You need to login to access this page"
    );
    const loginBtn = await screen.findByRole("link", { name: "Login" });

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/imgs/need_auth.svg");

    expect(title).toBeInTheDocument();

    expect(loginBtn).toBeInTheDocument();
    expect(loginBtn).toHaveClass("btn");
  });

  it("should render loading screen", () => {
    renderWithProviders(<WishlistPage />, {
      route: "/wishlist",
      preloadedState: { user: userStateMock },
    });

    const loadingSpinner = screen.getAllByText(/Loading Wishlist.../i)[0];
    expect(loadingSpinner).toBeInTheDocument();
  });

  it("should render no items in wishlist screen", async () => {
    server.use(http.get("*/users/wishlist/:id", () => HttpResponse.json([])));

    renderWithProviders(<WishlistPage />, {
      route: "/wishlist",
      preloadedState: { user: userStateMock },
    });

    const loadingSpinner = screen.getAllByText(/Loading Wishlist.../i)[0];
    expect(loadingSpinner).toBeInTheDocument();

    await waitFor(() => {
      const emptyListMsg = screen.getByText(
        "you don't have items in your wishlist"
      );
      const browseProductsBtn = screen.getByRole("link", {
        name: "Browse Our Products",
      });
      expect(emptyListMsg).toBeInTheDocument();
      expect(browseProductsBtn).toBeInTheDocument();
    });
  });

  it("should render page components correctlly", async () => {
    renderWithProviders(<WishlistPage />, {
      route: "/wishlist",
      preloadedState: { user: userStateMock },
    });

    const pageTitle = await screen.findByRole("heading", {
      name: /Your Wishlist/i,
    });

    const clearWishlistBtn = await screen.findByRole("button", {
      name: /clear your wishlist/i,
    });

    const productImgHeading = await screen.findByText("img", { selector: "p" });
    const productTitleHeading = await screen.findByText("title", {
      selector: "p",
    });
    const productBrandHeading = await screen.findByText("brand", {
      selector: "p",
    });
    const productQtyHeading = await screen.findByText("quantity", {
      selector: "p",
    });
    const productCategoryHeading = await screen.findByText("category", {
      selector: "p",
    });
    const productMoreInfoHeading = await screen.findByText("more info", {
      selector: "p",
    });

    expect(pageTitle).toBeInTheDocument();
    expect(productImgHeading).toBeInTheDocument();
    expect(productTitleHeading).toBeInTheDocument();
    expect(productBrandHeading).toBeInTheDocument();
    expect(productQtyHeading).toBeInTheDocument();
    expect(productCategoryHeading).toBeInTheDocument();
    expect(productMoreInfoHeading).toBeInTheDocument();
    expect(clearWishlistBtn).toBeInTheDocument();

    const items = screen.getAllByTestId("wishlist-item");

    expect(items.length).toBe(products.length);
  });

  it("should render all products correctly", async () => {
    renderWithProviders(<WishlistPage />, {
      route: "/wishlist",
      preloadedState: { user: userStateMock },
    });

    const items = await screen.findAllByTestId("wishlist-item");

    expect(items.length).toBe(products.length);

    const source = products[0];
    const imgs = await screen.findAllByRole("img");
    const firstItemImg = imgs[0];
    const firstItemTitle = await screen.findByText(source.title);
    const firstItemBrand = await screen.findByRole("button", {
      name: source.brand.name,
    });
    const firstItemQty = await screen.findByText(source.quantity);
    const firstItemCategory = await screen.findByRole("button", {
      name: source.category.name,
    });
    const firstItemPrice = await screen.findByText("$" + source.price);
    const firstItemMoreInfoBtn = await screen.findByTestId(
      `go-to-${source._id}`
    );

    const firstItemDeleteBtn = await screen.findByTestId(
      `delete-product-${source._id}`
    );

    expect(firstItemDeleteBtn).toBeInTheDocument();
    expect(firstItemDeleteBtn).toHaveClass("delete-product-btn");

    expect(firstItemMoreInfoBtn).toBeInTheDocument();
    expect(firstItemMoreInfoBtn).toHaveClass("product-card-more-info");

    expect(firstItemPrice).toBeInTheDocument();
    expect(firstItemPrice).toHaveClass("prop-cell-value");

    expect(firstItemCategory).toBeInTheDocument();

    expect(firstItemQty).toBeInTheDocument();
    expect(firstItemQty).toHaveClass("prop-cell-value");

    expect(firstItemBrand).toBeInTheDocument();

    expect(firstItemImg).toBeInTheDocument();
    expect(firstItemImg).toHaveAttribute("src", source.imgs[0].secure_url);

    expect(firstItemTitle).toBeInTheDocument();
    expect(firstItemTitle).toHaveClass("product-card-title");
  });

  describe("test product card btns", () => {
    it("should navigate to single product page when click on more info btn", async () => {
      renderWithProviders(
        <>
          <WishlistPage />
          <LocationDisplay />
        </>,
        {
          route: "/wishlist",
          preloadedState: { user: userStateMock },
        }
      );
      const source = products[0];

      const firstItemMoreInfoBtn = await screen.findByTestId(
        `go-to-${source._id}`
      );

      await userEvent.click(firstItemMoreInfoBtn);

      const location = new URL(screen.getByTestId("location").textContent)
        .pathname;

      expect(location).toBe(`/product/${source._id}`);
    });

    it("should delete single product when click on delete product btn", async () => {
      renderWithProviders(<WishlistPage />, {
        route: "/wishlist",
        preloadedState: { user: userStateMock },
      });
      const source = products[1];

      const items = await screen.findAllByTestId("wishlist-item");

      expect(items.length).toBe(products.length);

      const firstItemDeleteBtn = await screen.findByTestId(
        `delete-product-${source._id}`
      );

      await userEvent.click(firstItemDeleteBtn);
      expect(firstItemDeleteBtn).toBeDisabled();

      await waitFor(
        () => {
          const newItems = screen.getAllByTestId("wishlist-item");
          expect(newItems.length).toBe(products.length - 1);

          expect(
            screen.queryByTitle(`product-${source._id}`)
          ).not.toBeInTheDocument();
        },
        { timeout: 10000 }
      );
    }, 10000);

    it("should clear all product from wishlist when click on 'clear your wishlist' btn", async () => {
      renderWithProviders(<WishlistPage />, {
        route: "/wishlist",
        preloadedState: { user: userStateMock },
      });

      const clearWishlistBtn = await screen.findByRole("button", {
        name: /clear your wishlist/i,
      });

      await userEvent.click(clearWishlistBtn);
      expect(clearWishlistBtn).toBeDisabled();

      await waitFor(() => {
        const newItems = screen.queryAllByTestId("wishlist-item");
        const emptyListMsg = screen.getByText(
          "you don't have items in your wishlist"
        );
        const browseProductsBtn = screen.getByRole("link", {
          name: "Browse Our Products",
        });

        expect(newItems.length).toBe(0);

        expect(
          screen.queryByRole("button", {
            name: /clear your wishlist/i,
          })
        ).not.toBeInTheDocument();

        expect(emptyListMsg).toBeInTheDocument();
        expect(browseProductsBtn).toBeInTheDocument();
      });
    });

    it.each([{ key: "brand" }, { key: "category" }])(
      "should navigate to products page filtered with selected $key when click on $key btn",
      async ({ key }) => {
        renderWithProviders(
          <>
            <WishlistPage />
            <LocationDisplay />
          </>,
          {
            route: "/wishlist",
            preloadedState: { user: userStateMock },
          }
        );
        const model = products[0][key as keyof ProductType] as ProductType[
          | "brand"
          | "category"];
        const modelName = model.name;

        const firstItemModel = await screen.findByRole("button", {
          name: modelName,
        });

        await userEvent.click(firstItemModel);

        const location = new URL(screen.getByTestId("location").textContent);

        expect(location.pathname + "?" + location.searchParams).toBe(
          `/products?${key}=${modelName.replaceAll(" ", "+")}`
        );
      }
    );
  });
});
