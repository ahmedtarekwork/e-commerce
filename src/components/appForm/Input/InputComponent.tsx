import { forwardRef, type ComponentProps, type ReactNode } from "react";

type LabelProps =
  | {
      label: ReactNode;
      labelAttr?: ComponentProps<"label">;
    }
  | {
      label?: never;
      labelAttr?: never;
    };

export type InputPropsType = ComponentProps<"input"> &
  LabelProps & {
    error?: boolean;
  };

const InputComponent = forwardRef<HTMLInputElement, InputPropsType>(
  ({ label, error, labelAttr, ...attr }, ref) => {
    const { className, id, disabled } = attr;

    return (
      <>
        {label && (
          <label data-disabled={disabled} htmlFor={id} {...(labelAttr || {})}>
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
