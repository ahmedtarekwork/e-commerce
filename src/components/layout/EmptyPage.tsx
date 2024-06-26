// react
import { type ReactNode, useEffect } from "react";

// components
import GoToHomeBtn from "../GoToHomeBtn";

// layouts
import AnimatedLayout from "../../layouts/AnimatedLayout";

export type WithBtnType =
  | {
      type: "GoToHome";
      btn?: never;
    }
  | {
      type: "custom";
      btn: JSX.Element;
    };

type Props = {
  svg: string;
  content: ReactNode;
  withBtn?: WithBtnType;
  centerPage?: boolean;
};

const EmptyPage = ({ svg, content, withBtn, centerPage = true }: Props) => {
  useEffect(() => {
    if (centerPage) {
      const main = document.querySelector<HTMLElement>(".app-holder");

      if (main) {
        main!.classList.add("center-content");
        main!.classList.remove("full-page");

        return () => {
          main!.classList.remove("center-content");
          main!.classList.add("full-page");
        };
      }
    }
  });

  return (
    <AnimatedLayout className="empty-page">
      <img width="600px" height="100%" src={svg} alt="empty svg image" />

      <strong>{content}</strong>

      {withBtn && (withBtn.type === "GoToHome" ? <GoToHomeBtn /> : withBtn.btn)}
    </AnimatedLayout>
  );
};
export default EmptyPage;
