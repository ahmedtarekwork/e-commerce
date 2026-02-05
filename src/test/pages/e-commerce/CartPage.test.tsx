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
import CartPage from "../../../pages/e-commerce/cartPage/CartPage";

// mocks
import { orderProducts as products } from "../../mocks/handlers/products/static";
import userStateMock from "../../mocks/userStateMock";

// MSW
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";

// types
import type { OrderProductType } from "../../../utils/types";

describe("testing cart page", () => {
  it("should render forbidden screen when no user signed in", async () => {
    renderWithProviders(
      <Routes>
        <Route element={<NeedLoginLayout />}>
          <Route path="/cart" element={<CartPage />} />
        </Route>
      </Routes>,
      { route: "/cart" }
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
    renderWithProviders(<CartPage />, {
      route: "/wishlist",
      preloadedState: { user: userStateMock },
    });

    const loadingSpinner = screen.getAllByText(/Loading Cart Items.../i)[0];
    expect(loadingSpinner).toBeInTheDocument();
  });

  it("should render no items in cart screen", async () => {
    server.use(http.get("*carts/:userId", () => HttpResponse.json([])));

    renderWithProviders(<CartPage />, {
      route: "/cart",
      preloadedState: { user: userStateMock },
    });

    const loadingSpinner = screen.getAllByText(/Loading Cart Items.../i)[0];
    expect(loadingSpinner).toBeInTheDocument();

    await waitFor(() => {
      const emptyListMsg = screen.getByText(
        "you don't have items in your cart"
      );
      const browseProductsBtn = screen.getByRole("link", {
        name: "Browse Our Products",
      });
      expect(emptyListMsg).toBeInTheDocument();
      expect(browseProductsBtn).toBeInTheDocument();
    });
  });

  it("should render page components correctlly", async () => {
    renderWithProviders(<CartPage />, {
      route: "/cart",
      preloadedState: { user: userStateMock },
    });

    const pageTitle = await screen.findByRole("heading", {
      name: /Your Cart/i,
    });
    expect(pageTitle).toBeInTheDocument();

    const productImgHeading = await screen.findByText("img", { selector: "p" });
    const productTitleHeading = await screen.findByText("title", {
      selector: "p",
    });
    const productBrandHeading = await screen.findByText("brand", {
      selector: "p",
    });
    const productCountHeading = await screen.findByText("count", {
      selector: "p",
    });
    const productCategoryHeading = await screen.findByText("category", {
      selector: "p",
    });
    const productMoreInfoHeading = await screen.findByText("more info", {
      selector: "p",
    });

    const checkoutSectionTitle = await screen.findByRole("heading", {
      name: "Checkout Method",
    });
    const checkoutMethodOne = await screen.findByText("Cash on Delivery");
    const checkoutMethodTwo = await screen.findByText("Card");
    const totlaProducts = await screen.findByText("Total Products:");
    const totlaProductsCount = await screen.findByTestId("cart-products-count");
    const totlaProductsCountUnit = await screen.findByText("items");
    const totlaCartPrice = await screen.findByText("Total Price:");
    const checkoutBtn = await screen.findByRole("button", { name: "Checkout" });
    const clearCartBtn = await screen.findByRole("button", {
      name: /clear your Cart/i,
    });

    const cartTotalPrice = products
      .map((prd) => prd.price * prd.wantedQty)
      .reduce((a, b) => a + b, 0);

    const totlaCartPriceNumber = await screen.findByText(`${cartTotalPrice}$`);

    expect(productImgHeading).toBeInTheDocument();
    expect(productTitleHeading).toBeInTheDocument();
    expect(productBrandHeading).toBeInTheDocument();
    expect(productCountHeading).toBeInTheDocument();
    expect(productCategoryHeading).toBeInTheDocument();
    expect(productMoreInfoHeading).toBeInTheDocument();

    expect(checkoutSectionTitle).toBeInTheDocument();
    expect(checkoutMethodOne).toBeInTheDocument();
    expect(checkoutMethodTwo).toBeInTheDocument();
    expect(totlaProducts).toBeInTheDocument();
    expect(totlaProductsCount).toBeInTheDocument();
    expect(totlaProductsCountUnit).toBeInTheDocument();
    expect(totlaCartPrice).toBeInTheDocument();
    expect(totlaCartPriceNumber).toBeInTheDocument();
    expect(checkoutBtn).toBeInTheDocument();
    expect(checkoutBtn).toHaveClass("btn");
    expect(clearCartBtn).toBeInTheDocument();
    expect(clearCartBtn).toHaveClass("red-btn");

    const items = screen.getAllByTestId("cart-item");

    expect(items.length).toBe(products.length);
  });

  it("should render all products correctly", async () => {
    renderWithProviders(<CartPage />, {
      route: "/cart",
      preloadedState: { user: userStateMock },
    });

    const items = await screen.findAllByTestId("cart-item");

    expect(items.length).toBe(products.length);

    const source = products[0];
    const imgs = await screen.findAllByRole("img");
    const firstItemImg = imgs[0];
    const firstItemTitle = await screen.findByText(source.title);
    const firstItemBrand = await screen.findByRole("button", {
      name: source.brand.name,
    });
    const firstItemQty = await screen.findByText(source.wantedQty, {
      selector: "p.select-list-selected-opt",
    });
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
          <CartPage />
          <LocationDisplay />
        </>,
        {
          route: "/cart",
          preloadedState: { user: userStateMock },
        }
      );
      const source = products[0];

      const firstItemMoreInfoBtn = await screen.findByTestId(
        `go-to-${source._id}`
      );

      await userEvent.click(firstItemMoreInfoBtn);

      const location = new URL(screen.getByTestId("location").textContent || "")
        .pathname;

      expect(location).toBe(`/product/${source._id}`);
    });

    it("should delete single product when click on delete product btn", async () => {
      renderWithProviders(<CartPage />, {
        route: "/cart",
        preloadedState: { user: userStateMock },
      });
      const source = products[1];

      const items = await screen.findAllByTestId("cart-item");

      expect(items.length).toBe(products.length);

      const firstItemDeleteBtn = await screen.findByTestId(
        `delete-product-${source._id}`
      );

      await userEvent.click(firstItemDeleteBtn);
      expect(firstItemDeleteBtn).toBeDisabled();

      await waitFor(
        () => {
          const newItems = screen.getAllByTestId("cart-item");
          expect(newItems.length).toBe(products.length - 1);

          expect(
            screen.queryByTitle(`product-${source._id}`)
          ).not.toBeInTheDocument();
        },
        { timeout: 10000 }
      );
    }, 10000);

    it("should clear all products from cart when click on 'clear your cart' btn", async () => {
      renderWithProviders(<CartPage />, {
        route: "/cart",
        preloadedState: { user: userStateMock },
      });

      const clearCartBtn = await screen.findByRole("button", {
        name: /clear your cart/i,
      });
      const checkoutBtn = await screen.findByRole("button", {
        name: /Checkout/i,
      });

      await userEvent.click(clearCartBtn);
      expect(clearCartBtn).toBeDisabled();
      expect(checkoutBtn).toBeDisabled();

      await waitFor(
        () => {
          const newItems = screen.queryAllByTestId("cart-item");
          const emptyListMsg = screen.getByText(
            "you don't have items in your cart"
          );
          const browseProductsBtn = screen.getByRole("link", {
            name: "Browse Our Products",
          });

          expect(newItems.length).toBe(0);

          expect(
            screen.queryByRole("button", {
              name: /clear your cart/i,
            })
          ).not.toBeInTheDocument();

          expect(emptyListMsg).toBeInTheDocument();
          expect(browseProductsBtn).toBeInTheDocument();
        },
        { timeout: 10000 }
      );
    }, 10000);

    it("should make a new order with selected items in cart when click on 'Submit Order' btn", async () => {
      renderWithProviders(<CartPage />, {
        route: "/cart",
        preloadedState: { user: userStateMock },
      });

      const cashOnDeliveryOptionInput = await screen.findByLabelText(
        /cash on delivery/i
      );
      const cashOnDeliveryOptionLabel = await screen.findByText(
        "Cash on Delivery"
      );

      expect(cashOnDeliveryOptionInput).toBeInTheDocument();
      expect(cashOnDeliveryOptionLabel).toBeInTheDocument();

      await userEvent.click(cashOnDeliveryOptionLabel);

      expect(cashOnDeliveryOptionInput).toBeChecked();

      const clearCartBtn = await screen.findByRole("button", {
        name: /clear your cart/i,
      });
      const submitOrderBtn = await screen.findByRole("button", {
        name: /submit order/i,
      });

      await userEvent.click(submitOrderBtn);
      expect(submitOrderBtn).toBeDisabled();
      expect(clearCartBtn).toBeDisabled();

      await waitFor(
        () => {
          const newItems = screen.queryAllByTestId("cart-item");
          const emptyListMsg = screen.getByText(
            "you don't have items in your cart"
          );
          const browseProductsBtn = screen.getByRole("link", {
            name: "Browse Our Products",
          });

          expect(newItems.length).toBe(0);

          expect(
            screen.queryByRole("button", {
              name: /clear your cart/i,
            })
          ).not.toBeInTheDocument();

          expect(emptyListMsg).toBeInTheDocument();
          expect(browseProductsBtn).toBeInTheDocument();
        },
        { timeout: 10000 }
      );
    }, 10000);

    it.each([{ key: "brand" }, { key: "category" }])(
      "should navigate to products page filtered with selected $key when click on $key btn",
      async ({ key }) => {
        renderWithProviders(
          <>
            <CartPage />
            <LocationDisplay />
          </>,
          {
            route: "/cart",
            preloadedState: { user: userStateMock },
          }
        );
        const model = products[0][
          key as keyof OrderProductType
        ] as OrderProductType["brand" | "category"];
        const modelName = model.name;

        const firstItemModel = await screen.findByRole("button", {
          name: modelName,
        });

        await userEvent.click(firstItemModel);

        const location = new URL(
          screen.getByTestId("location").textContent || ""
        );

        expect(location.pathname + "?" + location.searchParams).toBe(
          `/products?${key}=${modelName.replaceAll(" ", "+")}`
        );
      }
    );
  });
});
