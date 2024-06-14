// react-router-dom
import { Outlet } from "react-router-dom";

// redux
import useSelector from "../hooks/redux/useSelector";

// components
import SplashScreen from "../components/spinners/SplashScreen";
import EmptyPage from "../components/layout/EmptyPage";

// SVGs
import notAllowedSvg from "../../imgs/not_allowed.svg";

const NotAuthLayout = ({ loading }: { loading: boolean }) => {
  const { user } = useSelector((state) => state.user);

  if (loading) return <SplashScreen />;

  if (!user?.isAdmin) {
    return (
      <EmptyPage
        content="You don't have access to the dashboard!"
        svg={notAllowedSvg}
        withBtn={{
          type: "GoToHome",
        }}
      />
    );
  }

  return <Outlet />;
};
export default NotAuthLayout;
