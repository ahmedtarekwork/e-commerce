import { useEffect, useRef } from "react";

const ErrorDiv = ({ msg }: { msg: string | undefined }) => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const btn = divRef.current;

    if (btn) {
      btn.style.translate = `0 -${btn.offsetHeight}px`;

      if (msg) {
        if (btn.parentElement)
          btn.parentElement.style.paddingBottom = `calc(${
            btn.offsetHeight
          }px + ${getComputedStyle(btn.parentElement).paddingBottom})`;
      } else {
        if (btn.parentElement)
          btn.parentElement.style.removeProperty("padding-bottom");
      }
    }
  }, [msg]);

  return (
    <div ref={divRef} className={`error-div${msg ? " active" : ""}`}>
      {msg}
    </div>
  );
};
export default ErrorDiv;
