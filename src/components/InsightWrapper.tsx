// react
import type { CSSProperties, ReactNode } from "react";

// components
import Heading from "./Heading";

type Props = Record<"children" | "title", ReactNode> & {
  diminsion?: `${number}px`;
};

const InsightWrapper = ({ children, title, diminsion }: Props) => {
  return (
    <li className="insight-wrapper">
      <Heading headingLevel={2}>{title}</Heading>

      <div
        className="chart-holder"
        style={
          {
            "--diminsion": diminsion,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </li>
  );
};
export default InsightWrapper;
