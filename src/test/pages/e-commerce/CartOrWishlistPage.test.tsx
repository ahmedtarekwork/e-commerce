// RTL
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// utils
import { LocationDisplay } from "../../utils/location";
import { renderWithProviders } from "../../utils/renderWithProviders";

// pages
import CartOrWishlistPage from "../../../pages/e-commerce/cartAndWishlist/CartOrWishlistPage";

// mocks
import { products } from "../../mocks/handlers/products/static";
import userStateMock from "../../mocks/userStateMock";

// MSW
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";

// types
import type { ProductType } from "../../../utils/types";

describe("testing wishlist page", () => {
  it("should navigate to login page when no user signed in", () => {
    renderWithProviders(
      <>
        <CartOrWishlistPage />
        <LocationDisplay />
      </>,
      { route: "/wishlist" }
    );

    const location = new URL(screen.getByTestId("location").textContent)
      .pathname;
    expect(location).toBe("/login");
  });

  it("should render loading screen", () => {
    renderWithProviders(<CartOrWishlistPage />, {
      route: "/wishlist",
      preloadedState: { user: userStateMock },
    });

    const loadingSpinner = screen.getAllByText(/Loading Wishlist.../i)[0];
    expect(loadingSpinner).toBeInTheDocument();
  });

  it("should render no items in wishlist screen", async () => {
    server.use(http.get("*/users/wishlist/:id", () => HttpResponse.json([])));

    renderWithProviders(<CartOrWishlistPage />, {
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
    renderWithProviders(<CartOrWishlistPage />, {
      route: "/wishlist",
      preloadedState: { user: userStateMock },
    });

    await waitFor(
      () => {
        const pageTitle = screen.getByRole("heading", {
          name: /Your Wishlist/i,
        });

        const clearWishlistBtn = screen.getByRole("button", {
          name: /clear your wishlist/i,
        });

        const productImgHeading = screen.getByText("img", { selector: "p" });
        const productTitleHeading = screen.getByText("title", {
          selector: "p",
        });
        const productBrandHeading = screen.getByText("brand", {
          selector: "p",
        });
        const productQtyHeading = screen.getByText("quantity", {
          selector: "p",
        });
        const productCategoryHeading = screen.getByText("category", {
          selector: "p",
        });
        const productMoreInfoHeading = screen.getByText("more info", {
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
      },
      { timeout: 4000 }
    );
  });

  it("should render all products correctlly", async () => {
    renderWithProviders(<CartOrWishlistPage />, {
      route: "/wishlist",
      preloadedState: { user: userStateMock },
    });

    await waitFor(
      () => {
        const items = screen.getAllByTestId("wishlist-item");

        expect(items.length).toBe(products.length);

        const source = products[0];
        const firstItemImg = screen.getAllByRole("img")[0];
        const firstItemTitle = screen.getByText(source.title);
        const firstItemBrand = screen.getByRole("button", {
          name: source.brand.name,
        });
        const firstItemQty = screen.getByText(source.quantity);
        const firstItemCategory = screen.getByRole("button", {
          name: source.category.name,
        });
        const firstItemPrice = screen.getByText("$" + source.price);
        const firstItemMoreInfoBtn = screen.getByTestId(`go-to-${source._id}`);

        const firstItemDeleteBtn = screen.getByTestId(
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
      },
      { timeout: 4000 }
    );
  });

  describe("test product card btns", () => {
    it("should navigate to single product page when click on more info btn", async () => {
      renderWithProviders(
        <>
          <CartOrWishlistPage />
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
      renderWithProviders(<CartOrWishlistPage />, {
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

      await waitFor(() => {
        const newItems = screen.getAllByTestId("wishlist-item");
        expect(newItems.length).toBe(products.length - 1);

        expect(
          screen.queryByTitle(`product-${source._id}`)
        ).not.toBeInTheDocument();
      });
    });

    it("should clear all product from wishlist when click on 'clear your wishlist' btn", async () => {
      renderWithProviders(<CartOrWishlistPage />, {
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
            <CartOrWishlistPage />
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
