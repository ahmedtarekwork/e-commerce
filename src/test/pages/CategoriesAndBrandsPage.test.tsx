import CategoriesAndBrandsPage from "../../pages/e-commerce/CategoriesAndBrandsPage";

import { LocationDisplay } from "../utils/location";
import { renderWithProviders } from "../utils/renderWithProviders";

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("test categories page", () => {
  it("should display categories after loading", async () => {
    renderWithProviders(
      <>
        <CategoriesAndBrandsPage type="categories" />
        <LocationDisplay />
      </>,
      {
        route: "/categories",
      }
    );

    expect(screen.getByTestId("location")).toHaveTextContent("/categories");
    expect(screen.getByText("Loading categories...")).toBeInTheDocument();

    expect(await screen.findAllByRole("listitem")).toHaveLength(2);
    expect(await screen.findByText("Available categories")).toBeInTheDocument();

    expect(await screen.findByText("Electronics")).toBeInTheDocument(); // based on fake data in msw handler
    expect(
      await screen.findByTestId("img-for-category-1", {})
    ).toBeInTheDocument(); // based on fake data in msw handler
    expect(await screen.findByTestId("img-for-category-1", {})).toHaveAttribute(
      "src",
      "https://picsum.photos/200/300"
    ); // based on fake data in msw handler

    expect(await screen.findByText("Clothes")).toBeInTheDocument(); // based on fake data in msw handler

    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();

    const secindCategoryBtn = await screen.findByTestId(
      "main-btn-for-category-2"
    );
    await userEvent.click(secindCategoryBtn);

    expect(await screen.findByTestId("location")).toHaveTextContent(
      "/products?category=Clothes"
    );
  });

  it("should display add new categories in dashboard mode", async () => {
    renderWithProviders(
      <>
        <CategoriesAndBrandsPage type="categories" />
        <LocationDisplay />
      </>,
      {
        route: "/dashboard/categories",
      }
    );

    const addNewCategoryBtn = await screen.findByText("+ Add New categories");
    expect(addNewCategoryBtn).toBeInTheDocument();

    await userEvent.click(addNewCategoryBtn);

    expect(await screen.findByTestId("location")).toHaveTextContent(
      "/dashboard/categoriesForm"
    );
  });
});

describe("test brands page", () => {
  it("should display brands after loading", async () => {
    renderWithProviders(
      <>
        <CategoriesAndBrandsPage type="brands" />
        <LocationDisplay />
      </>,
      {
        route: "/brands",
      }
    );

    expect(screen.getByTestId("location")).toHaveTextContent("/brands");
    expect(screen.getByText("Loading brands...")).toBeInTheDocument();

    expect(await screen.findAllByRole("listitem")).toHaveLength(2);
    expect(await screen.findByText("Available brands")).toBeInTheDocument();

    expect(await screen.findByText("Dell")).toBeInTheDocument(); // based on fake data in msw handler
    expect(
      await screen.findByTestId("img-for-brand-1", {})
    ).toBeInTheDocument(); // based on fake data in msw handler
    expect(await screen.findByTestId("img-for-brand-1", {})).toHaveAttribute(
      "src",
      "https://picsum.photos/200/300"
    ); // based on fake data in msw handler

    expect(await screen.findByText("HP")).toBeInTheDocument(); // based on fake data in msw handler

    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();

    const secindCategoryBtn = await screen.findByTestId("main-btn-for-brand-2");
    await userEvent.click(secindCategoryBtn);

    expect(await screen.findByTestId("location")).toHaveTextContent(
      "/products?brand=HP"
    );
  });

  it("should display add new brands in dashboard mode", async () => {
    renderWithProviders(
      <>
        <CategoriesAndBrandsPage type="brands" />
        <LocationDisplay />
      </>,
      {
        route: "/dashboard/brands",
      }
    );

    const addNewCategoryBtn = await screen.findByText("+ Add New brands");
    expect(addNewCategoryBtn).toBeInTheDocument();

    await userEvent.click(addNewCategoryBtn);

    expect(await screen.findByTestId("location")).toHaveTextContent(
      "/dashboard/brandsForm"
    );
  });
});
