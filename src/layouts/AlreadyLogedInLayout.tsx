import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootStateType } from "../utiles/types";

const AlreadyLogedInLayout = () => {
  const { user } = useSelector((state: RootStateType) => state.user);

  return user ? <Navigate to="/" relative="path" /> : <Outlet />;
};
export default AlreadyLogedInLayout;
