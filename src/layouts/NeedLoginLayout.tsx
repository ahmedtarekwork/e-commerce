import { Link, Outlet } from "react-router-dom";

import { useSelector } from "react-redux";
import { RootStateType } from "../utiles/types";

const NeedLoginLayout = () => {
  const isLogedIn = useSelector((state: RootStateType) => state.user.user);

  if (!isLogedIn)
    return (
      <>
        <h1>You Need to Login to access this page</h1>
        <Link className="btn" to="/login" relative="path">
          Login
        </Link>
      </>
    );

  return <Outlet />;
};
export default NeedLoginLayout;
