import type { CSSProperties, ComponentProps } from "react";

type Props = {
  settings: { diminsions: string; clr?: string; "brdr-width"?: string };
  effect?: "fade" | "scale" | "fade scale";
} & ComponentProps<"div">;

const EmptySpinner = ({ settings, effect, ...attr }: Props) => {
  const mainStyles = Object.fromEntries(
    Object.entries(settings).map(([key, value]) => ["--" + key, value])
  ) as CSSProperties;

  return (
    <div
      {...attr}
      className={`empty-spinner spinner-el${effect ? ` ${effect}` : ""}${
        attr.className ? ` ${attr.className}` : ""
      }`}
      style={{ ...mainStyles, ...(attr.style || {}) }}
    />
  );
};
export default EmptySpinner;
