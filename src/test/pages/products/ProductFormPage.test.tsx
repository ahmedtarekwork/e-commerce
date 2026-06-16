import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// react router dom
import { Route, Routes } from "react-router-dom";

// pages
import ProductFormPage from "../../../pages/products/productsFormPage/ProductFormPage";

// components
import TopMessage from "../../../components/TopMessage";

// utils
import { renderWithProviders } from "../../utils/renderWithProviders";
import { LocationDisplay } from "../../utils/location";

// mocks
import {
  brands,
  categories,
} from "../../mocks/handlers/categoriesAndBrandsHandlers/static";

const file = new File(["test"], "test.png", { type: "image/png" });
const file_2 = new File(["test_2"], "test_2.png", { type: "image/png" });

describe("test Product Form page in normal mode", () => {
  it("should render page normally in normal mode", async () => {
    renderWithProviders(<ProductFormPage />);
    const pageTitle = await screen.findByRole("heading", {
      name: /make a new product/i,
    });

    const backToProductsBtn = await screen.findByText(/back to products/i);

    const productNameInput =
      await screen.findByPlaceholderText(/product name/i);
    const productDescriptionInput =
      await screen.findByPlaceholderText(/description/i);
    const productPriceInput =
      await screen.findByPlaceholderText(/product price/i);
    const productQuantityInput =
      await screen.findByPlaceholderText(/product quantity/i);

    const productCategoryTitle = await screen.findByText(/category :/i);
    const productCategoryDefaultOpt =
      await screen.findByText(/choose category/i);

    const productBrandTitle = await screen.findByText(/brand :/i);
    const productBrandDefaultOpt = await screen.findByText(/choose brand/i);

    const productColorTitle = await screen.findByText(/color:/i);
    const productColorInput = await screen.findByLabelText(/color:/i);
    const maxProductImages = await screen.findByText(/product images: 0 \/ 7/i);
    const addImgsBtn = await screen.findByText("+");
    const submitFormBtn = await screen.findByText(/add product/i);

    expect(pageTitle).toBeInTheDocument();
    expect(backToProductsBtn).toBeInTheDocument();
    expect(productNameInput).toBeInTheDocument();
    expect(productDescriptionInput).toBeInTheDocument();
    expect(productPriceInput).toBeInTheDocument();
    expect(productQuantityInput).toBeInTheDocument();
    expect(productCategoryTitle).toBeInTheDocument();
    expect(productBrandTitle).toBeInTheDocument();
    expect(productColorTitle).toBeInTheDocument();
    expect(productCategoryDefaultOpt).toBeInTheDocument();
    expect(productBrandDefaultOpt).toBeInTheDocument();
    expect(productColorInput).toBeInTheDocument();
    expect(productColorInput).toHaveValue("#000000");
    expect(maxProductImages).toBeInTheDocument();
    expect(addImgsBtn).toBeInTheDocument();
    expect(submitFormBtn).toBeInTheDocument();
  });

  it("should navigate to products page when click on 'back to products' btn", async () => {
    renderWithProviders(
      <>
        <Routes>
          <Route element={<ProductFormPage />} path="/dashboard/new-product" />
          <Route element={<></>} path="/dashboard/products" />
        </Routes>

        <LocationDisplay />
      </>,
      { route: "/dashboard/new-product" },
    );
    const location = await screen.findByTestId("location");
    const backToProductsBtn = await screen.findByText(/back to products/i);

    expect(location).toHaveTextContent(
      "http://localhost/dashboard/new-product",
    );

    await userEvent.click(backToProductsBtn);

    expect(location).toHaveTextContent("http://localhost/dashboard/products");
  });

  it("should fill all product info and submit from successfully", async () => {
    renderWithProviders(
      <>
        <TopMessage />
        <ProductFormPage />
      </>,
    );
    const productNameInput =
      await screen.findByPlaceholderText(/product name/i);
    const productDescriptionInput =
      await screen.findByPlaceholderText(/description/i);
    const productPriceInput =
      await screen.findByPlaceholderText(/product price/i);
    const productQuantityInput =
      await screen.findByPlaceholderText(/product quantity/i);

    const productCategoryDefaultOpt =
      await screen.findByText(/choose category/i);

    const productBrandDefaultOpt = await screen.findByText(/choose brand/i);

    const productColorInput = await screen.findByLabelText(/color:/i);
    const addImgsBtn = await screen.findByText("+");
    const submitFormBtn = await screen.findByText(/add product/i);

    fireEvent.input(productColorInput, { target: { value: "#ff0000" } });

    await userEvent.type(productNameInput, "test product");
    await userEvent.type(productDescriptionInput, "test product description");
    await userEvent.type(productPriceInput, "100");
    await userEvent.type(productQuantityInput, "10");
    await userEvent.upload(addImgsBtn, file);

    await userEvent.click(productCategoryDefaultOpt.parentElement!);
    const categoryOptions = categories.map(({ name }) =>
      screen.getByText(name),
    );
    expect(categoryOptions).toHaveLength(categories.length);
    await userEvent.click(categoryOptions[0]);

    await userEvent.click(productBrandDefaultOpt.parentElement!);
    const brandOptions = brands.map(({ name }) => screen.getByText(name));
    expect(brandOptions).toHaveLength(brands.length);
    await userEvent.click(brandOptions[0]);

    const selectedCategory = await screen.findByText(categories[0].name, {
      selector: ".select-list-selected-opt",
    });
    const selectedBrand = await screen.findByText(brands[0].name, {
      selector: ".select-list-selected-opt",
    });
    const uploadedImg = await screen.findAllByAltText(/product image/i);
    const titleOfProdcutImgsAfterUpload = await screen.findByText(
      /product images: 1 \/ 7/i,
    );

    expect(titleOfProdcutImgsAfterUpload).toBeInTheDocument();
    expect(selectedCategory).toBeInTheDocument();
    expect(selectedBrand).toBeInTheDocument();
    expect(uploadedImg).toHaveLength(1);

    expect(productNameInput).toHaveValue("test product");
    expect(productDescriptionInput).toHaveValue("test product description");
    expect(productPriceInput).toHaveValue(100);
    expect(productQuantityInput).toHaveValue(10);
    expect(productColorInput).toHaveValue("#ff0000");

    await userEvent.click(submitFormBtn);

    const topMsg = await screen.findByText(/product created successfully/i);

    const resetCategoryDefaultOption =
      await screen.findByText(/choose category/i);
    const resetBrandDefaultOption = await screen.findByText(/choose brand/i);
    const resetProductImgsCount = await screen.findByText(
      /product images: 0 \/ 7/i,
    );

    expect(productNameInput).toHaveValue("");
    expect(productDescriptionInput).toHaveValue("");
    expect(productPriceInput).toHaveValue(null);
    expect(productQuantityInput).toHaveValue(null);
    expect(productColorInput).toHaveValue("#000000");
    expect(resetCategoryDefaultOption).toBeInTheDocument();
    expect(resetBrandDefaultOption).toBeInTheDocument();
    expect(resetProductImgsCount).toBeInTheDocument();
    expect(topMsg).toBeInTheDocument();
  });

  describe("test Product Form page validation", () => {
    it("should show main inputs red message when submiting the form without type any thing", async () => {
      renderWithProviders(<ProductFormPage />);
      const submitFormBtn = await screen.findByText(/add product/i);

      await userEvent.click(submitFormBtn);

      const productNameInputErr = await screen.findByText(/name is required/i);
      const productDescriptionInputErr = await screen.findByText(
        /description is required/i,
      );
      const productPriceInputErr =
        await screen.findByText(/price is required/i);
      const productQuantityInputErr =
        await screen.findByText(/quantity is required/i);

      expect(productNameInputErr).toBeInTheDocument();
      expect(productDescriptionInputErr).toBeInTheDocument();
      expect(productPriceInputErr).toBeInTheDocument();
      expect(productQuantityInputErr).toBeInTheDocument();
    });

    it("should show images error if no images were uploaded", async () => {
      renderWithProviders(<ProductFormPage />);
      const productNameInput =
        await screen.findByPlaceholderText(/product name/i);
      const productDescriptionInput =
        await screen.findByPlaceholderText(/description/i);
      const productPriceInput =
        await screen.findByPlaceholderText(/product price/i);
      const productQuantityInput =
        await screen.findByPlaceholderText(/product quantity/i);

      await userEvent.type(productNameInput, "test product");
      await userEvent.type(productDescriptionInput, "test product description");
      await userEvent.type(productPriceInput, "100");
      await userEvent.type(productQuantityInput, "10");

      const submitFormBtn = await screen.findByText(/add product/i);

      await userEvent.click(submitFormBtn);

      const productImgsInputErr = await screen.findByText(
        /product must have at least one image/i,
      );
      const productNameInputErr = screen.queryByText(/name is required/i);
      const productPriceInputErr = screen.queryByText(/price is required/i);
      const productQuantityInputErr =
        screen.queryByText(/quantity is required/i);
      const productDescriptionInputErr = screen.queryByText(
        /description is required/i,
      );

      expect(productNameInputErr).not.toBeInTheDocument();
      expect(productDescriptionInputErr).not.toBeInTheDocument();
      expect(productPriceInputErr).not.toBeInTheDocument();
      expect(productQuantityInputErr).not.toBeInTheDocument();
      expect(productImgsInputErr).toBeInTheDocument();
    });

    it("should show error for brands if not selected and all fields has filled", async () => {
      renderWithProviders(
        <>
          <TopMessage />
          <ProductFormPage />
        </>,
      );
      const productNameInput =
        await screen.findByPlaceholderText(/product name/i);
      const productDescriptionInput =
        await screen.findByPlaceholderText(/description/i);
      const productPriceInput =
        await screen.findByPlaceholderText(/product price/i);
      const productQuantityInput =
        await screen.findByPlaceholderText(/product quantity/i);
      const addImgsBtn = await screen.findByText("+");

      await userEvent.type(productNameInput, "test product");
      await userEvent.type(productDescriptionInput, "test product description");
      await userEvent.type(productPriceInput, "100");
      await userEvent.type(productQuantityInput, "10");
      await userEvent.upload(addImgsBtn, file);

      const submitFormBtn = await screen.findByText(/add product/i);

      await userEvent.click(submitFormBtn);

      const productImgsInputErr = screen.queryByText(
        /product must have at least one image/i,
      );
      const productNameInputErr = screen.queryByText(/name is required/i);
      const productPriceInputErr = screen.queryByText(/price is required/i);
      const productQuantityInputErr =
        screen.queryByText(/quantity is required/i);
      const productDescriptionInputErr = screen.queryByText(
        /description is required/i,
      );
      const topMsg = await screen.findByText(
        /please select a brand for this product/i,
      );

      expect(topMsg).toBeInTheDocument();
      expect(productNameInputErr).not.toBeInTheDocument();
      expect(productDescriptionInputErr).not.toBeInTheDocument();
      expect(productPriceInputErr).not.toBeInTheDocument();
      expect(productQuantityInputErr).not.toBeInTheDocument();
      expect(productImgsInputErr).not.toBeInTheDocument();
    });

    it("should show error for categores if not selected and all fields has filled", async () => {
      renderWithProviders(
        <>
          <TopMessage />
          <ProductFormPage />
        </>,
      );
      const productNameInput =
        await screen.findByPlaceholderText(/product name/i);
      const productDescriptionInput =
        await screen.findByPlaceholderText(/description/i);
      const productPriceInput =
        await screen.findByPlaceholderText(/product price/i);
      const productQuantityInput =
        await screen.findByPlaceholderText(/product quantity/i);
      const addImgsBtn = await screen.findByText("+");
      const productBrandBtn = await screen.findByText(/choose brand/i);

      await userEvent.click(productBrandBtn.parentElement!);

      const brandOptions = brands.map(({ name }) => screen.getByText(name));

      await userEvent.click(brandOptions[0]);

      await userEvent.type(productNameInput, "test product");
      await userEvent.type(productDescriptionInput, "test product description");
      await userEvent.type(productPriceInput, "100");
      await userEvent.type(productQuantityInput, "10");
      await userEvent.upload(addImgsBtn, file);

      const submitFormBtn = await screen.findByText(/add product/i);

      await userEvent.click(submitFormBtn);

      const productImgsInputErr = screen.queryByText(
        /product must have at least one image/i,
      );
      const productNameInputErr = screen.queryByText(/name is required/i);
      const productPriceInputErr = screen.queryByText(/price is required/i);
      const productQuantityInputErr =
        screen.queryByText(/quantity is required/i);
      const productDescriptionInputErr = screen.queryByText(
        /description is required/i,
      );
      const topMsg = await screen.findByText(
        /please select a category for this product/i,
      );
      const topMsgForBrand = screen.queryByText(
        /please select a brand for this product/i,
      );

      expect(topMsg).toBeInTheDocument();
      expect(topMsgForBrand).not.toBeInTheDocument();
      expect(productNameInputErr).not.toBeInTheDocument();
      expect(productDescriptionInputErr).not.toBeInTheDocument();
      expect(productPriceInputErr).not.toBeInTheDocument();
      expect(productQuantityInputErr).not.toBeInTheDocument();
      expect(productImgsInputErr).not.toBeInTheDocument();
    });
  });

  describe("test product image btns", () => {
    it("should remove uploaded image when click on delete btn", async () => {
      renderWithProviders(<ProductFormPage />);
      const addImgsBtn = await screen.findByText("+");

      const imgsTitle = await screen.findByText(/product images: 0 \/ 7/i);

      expect(imgsTitle).toBeInTheDocument();
      await userEvent.upload(addImgsBtn, file);
      expect(imgsTitle).toHaveTextContent(/product images: 1 \/ 7/i);

      const deleteImgBtn = await screen.findByTitle(
        /remove image from list btn/i,
      );
      expect(deleteImgBtn).toBeInTheDocument();

      await userEvent.click(deleteImgBtn);

      expect(imgsTitle).toHaveTextContent(/product images: 0 \/ 7/i);
    });

    it("should replace uploaded image with another selected one when click on replace btn", async () => {
      renderWithProviders(<ProductFormPage />);
      const titleTextContent = /product images: 1 \/ 7/i;
      const addImgsBtn = await screen.findByText("+");

      const imgsTitle = await screen.findByText(/product images: 0 \/ 7/i);

      expect(imgsTitle).toBeInTheDocument();
      await userEvent.upload(addImgsBtn, file);
      expect(imgsTitle).toHaveTextContent(titleTextContent);

      const replaceImgBtn = await screen.findByTitle(/replace image btn/i);
      const uploadedImg = (await screen.findByAltText(
        /product image/i,
      )) as HTMLImageElement;
      const oldSrc = uploadedImg.src;
      const imgInput = await screen.findByTitle(/replace-img-/i);

      expect(uploadedImg).toBeInTheDocument();
      expect(replaceImgBtn).toBeInTheDocument();

      await userEvent.upload(replaceImgBtn, file_2);

      expect(imgsTitle).toHaveTextContent(titleTextContent);
      expect((imgInput as HTMLInputElement).files?.[0]).toBe(file_2);
      expect(uploadedImg.src).not.toBe(oldSrc);
    });
  });
});
