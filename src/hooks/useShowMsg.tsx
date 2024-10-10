// redux
import useDispatch from "./redux/useDispatch";
// redux actions
import { showMsg } from "../store/fetures/topMessageSlice";

// types
import type { showMsgFnParamsType } from "../utils/types";

const useShowMsg = () => {
  const dispatch = useDispatch();

  return (params: showMsgFnParamsType) => {
    dispatch(showMsg({ ...params }));
  };
};

export default useShowMsg;
