// react
import * as reactRedux from "react-redux";
// react-router-dom
import { Link, Outlet } from "react-router-dom";
// components
import SplashScreen from "../components/spinners/SplashScreen";
// types
import { RootStateType } from "../utiles/types";

const NotAuthLayout = ({ loading }: { loading: boolean }) => {
  const { user } = reactRedux.useSelector((state: RootStateType) => state.user);

  if (loading) return <SplashScreen />;

  if (!user?.isAdmin) {
    return (
      <>
        <h1>you don't have access to dashboard</h1>
        <Link className="btn" to="/" relative="path">
          Go to Home page
        </Link>
      </>
    );
  }

  return <Outlet />;
};
export default NotAuthLayout;
