import { type ComponentProps, forwardRef } from "react";

export type InputPropsType = ComponentProps<"input"> & {
  label?: string;
  error?: boolean;
};

const InputComponent = forwardRef<HTMLInputElement, InputPropsType>(
  ({ label, error, ...attr }, ref) => {
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
          className={`${className || ""}${error ? " red" : ""}`}
          ref={ref}
        />
      </>
    );
  }
);
export default InputComponent;
