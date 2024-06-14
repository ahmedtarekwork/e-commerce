import {
  type Dispatch,
  type SetStateAction,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type timeAndRemove =
  | {
      remove?: never;
      time: number;
    }
  | {
      remove: false;
      time?: never;
    };

type MessageDataType =
  | (timeAndRemove & {
      show: true;
      clr: "green" | "red";
      content: string;
    })
  | { show: false };

export type TopMessageRefType = {
  message: HTMLDivElement | null;
  setMessageData: Dispatch<SetStateAction<MessageDataType>>;
};

const TopMessage = forwardRef<TopMessageRefType>((_, ref) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const [messageData, setMessageData] = useState<MessageDataType>({
    show: false,
  });

  const closeMsg = (msgEl: HTMLDivElement) => {
    msgEl.classList.remove("active");

    setTimeout(() => {
      if (msgEl === messageRef.current) setMessageData({ show: false });
      else msgEl.remove();
    }, 300);
  };

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

        setTimeout(() => msgEl.classList.add("active"));

        // if i want to remove messsage element after some time
        if (time) setTimeout(() => closeMsg(msgEl), time);
      } else closeMsg(msgEl);
  }, [messageData]);

  useImperativeHandle(
    ref,
    () => ({
      message: messageRef.current,
      setMessageData,
    }),
    []
  );

  return (
    messageData.show &&
    createPortal(
      <div ref={messageRef} className={`app-top-msg ${messageData.clr}`}>
        {messageData.content}
      </div>,
      document.body
    )
  );
});
export default TopMessage;
