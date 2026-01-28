import {
  useEffect,
  useRef,

  // types
  type Dispatch,
  type SetStateAction,
} from "react";
import { createPortal } from "react-dom";

// redux
import useDispatch from "../hooks/redux/useDispatch";
import useSelector from "../hooks/redux/useSelector";

// framer motion
import { AnimatePresence, motion } from "framer-motion";
import { showMsg } from "../store/fetures/topMessageSlice";

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

const TopMessage = () => {
  const dispatch = useDispatch();
  const messageData = useSelector((state) => state.topMessage.msgData);

  const messageRef = useRef<HTMLDivElement>(null);

  const closeMsg = (msgEl: HTMLDivElement) => {
    if (msgEl === messageRef.current)
      dispatch(showMsg({ show: false, clr: "green", content: "", time: 3500 }));
    else msgEl.remove();
  };

  useEffect(() => {
    const msgEl = messageRef.current;

    if (msgEl)
      if (messageData?.show) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageData]);

  return createPortal(
    <AnimatePresence>
      {messageData?.show && (
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
};
export default TopMessage;
