import { forwardRef, type ComponentProps, type ReactNode } from "react";

// components
import EmptySpinner from "../spinners/EmptySpinner";

// framer motion
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  children: ReactNode;
  toggleSpinner: boolean;
} & ComponentProps<"button">;

const BtnWithSpinner = forwardRef<HTMLButtonElement, Props>(
  ({ children, toggleSpinner, ...attr }, ref) => {
    return (
      <button
        ref={ref}
        {...attr}
        className={`btn-with-spinner${
          attr.className ? ` ${attr.className}` : ""
        }`}
      >
        {children}

        <AnimatePresence mode="popLayout">
          {toggleSpinner && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{
                type: "tween",
                duration: 0.1,
              }}
            >
              <EmptySpinner
                settings={{
                  diminsions: "20px",
                  clr: "white",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    );
  }
);
export default BtnWithSpinner;
