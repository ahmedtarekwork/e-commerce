import { http, HttpResponse } from "msw";

// mock data
import { imgs } from "./statics";

const handlers = [
  http.get("*/dashboard/homepageSliderImgs", async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return HttpResponse.json(imgs);
  }),

  http.post("*/dashboard/homepageSliderImgs", async ({ request }) => {
    const formData = await request.formData();

    await new Promise((resolve) => setTimeout(resolve, 500));

    return HttpResponse.json({
      images: imgs.slice(0, formData.getAll("images[]").length),
      message: "images successfully uploaded",
    });
  }),

  http.delete("*/dashboard/homepageSliderImgs/:imgId", async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return HttpResponse.json({
      imgId: params.imgId,
    });
  }),
];

export default handlers;
