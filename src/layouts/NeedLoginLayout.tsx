// react router dom
import { Link, Outlet } from "react-router-dom";

// redux
import useSelector from "../hooks/redux/useSelector";

// components
import EmptyPage from "../components/layout/EmptyPage";

// SVGs
import needAuthSvg from "../../imgs/need_auth.svg";

const NeedLoginLayout = () => {
  const isLogedIn = useSelector((state) => state.user.user);

  if (!isLogedIn)
    return (
      <EmptyPage
        content="You need to login to access this page"
        svg={needAuthSvg}
        withBtn={{
          type: "custom",
          btn: (
            <Link
              title="go to login page btn"
              style={{
                marginInline: "auto",
                marginTop: 15,
                paddingInline: 26,
              }}
              className="btn"
              to="/login"
              relative="path"
            >
              Login
            </Link>
          ),
        }}
      />
    );

  return <Outlet />;
};
export default NeedLoginLayout;
