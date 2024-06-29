import type { MouseEvent } from "react";

export default {
  onMouseEnter: (e: MouseEvent<HTMLElement>) => {
    e.currentTarget.querySelector(".fill-icon")?.classList.add("active");
  },
  onMouseLeave: (e: MouseEvent<HTMLElement>) => {
    e.currentTarget.querySelector(".fill-icon")?.classList.remove("active");
  },
};
