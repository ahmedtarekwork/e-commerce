// react
import type { ReactNode } from "react";

// components
import EmptySpinner, {
  type EmptySpinnerComponentProps,
} from "../spinners/EmptySpinner";

// framer motion
import { motion, AnimatePresence } from "framer-motion";
// variants
import { scaleUpDownVariant } from "../../utils/variants";

type Props = {
  toggleIcon: boolean;
  icon: ReactNode;
  spinnerDiminsions?: NonNullable<
    EmptySpinnerComponentProps["settings"]
  >["diminsions"];
};

const IconAndSpinnerSwitcher = ({
  toggleIcon,
  icon,
  spinnerDiminsions,
}: Props) => {
  return (
    <AnimatePresence mode="popLayout">
      {toggleIcon ? (
        <motion.div
          key="icon-one"
          className="align-content"
          variants={scaleUpDownVariant}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <EmptySpinner
            settings={{
              clr: "white",
              diminsions: spinnerDiminsions || "25px",
            }}
          />
        </motion.div>
      ) : (
        <motion.div
          key="icon-two"
          className="align-content"
          variants={scaleUpDownVariant}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {icon}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default IconAndSpinnerSwitcher;
