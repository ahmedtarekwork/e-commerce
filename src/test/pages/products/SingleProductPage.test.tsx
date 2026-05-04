import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// react router dom
import { Route, Routes } from "react-router-dom";

// pages
import SingleProductPage from "../../../pages/products/singleProductPage/SingleProductPage";

// mocks
import userStateMock from "../../mocks/userStateMock";
import { products } from "../../mocks/handlers/products/static";

// utils
import { renderWithProviders } from "../../utils/renderWithProviders";
import { LocationDisplay } from "../../utils/location";

// msw
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";

const {
  _id,
  imgs,
  title,
  price,
  color,
  description,
  quantity,
  brand: { name: brandName },
  category: { name: categoryName },
} = products[0];

describe("test single product page in normal mode", () => {
  it("should render single product page normally", async () => {
    renderWithProviders(
      <Routes>
        <Route path="/product/:id" element={<SingleProductPage />} />
      </Routes>,
      {
        preloadedState: { user: userStateMock },
        route: `/product/${_id}`,
      },
    );

    const productTitle = await screen.findByRole("heading", { name: title });
    const brandCell = await screen.findByText(/Brand:/i);
    const brandCellValue = await screen.findByText(brandName);
    const categoryCell = await screen.findByText(/Category:/i);
    const categoryCellValue = await screen.findByText(categoryName);
    const priceCell = await screen.findByText(/Price:/i);
    const priceCellValue = await screen.findByText(`${price}$`);
    const colorCell = await screen.findByText(/Color:/i);
    const colorCellValue = await screen.findByText(color);
    const descriptionCell = await screen.findByText(/Description:/i);
    const descriptionCellValue = await screen.findByText(description);
    const qtyCell = await screen.findByText(/Quantity:/i);
    const qtyValue = await screen.findByTestId("quantity");
    const qtyValueUnit = await screen.findByText("units");
    const imgsList = await screen.findAllByTestId("slider-img");
    const addToCartBtn = await screen.findByTitle("add to cart btn");
    const addToWishlistBtn = await screen.findByTitle(
      "toggle product from wishlist",
    );

    expect(productTitle).toBeInTheDocument();
    expect(brandCell).toBeInTheDocument();
    expect(brandCellValue).toBeInTheDocument();
    expect(categoryCell).toBeInTheDocument();
    expect(categoryCellValue).toBeInTheDocument();
    expect(priceCell).toBeInTheDocument();
    expect(priceCellValue).toBeInTheDocument();
    expect(colorCell).toBeInTheDocument();
    expect(colorCellValue).toBeInTheDocument();
    expect(descriptionCell).toBeInTheDocument();
    expect(descriptionCellValue).toBeInTheDocument();
    expect(qtyCell).toBeInTheDocument();
    expect(qtyValue).toBeInTheDocument();
    expect(qtyValue).toHaveTextContent(quantity.toString());
    expect(qtyValueUnit).toBeInTheDocument();
    expect(imgsList).toHaveLength(imgs.length);
    expect(addToCartBtn).toBeInTheDocument();
    expect(addToCartBtn).toHaveTextContent(/Add to Cart/i);
    expect(addToWishlistBtn).toBeInTheDocument();
    expect(addToWishlistBtn).toHaveTextContent(/Add to Wishlist/i);
  });

  describe("test add to cart btn", () => {
    it("should add product to the cart and change the btn text to 'show cart' when click on it", async () => {
      renderWithProviders(
        <Routes>
          <Route path="/product/:id" element={<SingleProductPage />} />
        </Routes>,
        {
          preloadedState: { user: userStateMock },
          route: `/product/${_id}`,
        },
      );

      const addToCartBtn = await screen.findByTitle("add to cart btn");
      expect(addToCartBtn).toHaveTextContent(/Add to Cart/i);
      expect(addToCartBtn).toBeEnabled();
      await userEvent.click(addToCartBtn);
      expect(addToCartBtn).toBeDisabled();

      await waitFor(() => {
        expect(addToCartBtn).toHaveTextContent(/show Cart/i);
        expect(addToCartBtn).toBeEnabled();
      });
    });

    it("should navigate to the cart on click insted of add the product to the cart and see text 'show cart'", async () => {
      const prodcut = {
        ...JSON.parse(JSON.stringify(products[0])),
        existsInCart: true,
      };

      server.use(http.get("*products/:id", () => HttpResponse.json(prodcut)));

      renderWithProviders(
        <>
          <Routes>
            <Route path="/product/:id" element={<SingleProductPage />} />
          </Routes>

          <LocationDisplay />
        </>,
        {
          preloadedState: { user: userStateMock },
          route: `/product/${_id}`,
        },
      );

      const location = screen.getByTestId("location");
      const showCartBtn = await screen.findByTitle("add to cart btn");

      expect(location).toHaveTextContent(
        `http://localhost/product/${prodcut._id}`,
      );
      expect(showCartBtn).toHaveTextContent(/show Cart/i);
      await userEvent.click(showCartBtn);
      expect(location).toHaveTextContent(`http://localhost/cart`);
    });
  });

  describe("test toggle from wishlist btn", () => {
    it("should add product to wishlist and change the btn text to 'Remove From Wishlist' when click on it", async () => {
      server.use(
        http.post("*/users/wishlist/:id", async () => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          return HttpResponse.json([products[0]._id]);
        }),
      );

      renderWithProviders(
        <Routes>
          <Route path="/product/:id" element={<SingleProductPage />} />
        </Routes>,
        {
          preloadedState: { user: userStateMock },
          route: `/product/${_id}`,
        },
      );

      const addToWishlistBtn = await screen.findByTitle(
        "toggle product from wishlist",
      );
      expect(addToWishlistBtn).toHaveTextContent(/Add to Wishlist/i);
      expect(addToWishlistBtn).toBeEnabled();
      await userEvent.click(addToWishlistBtn);
      expect(addToWishlistBtn).toBeDisabled();

      await waitFor(() => {
        expect(addToWishlistBtn).toHaveTextContent(/Remove from Wishlist/i);
        expect(addToWishlistBtn).toBeEnabled();
      });
    });

    it("should remove product from the wishlist and change the btn text to 'Add To Wishlist' when click on it", async () => {
      server.use(
        http.post("*/users/wishlist/:id", async () => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          return HttpResponse.json([]);
        }),
      );

      renderWithProviders(
        <Routes>
          <Route path="/product/:id" element={<SingleProductPage />} />
        </Routes>,
        {
          preloadedState: {
            user: {
              ...userStateMock,
              user: { ...userStateMock.user!, wishlist: [_id] },
            },
          },
          route: `/product/${_id}`,
        },
      );

      const addToWishlistBtn = await screen.findByTitle(
        "toggle product from wishlist",
      );
      expect(addToWishlistBtn).toHaveTextContent(/Remove From Wishlist/i);
      expect(addToWishlistBtn).toBeEnabled();
      await userEvent.click(addToWishlistBtn);
      expect(addToWishlistBtn).toBeDisabled();

      await waitFor(() => {
        expect(addToWishlistBtn).toHaveTextContent(/Add To Wishlist/i);
        expect(addToWishlistBtn).toBeEnabled();
      });
    });
  });
});

