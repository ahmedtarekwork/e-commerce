import { forwardRef, type CSSProperties, type ComponentProps } from "react";
import { motion } from "framer-motion";

export type EmptySpinnerComponentProps = {
  settings?: {
    diminsions?: Exclude<CSSProperties["width"], number>;
    clr?: Exclude<CSSProperties["borderColor"], number>;
    "brdr-width"?: Exclude<CSSProperties["borderWidth"], number>;
  };
  holderAttr?: ComponentProps<"div">;
} & ComponentProps<"div">;

const EmptySpinner = forwardRef(
  ({ settings, holderAttr, ...attr }: EmptySpinnerComponentProps, ref) => {
    const mainStyles = Object.fromEntries(
      Object.entries(settings || {}).map(([key, value]) => ["--" + key, value])
    ) as CSSProperties;

    return (
      <motion.div
        ref={ref}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{
          duration: 0.25,
          type: "spring",
          stiffness: 80,
        }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(holderAttr as any)}
        style={{
          ...holderAttr?.style,
          width: "fit-content",
        }}
      >
        <motion.div
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...(attr as any)}
          className={`empty-spinner${
            attr.className ? ` ${attr.className}` : ""
          }`}
          style={{ ...mainStyles, ...(attr.style || {}) }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
            repeat: Infinity,
            type: "spring",
            stiffness: 80,
            damping: 15,
          }}
        />
      </motion.div>
    );
  }
);
export default EmptySpinner;
