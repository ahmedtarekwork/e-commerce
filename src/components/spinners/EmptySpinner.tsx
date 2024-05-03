import { CSSProperties } from "react";

type Props = {
  settings: { diminsions: string; clr?: string; "brdr-width"?: string };
  effect?: "fade" | "scale" | "fade scale";
};

const EmptySpinner = ({ settings, effect }: Props) => {
  return (
    <div
      className={`empty-spinner spinner-el${effect ? " " + effect : ""}`}
      style={
        Object.fromEntries(
          Object.entries(settings).map(([key, value]) => ["--" + key, value])
        ) as CSSProperties
      }
    ></div>
  );
};
export default EmptySpinner;
