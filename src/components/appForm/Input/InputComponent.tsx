import { forwardRef } from "react";
import { InputPropsType } from "../../../utiles/types";

// functions \\
const preventLetters = (e: KeyboardEvent) => {
  const allowedKeys: number[] = [8, 9, 13, 37, 38, 39, 40, 46, 110];

  if (
    !(e.ctrlKey || e.altKey || e.shiftKey) &&
    allowedKeys.every((key) => key !== e.keyCode)
  ) {
    if (/[^0-9]/gi.test(e.key)) {
      e.preventDefault();
    }
  }
};

const preventInputSubmit = (
  e: KeyboardEvent,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submitFunction: (() => any) | undefined
) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    submitFunction && submitFunction();
  }
};

const InputComponent = forwardRef<HTMLInputElement, InputPropsType>(
  ({ label, noSubmit, submitFunction, errorMsg, ...attr }, ref) => {
    const { className, id, disabled } = attr;

    return (
      <>
        {label && (
          <label data-disabled={disabled} htmlFor={id}>
            {label}
          </label>
        )}

        <input
          {...attr}
          className={`${className || ""} ${errorMsg ? "red" : ""}`}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onKeyDown={(e: any) => {
            className === "numberInput" && preventLetters(e);
            noSubmit && preventInputSubmit(e, submitFunction);
          }}
          ref={ref}
        />
      </>
    );
  }
);
export default InputComponent;
