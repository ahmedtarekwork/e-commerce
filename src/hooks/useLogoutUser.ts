// react
import { useState } from "react";

// react router
import { useNavigate } from "react-router-dom";

// redux
import useDispatch from "./redux/useDispatch";
// redux actions
import { logoutUser as logoutUserAction } from "../store/fetures/userSlice";

// hooks
import useHandleErrorMsg from "./useHandleErrorMsg";

// utils
import axios from "../utils/axios";

const useLogoutUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleError = useHandleErrorMsg();

  const [logoutLoading, setLogoutLoading] = useState(false);

  const logoutUser = async () => {
    try {
      setLogoutLoading(true);
      await axios.post("/auth/logout");

      dispatch(logoutUserAction());

      navigate("/login", { relative: "path" });
    } catch (err) {
      handleError(err, {
        forAllStates: "something went wrong while logout",
      });
    } finally {
      setLogoutLoading(false);
    }
  };

  return {
    logoutUser,
    logoutLoading,
  };
};

export default useLogoutUser;
