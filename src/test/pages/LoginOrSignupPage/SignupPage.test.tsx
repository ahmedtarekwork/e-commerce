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

describe("test signup page", () => {
  it("should navigate to home page if there is a user", () => {
    renderWithProviders(
      <>
        <Routes>
          <Route element={<AlreadyLogedInLayout />}>
            <Route
              path="signup"
              element={<LoginOrSignupPage type="signup" />}
            />
          </Route>
        </Routes>

        <LocationDisplay />
      </>,

      {
        route: "/signup",
        preloadedState: { user: userStateMock },
      },
    );

    const location = screen.getByTestId("location");

    expect(location.textContent || "").toBe("http://localhost/");
  });

  it("should stay in signup page if no user", () => {
    renderWithProviders(
      <>
        <Routes>
          <Route element={<AlreadyLogedInLayout />}>
            <Route
              path="signup"
              element={<LoginOrSignupPage type="signup" />}
            />
          </Route>
        </Routes>

        <LocationDisplay />
      </>,

      {
        route: "/signup",
      },
    );

    const location = screen.getByTestId("location");

    expect(location.textContent || "").toBe("http://localhost/signup");
  });

  it("should render signup page successfull", () => {
    renderWithProviders(
      <LoginOrSignupPage type="signup" />,

      {
        route: "/signup",
      },
    );

    const title = screen.getByRole("heading", { name: "signup" });
    const emailInput = screen.getByPlaceholderText("email");
    const usernameInput = screen.getByPlaceholderText("username");
    const passwordInput = screen.getByPlaceholderText("password");
    const addressInput = screen.getByPlaceholderText("address");
    const isAdminInput = screen.getByText("isAdmin");
    const showPasswordBtn = screen.getByTitle("show password btn");
    const submitBtn = screen.getByRole("button", { name: "signup" });
    const dontHaveAccountMsg = screen.getByTestId("auth-msg");
    const signupLink = screen.getByRole("link", { name: "login" });

    expect(signupLink).toBeInTheDocument();
    expect(dontHaveAccountMsg).toBeInTheDocument();
    expect(dontHaveAccountMsg).toHaveClass("auth-msg");
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("form-title");

    expect(isAdminInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(addressInput).toBeInTheDocument();
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(showPasswordBtn).toBeInTheDocument();
    expect(showPasswordBtn).toBeDisabled();
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });

  it.each([
    { inputName: "username" },
    { inputName: "password" },
    { inputName: "email" },
    { inputName: "address" },
  ])(
    "should enable signup btn when type in $inputName input only",
    async ({ inputName }) => {
      renderWithProviders(
        <LoginOrSignupPage type="signup" />,

        {
          route: "/signup",
        },
      );

      const input = screen.getByPlaceholderText(inputName);
      const showPasswordBtn = screen.getByTitle("show password btn");
      const submitBtn = screen.getByRole("button", { name: "signup" });

      expect(showPasswordBtn).toBeDisabled();
      expect(submitBtn).toBeDisabled();

      await userEvent.type(input, "test");

      expect(input).toHaveValue("test");
      expect(showPasswordBtn)[
        inputName === "password" ? "toBeEnabled" : "toBeDisabled"
      ]();
      expect(submitBtn).toBeEnabled();
    },
  );

  it("should enable signup btn when isAdmin is checked", async () => {
    renderWithProviders(
      <LoginOrSignupPage type="signup" />,

      {
        route: "/signup",
      },
    );

    const isAdminInput = screen.getByText("isAdmin");
    const submitBtn = screen.getByRole("button", { name: "signup" });

    expect(submitBtn).toBeDisabled();
    await userEvent.click(isAdminInput);

    expect(submitBtn).toBeEnabled();
  });

  it("should redirect to login page when register successful", async () => {
    renderWithProviders(
      <>
        <LoginOrSignupPage type="signup" />
        <TopMessage />

        <LocationDisplay />
      </>,
      {
        route: "/signup",
      },
    );
    const location = screen.getByTestId("location");
    const emailInput = screen.getByPlaceholderText("email");
    const usernameInput = screen.getByPlaceholderText("username");
    const passwordInput = screen.getByPlaceholderText("password");
    const signupBtn = screen.getByRole("button", { name: "signup" });

    expect(location.textContent || "").toBe(`http://localhost/signup`);
    expect(signupBtn).toBeDisabled();

    await userEvent.type(emailInput, "test@mail.com");
    await userEvent.type(usernameInput, "testuser");
    await userEvent.type(passwordInput, "testpassword");

    expect(signupBtn).toBeEnabled();

    await userEvent.click(signupBtn);

    await waitFor(
      () => {
        expect(screen.getByTestId("location").textContent || "").toBe(
          "http://localhost/login",
        );

        const successMsg = screen.getByText("user registerd successfully");
        expect(successMsg).toBeInTheDocument();
        expect(successMsg).toHaveClass("app-top-msg green");
      },
      { timeout: 3000 },
    );
  }, 3000);

  describe("test signup link and show password btn", () => {
    it("test show password btn", async () => {
      renderWithProviders(
        <LoginOrSignupPage type="signup" />,

        {
          route: "/signup",
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

    it("should go to login page link", async () => {
      renderWithProviders(
        <>
          <LoginOrSignupPage type="signup" />
          <LocationDisplay />
        </>,

        {
          route: "/signup",
        },
      );

      const location = screen.getByTestId("location");

      expect(location.textContent || "").toBe("http://localhost/signup");

      const loginLink = screen.getByRole("link", { name: "login" });

      await userEvent.click(loginLink);

      expect(location.textContent || "").toBe("http://localhost/login");
    });
  });

  describe("test input fields errors", () => {
    it("should show red error msg if username is already taken", async () => {
      renderWithProviders(
        <>
          <LoginOrSignupPage type="signup" />
          <TopMessage />
        </>,
        {
          route: "/signup",
        },
      );

      const emailInput = screen.getByPlaceholderText("email");
      const usernameInput = screen.getByPlaceholderText("username");
      const passwordInput = screen.getByPlaceholderText("password");
      const signupBtn = screen.getByRole("button", { name: "signup" });

      expect(signupBtn).toBeDisabled();

      await userEvent.type(emailInput, "blabla" + users[0].email);
      await userEvent.type(usernameInput, users[0].username);
      await userEvent.type(passwordInput, users[0].password);

      expect(signupBtn).toBeEnabled();

      await userEvent.click(signupBtn);

      const errorMsg = await screen.findByText("username is already taken");

      expect(errorMsg).toBeInTheDocument();
      expect(errorMsg).toHaveClass("app-top-msg red");
    });

    it("should show red error msg if email is already taken", async () => {
      renderWithProviders(
        <>
          <LoginOrSignupPage type="signup" />
          <TopMessage />
        </>,
        {
          route: "/signup",
        },
      );

      const emailInput = screen.getByPlaceholderText("email");
      const usernameInput = screen.getByPlaceholderText("username");
      const passwordInput = screen.getByPlaceholderText("password");
      const signupBtn = screen.getByRole("button", { name: "signup" });

      expect(signupBtn).toBeDisabled();

      await userEvent.type(emailInput, users[0].email);
      await userEvent.type(usernameInput, "blabla" + users[0].username);
      await userEvent.type(passwordInput, users[0].password);

      expect(signupBtn).toBeEnabled();

      await userEvent.click(signupBtn);

      const errorMsg = await screen.findByText("email is already taken");

      expect(errorMsg).toBeInTheDocument();
      expect(errorMsg).toHaveClass("app-top-msg red");
    });

    it("should show red error msg 'email is already taken' if email and username are already taken", async () => {
      renderWithProviders(
        <>
          <LoginOrSignupPage type="signup" />
          <TopMessage />
        </>,
        {
          route: "/signup",
        },
      );

      const emailInput = screen.getByPlaceholderText("email");
      const usernameInput = screen.getByPlaceholderText("username");
      const passwordInput = screen.getByPlaceholderText("password");
      const signupBtn = screen.getByRole("button", { name: "signup" });

      expect(signupBtn).toBeDisabled();

      await userEvent.type(emailInput, users[0].email);
      await userEvent.type(usernameInput, users[0].username);
      await userEvent.type(passwordInput, users[0].password);

      expect(signupBtn).toBeEnabled();

      await userEvent.click(signupBtn);

      const errorMsg = await screen.findByText("email is already taken");

      expect(errorMsg).toBeInTheDocument();
      expect(errorMsg).toHaveClass("app-top-msg red");
    });

    it("should show 'password is required' msg", async () => {
      renderWithProviders(
        <>
          <LoginOrSignupPage type="signup" />
        </>,
        {
          route: "/signup",
        },
      );

      const usernameInput = screen.getByPlaceholderText("username");
      const passwordErrMsg = screen.queryByText("password is required");
      const signupBtn = screen.getByRole("button", { name: "signup" });

      expect(passwordErrMsg).not.toBeInTheDocument();

      expect(signupBtn).toBeDisabled();

      await userEvent.type(usernameInput, "testing");

      expect(signupBtn).toBeEnabled();

      await userEvent.click(signupBtn);

      expect(
        await screen.findByText("password is required"),
      ).toBeInTheDocument();
    });

    it("should show 'username is required' msg", async () => {
      renderWithProviders(
        <>
          <LoginOrSignupPage type="signup" />
        </>,
        {
          route: "/signup",
        },
      );

      const passwordInput = screen.getByPlaceholderText("password");
      const usernameErrMsg = screen.queryByText("username is required");
      const signupBtn = screen.getByRole("button", { name: "signup" });

      expect(usernameErrMsg).not.toBeInTheDocument();

      expect(signupBtn).toBeDisabled();

      await userEvent.type(passwordInput, "testing");

      expect(signupBtn).toBeEnabled();

      await userEvent.click(signupBtn);

      expect(
        await screen.findByText("username is required"),
      ).toBeInTheDocument();
    });

    it("should show 'password must be 6 characters or more' msg", async () => {
      renderWithProviders(
        <>
          <LoginOrSignupPage type="signup" />
        </>,
        {
          route: "/signup",
        },
      );

      const usernameInput = screen.getByPlaceholderText("username");
      const passwordInput = screen.getByPlaceholderText("password");
      const passwordErrMsg = screen.queryByText(
        "password must be 6 characters or more",
      );
      const signupBtn = screen.getByRole("button", { name: "signup" });

      expect(passwordErrMsg).not.toBeInTheDocument();

      expect(signupBtn).toBeDisabled();

      await userEvent.type(usernameInput, "test");
      await userEvent.type(passwordInput, "test");

      expect(signupBtn).toBeEnabled();

      await userEvent.click(signupBtn);

      expect(
        await screen.findByText("password must be 6 characters or more"),
      ).toBeInTheDocument();
    });

    it("shouldn't call API endpoint if there is a problem in inputs fileds values", async () => {
      const APIHandler = vitest.fn();
      server.use(http.post("*auth/login/credentials", APIHandler));

      renderWithProviders(
        <>
          <LoginOrSignupPage type="signup" />
        </>,
        {
          route: "/signup",
        },
      );

      const usernameInput = screen.getByPlaceholderText("username");
      const passwordInput = screen.getByPlaceholderText("password");
      const passwordErrMsg = screen.queryByText(
        "password must be 6 characters or more",
      );
      const signupBtn = screen.getByRole("button", { name: "signup" });

      expect(passwordErrMsg).not.toBeInTheDocument();

      expect(signupBtn).toBeDisabled();

      await userEvent.type(usernameInput, "test");
      await userEvent.type(passwordInput, "test");

      expect(signupBtn).toBeEnabled();

      await userEvent.click(signupBtn);

      expect(
        await screen.findByText("password must be 6 characters or more"),
      ).toBeInTheDocument();

      expect(APIHandler).not.toBeCalled();
    });

    it("should show 'password must be 6 characters or more' msg and hide it after type more characters in input", async () => {
      renderWithProviders(
        <>
          <LoginOrSignupPage type="signup" />
        </>,
        {
          route: "/signup",
        },
      );

      const usernameInput = screen.getByPlaceholderText("username");
      const passwordInput = screen.getByPlaceholderText("password");
      const passwordErrMsg = screen.queryByText(
        "password must be 6 characters or more",
      );
      const signupBtn = screen.getByRole("button", { name: "signup" });

      expect(passwordErrMsg).not.toBeInTheDocument();

      expect(signupBtn).toBeDisabled();

      await userEvent.type(usernameInput, "test");
      await userEvent.type(passwordInput, "test");

      expect(signupBtn).toBeEnabled();

      await userEvent.click(signupBtn);

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
