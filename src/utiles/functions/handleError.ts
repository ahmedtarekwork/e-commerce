import { RefObject } from "react";

import axios from "axios";

import { TopMessageRefType } from "../../components/TopMessage";

type EmergencyMsgType =
  | {
      forAllStates: string;
      duplicatedMsg?: string;
    }
  | {
      duplicatedMsg: string;
      forAllStates?: string;
    };

export default (
  err: unknown,
  msgRef: RefObject<TopMessageRefType>,
  emergencyMsg?: EmergencyMsgType,
  timeout?: number
) => {
  let msg: string = axios.isAxiosError(err)
    ? err.response?.data?.msg || err.response?.data
    : emergencyMsg?.forAllStates;

  if (msg?.includes("E11000"))
    msg = emergencyMsg?.duplicatedMsg || "Duplicated Data Error";

  msgRef.current?.setMessageData?.({
    show: true,
    clr: "red",
    time: timeout || 3000,
    content: msg || "something went wrong",
  });
};
