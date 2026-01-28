// RTL
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import CategoriesAndBrandsConfigPage from "../../pages/dashboard/categoriesAndBrandsConfigPage/CategoriesAndBrandsConfigPage";

// statics
import {
  brands,
  categories,
} from "../mocks/handlers/categoriesAndBrandsHandlers/static";

// utils
import { LocationDisplay } from "../utils/location";
import { renderWithProviders } from "../utils/renderWithProviders";

describe("CategoriesAndBrandsConfigPage", () => {
  describe("test categories", () => {
    const mockCategory = categories[0];
    const mockFile = new File(["dummy content"], "test-image.png", {
      type: "image/png",
    });

    it("should navigate to categories page inside dashboard when click on back btn", async () => {
      renderWithProviders(
        <>
          <CategoriesAndBrandsConfigPage type="categories" />
          <LocationDisplay />
        </>,
        {
          route: "/dashboard/categoriesForm",
        }
      );

      const location = screen.getByTestId("location");
      const backBtn = screen.getByText("back to categories");

      expect(new URL(location.textContent).pathname).toBe(
        "/dashboard/categoriesForm"
      );

      await userEvent.click(backBtn);

      expect(new URL(location.textContent).pathname).toBe(
        "/dashboard/categories"
      );
    });

    describe("add mode", () => {
      it("should render page in 'add' mode normally", () => {
        renderWithProviders(
          <CategoriesAndBrandsConfigPage type="categories" />
        );

        const backBtn = screen.getByText("back to categories");
        const nameInput = screen.getByPlaceholderText(/category name/i);
        const imageInput = screen.getByText(/choose image for this category/i);
        const resetBtn = screen.getByRole("button", { name: /reset/i });
        const submitBtn = screen.getByRole("button", {
          name: /submit category/i,
        });

        expect(backBtn).toBeInTheDocument();
        expect(nameInput).toBeInTheDocument();
        expect(imageInput).toBeInTheDocument();

        expect(resetBtn).toBeInTheDocument();
        expect(resetBtn).toHaveClass("red-btn");
        expect(resetBtn).toBeEnabled();

        expect(submitBtn).toBeInTheDocument();
        expect(submitBtn).toHaveClass("btn");
        expect(submitBtn).toBeDisabled();
      });

      it("should disable submit btn when have name but no image", async () => {
        renderWithProviders(
          <CategoriesAndBrandsConfigPage type="categories" />
        );

        const nameInput = screen.getByPlaceholderText(/category name/i);
        const resetBtn = screen.getByRole("button", {
          name: /reset/i,
        });
        const submitBtn = screen.getByRole("button", {
          name: /submit category/i,
        });

        await userEvent.type(nameInput, "New Category");

        expect(nameInput).toHaveValue("New Category");
        expect(submitBtn).toBeDisabled();
        expect(resetBtn).toBeEnabled();
      });

      it("should disable submit btn when have image but no name", async () => {
        renderWithProviders(
          <CategoriesAndBrandsConfigPage type="categories" />
        );

        const resetBtn = screen.getByRole("button", {
          name: /reset/i,
        });
        const submitBtn = screen.getByRole("button", {
          name: /submit category/i,
        });
        const fileInput = screen.getByLabelText(
          "choose image for this category"
        ) as HTMLInputElement;

        expect(submitBtn).toBeDisabled();
        expect(resetBtn).toBeEnabled();

        await userEvent.upload(fileInput, mockFile);

        expect(submitBtn).toBeDisabled();
        expect(resetBtn).toBeEnabled();
      });

      it("should enable submit btn when have image and name", async () => {
        renderWithProviders(
          <CategoriesAndBrandsConfigPage type="categories" />
        );

        const resetBtn = screen.getByRole("button", {
          name: /reset/i,
        });
        const submitBtn = screen.getByRole("button", {
          name: /submit category/i,
        });
        const fileInput = screen.getByLabelText(
          "choose image for this category"
        ) as HTMLInputElement;
        const nameInput = screen.getByPlaceholderText(/category name/i);

        expect(submitBtn).toBeDisabled();
        expect(resetBtn).toBeEnabled();

        await userEvent.type(nameInput, "New Category");
        await userEvent.upload(fileInput, mockFile);

        expect(submitBtn).toBeEnabled();
        expect(resetBtn).toBeEnabled();
      });

      it("should submit add new category form", async () => {
        renderWithProviders(
          <CategoriesAndBrandsConfigPage type="categories" />
        );

        const resetBtn = screen.getByRole("button", {
          name: /reset/i,
        });
        const submitBtn = screen.getByRole("button", {
          name: /submit category/i,
        });
        const fileInput = screen.getByLabelText(
          "choose image for this category"
        ) as HTMLInputElement;
        const nameInput = screen.getByPlaceholderText(/category name/i);

        expect(submitBtn).toBeDisabled();
        expect(resetBtn).toBeEnabled();

        await userEvent.type(nameInput, "New Category");

        expect(fileInput.value).toBe("");
        await userEvent.upload(fileInput, mockFile);
        expect(fileInput.value).not.toBe("");

        expect(submitBtn).toBeEnabled();

        await userEvent.click(submitBtn);

        await waitFor(async () => {
          expect(submitBtn).toBeDisabled();
          expect(resetBtn).toBeDisabled();
        });

        await waitFor(() => {
          expect(nameInput).toHaveValue("");
          expect(fileInput.value).toBe("");
          expect(submitBtn).toBeDisabled();
          expect(resetBtn).toBeEnabled();
        });
      });

      it("should reset form when click on reset btn", async () => {
        renderWithProviders(
          <CategoriesAndBrandsConfigPage type="categories" />
        );

        const nameInput = screen.getByPlaceholderText(/category name/i);
        const imageInput = screen.getByLabelText(
          /choose image for this category/i
        ) as HTMLInputElement;
        const resetBtn = screen.getByRole("button", { name: /reset/i });
        const submitBtn = screen.getByRole("button", {
          name: /submit category/i,
        });

        await userEvent.type(nameInput, "New Category");
        await userEvent.upload(imageInput, mockFile);

        expect(nameInput).toHaveValue("New Category");
        expect(imageInput.files?.length).toBeGreaterThan(0);
        expect(submitBtn).toBeEnabled();

        await userEvent.click(resetBtn);

        expect(nameInput).toHaveValue("");
        expect(imageInput.files?.length).toBe(0);
        expect(submitBtn).toBeDisabled();
      });
    });

    describe("edit mode", () => {
      it("should render page in 'edit' mode normally", async () => {
        renderWithProviders(
          <CategoriesAndBrandsConfigPage type="categories" />,
          { route: `/dashboard/categoriesForm?id=${mockCategory._id}` }
        );

        const nameInput = screen.getByPlaceholderText(
          /category name/i
        ) as HTMLInputElement;

        const resetBtn = screen.getByRole("button", { name: /reset/i });
        const updateBtn = screen.getByRole("button", {
          name: /update category/i,
        });

        expect(updateBtn).toBeInTheDocument();

        await waitFor(() => {
          expect(screen.getByRole("img")).toHaveAttribute(
            "src",
            mockCategory.image.secure_url
          );
          expect(nameInput).toHaveValue(mockCategory.name);

          expect(screen.getByRole("img")).toBeInTheDocument();

          expect(updateBtn).toBeDisabled();
          expect(resetBtn).toBeEnabled();
        });
      });

      it("should enable update btn when have different names and disable it if no value in name input", async () => {
        renderWithProviders(
          <CategoriesAndBrandsConfigPage type="categories" />,
          { route: `/dashboard/categoriesForm?id=${mockCategory._id}` }
        );

        await waitFor(async () => {
          const nameInput = screen.getByPlaceholderText(
            /category name/i
          ) as HTMLInputElement;
          const updateBtn = screen.getByRole("button", {
            name: /update category/i,
          });

          expect(nameInput).toHaveValue(mockCategory.name);
          expect(updateBtn).toBeDisabled();
        }).then(async () => {
          const nameInput = screen.getByPlaceholderText(
            /category name/i
          ) as HTMLInputElement;
          const updateBtn = screen.getByRole("button", {
            name: /update category/i,
          });

          await userEvent.clear(nameInput);

          expect(nameInput).toHaveValue("");

          expect(updateBtn).toBeDisabled();
          await userEvent.type(nameInput, "update electronics");
          expect(updateBtn).toBeEnabled();
        });
      });

      it("should enable update btn when have new image selected but name is the same", async () => {
        renderWithProviders(
          <CategoriesAndBrandsConfigPage type="categories" />,
          { route: `/dashboard/categoriesForm?id=${mockCategory._id}` }
        );

        await waitFor(async () => {
          const imgInput = screen.getByLabelText(
            "change image for this category"
          ) as HTMLInputElement;
          const updateBtn = screen.getByRole("button", {
            name: /update category/i,
          });

          expect(updateBtn).toBeDisabled();

          await userEvent.upload(imgInput, mockFile);

          expect(updateBtn).toBeEnabled();
        });
      });

      it("should enable update btn when have new image selected and different name", async () => {
        renderWithProviders(
          <CategoriesAndBrandsConfigPage type="categories" />,
          { route: `/dashboard/categoriesForm?id=${mockCategory._id}` }
        );

        await waitFor(async () => {
          const nameInput = screen.getByPlaceholderText(
            /category name/i
          ) as HTMLInputElement;
          const imgInput = screen.getByLabelText(
            "change image for this category"
          ) as HTMLInputElement;
          const updateBtn = screen.getByRole("button", {
            name: /update category/i,
          });

          expect(updateBtn).toBeDisabled();

          await userEvent.type(nameInput, "new electronics");
          await userEvent.upload(imgInput, mockFile);

          expect(updateBtn).toBeEnabled();
        });
      });

      it("should reset form when click on reset btn", async () => {
        renderWithProviders(
          <CategoriesAndBrandsConfigPage type="categories" />,
          { route: `/dashboard/categoriesForm?id=${mockCategory._id}` }
        );

        await waitFor(async () => {
          const nameInput = screen.getByPlaceholderText(/category name/i);
          const imageInput = screen.getByLabelText(
            /change image for this category/i
          ) as HTMLInputElement;
          const img = screen.getByRole("img");
          const resetBtn = screen.getByRole("button", { name: /reset/i });
          const submitBtn = screen.getByRole("button", {
            name: /update category/i,
          });

          await userEvent.clear(nameInput);
          await userEvent.type(nameInput, "update Category");
          await userEvent.upload(imageInput, mockFile);

          expect(nameInput).toHaveValue("update Category");
          expect(imageInput.files?.length).toBeGreaterThan(0);
          expect(submitBtn).toBeEnabled();

          await userEvent.click(resetBtn);

          expect(img).toHaveAttribute("src", mockCategory.image.secure_url);
          expect(nameInput).toHaveValue(mockCategory.name);
          expect(imageInput.files?.length).toBe(0);
          expect(submitBtn).toBeDisabled();
        });
      });

      it("should submit edit form when click on submit btn", async () => {
        renderWithProviders(
          <>
            <CategoriesAndBrandsConfigPage type="categories" />
            <LocationDisplay />
          </>,
          { route: `/dashboard/categoriesForm?id=${mockCategory._id}` }
        );

        const location = screen.getByTestId("location");
        const nameInput = screen.getByPlaceholderText(/category name/i);

        const submitBtn = screen.getByRole("button", {
          name: /update category/i,
        });
        const resetBtn = screen.getByRole("button", { name: /reset/i });

        await waitFor(() => {
          expect(nameInput).toHaveValue(mockCategory.name);
          expect(submitBtn).toBeDisabled();
        });

        expect(location).toHaveTextContent(
          `/dashboard/categoriesForm?id=${mockCategory._id}`
        );

        const imageInput = screen.getByLabelText(
          /change image for this category/i
        ) as HTMLInputElement;

        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, "update Category");
        await userEvent.upload(imageInput, mockFile);

        expect(nameInput).toHaveValue("update Category");
        expect(imageInput.files?.length).toBeGreaterThan(0);
        expect(submitBtn).toBeEnabled();

        await userEvent.click(submitBtn);

        expect(resetBtn).toBeDisabled();
        expect(submitBtn).toBeDisabled();

        await waitFor(() => {
          expect(new URL(location.textContent).pathname).toBe(
            `/dashboard/categories`
          );
        });
      });
    });
  });

  describe("test brands", () => {
    const mockBrand = brands[0];
    const mockFile = new File(["dummy content"], "test-image.png", {
      type: "image/png",
    });

    it("should navigate to brands page inside dashboard when click on back btn", async () => {
      renderWithProviders(
        <>
          <CategoriesAndBrandsConfigPage type="brands" />
          <LocationDisplay />
        </>,
        {
          route: "/dashboard/brandsForm",
        }
      );

      const location = screen.getByTestId("location");
      const backBtn = screen.getByText("back to brands");

      expect(new URL(location.textContent).pathname).toBe(
        "/dashboard/brandsForm"
      );

      await userEvent.click(backBtn);

      expect(new URL(location.textContent).pathname).toBe("/dashboard/brands");
    });

    describe("add mode", () => {
      it("should render page in 'add' mode normally", () => {
        renderWithProviders(<CategoriesAndBrandsConfigPage type="brands" />);

        const backBtn = screen.getByText("back to brands");
        const nameInput = screen.getByPlaceholderText(/brand name/i);
        const imageInput = screen.getByText(/choose image for this brand/i);
        const resetBtn = screen.getByRole("button", { name: /reset/i });
        const submitBtn = screen.getByRole("button", {
          name: /submit brand/i,
        });

        expect(backBtn).toBeInTheDocument();
        expect(nameInput).toBeInTheDocument();
        expect(imageInput).toBeInTheDocument();

        expect(resetBtn).toBeInTheDocument();
        expect(resetBtn).toHaveClass("red-btn");
        expect(resetBtn).toBeEnabled();

        expect(submitBtn).toBeInTheDocument();
        expect(submitBtn).toHaveClass("btn");
        expect(submitBtn).toBeDisabled();
      });

      it("should disable submit btn when have name but no image", async () => {
        renderWithProviders(<CategoriesAndBrandsConfigPage type="brands" />);

        const nameInput = screen.getByPlaceholderText(/brand name/i);
        const resetBtn = screen.getByRole("button", {
          name: /reset/i,
        });
        const submitBtn = screen.getByRole("button", {
          name: /submit brand/i,
        });

        await userEvent.type(nameInput, "New Brand");

        expect(nameInput).toHaveValue("New Brand");
        expect(submitBtn).toBeDisabled();
        expect(resetBtn).toBeEnabled();
      });

      it("should disable submit btn when have image but no name", async () => {
        renderWithProviders(<CategoriesAndBrandsConfigPage type="brands" />);

        const resetBtn = screen.getByRole("button", {
          name: /reset/i,
        });
        const submitBtn = screen.getByRole("button", {
          name: /submit brand/i,
        });
        const fileInput = screen.getByLabelText(
          "choose image for this brand"
        ) as HTMLInputElement;

        expect(submitBtn).toBeDisabled();
        expect(resetBtn).toBeEnabled();

        await userEvent.upload(fileInput, mockFile);

        expect(submitBtn).toBeDisabled();
        expect(resetBtn).toBeEnabled();
      });

      it("should enable submit btn when have image and name", async () => {
        renderWithProviders(<CategoriesAndBrandsConfigPage type="brands" />);

        const resetBtn = screen.getByRole("button", {
          name: /reset/i,
        });
        const submitBtn = screen.getByRole("button", {
          name: /submit brand/i,
        });
        const fileInput = screen.getByLabelText(
          "choose image for this brand"
        ) as HTMLInputElement;
        const nameInput = screen.getByPlaceholderText(/brand name/i);

        expect(submitBtn).toBeDisabled();
        expect(resetBtn).toBeEnabled();

        await userEvent.type(nameInput, "New Brand");
        await userEvent.upload(fileInput, mockFile);

        expect(submitBtn).toBeEnabled();
        expect(resetBtn).toBeEnabled();
      });

      it("should submit add new brand form", async () => {
        renderWithProviders(<CategoriesAndBrandsConfigPage type="brands" />);

        const resetBtn = screen.getByRole("button", {
          name: /reset/i,
        });
        const submitBtn = screen.getByRole("button", {
          name: /submit brand/i,
        });
        const fileInput = screen.getByLabelText(
          "choose image for this brand"
        ) as HTMLInputElement;
        const nameInput = screen.getByPlaceholderText(/brand name/i);

        expect(submitBtn).toBeDisabled();
        expect(resetBtn).toBeEnabled();

        await userEvent.type(nameInput, "New Brand");

        expect(fileInput.value).toBe("");
        await userEvent.upload(fileInput, mockFile);
        expect(fileInput.value).not.toBe("");

        expect(submitBtn).toBeEnabled();

        await userEvent.click(submitBtn);

        await waitFor(async () => {
          expect(submitBtn).toBeDisabled();
          expect(resetBtn).toBeDisabled();
        });

        await waitFor(() => {
          expect(nameInput).toHaveValue("");
          expect(fileInput.value).toBe("");
          expect(submitBtn).toBeDisabled();
          expect(resetBtn).toBeEnabled();
        });
      });

      it("should reset form when click on reset btn", async () => {
        renderWithProviders(<CategoriesAndBrandsConfigPage type="brands" />);

        const nameInput = screen.getByPlaceholderText(/brand name/i);
        const imageInput = screen.getByLabelText(
          /choose image for this brand/i
        ) as HTMLInputElement;
        const resetBtn = screen.getByRole("button", { name: /reset/i });
        const submitBtn = screen.getByRole("button", {
          name: /submit brand/i,
        });

        await userEvent.type(nameInput, "New Brand");
        await userEvent.upload(imageInput, mockFile);

        expect(nameInput).toHaveValue("New Brand");
        expect(imageInput.files?.length).toBeGreaterThan(0);
        expect(submitBtn).toBeEnabled();

        await userEvent.click(resetBtn);

        expect(nameInput).toHaveValue("");
        expect(imageInput.files?.length).toBe(0);
        expect(submitBtn).toBeDisabled();
      });
    });

    describe("edit mode", () => {
      it("should render page in 'edit' mode normally", async () => {
        renderWithProviders(<CategoriesAndBrandsConfigPage type="brands" />, {
          route: `/dashboard/brandsForm?id=${mockBrand._id}`,
        });

        const nameInput = screen.getByPlaceholderText(
          /brand name/i
        ) as HTMLInputElement;

        const resetBtn = screen.getByRole("button", { name: /reset/i });
        const updateBtn = screen.getByRole("button", {
          name: /update brand/i,
        });

        expect(updateBtn).toBeInTheDocument();

        await waitFor(() => {
          expect(screen.getByRole("img")).toHaveAttribute(
            "src",
            mockBrand.image.secure_url
          );
          expect(nameInput).toHaveValue(mockBrand.name);

          expect(screen.getByRole("img")).toBeInTheDocument();

          expect(updateBtn).toBeDisabled();
          expect(resetBtn).toBeEnabled();
        });
      });

      it("should enable update btn when have different names and disable it if no value in name input", async () => {
        renderWithProviders(<CategoriesAndBrandsConfigPage type="brands" />, {
          route: `/dashboard/brandsForm?id=${mockBrand._id}`,
        });

        await waitFor(async () => {
          const nameInput = screen.getByPlaceholderText(
            /brand name/i
          ) as HTMLInputElement;
          const updateBtn = screen.getByRole("button", {
            name: /update brand/i,
          });

          expect(nameInput).toHaveValue(mockBrand.name);
          expect(updateBtn).toBeDisabled();
        }).then(async () => {
          const nameInput = screen.getByPlaceholderText(
            /brand name/i
          ) as HTMLInputElement;
          const updateBtn = screen.getByRole("button", {
            name: /update brand/i,
          });

          await userEvent.clear(nameInput);

          expect(nameInput).toHaveValue("");

          expect(updateBtn).toBeDisabled();
          await userEvent.type(nameInput, "update brand");
          expect(updateBtn).toBeEnabled();
        });
      });

      it("should enable update btn when have new image selected but name is the same", async () => {
        renderWithProviders(<CategoriesAndBrandsConfigPage type="brands" />, {
          route: `/dashboard/brandsForm?id=${mockBrand._id}`,
        });

        await waitFor(async () => {
          const imgInput = screen.getByLabelText(
            "change image for this brand"
          ) as HTMLInputElement;
          const updateBtn = screen.getByRole("button", {
            name: /update brand/i,
          });

          expect(updateBtn).toBeDisabled();

          await userEvent.upload(imgInput, mockFile);

          expect(updateBtn).toBeEnabled();
        });
      });

      it("should enable update btn when have new image selected and different name", async () => {
        renderWithProviders(<CategoriesAndBrandsConfigPage type="brands" />, {
          route: `/dashboard/brandsForm?id=${mockBrand._id}`,
        });

        await waitFor(async () => {
          const nameInput = screen.getByPlaceholderText(
            /brand name/i
          ) as HTMLInputElement;
          const imgInput = screen.getByLabelText(
            "change image for this brand"
          ) as HTMLInputElement;
          const updateBtn = screen.getByRole("button", {
            name: /update brand/i,
          });

          expect(updateBtn).toBeDisabled();

          await userEvent.type(nameInput, "new Brand");
          await userEvent.upload(imgInput, mockFile);

          expect(updateBtn).toBeEnabled();
        });
      });

      it("should reset form when click on reset btn", async () => {
        renderWithProviders(<CategoriesAndBrandsConfigPage type="brands" />, {
          route: `/dashboard/brandsForm?id=${mockBrand._id}`,
        });

        await waitFor(async () => {
          const nameInput = screen.getByPlaceholderText(/brand name/i);
          const imageInput = screen.getByLabelText(
            /change image for this brand/i
          ) as HTMLInputElement;
          const img = screen.getByRole("img");
          const resetBtn = screen.getByRole("button", { name: /reset/i });
          const submitBtn = screen.getByRole("button", {
            name: /update brand/i,
          });

          await userEvent.clear(nameInput);
          await userEvent.type(nameInput, "update brand");
          await userEvent.upload(imageInput, mockFile);

          expect(nameInput).toHaveValue("update brand");
          expect(imageInput.files?.length).toBeGreaterThan(0);
          expect(submitBtn).toBeEnabled();

          await userEvent.click(resetBtn);

          expect(img).toHaveAttribute("src", mockBrand.image.secure_url);
          expect(nameInput).toHaveValue(mockBrand.name);
          expect(imageInput.files?.length).toBe(0);
          expect(submitBtn).toBeDisabled();
        });
      });

      it("should submit edit form when click on submit btn", async () => {
        renderWithProviders(
          <>
            <CategoriesAndBrandsConfigPage type="brands" />
            <LocationDisplay />
          </>,
          { route: `/dashboard/brandsForm?id=${mockBrand._id}` }
        );

        const location = screen.getByTestId("location");
        const nameInput = screen.getByPlaceholderText(/brand name/i);

        const submitBtn = screen.getByRole("button", {
          name: /update brand/i,
        });
        const resetBtn = screen.getByRole("button", { name: /reset/i });

        await waitFor(() => {
          expect(nameInput).toHaveValue(mockBrand.name);
          expect(submitBtn).toBeDisabled();
        });

        expect(location).toHaveTextContent(
          `/dashboard/brandsForm?id=${mockBrand._id}`
        );

        const imageInput = screen.getByLabelText(
          /change image for this brand/i
        ) as HTMLInputElement;

        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, "update Brand");
        await userEvent.upload(imageInput, mockFile);

        expect(nameInput).toHaveValue("update Brand");
        expect(imageInput.files?.length).toBeGreaterThan(0);
        expect(submitBtn).toBeEnabled();

        await userEvent.click(submitBtn);

        expect(resetBtn).toBeDisabled();
        expect(submitBtn).toBeDisabled();

        await waitFor(() => {
          expect(new URL(location.textContent).pathname).toBe(
            `/dashboard/brands`
          );
        });
      });
    });
  });
});
