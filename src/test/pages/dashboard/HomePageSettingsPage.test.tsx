import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// pages
import HomePageSettingsPage from "../../../pages/dashboard/homePageSettings/HomePageSettingsPage";

// components
import TopMessage from "../../../components/TopMessage";

// utils
import { renderWithProviders } from "../../utils/renderWithProviders";

// msw
import { server } from "../../mocks/server";
import { http, HttpResponse } from "msw";

// mocks
import { imgs } from "../../mocks/handlers/dashboard/homePageImgsSlider/statics";

const file = new File(["dummy"], "test.png", {
  type: "image/png",
});
const mockImgs = [file, file];

describe("test HomePageSettings page", () => {
  it("should render page normally without any images", async () => {
    server.use(
      http.get("*/dashboard/homepageSliderImgs", async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return HttpResponse.json([]);
      }),
    );

    renderWithProviders(<HomePageSettingsPage />);
    const pageTitle = await screen.findByRole("heading", {
      name: /Home Page Settings/i,
    });
    const imgsSliderSectionTitle = await screen.findByRole("heading", {
      name: /Home Page Slider Images/i,
    });
    const noImgsMsg = await screen.findByText(
      "There aren't any home page slider images.",
    );
    const addImgsBtn = await screen.findByText("Add some images");

    expect(pageTitle).toBeInTheDocument();
    expect(imgsSliderSectionTitle).toBeInTheDocument();
    expect(noImgsMsg).toBeInTheDocument();
    expect(addImgsBtn).toBeInTheDocument();
  });

  it.each([{ message: "" }, { message: "there is a problem !" }])(
    "should render page with error message",
    async (response) => {
      server.use(
        http.get("*/dashboard/homepageSliderImgs", async () => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          return HttpResponse.json(response, { status: 500 });
        }),
      );

      renderWithProviders(<HomePageSettingsPage />);
      const pageTitle = await screen.findByRole("heading", {
        name: /Home Page Settings/i,
      });
      const imgsSliderSectionTitle = await screen.findByRole("heading", {
        name: /Home Page Slider Images/i,
      });
      const noImgsMsg = await screen.findByText(
        !response.message
          ? "something went wrogn while fetching images!"
          : "there is a problem !",
      );
      const addImgsBtn = screen.queryByText("Add some images");

      expect(pageTitle).toBeInTheDocument();
      expect(imgsSliderSectionTitle).toBeInTheDocument();
      expect(noImgsMsg).toBeInTheDocument();
      expect(addImgsBtn).not.toBeInTheDocument();
    },
  );

  it("should render selected images section only", async () => {
    server.use(
      http.get("*/dashboard/homepageSliderImgs", async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return HttpResponse.json([]);
      }),
    );

    renderWithProviders(<HomePageSettingsPage />);
    const addImgsBtn = await screen.findByText("Add some images");

    expect(addImgsBtn).toBeInTheDocument();

    await userEvent.upload(addImgsBtn, mockImgs);

    const sectionTitle = await screen.findByText(
      /Images Will Be Added To The Home Page Slider/i,
    );
    const uploadedImgs = await screen.findAllByRole("img", {
      name: /home page slider image No.\d+ that's will be uploaded/i,
    });
    const uploadedImgsCancelBtn = await screen.findAllByRole("button", {
      name: /cancel/i,
    });

    const submitBtn = await screen.findByRole("button", {
      name: /submit images/i,
    });
    const addMoreBtn = await screen.findByText(/add more/i);

    expect(sectionTitle).toBeInTheDocument();
    expect(uploadedImgs).toHaveLength(mockImgs.length);
    expect(uploadedImgsCancelBtn).toHaveLength(mockImgs.length);
    expect(submitBtn).toBeInTheDocument();
    expect(addMoreBtn).toBeInTheDocument();
  });

  it("should remove selected image from selected images section when click on 'cancel' btn", async () => {
    server.use(
      http.get("*/dashboard/homepageSliderImgs", async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return HttpResponse.json([]);
      }),
    );

    renderWithProviders(<HomePageSettingsPage />);
    const addImgsBtn = await screen.findByText("Add some images");

    await userEvent.upload(addImgsBtn, mockImgs);

    const uploadedImgs = await screen.findAllByRole("img", {
      name: /home page slider image No.\d+ that's will be uploaded/i,
    });
    const uploadedImgsCancelBtn = await screen.findAllByRole("button", {
      name: /cancel/i,
    });

    expect(uploadedImgs).toHaveLength(mockImgs.length);
    expect(uploadedImgsCancelBtn).toHaveLength(mockImgs.length);

    await userEvent.click(uploadedImgsCancelBtn[0]);
    const uploadedImgsAfterDeleteOne = await screen.findAllByRole("img", {
      name: /home page slider image No.\d+ that's will be uploaded/i,
    });
    const uploadedImgsAfterDeleteOneCancelBtn = await screen.findAllByRole(
      "button",
      {
        name: /cancel/i,
      },
    );

    expect(uploadedImgsAfterDeleteOne).toHaveLength(mockImgs.length - 1);
    expect(uploadedImgsAfterDeleteOneCancelBtn).toHaveLength(
      mockImgs.length - 1,
    );
  });

  it("should submit selected images when click on 'submit images' btn", async () => {
    server.use(
      http.get("*/dashboard/homepageSliderImgs", async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return HttpResponse.json([]);
      }),
    );

    renderWithProviders(
      <>
        <TopMessage />
        <HomePageSettingsPage />
      </>,
    );
    const addImgsBtn = await screen.findByText("Add some images");

    expect(addImgsBtn).toBeInTheDocument();

    await userEvent.upload(addImgsBtn, mockImgs);

    const submitBtn = await screen.findByRole("button", {
      name: /submit images/i,
    });

    await userEvent.click(submitBtn);

    const uploadedImgsAfterSubmit = await screen.findAllByRole("img", {
      name: "home page slider image",
    });

    const topMsg = await screen.findByText(/images successfully uploaded/i);
    const uploadedImgsAfterSubmitRemoveBtns = await screen.findAllByTitle(
      /remove image form home page slider btn/i,
    );

    expect(topMsg).toBeInTheDocument();
    expect(uploadedImgsAfterSubmit).toHaveLength(mockImgs.length);
    expect(uploadedImgsAfterSubmitRemoveBtns).toHaveLength(mockImgs.length);
  });

  it("should remove first image from server when click on 'remove' btn", async () => {
    renderWithProviders(
      <>
        <TopMessage />
        <HomePageSettingsPage />
      </>,
    );

    const uploadedImgs = await screen.findAllByRole("img", {
      name: "home page slider image",
    });
    const uploadedImgsRemoveBtns = await screen.findAllByTitle(
      /remove image form home page slider btn/i,
    );

    expect(uploadedImgs).toHaveLength(imgs.length);
    expect(uploadedImgsRemoveBtns).toHaveLength(imgs.length);

    await userEvent.click(uploadedImgsRemoveBtns[0]);

    const modalMsg = await screen.findByText(
      /are you sure you want to remove this image from home page images slider \?/i,
    );
    const modalYesBtn = await screen.findByRole("button", {
      name: /yes/i,
    });
    const modalNoBtn = await screen.findByRole("button", {
      name: /no/i,
    });
    expect(modalMsg).toBeInTheDocument();
    expect(modalYesBtn).toBeInTheDocument();
    expect(modalNoBtn).toBeInTheDocument();

    await userEvent.click(modalYesBtn);

    const topMsg = await screen.findByText(/image successfully removed/i);

    expect(topMsg).toBeInTheDocument();
    expect(uploadedImgsRemoveBtns[0]).toBeDisabled();

    await waitFor(async () => {
      const uploadedImgs = await screen.findAllByRole("img", {
        name: "home page slider image",
      });
      const uploadedImgsRemoveBtns = await screen.findAllByTitle(
        /remove image form home page slider btn/i,
      );

      expect(uploadedImgs).toHaveLength(imgs.length - 1);
      expect(uploadedImgsRemoveBtns).toHaveLength(imgs.length - 1);
    });
  });

  it("should add more images when click on 'add more' btn then submit it when click on 'submit images' btn then render them", async () => {
    renderWithProviders(
      <>
        <TopMessage />
        <HomePageSettingsPage />
      </>,
    );
    const uploadedImgsBeforeSubmit = await screen.findAllByRole("img", {
      name: "home page slider image",
    });

    const uploadedImgsBeforeSubmitRemoveBtns = await screen.findAllByTitle(
      /remove image form home page slider btn/i,
    );

    expect(uploadedImgsBeforeSubmit).toHaveLength(imgs.length);
    expect(uploadedImgsBeforeSubmitRemoveBtns).toHaveLength(imgs.length);

    const addMoreBtn = await screen.findByText("Add more images");

    await userEvent.upload(addMoreBtn, file);

    const submitBtn = await screen.findByRole("button", {
      name: /submit images/i,
    });

    await userEvent.click(submitBtn);

    const topMsg = await screen.findByText(/images successfully uploaded/i);
    expect(topMsg).toBeInTheDocument();

    await waitFor(async () => {
      const uploadedImgsAfterSubmit = await screen.findAllByRole("img", {
        name: "home page slider image",
      });
      const uploadedImgsAfterSubmitRemoveBtns = await screen.findAllByTitle(
        /remove image form home page slider btn/i,
      );

      expect(uploadedImgsAfterSubmit).toHaveLength(imgs.length + 1);
      expect(uploadedImgsAfterSubmitRemoveBtns).toHaveLength(imgs.length + 1);
    });
  });
});
