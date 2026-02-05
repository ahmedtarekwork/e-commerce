import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { LocationDisplay } from "../utils/location";
import { renderWithProviders } from "../utils/renderWithProviders";

import CategoryAndBrandCard from "../../components/categoryAndBrandCard/CategoryAndBrandCard";

describe("test CategoryAndBrandCard component", () => {
  describe("test category card", () => {
    const mockCategory = {
      _id: "1",
      image: {
        public_id: "1",
        secure_url: "https://picsum.photos/200/300",
        _id: "1",
        order: 1,
      },
      name: "Electronics",
      productsCount: 0,
      products: [],
    };

    it("should render category card correctly in non-dashboard mode", () => {
      const refetchCategories = vitest.fn();

      renderWithProviders(
        <CategoryAndBrandCard
          isDashboard={false}
          type="categories"
          refetchModels={refetchCategories}
          modelData={mockCategory}
        />
      );

      const mainBtn = screen.getByTestId("main-btn-for-category-1");
      const img = screen.getByTestId("img-for-category-1");
      const title = screen.getByText("Electronics");
      const deleteBtn = screen.queryByText("delete");
      const editBtn = screen.queryByText("edit");

      expect(deleteBtn).not.toBeInTheDocument();
      expect(editBtn).not.toBeInTheDocument();

      expect(title).toBeInTheDocument();

      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "https://picsum.photos/200/300");
      expect(img).toHaveAttribute("alt", "Electronics category image");

      expect(mainBtn).toBeInTheDocument();
      expect(mainBtn).toHaveClass("category-or-brand-card");

      expect(refetchCategories).not.toHaveBeenCalled();
    });

    it("should render category card correctly in dashboard mode", () => {
      const refetchCategories = vitest.fn();

      renderWithProviders(
        <CategoryAndBrandCard
          isDashboard
          type="categories"
          refetchModels={refetchCategories}
          modelData={mockCategory}
        />
      );

      const mainBtn = screen.getByTestId("main-btn-for-category-1");
      const img = screen.getByTestId("img-for-category-1");
      const title = screen.getByText("Electronics");
      const deleteBtn = screen.getByText("delete");
      const editBtn = screen.getByText("edit");

      expect(deleteBtn).toBeInTheDocument();
      expect(editBtn).toBeInTheDocument();

      expect(title).toBeInTheDocument();

      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "https://picsum.photos/200/300");
      expect(img).toHaveAttribute("alt", "Electronics category image");

      expect(mainBtn).toBeInTheDocument();
      expect(mainBtn).toHaveClass("category-or-brand-card");

      expect(refetchCategories).not.toHaveBeenCalled();
    });

    describe("click on category card btns correctly in mode", () => {
      it("click on delete btn", async () => {
        const refetchCategories = vitest.fn();

        renderWithProviders(
          <CategoryAndBrandCard
            isDashboard
            type="categories"
            refetchModels={refetchCategories}
            modelData={mockCategory}
          />
        );

        const deleteBtn = screen.getByText("delete");

        expect(refetchCategories).not.toHaveBeenCalled();
        await userEvent.click(deleteBtn);

        const yesBtn = screen.getByText(/yes/i);
        expect(yesBtn).toBeInTheDocument();

        await userEvent.click(yesBtn);

        waitFor(() => {
          expect(refetchCategories).toHaveBeenCalled();
          expect(
            screen.queryByTestId("main-btn-for-category-1")
          ).not.toBeInTheDocument();
        });
      });

      it("click on edit btn", async () => {
        renderWithProviders(
          <>
            <CategoryAndBrandCard
              isDashboard
              type="categories"
              refetchModels={vitest.fn()}
              modelData={mockCategory}
            />
            <LocationDisplay />
          </>,
          { route: "/dashboard/categories" }
        );

        const editBtn = screen.getByText("edit");
        const location = screen.getByTestId("location");

        expect(new URL(location.textContent || "").pathname).toBe(
          "/dashboard/categories"
        );

        await userEvent.click(editBtn);

        const newLocation = new URL(location.textContent || "");
        expect(newLocation.pathname + "?" + newLocation.searchParams).toBe(
          "/dashboard/categoriesForm?id=1"
        );
      });

      it("click on category card itself", async () => {
        renderWithProviders(
          <>
            <CategoryAndBrandCard
              isDashboard
              type="categories"
              refetchModels={vitest.fn()}
              modelData={mockCategory}
            />
            <LocationDisplay />
          </>,
          { route: "/dashboard/categories" }
        );

        const mainBtn = screen.getByTestId("main-btn-for-category-1");
        const location = screen.getByTestId("location");

        expect(new URL(location.textContent || "").pathname).toBe(
          "/dashboard/categories"
        );

        await userEvent.click(mainBtn);

        const newLocation = new URL(location.textContent || "");
        expect(newLocation.pathname + "?" + newLocation.searchParams).toBe(
          "/dashboard/products?category=Electronics"
        );
      });
    });
  });

  describe("test brand card", () => {
    const mockBrand = {
      _id: "1",
      image: {
        public_id: "1",
        secure_url: "https://picsum.photos/200/300",
        _id: "1",
        order: 1,
      },
      name: "HP",
      productsCount: 0,
      products: [],
    };

    it("should render brand card correctly in non-dashboard mode", () => {
      const refetchCategories = vitest.fn();

      renderWithProviders(
        <CategoryAndBrandCard
          isDashboard={false}
          type="brands"
          refetchModels={refetchCategories}
          modelData={mockBrand}
        />
      );

      const mainBtn = screen.getByTestId("main-btn-for-brand-1");
      const img = screen.getByTestId("img-for-brand-1");
      const title = screen.getByText("HP");
      const deleteBtn = screen.queryByText("delete");
      const editBtn = screen.queryByText("edit");

      expect(deleteBtn).not.toBeInTheDocument();
      expect(editBtn).not.toBeInTheDocument();

      expect(title).toBeInTheDocument();

      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "https://picsum.photos/200/300");
      expect(img).toHaveAttribute("alt", "HP brand image");

      expect(mainBtn).toBeInTheDocument();
      expect(mainBtn).toHaveClass("category-or-brand-card");

      expect(refetchCategories).not.toHaveBeenCalled();
    });

    it("should render brand card correctly in dashboard mode", () => {
      const refetchCategories = vitest.fn();

      renderWithProviders(
        <CategoryAndBrandCard
          isDashboard
          type="brands"
          refetchModels={refetchCategories}
          modelData={mockBrand}
        />
      );

      const mainBtn = screen.getByTestId("main-btn-for-brand-1");
      const img = screen.getByTestId("img-for-brand-1");
      const title = screen.getByText("HP");
      const deleteBtn = screen.getByText("delete");
      const editBtn = screen.getByText("edit");

      expect(deleteBtn).toBeInTheDocument();
      expect(editBtn).toBeInTheDocument();

      expect(title).toBeInTheDocument();

      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "https://picsum.photos/200/300");
      expect(img).toHaveAttribute("alt", "HP brand image");

      expect(mainBtn).toBeInTheDocument();
      expect(mainBtn).toHaveClass("category-or-brand-card");

      expect(refetchCategories).not.toHaveBeenCalled();
    });

    describe("click on brand card btns correctly in mode", () => {
      it("click on delete btn", async () => {
        const refetchCategories = vitest.fn();

        renderWithProviders(
          <CategoryAndBrandCard
            isDashboard
            type="brands"
            refetchModels={refetchCategories}
            modelData={mockBrand}
          />
        );

        const deleteBtn = screen.getByText("delete");

        expect(refetchCategories).not.toHaveBeenCalled();
        await userEvent.click(deleteBtn);

        const yesBtn = screen.getByText(/yes/i);
        expect(yesBtn).toBeInTheDocument();

        await userEvent.click(yesBtn);

        waitFor(() => {
          expect(refetchCategories).toHaveBeenCalled();
          expect(
            screen.queryByTestId("main-btn-for-brand-1")
          ).not.toBeInTheDocument();
        });
      });

      it("click on edit btn", async () => {
        renderWithProviders(
          <>
            <CategoryAndBrandCard
              isDashboard
              type="brands"
              refetchModels={vitest.fn()}
              modelData={mockBrand}
            />
            <LocationDisplay />
          </>,
          { route: "/dashboard/brands" }
        );

        const editBtn = screen.getByText("edit");
        const location = screen.getByTestId("location");

        expect(new URL(location.textContent || "").pathname).toBe(
          "/dashboard/brands"
        );

        await userEvent.click(editBtn);

        const newLocation = new URL(location.textContent || "");
        expect(newLocation.pathname + "?" + newLocation.searchParams).toBe(
          "/dashboard/brandsForm?id=1"
        );
      });

      it("click on category card itself", async () => {
        renderWithProviders(
          <>
            <CategoryAndBrandCard
              isDashboard
              type="brands"
              refetchModels={vitest.fn()}
              modelData={mockBrand}
            />
            <LocationDisplay />
          </>,
          { route: "/dashboard/brands" }
        );

        const mainBtn = screen.getByTestId("main-btn-for-brand-1");
        const location = screen.getByTestId("location");

        expect(new URL(location.textContent || "").pathname).toBe(
          "/dashboard/brands"
        );

        await userEvent.click(mainBtn);

        const newLocation = new URL(location.textContent || "");
        expect(newLocation.pathname + "?" + newLocation.searchParams).toBe(
          "/dashboard/products?brand=HP"
        );
      });
    });
  });
});
