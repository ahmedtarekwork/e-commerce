// utils
import axios from "axios";
// hooks

import useShowMsg from "./useShowMsg";

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
  const showMsg = useShowMsg();

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
