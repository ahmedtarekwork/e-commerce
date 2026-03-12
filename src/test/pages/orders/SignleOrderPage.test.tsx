// RTL
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// pages
import SingleOrderPage from "../../../pages/orders/SingleOrderPage/SingleOrderPage";

// utils
import { renderWithProviders } from "../../utils/renderWithProviders";
import { LocationDisplay } from "../../utils/location";

// mocks
import { orders } from "../../mocks/handlers/orders/statics";
import userStateMock from "../../mocks/userStateMock";

// react router dom
import { Route, Routes } from "react-router-dom";

// MSW
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";

describe("Single Order Page", () => {
  it("should render single order page normally", async () => {
    renderWithProviders(
      <Routes>
        <Route path="/orders/:id" element={<SingleOrderPage />} />
      </Routes>,
      {
        preloadedState: { user: userStateMock },
        route: `/orders/${orders[0]._id}`,
      },
    );

    const title = await screen.findByRole("heading", {
      name: /order preview/i,
    });

    const IDCell = await screen.findByText("order ID:", { exact: false });
    const IDCellValue = await screen.findByText(orders[0]._id);

    const OrderStatusCell = await screen.findByText("Order Status:", {
      exact: false,
    });
    const OrderStatusCellValue = await screen.findByText(orders[0].orderStatus);

    const ItemsCountCell = await screen.findByText("Items Count:", {
      exact: false,
    });
    const ItemsCountCellValue = await screen.findByText(
      orders[0].products.map((p) => p.wantedQty).reduce((a, b) => a + b, 0) +
        orders[0].removedProductsCount,
    );

    const TotalPriceCell = await screen.findByText("Total Price:", {
      exact: false,
    });
    const TotalPriceCellValue = await screen.findByText(
      orders[0].totalPrice + "$",
    );

    const PaymentMethodCell = await screen.findByText("Payment Method:", {
      exact: false,
    });
    const PaymentMethodCellValue = await screen.findByText(orders[0].method);

    const OrderdAtCell = await screen.findByText("Orderd At:", {
      exact: false,
    });
    const OrderdAtCellValue = await screen.findByText(
      new Date(orders[0].createdAt).toDateString(),
    );

    const OrderdByCell = await screen.findByText("Ordered By:", {
      exact: false,
    });
    const OrderOwnerCell = await screen.findByText("You");

    const productImgHeading = await screen.findByText("img", {
      selector: "p",
    });
    const productTitleHeading = await screen.findByText("title", {
      selector: "p",
    });
    const productBrandHeading = await screen.findByText("brand", {
      selector: "p",
    });
    const productCountHeading = await screen.findByText("count", {
      selector: "p",
    });
    const productPriceHeading = await screen.findByText("price", {
      selector: "p",
    });
    const productCategoryHeading = await screen.findByText("category", {
      selector: "p",
    });
    const productMoreInfoHeading = await screen.findByText("more info", {
      selector: "p",
    });

    const productsList = await screen.findAllByTestId("product-card");

    expect(productImgHeading).toBeInTheDocument();
    expect(productTitleHeading).toBeInTheDocument();
    expect(productBrandHeading).toBeInTheDocument();
    expect(productCountHeading).toBeInTheDocument();
    expect(productPriceHeading).toBeInTheDocument();
    expect(productCategoryHeading).toBeInTheDocument();
    expect(productMoreInfoHeading).toBeInTheDocument();

    expect(title).toBeInTheDocument();

    expect(IDCell).toBeInTheDocument();
    expect(IDCellValue).toBeInTheDocument();

    expect(OrderStatusCell).toBeInTheDocument();
    expect(OrderStatusCellValue).toBeInTheDocument();

    expect(ItemsCountCell).toBeInTheDocument();
    expect(ItemsCountCellValue).toBeInTheDocument();

    expect(TotalPriceCell).toBeInTheDocument();
    expect(TotalPriceCellValue).toBeInTheDocument();

    expect(PaymentMethodCell).toBeInTheDocument();
    expect(PaymentMethodCellValue).toBeInTheDocument();

    expect(OrderdAtCell).toBeInTheDocument();
    expect(OrderdAtCellValue).toBeInTheDocument();

    expect(OrderdByCell).toBeInTheDocument();
    expect(OrderOwnerCell).toBeInTheDocument();

    expect(productsList).toHaveLength(orders[0].products.length);
  });

  it("should render first product of the order normally", async () => {
    renderWithProviders(
      <Routes>
        <Route path="/orders/:id" element={<SingleOrderPage />} />
      </Routes>,
      {
        preloadedState: { user: userStateMock },
        route: `/orders/${orders[0]._id}`,
      },
    );

    const firstProduct = (await screen.findAllByTestId("product-card"))[0];
    const firstProductTitle = await screen.findByText(
      orders[0].products[0].title,
    );
    const firstProductBrand = await screen.findByText(
      orders[0].products[0].brand.name,
    );
    const firstProductCategory = await screen.findByText(
      orders[0].products[0].category.name,
    );
    const firstProductPrice = await screen.findByText(
      "$" + orders[0].products[0].price,
    );
    const firstProductCount = (
      await screen.findAllByText(orders[0].products[0].wantedQty.toString())
    )[0];
    const moreInfoBtn = await screen.findByTestId(
      `go-to-${orders[0].products[0]._id}`,
    );

    expect(firstProductTitle).toBeInTheDocument();
    expect(firstProduct).toBeInTheDocument();
    expect(firstProductBrand).toBeInTheDocument();
    expect(firstProductCategory).toBeInTheDocument();
    expect(firstProductPrice).toBeInTheDocument();
    expect(firstProductCount).toBeInTheDocument();
    expect(moreInfoBtn).toBeInTheDocument();
  });

  it("should navigate to single product page when clicking on more info btn", async () => {
    const initRoute = `/orders/${orders[0]._id}`;
    renderWithProviders(
      <>
        <Routes>
          <Route path="/orders/:id" element={<SingleOrderPage />} />
        </Routes>

        <LocationDisplay />
      </>,
      {
        route: initRoute,
        preloadedState: { user: userStateMock },
      },
    );

    const location = screen.getByTestId("location");
    const moreInfoBtn = await screen.findByTestId(
      `go-to-${orders[0].products[0]._id}`,
    );

    expect(location).toHaveTextContent(`http://localhost${initRoute}`);
    await userEvent.click(moreInfoBtn);
    expect(location).toHaveTextContent(
      `http://localhost/product/${orders[0].products[0]._id}`,
    );
  });

  describe("test problems", () => {
    it.each([
      {
        errorMsg: "can't get the order at the momment",
        statusCode: 500,
      },
      { errorMsg: "order with given id not found", statusCode: 404 },
      {
        errorMsg: "you don't have authority to access this order informations",
        statusCode: 401,
      },
      { errorMsg: "", statusCode: 500 },
    ])(
      "should render single order page with error message $errorMsg if there is an error",
      async ({ errorMsg, statusCode }) => {
        server.use(
          http.get(`*/orders/${orders[0]._id}`, () =>
            HttpResponse.json({ message: errorMsg }, { status: statusCode }),
          ),
        );

        renderWithProviders(
          <Routes>
            <Route path="/orders/:id" element={<SingleOrderPage />} />
          </Routes>,
          {
            preloadedState: { user: userStateMock },
            route: `/orders/${orders[0]._id}`,
          },
        );

        const img = await screen.findByRole("img");
        const noOrdersMsg = await screen.findByText(
          errorMsg || "Can't get the order at the moment",
          { exact: false },
        );
        const goToHomeBtn = await screen.findByRole("link");

        expect(noOrdersMsg).toBeInTheDocument();
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("alt", "empty svg image");
        expect(img).toHaveAttribute("src", "/imgs/error.svg");
        expect(img).toHaveAttribute("width", "600px");
        expect(img).toHaveAttribute("height", "100%");
        expect(goToHomeBtn).toBeInTheDocument();
        expect(goToHomeBtn).toHaveClass("btn go-to-home-btn");
      },
    );
  });
});
