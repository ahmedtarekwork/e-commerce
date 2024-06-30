// react
import type { ComponentProps, ReactNode } from "react";

// framer motion
import { motion } from "framer-motion";

type Props = {
  children: ReactNode;
  withFlex?: boolean;
} & ComponentProps<"div">;

const AnimatedLayout = ({ children, withFlex = true, ...attr }: Props) => {
  const style = !withFlex
    ? {}
    : {
        display: "flex",
        flexDirection: "column",
        height: "100%",
      };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        type: "tween",
        duration: 0.18,
      }}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(attr as any)}
      style={{
        ...style,
        ...attr.style,
      }}
    >
      {children}
    </motion.div>
  );
};
export default AnimatedLayout;
