import type { CSSProperties, ReactNode } from "react";

type Props = Record<"firstIcon" | "lastIcon", ReactNode> & {
  isActive: boolean;
  iconsColor?: string;
};

const IconsSwitcher = ({
  firstIcon,
  lastIcon,
  iconsColor,
  isActive,
}: Props) => {
  return (
    <div
      className={`icons-switcher-holder${isActive ? " active" : ""}`}
      style={{ "--icon-color": iconsColor } as CSSProperties}
    >
      {firstIcon}
      {lastIcon}
    </div>
  );
};
export default IconsSwitcher;
