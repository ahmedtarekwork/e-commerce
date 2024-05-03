import { ReactNode } from "react";

type Props = {
  name?: string;
  val?: string;
  children?: ReactNode;
};

const AppModalCell = ({ name, val, children }: Props) => {
  return (
    <div className="app-modal-cell">
      {name && val ? (
        <>
          <p className="app-modal-cell-name">{name}</p>
          <p className="app-modal-cell-val">{val}</p>
        </>
      ) : (
        children
      )}
    </div>
  );
};
export default AppModalCell;
