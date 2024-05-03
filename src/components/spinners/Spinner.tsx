import { ComponentProps, ReactNode, useEffect, useRef } from "react";

type Content =
  | {
      content: ReactNode;
      children?: never;
    }
  | {
      children: ReactNode;
      content?: never;
    };

type Settings =
  | {
      clr?: never;
      "brdr-width": number;
    }
  | {
      clr: string;
      "brdr-width"?: never;
    };

type Props = Content & {
  settings?: Settings;
  effect?: "fade" | "scale" | "fade scale";
  mainSpinner?: boolean;
};

const Spinner = (props: Props & ComponentProps<"div">) => {
  const { settings, effect, mainSpinner, content, children, ...attr } = props;

  const spinnerEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spinner = spinnerEl.current;

    if (spinner) {
      // gap between content and cirlcle stroke
      const gap = 30;

      if (settings && Object.keys(settings).length) {
        spinner.style.cssText +=
          `padding: ${gap}px; margin-block: 20px;` +
          Object.entries(settings)
            .map(
              ([prop, val]) =>
                `--${prop}: ${val}${prop === "brdr-width" ? "px" : ""}`
            )
            .join("; ");

        setTimeout(() => spinner.classList.add("active"));
      }

      return () => {
        spinner.parentElement?.style.removeProperty("position");
      };
    }
  }, [settings]);

  return (
    <div
      {...attr}
      ref={spinnerEl}
      className={`spinner-el ${mainSpinner ? "main-spinner" : ""} ${
        effect || ""
      }`}
    >
      {<p>{children || content}</p>}
    </div>
  );
};
export default Spinner;
