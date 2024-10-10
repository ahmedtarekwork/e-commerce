// react-router-dom
import { Link } from "react-router-dom";

// types
import type { IconType } from "react-icons";

// icons
import { BsBoxArrowInUpRight } from "react-icons/bs";

export type DashboardSqaureProps = {
  path: string;
  title: string;
  Icon: IconType;
  number: number;
  noNum: boolean;
};

const SquareData = ({
  Icon,
  noNum,
  number,
  title,
  path,
}: DashboardSqaureProps) => {
  return (
    <>
      <div className="square-top">
        <Icon size={28} />
        <strong className="dashboard-square-title">{title}</strong>
      </div>

      <strong>{number}</strong>

      {path && <BsBoxArrowInUpRight />}

      {noNum && !number && <strong>unknown</strong>}
    </>
  );
};

const DashboardSquare = (props: DashboardSqaureProps) => {
  const { path, title } = props;

  return (
    <li className="dashboard-square">
      {path ? (
        <Link to={path} relative="path" title={`go to ${title}`}>
          <SquareData {...props} />
        </Link>
      ) : (
        <div className="dashbaord-square">
          <SquareData {...props} />
        </div>
      )}
    </li>
  );
};
export default DashboardSquare;
