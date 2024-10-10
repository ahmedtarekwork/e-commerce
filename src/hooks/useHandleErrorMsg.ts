import useSelector from "./redux/useSelector";

import axios from "axios";

type EmergencyMsgType =
  | {
      forAllStates: string;
      duplicatedMsg?: string;
    }
  | {
      duplicatedMsg: string;
      forAllStates?: string;
    };

const useHandleErrorMsg = () => {
  const showMsg = useSelector((state) => state.topMessage.showMsg);

  return (err: unknown, emergencyMsg?: EmergencyMsgType, time?: number) => {
    let msg: string = axios.isAxiosError(err)
      ? err.response?.data?.message || err.response?.data
      : emergencyMsg?.forAllStates;

    if (msg?.includes("E11000"))
      msg = emergencyMsg?.duplicatedMsg || "Duplicated Data Error";

    showMsg?.({
      clr: "red",
      time,
      content: msg || "something went wrong",
    });
  };
};

export default useHandleErrorMsg;
