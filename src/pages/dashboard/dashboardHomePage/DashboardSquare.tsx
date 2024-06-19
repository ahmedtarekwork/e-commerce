// react-router-dom
import { Link } from "react-router-dom";

// types
import type { IconType } from "react-icons";

// icons
import { BsBoxArrowInUpRight, BsFillXSquareFill } from "react-icons/bs";

export type DashboardSqaureProps = {
  path?: string;
  title: string;
  Icon: IconType;
  number: number;
  noNum: boolean;
};

const DashboardSquare = ({
  path,
  title,
  number,
  Icon,
  noNum,
}: DashboardSqaureProps) => {
  const Children = () => (
    <>
      <div className="square-top">
        <Icon size={28} />
        <strong className="dashboard-square-title">{title}</strong>
      </div>

      <strong>{number}</strong>

      {number && !noNum && path && <BsBoxArrowInUpRight />}
      {number && !noNum && !path && <BsFillXSquareFill />}

      {noNum && !number && <strong>unknown</strong>}
    </>
  );

  return (
    <li className="dashboard-square">
      {path ? (
        <Link
          to={path || ""}
          relative="path"
          title={`go to ${title} square btn`}
        >
          <Children />
        </Link>
      ) : (
        <div className="non-anchor-dashbaord-square">
          <Children />
        </div>
      )}
    </li>
  );
};
export default DashboardSquare;
