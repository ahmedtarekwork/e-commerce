import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// pages
import ProfilePage from "../../pages/profilePage/ProfilePage";

// components
import TopMessage from "../../components/TopMessage";

// mocks
import userStateMock from "../mocks/userStateMock";

// utils
import { renderWithProviders } from "../utils/renderWithProviders";
import { LocationDisplay } from "../utils/location";

describe("test profile page", () => {
  it("should render profile page normally", () => {
    const { username, email, address, donationPlan } = userStateMock.user!;

    renderWithProviders(<ProfilePage />, {
      preloadedState: { user: userStateMock },
      route: "/profile",
    });

    const title = screen.getByRole("heading", { name: /Your Profile/i });
    const usernameCell = screen.getByText(/username/i);
    const usernameCellValue = screen.getByText(`#${username}`);
    const emailCell = screen.getByText(/email/i);
    const emailCellValue = screen.getByText(email);
    const addressCell = screen.getByText("address:");
    const addressCellValue = screen.getByText(address || "NO_ADDRESS_FOUND!");
    const donationPlanCell = screen.getByText(/donation plan/i);
    const donationPlanCellValue = screen.getByText(
      donationPlan || "you aren't subscriped to any donation plan",
    );
    const donateBtn = screen.getByTitle("go to donate page btn");
    const editBtns = screen.queryAllByRole("button", { name: /edit/i });
    const dangerZoneTitle = screen.getByRole("heading", {
      name: /danger zone/i,
    });
    const dangerZoneDescribtion = screen.getByText(
      "delete your account, you can't restore your account after delete it.",
    );
    const deleteAccountBtn = screen.getByRole("button", {
      name: /Delete your account/i,
    });

    expect(title).toBeInTheDocument();
    expect(usernameCell).toBeInTheDocument();
    expect(usernameCellValue).toBeInTheDocument();
    expect(emailCell).toBeInTheDocument();
    expect(emailCellValue).toBeInTheDocument();
    expect(addressCell).toBeInTheDocument();
    expect(addressCellValue).toBeInTheDocument();
    expect(donationPlanCell).toBeInTheDocument();
    expect(donationPlanCellValue).toBeInTheDocument();
    expect(donateBtn).toBeInTheDocument();
    expect(editBtns).toHaveLength(3);
    expect(dangerZoneTitle).toBeInTheDocument();
    expect(dangerZoneTitle).toHaveClass("danger-zone-title");
    expect(dangerZoneDescribtion).toBeInTheDocument();
    expect(deleteAccountBtn).toBeInTheDocument();
    expect(deleteAccountBtn).toHaveClass("btn-with-spinner red-btn");
  });

  describe("test profile page btns", () => {
    it("should navigate to donate page when click on donate btn", async () => {
      renderWithProviders(
        <>
          <ProfilePage />
          <LocationDisplay />
        </>,
        {
          preloadedState: { user: userStateMock },
          route: "/profile",
        },
      );

      const location = screen.getByTestId("location");
      const donateBtn = screen.getByTitle("go to donate page btn");

      expect((location.textContent || "").includes("/profile")).toBeTruthy();

      await userEvent.click(donateBtn);

      expect((location.textContent || "").includes("/donate")).toBeTruthy();
    });

    it("should create text field instead of read-only field when edit username button is clicked", async () => {
      const { username } = userStateMock.user!;

      renderWithProviders(
        <>
          <ProfilePage />
        </>,
        {
          preloadedState: { user: userStateMock },
          route: "/profile",
        },
      );

      const editBtn = screen.getByTitle("edit your username");
      const usernameCellValue = screen.getByText(`#${username}`);

      expect(editBtn).toHaveTextContent("edit");
      expect(usernameCellValue).toBeInTheDocument();
      expect(usernameCellValue).toHaveClass("profile-cell-content");

      await userEvent.click(editBtn);

      const input = screen.getByRole("textbox");
      const cancelBtn = screen.getByText("cancel");
      const saveChangesBtn = screen.getByText("save changes");

      expect(saveChangesBtn).toBeInTheDocument();
      expect(saveChangesBtn).toBeDisabled();
      expect(input).toBeInTheDocument();
      expect((input as HTMLInputElement).value).toBe(username);
      expect(cancelBtn).toBeInTheDocument();
      expect(cancelBtn).toHaveClass("red-btn");
    });

    it("should cancel the edit mode when cancel button is clicked", async () => {
      const { username } = userStateMock.user!;

      renderWithProviders(
        <>
          <ProfilePage />
        </>,
        {
          preloadedState: { user: userStateMock },
          route: "/profile",
        },
      );

      const toggleEditBtn = screen.getByTitle("edit your username");
      const usernameCellValue = screen.getByText(`#${username}`);

      expect(usernameCellValue).toBeInTheDocument();
      expect(usernameCellValue).toHaveClass("profile-cell-content");
      expect(toggleEditBtn).toHaveTextContent("edit");
      expect(toggleEditBtn).toHaveClass("btn");

      await userEvent.click(toggleEditBtn);
      expect(toggleEditBtn).toHaveTextContent("cancel");
      expect(toggleEditBtn).toHaveClass("red-btn");

      const input = screen.getByRole("textbox");
      const saveChangesBtn = screen.getByText("save changes");

      expect(saveChangesBtn).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect((input as HTMLInputElement).value).toBe(username);

      await userEvent.click(toggleEditBtn);

      expect(usernameCellValue).toBeInTheDocument();
      expect(toggleEditBtn).toHaveTextContent("edit");
      expect(toggleEditBtn).toHaveClass("btn");
      expect(saveChangesBtn).not.toBeInTheDocument();
      expect(input).not.toBeInTheDocument();
    });

    it("should active save changes btn when type non-equal values in input", async () => {
      const { username } = userStateMock.user!;

      renderWithProviders(
        <>
          <ProfilePage />
        </>,
        {
          preloadedState: { user: userStateMock },
          route: "/profile",
        },
      );

      const toggleEditBtn = screen.getByTitle("edit your username");

      await userEvent.click(toggleEditBtn);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      const saveChangesBtn = screen.getByText("save changes");

      expect(saveChangesBtn).toBeInTheDocument();
      expect(saveChangesBtn).toBeDisabled();

      expect(input).toBeInTheDocument();
      expect(input.value).toBe(username);

      await userEvent.clear(input);
      expect(saveChangesBtn).toBeDisabled();

      await userEvent.type(input, "new username");

      expect(input.value).toBe("new username");
      expect(saveChangesBtn).toBeEnabled();
    });

    it.each([
      { key: "username", value: "new_username" },
      { key: "email", value: "new_email" },
      { key: "address", value: "new_address" },
    ])(
      "should submit new $key changes when save changes btn is clicked with non-equal values in input",
      async ({ key: keyName, value }) => {
        // const { username } = userStateMock.user!;
        const oldKey =
          userStateMock.user![keyName as keyof typeof userStateMock.user] ||
          ("" as string);

        renderWithProviders(
          <>
            <ProfilePage />
            <TopMessage />
          </>,
          {
            preloadedState: { user: userStateMock },
            route: "/profile",
          },
        );

        const toggleEditBtn = screen.getByTitle(`edit your ${keyName}`);

        await userEvent.click(toggleEditBtn);

        const input = screen.getByRole("textbox") as HTMLInputElement;
        const saveChangesBtn = screen.getByText("save changes");

        expect(saveChangesBtn).toBeInTheDocument();
        expect(saveChangesBtn).toBeDisabled();

        expect(input).toBeInTheDocument();

        await userEvent.type(input, value);

        expect(input.value).toBe(oldKey + value);
        expect(saveChangesBtn).toBeEnabled();

        await userEvent.click(saveChangesBtn);

        expect(screen.queryByText("save changes")).not.toBeInTheDocument();

        const keyCellValue = await screen.findByText(
          `${keyName === "username" ? "#" : ""}${oldKey}${value}`,
        );
        const topMsg = await screen.findByText(
          `${keyName} updated successfully`,
        );

        expect(saveChangesBtn).not.toBeInTheDocument();
        expect(input).not.toBeInTheDocument();

        expect(topMsg).toBeInTheDocument();
        expect(topMsg).toHaveClass("green");

        expect(keyCellValue).toBeInTheDocument();
        expect(keyCellValue).toHaveClass("profile-cell-content");
      },
    );

    it("should show empty input address edit field even active the edit mode for this field more than one time", async () => {
      const { username } = userStateMock.user!;

      renderWithProviders(
        <>
          <ProfilePage />
        </>,
        {
          preloadedState: { user: userStateMock }, // this mock user doesn'h have an address property
          route: "/profile",
        },
      );

      const toggleEditBtn = screen.getByTitle("edit your address");
      const addressCellValue = screen.getByText(`#${username}`);

      expect(addressCellValue).toBeInTheDocument();
      expect(addressCellValue).toHaveClass("profile-cell-content");
      expect(toggleEditBtn).toHaveTextContent("edit");
      expect(toggleEditBtn).toHaveClass("btn");

      await userEvent.click(toggleEditBtn);
      expect(toggleEditBtn).toHaveTextContent("cancel");
      expect(toggleEditBtn).toHaveClass("red-btn");

      let input = screen.getByRole("textbox") as HTMLInputElement;
      const saveChangesBtn = screen.getByText("save changes");

      expect(saveChangesBtn).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(input.value).toBe("");

      await userEvent.click(toggleEditBtn);

      expect(addressCellValue).toBeInTheDocument();
      expect(toggleEditBtn).toHaveTextContent("edit");
      expect(toggleEditBtn).toHaveClass("btn");
      expect(saveChangesBtn).not.toBeInTheDocument();
      expect(input).not.toBeInTheDocument();

      await userEvent.click(toggleEditBtn);
      input = screen.getByRole("textbox") as HTMLInputElement;

      expect(input).toBeInTheDocument();
      expect(input.value).toBe("");
    });
  });

  describe("test danger zone in profile page", () => {
    it("should show delete user account modal", async () => {
      renderWithProviders(
        <>
          <ProfilePage />
        </>,
        {
          preloadedState: { user: userStateMock },
          route: "/profile",
        },
      );

      const deleteAccountBtn = screen.getByRole("button", {
        name: /Delete your account/i,
      });

      await userEvent.click(deleteAccountBtn);

      const closeModalBtn = await screen.findByTitle("close app modal btn");
      const sureMsg = screen.getByText(/are you sure you want to/i);
      const typeofUser = screen.getByTestId("typeof-user");
      const yesBtn = screen.getByRole("button", { name: /yes/i });
      const noBtn = screen.getByRole("button", { name: /no/i });

      expect(typeofUser).toBeInTheDocument();
      expect(typeofUser).toHaveTextContent("delete your account");

      expect(closeModalBtn).toBeInTheDocument();
      expect(sureMsg).toBeInTheDocument();
      expect(yesBtn).toBeInTheDocument();
      expect(noBtn).toBeInTheDocument();
    });

    it.each([{ name: "cancel" }, { name: "close" }])(
      "should close modal when click on $name btn",
      async ({ name }) => {
        renderWithProviders(
          <>
            <ProfilePage />
          </>,
          {
            preloadedState: { user: userStateMock },
            route: "/profile",
          },
        );

        const deleteAccountBtn = screen.getByRole("button", {
          name: /Delete your account/i,
        });
        let sureModal = screen.queryByTestId("app-modal");
        let sureModalOverlay = screen.queryByTestId("app-modal-overlay");

        expect(sureModal).not.toBeInTheDocument();
        expect(sureModalOverlay).not.toBeInTheDocument();

        await userEvent.click(deleteAccountBtn);

        sureModal = await screen.findByTestId("app-modal");
        sureModalOverlay = await screen.findByTestId("app-modal-overlay");

        expect(sureModal).toBeInTheDocument();
        expect(sureModalOverlay).toBeInTheDocument();

        const closeModalBtn = await screen.findByTitle(
          name === "cancel" ? name : "close app modal btn",
        );
        expect(closeModalBtn).toHaveTextContent(
          name === "cancel" ? /No/i : "X",
        );
        await userEvent.click(closeModalBtn);

        await waitFor(() => {
          expect(sureModal).not.toBeInTheDocument();
          expect(sureModalOverlay).not.toBeInTheDocument();
        });
      },
    );

    it("should delete user account when click on Yes btn", async () => {
      renderWithProviders(
        <>
          <ProfilePage />
          <LocationDisplay />
        </>,
        {
          preloadedState: { user: userStateMock },
          route: "/profile",
        },
      );

      const location = screen.getByTestId("location");
      const deleteAccountBtn = screen.getByRole("button", {
        name: /Delete your account/i,
      });

      await userEvent.click(deleteAccountBtn);

      const yesBtn = screen.getByRole("button", { name: /yes/i });
      const closeModalBtn = await screen.findByTitle("close app modal btn");
      const noBtn = screen.getByRole("button", { name: /no/i });

      expect((location.textContent || "").includes("/profile")).toBeTruthy();
      await userEvent.click(yesBtn);

      expect(deleteAccountBtn).toBeDisabled();
      expect(closeModalBtn).toBeDisabled();
      expect(noBtn).toBeDisabled();
      expect(yesBtn).toBeDisabled();

      const spinner = await screen.findAllByTestId("empty-spinner-holder");
      expect(spinner).toHaveLength(2);

      await waitFor(() => {
        expect(
          (screen.getByTestId("location").textContent || "").includes("/login"),
        ).toBeTruthy();
      });

      expect(deleteAccountBtn).not.toBeInTheDocument();
      expect(closeModalBtn).not.toBeInTheDocument();
      expect(noBtn).not.toBeInTheDocument();
      expect(yesBtn).not.toBeInTheDocument();
    });
  });
});
