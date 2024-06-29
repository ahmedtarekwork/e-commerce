// react
import type { ComponentProps, ReactNode } from "react";

// framer motion
import { motion } from "framer-motion";

type Props = {
  children: ReactNode;
} & ComponentProps<"div">;

const AnimatedLayout = ({ children, ...attr }: Props) => {
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
        display: "flex",
        flexDirection: "column",
        height: "100%",
        ...attr.style,
      }}
    >
      {children}
    </motion.div>
  );
};
export default AnimatedLayout;
