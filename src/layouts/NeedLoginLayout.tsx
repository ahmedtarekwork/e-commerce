import { Link, Outlet } from "react-router-dom";

import useSelector from "../hooks/redux/useSelector";

const NeedLoginLayout = () => {
  const isLogedIn = useSelector((state) => state.user.user);

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
