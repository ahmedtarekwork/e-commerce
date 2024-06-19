import type { ReactNode } from "react";

type props = {
  children: ReactNode;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
};
type TagNameType = NonNullable<props["headingLevel"]>;

const Heading = ({ children, headingLevel = 1 }: props) => {
  const TagName = `h${headingLevel}` as `h${TagNameType}`;

  return <TagName className="sec-heading">{children}</TagName>;
};

export default Heading;
