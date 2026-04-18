import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// pages
import UsersPage from "../../../pages/dashboard/usersPage/UsersPage";

// components
import TopMessage from "../../../components/TopMessage";

// mocks
import userStateMock from "../../mocks/userStateMock";
import { allUsersEndpointData as users } from "../../mocks/handlers/users/statics";
import { orders } from "../../mocks/handlers/orders/statics";

// utils
import { renderWithProviders } from "../../utils/renderWithProviders";
import { LocationDisplay } from "../../utils/location";

describe("test users page", () => {
  it("should render users page normally", async () => {
    renderWithProviders(<UsersPage />, {
      preloadedState: { user: userStateMock },
      route: "/dashboard/users",
    });

    const title = await screen.findByRole("heading", { name: /Users List/i });
    const usernameCell = await screen.findByText(/username/i, {
      selector: "p.white-selection",
    });
    const emailCell = await screen.findByText(/email/i, {
      selector: "p.white-selection",
    });
    const addressCell = await screen.findByText("address", {
      selector: "p.white-selection",
    });
    const isAdminCell = await screen.findByText("isAdmin", {
      selector: "p.white-selection",
    });
    const ordersCell = await screen.findByText("orders", {
      selector: "p.white-selection",
    });
    const deleteCell = await screen.findByText("delete", {
      selector: "p.white-selection",
    });

    const usersList = await screen.findAllByTestId("users-page-cell");

    expect(usersList).toHaveLength(users.length);

    expect(title).toBeInTheDocument();
    expect(usernameCell).toBeInTheDocument();
    expect(emailCell).toBeInTheDocument();
    expect(addressCell).toBeInTheDocument();
    expect(isAdminCell).toBeInTheDocument();
    expect(ordersCell).toBeInTheDocument();
    expect(deleteCell).toBeInTheDocument();
  });

  it("should render first user cell normally", async () => {
    const { username, email } = users[0];
    renderWithProviders(<UsersPage />, {
      preloadedState: { user: userStateMock },
      route: "/dashboard/users",
    });

    const firstUserName = await screen.findByText(username, {
      selector: "p",
    });
    const firstUserEmail = await screen.findByText(email, {
      selector: "p.users-page-cell-email",
    });
    const firstUserCell = (await screen.findAllByTestId("users-page-cell"))[0];
    const goToUserProfileBtn = (
      await screen.findAllByTitle("go to single user page btn")
    )[0];

    const deleteFirstUserBtn = (await screen.findAllByTitle("delete user"))[0];

    const admins = await screen.findAllByTestId("true-icon");
    const nonAdmins = await screen.findAllByTestId("false-icon");

    const usersAddresses = await screen.findAllByTestId(
      "users-page-cell-address",
    );
    const noOrdersMsg = await screen.findAllByTestId("no-orders-msg");
    const showOrdersBtn = await screen.findAllByTestId("show-orders-btn");

    const possibleAddresses = [
      ...users.map(({ address }) => address),
      "NO_ADDRESS !",
    ].filter(Boolean);

    usersAddresses.forEach((address) => {
      expect(possibleAddresses).toContain(address.textContent);
    });

    expect(noOrdersMsg).toHaveLength(
      users.filter(({ orders }) => !orders.length).length,
    );
    expect(showOrdersBtn).toHaveLength(
      users.filter(({ orders }) => orders.length).length,
    );

    expect(admins).toHaveLength(users.filter(({ isAdmin }) => isAdmin).length);
    expect(nonAdmins).toHaveLength(
      users.filter(({ isAdmin }) => !isAdmin).length,
    );

    expect(noOrdersMsg[0]).toHaveTextContent("NO_ORDERS !");
    expect(showOrdersBtn[0]).toHaveTextContent("show orders");
    expect(showOrdersBtn[0]).toHaveClass("btn");

    expect(deleteFirstUserBtn).toHaveTextContent("Delete");
    expect(deleteFirstUserBtn).toHaveClass("red-btn");

    expect(firstUserName).toBeInTheDocument();
    expect(firstUserEmail).toBeInTheDocument();
    expect(firstUserCell).toBeInTheDocument();
    expect(goToUserProfileBtn).toBeInTheDocument();
    expect(goToUserProfileBtn).toHaveClass(
      "btn users-page-username-btn user-page-cell-btn",
    );
  });

  describe("test user cell btns", () => {
    it.each(users.map((user, i) => [user, i]))(
      "should navigate to the user profile page when click on his username btn",
      async (user, i) => {
        const _id = userStateMock.user!._id;
        renderWithProviders(
          <>
            <UsersPage />
          </>,
          {
            preloadedState: { user: userStateMock },
            route: "/dashboard/users",
          },
        );

        const goToUserProfileBtns = await screen.findAllByTitle(
          "go to single user page btn",
        );
        const currentUserProfileBtn = goToUserProfileBtns[i];

        expect(currentUserProfileBtn).toBeInTheDocument();
        expect(currentUserProfileBtn).toHaveClass(
          "btn users-page-username-btn user-page-cell-btn",
        );
        expect(currentUserProfileBtn).toHaveAttribute(
          "href",
          +user._id === +_id ? "/profile" : `/dashboard/singleUser/${user._id}`,
        );
      },
    );

    it.each(users.map((user, i) => [user, i]))(
      "should remove user when click on delete btn",
      async (user, i) => {
        const _id = userStateMock.user!._id;

        renderWithProviders(
          <>
            <UsersPage />
            <TopMessage />
            <LocationDisplay />
          </>,
          {
            preloadedState: { user: userStateMock },
            route: "/dashboard/users",
          },
        );

        const location = screen.getByTestId("location");
        const deleteFirstUserBtn = (await screen.findAllByTitle("delete user"))[
          i
        ];

        await userEvent.click(deleteFirstUserBtn);

        const acceptBtn = await screen.findByTitle("accept");
        const cancelBtn = await screen.findByTitle("cancel");

        expect(location).toHaveTextContent("http://localhost/dashboard/users");
        expect(cancelBtn).toBeInTheDocument();
        expect(acceptBtn).toBeInTheDocument();

        expect(deleteFirstUserBtn).toBeEnabled();
        expect(acceptBtn).toBeEnabled();

        await userEvent.click(acceptBtn);

        expect(deleteFirstUserBtn).toBeDisabled();
        expect(acceptBtn).toBeDisabled();

        if (_id === user._id) {
          await waitFor(() => {
            expect(location).toHaveTextContent("http://localhost/login");
          });

          return;
        }

        const topMessage = await screen.findByText("user deleted successfully");
        expect(topMessage).toBeInTheDocument();
      },
    );

    it("should show user orders in modal when click on show orders btn", async () => {
      renderWithProviders(<UsersPage />, {
        preloadedState: { user: userStateMock },
        route: "/dashboard/users",
      });

      const showOrdersBtn = (
        await screen.findAllByTestId("show-orders-btn")
      )[0];

      await userEvent.click(showOrdersBtn);

      const ordersList = await screen.findAllByTestId("order-card");
      expect(ordersList).toHaveLength(orders.length);
    });
  });
});