describe("test single product page in dashboard mode", () => {
  const preloadedState = (isAdmin: boolean = true) => ({
    user: {
      ...userStateMock,
      user: {
        ...userStateMock.user!,
        isAdmin,
      },
    },
  });

  it.each([{ isAdmin: true }, { isAdmin: false }])(
    "should show 'Edit this product' btn if user is admin and reverse",
    async ({ isAdmin }) => {
      renderWithProviders(
        <Routes>
          <Route path="/product/:id" element={<SingleProductPage />} />
        </Routes>,
        {
          preloadedState: preloadedState(isAdmin),
          route: `/product/${_id}`,
        },
      );

      if (!isAdmin) {
        const editThisProductBtn = screen.queryByText(/edit this product/i);

        expect(editThisProductBtn).not.toBeInTheDocument();
      } else {
        const editThisProductBtn =
          await screen.findByText(/edit this product/i);

        expect(editThisProductBtn).toBeInTheDocument();
      }
    },
  );

  it("should navigate to dashboard version of single product page when click on 'Edit this product' btn", async () => {
    renderWithProviders(
      <>
        <Routes>
          <Route path="/product/:id" element={<SingleProductPage />} />
        </Routes>

        <LocationDisplay />
      </>,
      {
        preloadedState: preloadedState(),
        route: `/product/${_id}`,
      },
    );

    const location = screen.getByTestId("location");
    const editThisProductBtn = await screen.findByText(/edit this product/i);

    expect(location).toHaveTextContent(`http://localhost/product/${_id}`);

    await userEvent.click(editThisProductBtn);

    expect(location).toHaveTextContent(
      `http://localhost/dashboard/product/${_id}`,
    );
  });

  it("should render single product page dashboard version components normally", async () => {
    renderWithProviders(
      <Routes>
        <Route path="/dashboard/product/:id" element={<SingleProductPage />} />
      </Routes>,
      {
        preloadedState: preloadedState(),
        route: `/dashboard/product/${_id}`,
      },
    );

    const soldedUnitsSectionTitle = await screen.findByRole("heading", {
      name: /Solded Units Count/i,
    });
    const deleteProductBtn = await screen.findByText(/Delete/i);
    const editProductBtn = await screen.findByText(/Edit/i);

    expect(soldedUnitsSectionTitle).toBeInTheDocument();
    expect(deleteProductBtn).toBeInTheDocument();
    expect(deleteProductBtn).toHaveClass("red-btn");

    expect(editProductBtn).toBeInTheDocument();
    expect(editProductBtn).toHaveClass("btn");
  });

  it("should navigate to edit product form page when click on 'Edit' btn", async () => {
    renderWithProviders(
      <>
        <Routes>
          <Route
            path="/dashboard/product/:id"
            element={<SingleProductPage />}
          />
        </Routes>

        <LocationDisplay />
      </>,
      {
        preloadedState: preloadedState(),
        route: `/dashboard/product/${_id}`,
      },
    );

    const location = screen.getByTestId("location");
    const editBtn = await screen.findByText(/Edit/i);

    expect(location).toHaveTextContent(
      `http://localhost/dashboard/product/${_id}`,
    );

    await userEvent.click(editBtn);

    expect(location).toHaveTextContent(
      `http://localhost/dashboard/edit-product/${_id}`,
    );
  });

  it("should delete product and navigate to products page when click on 'Delete' btn", async () => {
    renderWithProviders(
      <>
        <Routes>
          <Route
            path="/dashboard/product/:id"
            element={<SingleProductPage />}
          />
        </Routes>

        <LocationDisplay />
      </>,
      {
        preloadedState: preloadedState(),
        route: `/dashboard/product/${_id}`,
      },
    );

    const location = screen.getByTestId("location");
    const deleteBtn = await screen.findByText(/Delete/i);

    expect(location).toHaveTextContent(
      `http://localhost/dashboard/product/${_id}`,
    );

    await userEvent.click(deleteBtn);

    const productTitle = screen.getByText(title, { selector: "span" });
    const yesBtn = screen.getByRole("button", { name: /yes/i });

    expect(productTitle).toBeInTheDocument();
    expect(yesBtn).toBeInTheDocument();

    await userEvent.click(yesBtn);

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /yes/i }),
      ).not.toBeInTheDocument();

      expect(location).toHaveTextContent(`http://localhost/dashboard/products`);
    });
  });
});
