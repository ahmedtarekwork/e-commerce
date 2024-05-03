// react-router-dom
import { Link } from "react-router-dom";

// components
import EmptySpinner from "../../../components/spinners/EmptySpinner";

// types
import { IconType } from "react-icons";

export type DashboardSqaureProps = {
  path: string;
  title: string;
  Icon: IconType;
  number: number;
  loading: boolean;
  noNum: boolean;
};

const DashboardSquare = ({
  path,
  title,
  number,
  Icon,
  loading,
  noNum,
}: DashboardSqaureProps) => {
  return (
    <li className="dashboard-square">
      <Link to={path} relative="path">
        <div className="square-top">
          <Icon size={28} />
          <h3>{title}</h3>
        </div>

        {loading ? (
          <EmptySpinner settings={{ diminsions: "18px" }} />
        ) : (
          <strong>{number}</strong>
        )}

        {noNum && !loading && !number && <strong>unknown</strong>}
      </Link>
    </li>
  );
};
export default DashboardSquare;
