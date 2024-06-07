import { ReactNode } from "react";

const Warning = ({ children }: { children: ReactNode }) => {
  return (
    <div className="warning">
      <p>{children}</p>
    </div>
  );
};
export default Warning;
