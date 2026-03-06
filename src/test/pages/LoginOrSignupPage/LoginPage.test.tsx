// RTL
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// utils
import { LocationDisplay } from "../../utils/location";
import { renderWithProviders } from "../../utils/renderWithProviders";

// pages
import LoginOrSignupPage from "../../../pages/LoginOrSignupPage";

// components
import TopMessage from "../../../components/TopMessage";

// mocks
import userStateMock from "../../mocks/userStateMock";
import { users } from "../../mocks/handlers/auth/statics";

// react router dom
import { Route, Routes } from "react-router-dom";
import AlreadyLogedInLayout from "../../../layouts/AlreadyLogedInLayout";

// MSW
import { http } from "msw";
import { server } from "../../mocks/server";

describe("test login page", () => {
  it("should navigate to home page if there is a user", () => {
    renderWithProviders(
      <>
        <Routes>
          <Route element={<AlreadyLogedInLayout />}>
            <Route path="login" element={<LoginOrSignupPage type="login" />} />
          </Route>
        </Routes>

        <LocationDisplay />
      </>,

      {
        route: "/login",
        preloadedState: { user: userStateMock },
      },
    );

    const location = screen.getByTestId("location");

    expect(location.textContent || "").toBe("http://localhost/");
  });

  it("should stay in login page if no user", () => {
    renderWithProviders(
      <>
        <Routes>
          <Route element={<AlreadyLogedInLayout />}>
            <Route path="login" element={<LoginOrSignupPage type="login" />} />
          </Route>
        </Routes>

        <LocationDisplay />
      </>,

      {
        route: "/login",
      },
    );

    const location = screen.getByTestId("location");

    expect(location.textContent || "").toBe("http://localhost/login");
  });

  it("should render login page successfull", () => {
    renderWithProviders(
      <LoginOrSignupPage type="login" />,

      {
        route: "/login",
      },
    );

    const title = screen.getByRole("heading", { name: "login" });
    const usernameInput = screen.getByPlaceholderText("username");
    const passwordInput = screen.getByPlaceholderText("password");
    const showPasswordBtn = screen.getByTitle("show password btn");
    const submitBtn = screen.getByRole("button", { name: "login" });
    const dontHaveAccountMsg = screen.getByTestId("auth-msg");
    const signupLink = screen.getByRole("link", { name: "signup" });

    expect(signupLink).toBeInTheDocument();
    expect(dontHaveAccountMsg).toBeInTheDocument();
    expect(dontHaveAccountMsg).toHaveClass("auth-msg");
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("form-title");

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(showPasswordBtn).toBeInTheDocument();
    expect(showPasswordBtn).toBeDisabled();
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });

  it("should enable login btn when type in username input only", async () => {
    renderWithProviders(
      <LoginOrSignupPage type="login" />,

      {
        route: "/login",
      },
    );

    const usernameInput = screen.getByPlaceholderText("username");
    const showPasswordBtn = screen.getByTitle("show password btn");
    const submitBtn = screen.getByRole("button", { name: "login" });

    expect(showPasswordBtn).toBeDisabled();
    expect(submitBtn).toBeDisabled();

    await userEvent.type(usernameInput, "test");

    expect(usernameInput).toHaveValue("test");
    expect(showPasswordBtn).toBeDisabled();
    expect(submitBtn).toBeEnabled();
  });

  it("should enable login btn when type in password input only", async () => {
    renderWithProviders(
      <LoginOrSignupPage type="login" />,

      {
        route: "/login",
      },
    );

    const passwordInput = screen.getByPlaceholderText("password");
    const showPasswordBtn = screen.getByTitle("show password btn");
    const submitBtn = screen.getByRole("button", { name: "login" });

    expect(showPasswordBtn).toBeDisabled();
    expect(submitBtn).toBeDisabled();

    await userEvent.type(passwordInput, "test");

    expect(passwordInput).toHaveValue("test");
    expect(showPasswordBtn).toBeEnabled();
    expect(submitBtn).toBeEnabled();
  });

  it("should redirect to home page when username and password is correct", async () => {
    renderWithProviders(
      <>
        <Routes>
          <Route element={<AlreadyLogedInLayout />}>
            <Route path="login" element={<LoginOrSignupPage type="login" />} />
          </Route>
        </Routes>

        <LocationDisplay />
      </>,
      {
        route: "/login",
      },
    );
    const location = screen.getByTestId("location");
    const usernameInput = screen.getByPlaceholderText("username");
    const passwordInput = screen.getByPlaceholderText("password");
    const loginBtn = screen.getByRole("button", { name: "login" });

    expect(location.textContent || "").toBe(`http://localhost/login`);
    expect(loginBtn).toBeDisabled();

    await userEvent.type(usernameInput, users[0].username);
    await userEvent.type(passwordInput, users[0].password);

    expect(loginBtn).toBeEnabled();

    await userEvent.click(loginBtn);

    await waitFor(
      () => {
        expect(screen.getByTestId("location").textContent || "").toBe(
          "http://localhost/",
        );
      },
      { timeout: 3000 },
    );
  }, 3000);

  describe("test signup link and show password btn", () => {
    it("test show password btn", async () => {
      renderWithProviders(
        <LoginOrSignupPage type="login" />,

        {
          route: "/login",
        },
      );

      const passwordInput = screen.getByPlaceholderText(
        "password",
      ) as HTMLInputElement;
      const showPasswordBtn = screen.getByTitle("show password btn");

      expect(showPasswordBtn).toBeDisabled();

      await userEvent.type(passwordInput, "test");

      expect(showPasswordBtn).toBeEnabled();
      expect(passwordInput).toHaveValue("test");

      expect(passwordInput.type).toBe("password");

      await userEvent.click(showPasswordBtn);

      expect(passwordInput.type).toBe("text");

      await userEvent.click(showPasswordBtn);

      expect(passwordInput.type).toBe("password");
    });

    it("should go to signup page link", async () => {
      renderWithProviders(
        <>
          <LoginOrSignupPage type="login" />
          <LocationDisplay />
        </>,

        {
          route: "/login",
        },
      );

      const location = screen.getByTestId("location");

      expect(location.textContent || "").toBe("http://localhost/login");

      const signupLink = screen.getByRole("link", { name: "signup" });

      await userEvent.click(signupLink);

      expect(location.textContent || "").toBe("http://localhost/signup");
    });
  });

  describe("test input fields errors", () => {
    it("should show red error msg if password is incorrect", async () => {
      renderWithProviders(
        <>
          <LoginOrSignupPage type="login" />
          <TopMessage />
        </>,
        {
          route: "/login",
        },
      );

      const usernameInput = screen.getByPlaceholderText("username");
      const passwordInput = screen.getByPlaceholderText("password");
      const loginBtn = screen.getByRole("button", { name: "login" });

      expect(loginBtn).toBeDisabled();

      await userEvent.type(usernameInput, users[0].username);
      await userEvent.type(passwordInput, users[0].password + "wrong");

      expect(loginBtn).toBeEnabled();

      await userEvent.click(loginBtn);

      const errorMsg = await screen.findByText("password incorrect");

      expect(errorMsg).toBeInTheDocument();
      expect(errorMsg).toHaveClass("app-top-msg red");
    });

    it("should show red error msg if user doesn't exists in DB", async () => {
      renderWithProviders(
        <>
          <LoginOrSignupPage type="login" />
          <TopMessage />
        </>,
        {
          route: "/login",
        },
      );

      const usernameInput = screen.getByPlaceholderText("username");
      const passwordInput = screen.getByPlaceholderText("password");
      const loginBtn = screen.getByRole("button", { name: "login" });

      expect(loginBtn).toBeDisabled();

      await userEvent.type(usernameInput, "testing");
      await userEvent.type(passwordInput, "testing");

      expect(loginBtn).toBeEnabled();

      await userEvent.click(loginBtn);

      const errorMsg = await screen.findByText("user not found");

      expect(errorMsg).toBeInTheDocument();
      expect(errorMsg).toHaveClass("app-top-msg red");
    });

    it("should show 'password is required' msg", async () => {
      renderWithProviders(
        <>
          <LoginOrSignupPage type="login" />
        </>,
        {
          route: "/login",
        },
      );

      const usernameInput = screen.getByPlaceholderText("username");
      const passwordErrMsg = screen.queryByText("password is required");
      const loginBtn = screen.getByRole("button", { name: "login" });

      expect(passwordErrMsg).not.toBeInTheDocument();

      expect(loginBtn).toBeDisabled();

      await userEvent.type(usernameInput, "testing");

      expect(loginBtn).toBeEnabled();

      await userEvent.click(loginBtn);

      expect(
        await screen.findByText("password is required"),
      ).toBeInTheDocument();
    });

    it("should show 'username is required' msg", async () => {
      renderWithProviders(
        <>
          <LoginOrSignupPage type="login" />
        </>,
        {
          route: "/login",
        },
      );

      const passwordInput = screen.getByPlaceholderText("password");
      const usernameErrMsg = screen.queryByText("username is required");
      const loginBtn = screen.getByRole("button", { name: "login" });

      expect(usernameErrMsg).not.toBeInTheDocument();

      expect(loginBtn).toBeDisabled();

      await userEvent.type(passwordInput, "testing");

      expect(loginBtn).toBeEnabled();

      await userEvent.click(loginBtn);

      expect(
        await screen.findByText("username is required"),
      ).toBeInTheDocument();
    });

    it("should show 'password must be 6 characters or more' msg", async () => {
      renderWithProviders(
        <>
          <LoginOrSignupPage type="login" />
        </>,
        {
          route: "/login",
        },
      );

      const usernameInput = screen.getByPlaceholderText("username");
      const passwordInput = screen.getByPlaceholderText("password");
      const passwordErrMsg = screen.queryByText(
        "password must be 6 characters or more",
      );
      const loginBtn = screen.getByRole("button", { name: "login" });

      expect(passwordErrMsg).not.toBeInTheDocument();

      expect(loginBtn).toBeDisabled();

      await userEvent.type(usernameInput, "test");
      await userEvent.type(passwordInput, "test");

      expect(loginBtn).toBeEnabled();

      await userEvent.click(loginBtn);

      expect(
        await screen.findByText("password must be 6 characters or more"),
      ).toBeInTheDocument();
    });

    it("shouldn't call API endpoint if there is a problem in inputs fileds values", async () => {
      const APIHandler = vitest.fn();
      server.use(http.post("*auth/login/credentials", APIHandler));

      renderWithProviders(
        <>
          <LoginOrSignupPage type="login" />
        </>,
        {
          route: "/login",
        },
      );

      const usernameInput = screen.getByPlaceholderText("username");
      const passwordInput = screen.getByPlaceholderText("password");
      const passwordErrMsg = screen.queryByText(
        "password must be 6 characters or more",
      );
      const loginBtn = screen.getByRole("button", { name: "login" });

      expect(passwordErrMsg).not.toBeInTheDocument();

      expect(loginBtn).toBeDisabled();

      await userEvent.type(usernameInput, "test");
      await userEvent.type(passwordInput, "test");

      expect(loginBtn).toBeEnabled();

      await userEvent.click(loginBtn);

      expect(
        await screen.findByText("password must be 6 characters or more"),
      ).toBeInTheDocument();

      expect(APIHandler).not.toBeCalled();
    });

    it("should show 'password must be 6 characters or more' msg and hide it after type more characters in input", async () => {
      renderWithProviders(
        <>
          <LoginOrSignupPage type="login" />
        </>,
        {
          route: "/login",
        },
      );

      const usernameInput = screen.getByPlaceholderText("username");
      const passwordInput = screen.getByPlaceholderText("password");
      const passwordErrMsg = screen.queryByText(
        "password must be 6 characters or more",
      );
      const loginBtn = screen.getByRole("button", { name: "login" });

      expect(passwordErrMsg).not.toBeInTheDocument();

      expect(loginBtn).toBeDisabled();

      await userEvent.type(usernameInput, "test");
      await userEvent.type(passwordInput, "test");

      expect(loginBtn).toBeEnabled();

      await userEvent.click(loginBtn);

      expect(
        await screen.findByText("password must be 6 characters or more"),
      ).toBeInTheDocument();

      await userEvent.clear(passwordInput);

      expect(
        await screen.findByText("password is required"),
      ).toBeInTheDocument();

      await userEvent.type(passwordInput, "test123");

      expect(
        screen.queryByText("password is required"),
      ).not.toBeInTheDocument();
    });
  });
});
