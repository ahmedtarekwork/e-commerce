// react router
import { useNavigate } from "react-router-dom";

// redux
import useDispatch from "./redux/useDispatch";
// redux actions
import { logoutUser } from "../store/fetures/userSlice";

// hooks
import useHandleErrorMsg from "./useHandleErrorMsg";

// utils
import axios from "../utils/axios";

const useLogoutUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleError = useHandleErrorMsg();

  return async () => {
    try {
      await axios.post("/auth/logout");

      dispatch(logoutUser());

      navigate("/login", { relative: "path" });
    } catch (err) {
      handleError(err, {
        forAllStates: "something went wrong while logout",
      });
    }
  };
};

export default useLogoutUser;
