import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,

  // types
  type Dispatch,
  type SetStateAction,
} from "react";
import { createPortal } from "react-dom";

// redux
import useDispatch from "../hooks/redux/useDispatch";
import useSelector from "../hooks/redux/useSelector";
// redux actions
import { setTopMessageShowFn } from "../store/fetures/topMessageSlice";

// types
import type { ShowMsgFnType } from "../utils/types";

// framer motion
import { AnimatePresence, motion } from "framer-motion";

export type MessageDataType = {
  time: number;
  show: boolean;
  clr: "green" | "red";
  content: string;
};

export type TopMessageRefType = {
  message: HTMLDivElement | null;
  setMessageData: Dispatch<SetStateAction<MessageDataType>>;
};

const TopMessage = forwardRef<TopMessageRefType>((_, ref) => {
  const dispatch = useDispatch();
  const appShowMsg = useSelector((state) => state.topMessage.showMsg);

  const messageRef = useRef<HTMLDivElement>(null);
  const [messageData, setMessageData] = useState<MessageDataType>({
    show: false,
    clr: "green",
    content: "",
    time: 3500,
  });

  const closeMsg = (msgEl: HTMLDivElement) => {
    if (msgEl === messageRef.current)
      setMessageData({ show: false, clr: "green", content: "", time: 3500 });
    else msgEl.remove();
  };

  const showMsg: ShowMsgFnType = ({ time = 3500, clr, content }) => {
    setMessageData({
      show: true,
      clr,
      content,
      time,
    });
  };

  useEffect(() => {
    if (!appShowMsg) dispatch(setTopMessageShowFn(showMsg));
  }, []);

  useEffect(() => {
    const msgEl = messageRef.current;

    if (msgEl)
      if (messageData.show) {
        const appHeaderEl = document.querySelector(
          ".app-header"
        ) as HTMLElement;
        msgEl.style.top = `${(appHeaderEl?.offsetHeight || 20) + 20}px`;

        const { time } = messageData;

        // remove previous messages
        (
          [...document.querySelectorAll(".app-top-message")] as HTMLDivElement[]
        ).forEach((msg) => msg !== messageRef.current && closeMsg(msg));

        // if i want to remove messsage element after some time
        if (time) setTimeout(() => closeMsg(msgEl), time);
      }
  }, [messageData]);

  useImperativeHandle(
    ref,
    () => ({
      message: messageRef.current,
      setMessageData,
    }),
    []
  );

  return createPortal(
    <AnimatePresence>
      {messageData.show && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          ref={messageRef}
          className={`app-top-msg ${messageData.clr}`}
        >
          {messageData.content}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
});
export default TopMessage;
