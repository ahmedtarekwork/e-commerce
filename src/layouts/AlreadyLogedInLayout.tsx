import { Navigate, Outlet } from "react-router-dom";
import useSelector from "../hooks/redux/useSelector";

const AlreadyLogedInLayout = () => {
  const { user } = useSelector((state) => state.user);

  return user ? <Navigate to="/" relative="path" /> : <Outlet />;
};
export default AlreadyLogedInLayout;
