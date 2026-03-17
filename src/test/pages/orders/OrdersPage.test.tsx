// RTL
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// pages
import OrdersPage from "../../../pages/orders/OrdersPage";

// utils
import { renderWithProviders } from "../../utils/renderWithProviders";
import { LocationDisplay } from "../../utils/location";

// mocks
import { orders } from "../../mocks/handlers/orders/statics";
import userStateMock from "../../mocks/userStateMock";

// MSW
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";

// types
import type { OrderType } from "../../../utils/types";

describe("Orders Page", () => {
  it.each([{ route: "/orders" }, { route: "/dashboard/orders" }])(
    "should render orders page normally",
    async ({ route }) => {
      const isDashboard = route.includes("dashboard");
      server.use(http.get("*/orders", () => HttpResponse.json(orders)));

      renderWithProviders(<OrdersPage />, {
        preloadedState: { user: userStateMock },
        route: route,
      });

      const title = await screen.findByRole("heading", {
        name: isDashboard ? /orders page/i : /your orders/i,
      });
      const ordersList = await screen.findAllByTestId("order-card");

      const IDCellList = await screen.findAllByText("ID:");
      const OrderStatusCellList = await screen.findAllByText("Order Status:");
      const ItemsCountCellList = await screen.findAllByText("Items Count:");
      const TotalPriceCellList = await screen.findAllByText("Total Price:");
      const PaymentMethodCellList = await screen.findAllByText(
        "Payment Method:",
        { exact: false },
      );
      const OrderdAtCellList = await screen.findAllByText("Orderd At:");
      const OrderdByCellList = await screen.findAllByText("Orderd By:");
      const OrderOwnerCellList = await screen.findAllByText("You");
      const DeletedUserCellList = await screen.findAllByText("_DELETED_USER_");
      const orderByYouListLength = orders.filter(
        (o) => o.orderby?.username === userStateMock.user?.username,
      ).length;

      expect(title).toBeInTheDocument();
      expect(ordersList).toHaveLength(orders.length);
      expect(IDCellList).toHaveLength(orders.length);
      expect(OrderStatusCellList).toHaveLength(orders.length);
      expect(ItemsCountCellList).toHaveLength(orders.length);
      expect(TotalPriceCellList).toHaveLength(orders.length);
      expect(PaymentMethodCellList).toHaveLength(orders.length);
      expect(OrderdAtCellList).toHaveLength(orders.length);
      expect(OrderdByCellList).toHaveLength(orders.length);
      expect(OrderOwnerCellList).toHaveLength(orderByYouListLength);

      // Dashboard test
      const orderStatusLists = isDashboard
        ? await screen.findAllByTitle("toggle list btn")
        : [];

      expect(orderStatusLists).toHaveLength(isDashboard ? orders.length : 0);
      expect(DeletedUserCellList).toHaveLength(
        orders.length - orderByYouListLength,
      );
    },
  );

  it.each([
    { route: "/orders", msg: /you don't have any orders yet/i },
    { route: "/dashboard/orders", msg: /there aren't any orders yet/i },
  ])(
    "should render orders page with no orders message if there is no orders",
    async ({ route, msg }) => {
      server.use(http.get("*/orders", () => HttpResponse.json([])));

      renderWithProviders(<OrdersPage />, {
        route,
      });

      const img = await screen.findByRole("img");
      const noOrdersMsg = await screen.findByText(msg);
      const goToHomeBtn = await screen.findByRole("link");

      expect(noOrdersMsg).toBeInTheDocument();
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("alt", "empty svg image");
      expect(img).toHaveAttribute("src", "/imgs/no-orders.svg");
      expect(img).toHaveAttribute("width", "600px");
      expect(img).toHaveAttribute("height", "100%");
      expect(goToHomeBtn).toBeInTheDocument();
      expect(goToHomeBtn).toHaveClass("btn go-to-home-btn");
    },
  );

  it.each([
    { errorMsg: "something went wrong while fetching orders", statusCode: 500 },
    { errorMsg: "no orders has been founded", statusCode: 404 },
    { errorMsg: "", statusCode: 500 },
  ])(
    "should render orders page with error message '$errorMsg' if there an error",
    async ({ errorMsg, statusCode }) => {
      server.use(
        http.get("*/orders", () =>
          HttpResponse.json({ message: errorMsg }, { status: statusCode }),
        ),
      );

      renderWithProviders(<OrdersPage />);

      const img = await screen.findByRole("img");
      const noOrdersMsg = await screen.findByText(
        errorMsg || "can't get the orders at the momment",
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

  it.each([{ route: "/orders" }, { route: "/dashboard/orders" }])(
    "should render first order normally",
    async ({ route }) => {
      renderWithProviders(<OrdersPage />, {
        preloadedState: { user: userStateMock },
        route,
      });
      const isDashboard = route.includes("dashboard");

      const IDCell = (await screen.findAllByText("ID:"))[0];
      const IDCellValue = await screen.findByText(orders[0]._id);

      const OrderStatusCell = (await screen.findAllByText("Order Status:"))[0];
      const OrderStatusCellValue = (
        await screen.findAllByText(orders[0].orderStatus)
      )[0];

      const ItemsCountCell = (await screen.findAllByText("Items Count:"))[0];
      const ItemsCountCellValue = await screen.findByText(
        orders[0].products.map((p) => p.wantedQty).reduce((a, b) => a + b, 0) +
          orders[0].removedProductsCount,
      );

      const TotalPriceCell = (await screen.findAllByText("Total Price:"))[0];
      const TotalPriceCellValue = await screen.findByText(
        orders[0].totalPrice + "$",
      );

      const PaymentMethodCell = (
        await screen.findAllByText("Payment Method:", { exact: false })
      )[0];
      const PaymentMethodCellValue = (
        await screen.findAllByText(orders[0].method)
      )[0];

      const OrderdAtCell = (await screen.findAllByText("Orderd At:"))[0];
      const OrderdAtCellValue = (
        await screen.findAllByText(new Date(orders[0].createdAt).toDateString())
      )[0];

      const OrderdByCell = (await screen.findAllByText("Orderd By:"))[0];
      const firstOrderOwnerUsername = orders[0].orderby?.username;
      const firstOrderOwner =
        firstOrderOwnerUsername === userStateMock.user?.username
          ? "You"
          : firstOrderOwnerUsername || "_DELETED_USER_";

      const OrderOwnerCell = (
        await screen.findAllByText(isDashboard ? firstOrderOwner : "You")
      )[0];

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
    },
  );

  it.each([{ route: "/orders" }, { route: "/dashboard/orders" }])(
    "should navigate to single order page when click on order card",
    async ({ route }) => {
      renderWithProviders(
        <>
          <OrdersPage />
          <LocationDisplay />
        </>,
        {
          preloadedState: { user: userStateMock },
          route,
        },
      );

      const location = screen.getByTestId("location");
      const firstOrderCard = (await screen.findAllByTestId("order-card"))[0];

      expect(location).toHaveTextContent(`http://localhost${route}`);
      await userEvent.click(firstOrderCard);
      expect(location).toHaveTextContent(
        `http://localhost${route}/${orders[0]._id}`,
      );
    },
  );

  it("should change order status when click on status list item in dashboard", async () => {
    const targetedStatus: OrderType["orderStatus"] = "Dispatched";
    const oldStatus = orders[0].orderStatus;
    const mockOrder = JSON.parse(JSON.stringify(orders[0]));

    server.use(
      http.get("*/orders", () => HttpResponse.json([mockOrder])),
      http.patch("*/orders/:id", async ({ request }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const body = await request.json();
        const { newStatus } = body as {
          newStatus: OrderType["orderStatus"];
        };

        mockOrder.orderStatus = newStatus;
        return HttpResponse.json(mockOrder);
      }),
    );

    renderWithProviders(<OrdersPage />, {
      preloadedState: { user: userStateMock },
      route: "/dashboard/orders",
    });

    const orderStatusCellOldValue = await screen.findByText(oldStatus, {
      selector: ".prop-cell-value",
    });
    expect(orderStatusCellOldValue).toBeInTheDocument();

    const orderStatusListBtn = await screen.findByTitle("toggle list btn");
    await userEvent.click(orderStatusListBtn);

    const newStatusListItem = await screen.findByText(targetedStatus, {
      exact: false,
      selector: `button[data-opt='${targetedStatus}']`,
    });
    await userEvent.click(newStatusListItem);

    const orderStatusCellValue = await screen.findByText(targetedStatus, {
      selector: ".prop-cell-value",
    });

    expect(orderStatusCellValue).toBeInTheDocument();
    expect(
      screen.queryByText(oldStatus, {
        selector: ".prop-cell-value",
      }),
    ).not.toBeInTheDocument();
  });
});
